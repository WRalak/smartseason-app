import { FIELD_STAGES, FIELD_STATUS, STAGE_PROGRESSION, FIELD_STATUS_THRESHOLDS } from './constants';

// Field Status Computation
export const computeFieldStatus = (field) => {
  if (!field || !field.planting_date || !field.current_stage) {
    return FIELD_STATUS.ACTIVE;
  }

  if (field.current_stage === FIELD_STAGES.HARVESTED) {
    return FIELD_STATUS.COMPLETED;
  }

  const plantingDate = new Date(field.planting_date);
  const currentDate = new Date();
  const daysSincePlanting = Math.floor((currentDate - plantingDate) / (1000 * 60 * 60 * 24));

  const threshold = FIELD_STATUS_THRESHOLDS[field.current_stage] || 30;

  return daysSincePlanting > threshold ? FIELD_STATUS.AT_RISK : FIELD_STATUS.ACTIVE;
};

// Field Stage Validation
export const validateFieldStageTransition = (currentStage, newStage) => {
  const allowedStages = STAGE_PROGRESSION[currentStage] || [];
  return allowedStages.includes(newStage);
};

// Format Date for Display
export const formatDate = (date, format = 'medium') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    medium: { year: 'numeric', month: 'long', day: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };

  return dateObj.toLocaleDateString('en-US', options[format] || options.medium);
};

// Calculate Time Ago
export const getTimeAgo = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

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
};

// Validation Utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  fieldName: (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
  },

  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  date: (date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }
};

// Error Handling Utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.error || error.response.data?.message || 'Server error',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unknown error occurred',
      status: 0,
      data: null
    };
  }
};

// Data Transformation Utilities
export const transformFields = (fields) => {
  return fields.map(field => ({
    ...field,
    computed_status: computeFieldStatus(field),
    planting_date: formatDate(field.planting_date),
    updated_at: getTimeAgo(field.updated_at),
    created_at: formatDate(field.created_at)
  }));
};

export const transformAgent = (agent) => ({
  ...agent,
  created_at: formatDate(agent.created_at),
  field_count: agent.field_count || 0
});

// Search and Filter Utilities
export const filterFields = (fields, filters) => {
  return fields.filter(field => {
    let matches = true;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matches = matches && (
        field.name.toLowerCase().includes(searchLower) ||
        field.crop_type.toLowerCase().includes(searchLower) ||
        field.agent_name?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      matches = matches && field.computed_status === filters.status;
    }

    if (filters.stage && filters.stage !== 'all') {
      matches = matches && field.current_stage === filters.stage;
    }

    if (filters.agent) {
      matches = matches && field.assigned_agent_id === filters.agent;
    }

    return matches;
  });
};

// Sort Utilities
export const sortFields = (fields, sortBy, sortOrder = 'asc') => {
  const sorted = [...fields].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'planting_date':
        comparison = new Date(a.planting_date) - new Date(b.planting_date);
        break;
      case 'updated_at':
        comparison = new Date(a.updated_at) - new Date(b.updated_at);
        break;
      case 'status':
        comparison = a.computed_status.localeCompare(b.computed_status);
        break;
      case 'stage':
        comparison = a.current_stage.localeCompare(b.current_stage);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

// Local Storage Utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Notification Utilities
export const showNotification = (message, type = 'info') => {
  // This would integrate with a notification library
  // For now, just log to console
  console.log(`[${type.toUpperCase()}] ${message}`);
};

// Debounce Utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle Utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
