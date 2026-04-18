import { useState, useEffect } from 'react';
import adminService from '../api/adminService';

// Custom hook for admin operations
export const useAdmin = () => {
  const [allFields, setAllFields] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fields, agents] = await Promise.all([
        adminService.getAllFields(),
        adminService.getAllAgents()
      ]);
      
      setAllFields(fields);
      setAgents(agents);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newAgent = await adminService.createAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      
      return { success: true, data: newAgent };
    } catch (err) {
      setError(err.message || 'Failed to create agent');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createField = async (fieldData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newField = await adminService.createField(fieldData);
      setAllFields(prev => [newField, ...prev]);
      
      return { success: true, data: newField };
    } catch (err) {
      setError(err.message || 'Failed to create field');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (fieldId, fieldData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedField = await adminService.updateField(fieldId, fieldData);
      setAllFields(prev => 
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

  const deleteField = async (fieldId) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminService.deleteField(fieldId);
      setAllFields(prev => prev.filter(field => field.id !== fieldId));
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete field');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getFieldDetails = async (fieldId) => {
    try {
      const field = await adminService.getFieldDetails(fieldId);
      return field;
    } catch (err) {
      setError(err.message || 'Failed to get field details');
      return null;
    }
  };

  const getAllUpdates = async () => {
    try {
      const updates = await adminService.getAllUpdates();
      return updates;
    } catch (err) {
      setError(err.message || 'Failed to get updates');
      return [];
    }
  };

  const getDashboardStats = async () => {
    try {
      const stats = await adminService.getDashboardStats();
      return stats;
    } catch (err) {
      setError(err.message || 'Failed to get dashboard stats');
      return null;
    }
  };

  const getAgentMetrics = async () => {
    try {
      const metrics = await adminService.getAgentMetrics();
      return metrics;
    } catch (err) {
      setError(err.message || 'Failed to get agent metrics');
      return [];
    }
  };

  const getAgentActivity = async (timeframe) => {
    try {
      const activity = await adminService.getAgentActivity(timeframe);
      return activity;
    } catch (err) {
      setError(err.message || 'Failed to get agent activity');
      return [];
    }
  };

  const assignFieldToAgent = async (fieldId, agentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedField = await adminService.assignFieldToAgent(fieldId, agentId);
      
      setAllFields(prev => 
        prev.map(field => 
          field.id === fieldId ? { ...field, ...updatedField } : field
        )
      );
      
      return { success: true, data: updatedField };
    } catch (err) {
      setError(err.message || 'Failed to assign field');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const report = await adminService.generateAgentReport();
      return report;
    } catch (err) {
      setError(err.message || 'Failed to generate report');
      return null;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    allFields,
    agents,
    loading,
    error,
    refresh: fetchAllData,
    createAgent,
    createField,
    updateField,
    deleteField,
    getFieldDetails,
    getAllUpdates,
    getDashboardStats,
    getAgentMetrics,
    getAgentActivity,
    assignFieldToAgent,
    generateReport
  };
};

export default useAdmin;
