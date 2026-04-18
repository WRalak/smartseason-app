import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// In-memory database (for development)
const correctPasswordHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // hash for "password123"

const users = [
  {
    id: 1,
    email: 'admin@smartseason.com',
    password_hash: correctPasswordHash,
    name: 'Admin User',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'agent1@smartseason.com',
    password_hash: correctPasswordHash,
    name: 'John Agent',
    role: 'agent',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    email: 'agent2@smartseason.com',
    password_hash: correctPasswordHash,
    name: 'Jane Agent',
    role: 'agent',
    created_at: new Date().toISOString()
  }
];

const fields = [
  {
    id: 1,
    name: 'North Field',
    crop_type: 'Corn',
    planting_date: '2024-03-15',
    current_stage: 'growing',
    assigned_agent_id: 2,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent_name: 'John Agent'
  },
  {
    id: 2,
    name: 'South Field',
    crop_type: 'Wheat',
    planting_date: '2024-04-01',
    current_stage: 'planted',
    assigned_agent_id: 2,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent_name: 'John Agent'
  },
  {
    id: 3,
    name: 'East Field',
    crop_type: 'Soybeans',
    planting_date: '2024-02-20',
    current_stage: 'ready',
    assigned_agent_id: 3,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent_name: 'Jane Agent'
  },
  {
    id: 4,
    name: 'West Field',
    crop_type: 'Corn',
    planting_date: '2024-03-25',
    current_stage: 'growing',
    assigned_agent_id: 3,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent_name: 'Jane Agent'
  }
];

let fieldUpdates = [];
let nextFieldId = 5;
let nextUpdateId = 1;

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

  jwt.verify(token, 'your-secret-key-change-this', (err, user) => {
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
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      'your-secret-key-change-this',
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
    let filteredFields = fields;
    
    if (req.user.role !== 'admin') {
      filteredFields = fields.filter(f => f.assigned_agent_id === req.user.id);
    }
    
    // Add agent names
    const fieldsWithAgentNames = filteredFields.map(field => {
      const agent = users.find(u => u.id === field.assigned_agent_id);
      return {
        ...field,
        agent_name: agent ? agent.name : null,
        computed_status: computeFieldStatus(field)
      };
    });
    
    res.json(fieldsWithAgentNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fields/:id', authenticateToken, (req, res) => {
  try {
    const field = fields.find(f => f.id === parseInt(req.params.id));
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    // Check access
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get update history
    const updates = fieldUpdates.filter(u => u.field_id === field.id);
    
    // Add agent names to updates
    const updatesWithAgentNames = updates.map(update => {
      const agent = users.find(u => u.id === update.agent_id);
      return {
        ...update,
        agent_name: agent ? agent.name : null
      };
    });
    
    const agent = users.find(u => u.id === field.assigned_agent_id);
    
    res.json({
      ...field,
      agent_name: agent ? agent.name : null,
      computed_status: computeFieldStatus(field),
      updates: updatesWithAgentNames
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
    
    const agents = users.filter(u => u.role === 'agent').map(u => ({
      id: u.id,
      name: u.name,
      email: u.email
    }));
    
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
    
    const agent = users.find(u => u.id === assigned_agent_id);
    
    const newField = {
      id: nextFieldId++,
      name,
      crop_type,
      planting_date,
      current_stage,
      assigned_agent_id: assigned_agent_id || null,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agent_name: agent ? agent.name : null
    };
    
    fields.push(newField);
    
    res.status(201).json({
      ...newField,
      computed_status: computeFieldStatus(newField)
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
    
    const fieldIndex = fields.findIndex(f => f.id === parseInt(req.params.id));
    
    if (fieldIndex === -1) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    const agent = users.find(u => u.id === assigned_agent_id);
    
    fields[fieldIndex] = {
      ...fields[fieldIndex],
      name,
      crop_type,
      planting_date,
      current_stage,
      assigned_agent_id: assigned_agent_id || null,
      updated_at: new Date().toISOString(),
      agent_name: agent ? agent.name : null
    };
    
    res.json({
      ...fields[fieldIndex],
      computed_status: computeFieldStatus(fields[fieldIndex])
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Updates routes
app.post('/api/updates', authenticateToken, (req, res) => {
  try {
    const { field_id, new_stage, notes } = req.body;
    
    const fieldIndex = fields.findIndex(f => f.id === parseInt(field_id));
    
    if (fieldIndex === -1) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    const field = fields[fieldIndex];
    
    // Check access
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const previous_stage = field.current_stage;
    
    const update = {
      id: nextUpdateId++,
      field_id: parseInt(field_id),
      agent_id: req.user.id,
      previous_stage,
      new_stage,
      notes,
      created_at: new Date().toISOString(),
      agent_name: req.user.name
    };
    
    fieldUpdates.push(update);
    
    // Update field
    fields[fieldIndex] = {
      ...field,
      current_stage: new_stage,
      updated_at: new Date().toISOString()
    };
    
    res.json({
      ...fields[fieldIndex],
      computed_status: computeFieldStatus(fields[fieldIndex])
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Database: In-memory (for development)');
    console.log('Test credentials:');
    console.log('Admin: admin@smartseason.com / password123');
    console.log('Agent: agent1@smartseason.com / password123');
});
