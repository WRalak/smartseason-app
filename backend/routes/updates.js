import express from 'express';
import { db } from '../server.js';
import { computeFieldStatus } from '../utils/fieldStatus.js';

const router = express.Router();

// Add update to field
router.post('/', async (req, res) => {
    try {
        const { field_id, new_stage, notes } = req.body;
        
        // Get current field
        const fieldResult = await db.query(
            'SELECT * FROM fields WHERE id = $1',
            [field_id]
        );
        
        if (fieldResult.rows.length === 0) {
            return res.status(404).json({ error: 'Field not found' });
        }
        
        const field = fieldResult.rows[0];
        
        // Check access
        if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const previous_stage = field.current_stage;
        
        // Insert update record
        await db.query(
            `INSERT INTO field_updates (field_id, agent_id, previous_stage, new_stage, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [field_id, req.user.id, previous_stage, new_stage, notes]
        );
        
        // Update field stage
        await db.query(
            'UPDATE fields SET current_stage = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [new_stage, field_id]
        );
        
        // Get updated field
        const updatedFieldResult = await db.query(
            'SELECT * FROM fields WHERE id = $1',
            [field_id]
        );
        
        const updatedField = updatedFieldResult.rows[0];
        
        res.json({
            ...updatedField,
            computed_status: computeFieldStatus(updatedField)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;