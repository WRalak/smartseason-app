import express from 'express';
import { db } from '../server.js';
import { requireAdmin } from '../middleware/auth.js';
import { computeFieldStatus } from '../utils/fieldStatus.js';

const router = express.Router();

// Get all fields (admin sees all, agents see assigned only)
router.get('/', async (req, res) => {
    try {
        let query;
        let params;
        
        if (req.user.role === 'admin') {
            query = `
                SELECT f.*, u.name as agent_name 
                FROM fields f
                LEFT JOIN users u ON f.assigned_agent_id = u.id
                ORDER BY f.created_at DESC
            `;
            params = [];
        } else {
            query = `
                SELECT f.*, u.name as agent_name 
                FROM fields f
                LEFT JOIN users u ON f.assigned_agent_id = u.id
                WHERE f.assigned_agent_id = $1
                ORDER BY f.created_at DESC
            `;
            params = [req.user.id];
        }
        
        const result = await db.query(query, params);
        
        // Compute status for each field
        const fieldsWithStatus = result.rows.map(field => ({
            ...field,
            computed_status: computeFieldStatus(field)
        }));
        
        res.json(fieldsWithStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single field
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT f.*, u.name as agent_name 
            FROM fields f
            LEFT JOIN users u ON f.assigned_agent_id = u.id
            WHERE f.id = $1
        `;
        const result = await db.query(query, [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Field not found' });
        }
        
        const field = result.rows[0];
        
        // Check access
        if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Get update history
        const updatesResult = await db.query(
            `SELECT fu.*, u.name as agent_name 
             FROM field_updates fu
             LEFT JOIN users u ON fu.agent_id = u.id
             WHERE fu.field_id = $1
             ORDER BY fu.created_at DESC`,
            [req.params.id]
        );
        
        res.json({
            ...field,
            computed_status: computeFieldStatus(field),
            updates: updatesResult.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create field (admin only)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
        
        const result = await db.query(
            `INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, crop_type, planting_date, current_stage, assigned_agent_id || null, req.user.id]
        );
        
        const field = result.rows[0];
        
        res.status(201).json({
            ...field,
            computed_status: computeFieldStatus(field)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update field (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
        
        const result = await db.query(
            `UPDATE fields 
             SET name = $1, crop_type = $2, planting_date = $3, current_stage = $4, 
                 assigned_agent_id = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [name, crop_type, planting_date, current_stage, assigned_agent_id, req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Field not found' });
        }
        
        res.json({
            ...result.rows[0],
            computed_status: computeFieldStatus(result.rows[0])
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete field (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        // First delete related updates
        await db.query('DELETE FROM field_updates WHERE field_id = $1', [req.params.id]);
        
        // Then delete the field
        const result = await db.query('DELETE FROM fields WHERE id = $1 RETURNING *', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Field not found' });
        }
        
        res.json({ message: 'Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get agents list (admin only)
router.get('/agents/list', requireAdmin, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email FROM users WHERE role = $1 ORDER BY name',
            ['agent']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all agents with field counts (admin only)
router.get('/agents', requireAdmin, async (req, res) => {
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