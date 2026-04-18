import api from './client';

// Authentication Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  registerAgent: async (agentData) => {
    const response = await api.post('/auth/register-agent', agentData);
    return response.data;
  },

  getAgents: async () => {
    const response = await api.get('/auth/agents');
    return response.data;
  },

  getAgentsList: async () => {
    const response = await api.get('/fields/agents/list');
    return response.data;
  }
};

// Field Services
export const fieldService = {
  getFields: async () => {
    const response = await api.get('/fields');
    return response.data;
  },

  getField: async (id) => {
    const response = await api.get(`/fields/${id}`);
    return response.data;
  },

  createField: async (fieldData) => {
    const response = await api.post('/fields', fieldData);
    return response.data;
  },

  updateField: async (id, fieldData) => {
    const response = await api.put(`/fields/${id}`, fieldData);
    return response.data;
  },

  deleteField: async (id) => {
    const response = await api.delete(`/fields/${id}`);
    return response.data;
  }
};

// Update Services
export const updateService = {
  createUpdate: async (updateData) => {
    const response = await api.post('/updates', updateData);
    return response.data;
  }
};

// Combined Services
export const smartSeasonService = {
  // Dashboard data
  getDashboardData: async () => {
    const fields = await fieldService.getFields();
    const agents = await authService.getAgents();
    
    const stats = {
      total: fields.length,
      active: fields.filter(f => f.computed_status === 'active').length,
      at_risk: fields.filter(f => f.computed_status === 'at_risk').length,
      completed: fields.filter(f => f.computed_status === 'completed').length,
    };

    const stageCounts = {
      planted: fields.filter(f => f.current_stage === 'planted').length,
      growing: fields.filter(f => f.current_stage === 'growing').length,
      ready: fields.filter(f => f.current_stage === 'ready').length,
      harvested: fields.filter(f => f.current_stage === 'harvested').length,
    };

    return {
      fields,
      agents,
      stats,
      stageCounts
    };
  },

  // Agent management
  getAgentManagementData: async () => {
    const agents = await authService.getAgents();
    const agentsList = await authService.getAgentsList();
    
    return {
      agents,
      agentsList,
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'Active').length,
      avgFieldsPerAgent: agents.length > 0 
        ? Math.round(agents.reduce((acc, agent) => acc + (agent.field_count || 0), 0) / agents.length)
        : 0
    };
  },

  // Field details with full context
  getFieldDetails: async (id) => {
    const field = await fieldService.getField(id);
    const agentsList = await authService.getAgentsList();
    
    return {
      ...field,
      agentsList
    };
  }
};

export default {
  ...authService,
  ...fieldService,
  ...updateService,
  smartSeasonService
};
