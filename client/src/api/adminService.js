import api from './client';

// Admin Service - handles admin-specific operations
export const adminService = {
  // Get ALL fields in the system (admin sees everything)
  getAllSystemFields: async () => {
    const response = await api.get('/fields');
    // Backend returns all fields for admin visibility
    return response.data;
  },

  // Get ALL agents with their performance metrics
  getAllSystemAgents: async () => {
    const response = await api.get('/auth/agents');
    // Backend returns all agents with field counts
    return response.data;
  },

  // Get agents list specifically for field assignment
  getAgentsForAssignment: async () => {
    const response = await api.get('/fields/agents/list');
    // Backend returns agents suitable for field assignment
    return response.data;
  },

  // Create new agent
  createAgent: async (agentData) => {
    const response = await api.post('/auth/register-agent', agentData);
    return response.data;
  },

  // Create new field (admin only)
  createSystemField: async (fieldData) => {
    const response = await api.post('/fields', fieldData);
    return response.data;
  },

  // Update any field (admin only)
  updateAnyField: async (fieldId, fieldData) => {
    const response = await api.put(`/fields/${fieldId}`, fieldData);
    return response.data;
  },

  // Delete any field (admin only)
  deleteAnyField: async (fieldId) => {
    const response = await api.delete(`/fields/${fieldId}`);
    return response.data;
  },

  // Get any field details (admin sees everything)
  getAnyFieldDetails: async (fieldId) => {
    const response = await api.get(`/fields/${fieldId}`);
    return response.data;
  },

  // Monitor ALL updates across ALL agents
  getAllAgentsUpdates: async () => {
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

  // Monitor updates by specific agent (admin oversight)
  getAgentUpdatesForOversight: async (agentId) => {
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

  // Get admin dashboard statistics (system overview)
  getSystemDashboardStats: async () => {
    const [fields, agents] = await Promise.all([
      api.get('/fields'),
      api.get('/auth/agents')
    ]);

    const stats = {
      totalFields: fields.length,
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'Active').length,
      fieldStatusBreakdown: {
        active: fields.filter(f => f.computed_status === 'active').length,
        at_risk: fields.filter(f => f.computed_status === 'at_risk').length,
        completed: fields.filter(f => f.computed_status === 'completed').length,
      },
      stageBreakdown: {
        planted: fields.filter(f => f.current_stage === 'planted').length,
        growing: fields.filter(f => f.current_stage === 'growing').length,
        ready: fields.filter(f => f.current_stage === 'ready').length,
        harvested: fields.filter(f => f.current_stage === 'harvested').length,
      },
      agentWorkload: agents.map(agent => ({
        agentId: agent.id,
        agentName: agent.name,
        fieldCount: agent.field_count || 0,
        activeFields: agent.field_count ? 
          fields.filter(f => f.assigned_agent_id === agent.id && f.computed_status === 'active').length : 0,
        atRiskFields: agent.field_count ? 
          fields.filter(f => f.assigned_agent_id === agent.id && f.computed_status === 'at_risk').length : 0,
        completedFields: agent.field_count ? 
          fields.filter(f => f.assigned_agent_id === agent.id && f.computed_status === 'completed').length : 0
      }))
    };

    return stats;
  },

  // Get agent performance metrics
  getAgentMetrics: async () => {
    const [fields, agents] = await Promise.all([
      api.get('/fields'),
      api.get('/auth/agents')
    ]);

    const metrics = agents.map(agent => {
      const agentFields = fields.filter(f => f.assigned_agent_id === agent.id);
      
      return {
        agentId: agent.id,
        agentName: agent.name,
        totalFields: agentFields.length,
        updatesCount: agentFields.reduce((total, field) => 
          total + (field.updates ? field.updates.length : 0), 0
        ),
        lastUpdate: agentFields.length > 0 ? 
          Math.max(...agentFields.map(f => 
            f.updated_at ? new Date(f.updated_at) : new Date(0)
          )) : null,
        efficiency: agentFields.length > 0 ? 
          agentFields.filter(f => f.computed_status === 'active').length / agentFields.length : 0
      };
    });

    return metrics;
  },

  // Monitor agent activity
  getAgentActivity: async (timeframe = '7d') => {
    const updates = await api.get('/updates');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframe));
    
    const recentUpdates = updates.filter(update => 
      new Date(update.created_at) > cutoffDate
    );

    return recentUpdates.map(update => ({
      ...update,
      timeAgo: getTimeAgo(update.created_at),
      agentName: update.agent_name,
      fieldName: update.field_name || 'Unknown Field'
    }));
  },

  // Field assignment management
  assignFieldToAgent: async (fieldId, agentId) => {
    const response = await api.put(`/fields/${fieldId}`, {
      assigned_agent_id: agentId
    });
    return response.data;
  },

  // Bulk operations
  bulkAssignFields: async (assignments) => {
    const results = [];
    
    for (const { fieldId, agentId } of assignments) {
      try {
        const result = await api.put(`/fields/${fieldId}`, {
          assigned_agent_id: agentId
        });
        results.push({ fieldId, success: true, result });
      } catch (error) {
        results.push({ fieldId, success: false, error: error.message });
      }
    }
    
    return results;
  },

  // Reporting
  generateAgentReport: async () => {
    const [fields, agents, updates] = await Promise.all([
      api.get('/fields'),
      api.get('/auth/agents'),
      api.get('/updates')
    ]);

    const report = {
      summary: {
        totalAgents: agents.length,
        totalFields: fields.length,
        totalUpdates: updates.length,
        generatedAt: new Date().toISOString()
      },
      agents: agents.map(agent => ({
        ...agent,
        fieldsAssigned: fields.filter(f => f.assigned_agent_id === agent.id).length,
        updatesMade: updates.filter(u => u.agent_id === agent.id).length
      })),
      fields: fields.map(field => ({
        ...field,
        updatesCount: field.updates ? field.updates.length : 0,
        lastUpdate: field.updated_at
      })),
      recentActivity: updates.slice(0, 10).map(update => ({
        ...update,
        timeAgo: getTimeAgo(update.created_at),
        agentName: update.agent_name,
        fieldName: update.field_name || 'Unknown Field'
      }))
    };

    return report;
  }
};

// Helper function to format time ago
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

export default adminService;
