import api from './client';

// Field Agent Core Functions - ONLY what's needed
export const agentCore = {
  // 1. Update the stage of a field
  updateFieldStage: async (fieldId, newStage, notes) => {
    const response = await api.post('/updates', {
      field_id: fieldId,
      new_stage: newStage,
      notes: notes || ''
    });
    return response.data;
  },

  // 2. Add notes or observations (included in update)
  addFieldObservation: async (fieldId, notes, newStage = null) => {
    const response = await api.post('/updates', {
      field_id: fieldId,
      new_stage: newStage,
      notes: notes
    });
    return response.data;
  },

  // Helper: Get my assigned fields (to know what I can update)
  getMyFields: async () => {
    const response = await api.get('/fields');
    return response.data;
  },

  // Helper: Get field details (to see current stage)
  getFieldDetails: async (fieldId) => {
    const response = await api.get(`/fields/${fieldId}`);
    return response.data;
  }
};

