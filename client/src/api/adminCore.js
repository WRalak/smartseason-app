import api from './client';

// Admin Core Functions - ONLY what's needed
export const adminCore = {
  // 1. View all fields
  getAllFields: async () => {
    const response = await api.get('/fields');
    return response.data;
  },

  // 2. Monitor updates across agents
  getAllUpdates: async () => {
    const fields = await api.get('/fields');
    const allUpdates = [];
    
    for (const field of fields) {
      if (field.updates && field.updates.length > 0) {
        allUpdates.push(...field.updates);
      }
    }
    
    // Sort by most recent
    return allUpdates.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  },

  // Helper: Get updates by specific agent (for monitoring)
  getAgentUpdates: async (agentId) => {
    const fields = await api.get('/fields');
    const agentUpdates = [];
    
    for (const field of fields) {
      if (field.assigned_agent_id === agentId) {
        if (field.updates && field.updates.length > 0) {
          agentUpdates.push(...field.updates);
        }
      }
    }
    
    return agentUpdates.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  },

  // Helper: Get all agents (for monitoring)
  getAllAgents: async () => {
    const response = await api.get('/auth/agents');
    return response.data;
  }
};

