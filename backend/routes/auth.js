import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../server.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await db.query(
            'SELECT id, email, name, password_hash, role FROM users WHERE email = $1',
            [email]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create agent (admin only)
router.post('/register-agent', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        // Hash password
        const bcrypt = await import('bcryptjs');
        const password_hash = await bcrypt.default.hash(password, 10);
        
        // Create agent
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
            [name, email, password_hash, 'agent']
        );
        
        const agent = result.rows[0];
        
        res.status(201).json(agent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all agents with field counts (admin only)
router.get('/agents', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.created_at,
                COUNT(f.id) as field_count
            FROM users u
            LEFT JOIN fields f ON u.id = f.assigned_agent_id
            WHERE u.role = 'agent'
            GROUP BY u.id, u.name, u.email, u.created_at
            ORDER BY u.name
        `);
        
        const agents = result.rows.map(agent => ({
            ...agent,
            status: 'Active' // All agents are considered active for now
        }));
        
        res.json(agents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;