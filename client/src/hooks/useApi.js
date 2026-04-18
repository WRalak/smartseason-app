import { useState, useEffect } from 'react';
import { smartSeasonService, authService, fieldService } from '../api/services';

// Authentication Hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const userData = JSON.parse(token);
        setUser(userData.state?.user);
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-storage');
  };

  return { user, loading, login, logout };
};

// Dashboard Hook
export const useDashboard = () => {
  const [data, setData] = useState({
    fields: [],
    agents: [],
    stats: {},
    stageCounts: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await smartSeasonService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => fetchData();

  return { ...data, loading, error, refresh };
};

// Agents Management Hook
export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const agentData = await smartSeasonService.getAgentManagementData();
      setAgents(agentData.agents);
      setAgentsList(agentData.agentsList);
    } catch (err) {
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData) => {
    try {
      const newAgent = await authService.registerAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      setAgentsList(prev => [...prev, { id: newAgent.id, name: newAgent.name, email: newAgent.email }]);
      return { success: true, data: newAgent };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create agent' };
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return { agents, agentsList, loading, error, createAgent, refresh: fetchAgents };
};

// Field Details Hook
export const useFieldDetails = (fieldId) => {
  const [field, setField] = useState(null);
  const [agentsList, setAgentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFieldDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const fieldData = await smartSeasonService.getFieldDetails(fieldId);
      setField(fieldData);
      setAgentsList(fieldData.agentsList);
    } catch (err) {
      setError(err.message || 'Failed to load field details');
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (fieldData) => {
    try {
      const updatedField = await fieldService.updateField(fieldId, fieldData);
      setField(prev => ({ ...prev, ...updatedField }));
      return { success: true, data: updatedField };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update field' };
    }
  };

  const deleteField = async () => {
    try {
      await fieldService.deleteField(fieldId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete field' };
    }
  };

  const createUpdate = async (updateData) => {
    try {
      const updatedField = await smartSeasonService.createUpdate(updateData);
      setField(prev => ({ ...prev, ...updatedField }));
      return { success: true, data: updatedField };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create update' };
    }
  };

  useEffect(() => {
    if (fieldId) {
      fetchFieldDetails();
    }
  }, [fieldId]);

  return { 
    field, 
    agentsList, 
    loading, 
    error, 
    refresh: fetchFieldDetails, 
    updateField, 
    deleteField, 
    createUpdate 
  };
};

// Fields List Hook
export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const fieldsData = await fieldService.getFields();
      setFields(fieldsData);
    } catch (err) {
      setError(err.message || 'Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  const createField = async (fieldData) => {
    try {
      const newField = await fieldService.createField(fieldData);
      setFields(prev => [newField, ...prev]);
      return { success: true, data: newField };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create field' };
    }
  };

  const updateField = async (id, fieldData) => {
    try {
      const updatedField = await fieldService.updateField(id, fieldData);
      setFields(prev => prev.map(field => 
        field.id === id ? { ...field, ...updatedField } : field
      ));
      return { success: true, data: updatedField };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update field' };
    }
  };

  const deleteField = async (id) => {
    try {
      await fieldService.deleteField(id);
      setFields(prev => prev.filter(field => field.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete field' };
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return { fields, loading, error, refresh: fetchFields, createField, updateField, deleteField };
};
