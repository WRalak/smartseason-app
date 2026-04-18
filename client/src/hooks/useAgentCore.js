import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { agentCore } from '../api/agentCore';

// Field Agent Core Hook - ONLY essential functions
export const useAgentCore = () => {
  const { user } = useAuthStore();
  const [myFields, setMyFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get my assigned fields
  const fetchMyFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const fields = await agentCore.getMyFields();
      setMyFields(fields);
    } catch (err) {
      setError(err.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  // Update field stage with notes
  const updateFieldStage = async (fieldId, newStage, notes) => {
    try {
      setError(null);
      
      // Validate I can update this field
      const field = myFields.find(f => f.id === fieldId);
      if (!field || field.assigned_agent_id !== user.id) {
        throw new Error('You can only update your assigned fields');
      }

      const updatedField = await agentCore.updateFieldStage(fieldId, newStage, notes);
      
      // Update local state
      setMyFields(prev => 
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

  // Add notes/observations to field
  const addFieldObservation = async (fieldId, notes, newStage = null) => {
    try {
      setError(null);
      
      // Validate I can update this field
      const field = myFields.find(f => f.id === fieldId);
      if (!field || field.assigned_agent_id !== user.id) {
        throw new Error('You can only add observations to your assigned fields');
      }

      const updatedField = await agentCore.addFieldObservation(fieldId, notes, newStage);
      
      // Update local state
      setMyFields(prev => 
        prev.map(field => 
          field.id === fieldId ? { ...field, ...updatedField } : field
        )
      );
      
      return { success: true, data: updatedField };
    } catch (err) {
      setError(err.message || 'Failed to add observation');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get field details
  const getFieldDetails = async (fieldId) => {
    try {
      const field = await agentCore.getFieldDetails(fieldId);
      
      // Validate I can view this field
      if (field.assigned_agent_id !== user.id) {
        throw new Error('You can only view your assigned fields');
      }
      
      return field;
    } catch (err) {
      setError(err.message || 'Failed to get field details');
      return null;
    }
  };

  useEffect(() => {
    if (user && user.role === 'agent') {
      fetchMyFields();
    }
  }, [user]);

  return {
    myFields,
    loading,
    error,
    refresh: fetchMyFields,
    updateFieldStage,
    addFieldObservation,
    getFieldDetails
  };
};

export default useAgentCore;
