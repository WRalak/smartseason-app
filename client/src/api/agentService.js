import api from './client';

// Field Agent Service - handles agent-specific operations
export const agentService = {
  // Get ONLY fields assigned to the current agent (backend filters automatically)
  getMyAssignedFields: async () => {
    const response = await api.get('/fields');
    // Backend automatically filters to show only assigned fields for agents
    return response.data;
  },

  // Update ONLY fields I'm assigned to with my observations
  updateMyFieldStage: async (fieldId, updateData) => {
    // Backend will validate that I can only update my assigned fields
    const response = await api.post('/updates', {
      field_id: fieldId,
      new_stage: updateData.newStage,
      notes: updateData.notes || ''
    });
    return response.data;
  },

  // Get details of MY assigned field only
  getMyFieldDetails: async (fieldId) => {
    const response = await api.get(`/fields/${fieldId}`);
    // Backend will validate I can only see my assigned fields
    return response.data;
  },

  // Get MY update history (only my observations)
  getMyPersonalUpdateHistory: async () => {
    const fields = await api.get('/fields');
    const allUpdates = [];
    
    for (const field of fields) {
      if (field.updates && field.updates.length > 0) {
        const myUpdates = field.updates.filter(update => 
          update.agent_id === getCurrentUserId()
        );
        allUpdates.push(...myUpdates);
      }
    }
    
    return allUpdates.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  },

  // Get MY personal statistics (only my assigned fields)
  getMyPersonalStats: async () => {
    const fields = await api.get('/fields');
    
    const stats = {
      totalFields: fields.length, // Only my assigned fields
      activeFields: fields.filter(f => f.computed_status === 'active').length,
      atRiskFields: fields.filter(f => f.computed_status === 'at_risk').length,
      completedFields: fields.filter(f => f.computed_status === 'completed').length,
      stageBreakdown: {
        planted: fields.filter(f => f.current_stage === 'planted').length,
        growing: fields.filter(f => f.current_stage === 'growing').length,
        ready: fields.filter(f => f.current_stage === 'ready').length,
        harvested: fields.filter(f => f.current_stage === 'harvested').length,
      }
    };

    return stats;
  },

  // Get available stages for field update
  getAvailableStages: (currentStage) => {
    const stages = ['planted', 'growing', 'ready', 'harvested'];
    const currentIndex = stages.indexOf(currentStage);
    return stages.slice(currentIndex + 1);
  },

  // Validate if agent can update a field
  canUpdateField: (field, user) => {
    return field.assigned_agent_id === user.id && field.current_stage !== 'harvested';
  }
};

// Helper function to get current user ID (would need to be implemented based on auth context)
function getCurrentUserId() {
  // This would typically come from auth store or context
  // For now, return a placeholder
  return localStorage.getItem('userId') || 1;
}

export default agentService;
