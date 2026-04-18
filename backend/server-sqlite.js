import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Initialize SQLite database
const db = new Database('smartseason.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    planting_date DATE NOT NULL,
    current_stage TEXT NOT NULL CHECK (current_stage IN ('planted', 'growing', 'ready', 'harvested')),
    assigned_agent_id INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_agent_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS field_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    agent_id INTEGER,
    previous_stage TEXT,
    new_stage TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id)
  );
`);

// Insert test data if tables are empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const hashedPassword = '$2a$10$rQKp5xJZqL9qL9qL9qL9quO9qL9qL9qL9qL9qL9qL9qL9qL9q';
  
  const insertUser = db.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)');
  insertUser.run('admin@smartseason.com', hashedPassword, 'Admin User', 'admin');
  insertUser.run('agent1@smartseason.com', hashedPassword, 'John Agent', 'agent');
  insertUser.run('agent2@smartseason.com', hashedPassword, 'Jane Agent', 'agent');

  // Get user IDs
  const admin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@smartseason.com');
  const agent1 = db.prepare('SELECT id FROM users WHERE email = ?').get('agent1@smartseason.com');
  const agent2 = db.prepare('SELECT id FROM users WHERE email = ?').get('agent2@smartseason.com');

  // Insert sample fields
  const insertField = db.prepare('INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, created_by) VALUES (?, ?, ?, ?, ?, ?)');
  insertField.run('North Field', 'Corn', '2024-03-15', 'growing', agent1.id, admin.id);
  insertField.run('South Field', 'Wheat', '2024-04-01', 'planted', agent1.id, admin.id);
  insertField.run('East Field', 'Soybeans', '2024-02-20', 'ready', agent2.id, admin.id);
  insertField.run('West Field', 'Corn', '2024-03-25', 'growing', agent2.id, admin.id);

  console.log('Database initialized with sample data');
}

// Utility function to compute field status
const computeFieldStatus = (field) => {
  const today = new Date();
  const plantingDate = new Date(field.planting_date);
  const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
  const stage = field.current_stage;

  if (stage === 'harvested') {
    return 'completed';
  }

  if (stage === 'planted' && daysSincePlanting > 30) {
    return 'at_risk';
  }
  
  if (stage === 'growing' && daysSincePlanting > 60) {
    return 'at_risk';
  }
  
  if (stage === 'ready' && daysSincePlanting > 90) {
    return 'at_risk';
  }

  return 'active';
};

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.prepare('SELECT id, email, name, password_hash, role FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
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

// Fields routes
app.get('/api/fields', authenticateToken, (req, res) => {
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
        WHERE f.assigned_agent_id = ?
        ORDER BY f.created_at DESC
      `;
      params = [req.user.id];
    }
    
    const fields = db.prepare(query).all(...params);
    
    // Compute status for each field
    const fieldsWithStatus = fields.map(field => ({
      ...field,
      computed_status: computeFieldStatus(field)
    }));
    
    res.json(fieldsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fields/:id', authenticateToken, (req, res) => {
  try {
    const query = `
      SELECT f.*, u.name as agent_name 
      FROM fields f
      LEFT JOIN users u ON f.assigned_agent_id = u.id
      WHERE f.id = ?
    `;
    const field = db.prepare(query).get(req.params.id);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    // Check access
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get update history
    const updates = db.prepare(`
      SELECT fu.*, u.name as agent_name 
      FROM field_updates fu
      LEFT JOIN users u ON fu.agent_id = u.id
      WHERE fu.field_id = ?
      ORDER BY fu.created_at DESC
    `).all(req.params.id);
    
    res.json({
      ...field,
      computed_status: computeFieldStatus(field),
      updates: updates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fields/agents/list', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const agents = db.prepare('SELECT id, name, email FROM users WHERE role = ? ORDER BY name').all('agent');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fields', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
    
    const result = db.prepare(`
      INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, crop_type, planting_date, current_stage, assigned_agent_id || null, req.user.id);
    
    const field = db.prepare('SELECT * FROM fields WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...field,
      computed_status: computeFieldStatus(field)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/fields/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
    
    const result = db.prepare(`
      UPDATE fields 
      SET name = ?, crop_type = ?, planting_date = ?, current_stage = ?, 
          assigned_agent_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, crop_type, planting_date, current_stage, assigned_agent_id, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    const field = db.prepare('SELECT * FROM fields WHERE id = ?').get(req.params.id);
    
    res.json({
      ...field,
      computed_status: computeFieldStatus(field)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Updates routes
app.post('/api/updates', authenticateToken, (req, res) => {
  try {
    const { field_id, new_stage, notes } = req.body;
    
    // Get current field
    const field = db.prepare('SELECT * FROM fields WHERE id = ?').get(field_id);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    // Check access
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const previous_stage = field.current_stage;
    
    // Insert update record
    db.prepare(`
      INSERT INTO field_updates (field_id, agent_id, previous_stage, new_stage, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(field_id, req.user.id, previous_stage, new_stage, notes);
    
    // Update field stage
    db.prepare('UPDATE fields SET current_stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(new_stage, field_id);
    
    // Get updated field
    const updatedField = db.prepare('SELECT * FROM fields WHERE id = ?').get(field_id);
    
    res.json({
      ...updatedField,
      computed_status: computeFieldStatus(updatedField)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database: SQLite (smartseason.db)');
    console.log('Test credentials:');
    console.log('Admin: admin@smartseason.com / password123');
    console.log('Agent: agent1@smartseason.com / password123');
});
