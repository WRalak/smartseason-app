import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import agentService from '../api/agentService';

// Custom hook for field agent operations
export const useAgent = () => {
  const { user } = useAuthStore();
  const [assignedFields, setAssignedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchAssignedFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const fields = await agentService.getAssignedFields();
      setAssignedFields(fields);
      
      // Calculate stats
      const agentStats = agentService.getAgentStats();
      setStats(agentStats);
    } catch (err) {
      setError(err.message || 'Failed to fetch assigned fields');
    } finally {
      setLoading(false);
    }
  };

  const updateFieldStage = async (fieldId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate that agent can update this field
      const field = assignedFields.find(f => f.id === fieldId);
      if (!agentService.canUpdateField(field, user)) {
        throw new Error('You are not authorized to update this field');
      }

      const updatedField = await agentService.updateFieldStage(fieldId, updateData);
      
      // Update the field in the local state
      setAssignedFields(prev => 
        prev.map(field => 
          field.id === fieldId ? { ...field, ...updatedField } : field
        )
      );
      
      return { success: true, data: updatedField };
    } catch (err) {
      setError(err.message || 'Failed to update field');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getFieldDetails = async (fieldId) => {
    try {
      const field = await agentService.getFieldDetails(fieldId);
      return field;
    } catch (err) {
      setError(err.message || 'Failed to get field details');
      return null;
    }
  };

  const getMyUpdateHistory = async () => {
    try {
      const updates = await agentService.getMyUpdateHistory();
      return updates;
    } catch (err) {
      setError(err.message || 'Failed to get update history');
      return [];
    }
  };

  useEffect(() => {
    if (user && user.role === 'agent') {
      fetchAssignedFields();
    }
  }, [user]);

  return {
    assignedFields,
    stats,
    loading,
    error,
    refresh: fetchAssignedFields,
    updateFieldStage,
    getFieldDetails,
    getMyUpdateHistory,
    canUpdateField: agentService.canUpdateField
  };
};

export default useAgent;
