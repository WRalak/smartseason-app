import { useState, useEffect } from 'react';
import { adminCore } from '../api/adminCore';

// Admin Core Hook - ONLY essential functions
export const useAdminCore = () => {
  const [allFields, setAllFields] = useState([]);
  const [allUpdates, setAllUpdates] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all admin data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fields, updates, agents] = await Promise.all([
        adminCore.getAllFields(),
        adminCore.getAllUpdates(),
        adminCore.getAllAgents()
      ]);
      
      setAllFields(fields);
      setAllUpdates(updates);
      setAllAgents(agents);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // 1. View all fields (already loaded in fetchAdminData)
  const getViewAllFields = () => allFields;

  // 2. Monitor updates across agents (already loaded in fetchAdminData)
  const getMonitorUpdates = () => allUpdates;

  // Helper: Get updates by specific agent
  getAgentUpdates = async (agentId) => {
    try {
      const updates = await adminCore.getAgentUpdates(agentId);
      return updates;
    } catch (err) {
      setError(err.message || 'Failed to get agent updates');
      return [];
    }
  };

  // Helper: Refresh data
  const refresh = () => fetchAdminData();

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    // Core admin data
    allFields,
    allUpdates,
    allAgents,
    loading,
    error,
    
    // Core admin functions
    getViewAllFields,
    getMonitorUpdates,
    getAgentUpdates,
    
    // Helper functions
    refresh
  };
};

export default useAdminCore;
