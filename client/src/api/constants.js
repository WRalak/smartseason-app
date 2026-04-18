// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER_AGENT: '/auth/register-agent',
  GET_AGENTS: '/auth/agents',
  GET_AGENTS_LIST: '/fields/agents/list',
  
  // Fields
  GET_FIELDS: '/fields',
  GET_FIELD: '/fields/:id',
  CREATE_FIELD: '/fields',
  UPDATE_FIELD: '/fields/:id',
  DELETE_FIELD: '/fields/:id',
  
  // Updates
  CREATE_UPDATE: '/updates',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Field Stages
export const FIELD_STAGES = {
  PLANTED: 'planted',
  GROWING: 'growing',
  READY: 'ready',
  HARVESTED: 'harvested',
};

// Field Status
export const FIELD_STATUS = {
  ACTIVE: 'active',
  AT_RISK: 'at_risk',
  COMPLETED: 'completed',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
};

// Field Stage Progression
export const STAGE_PROGRESSION = {
  [FIELD_STAGES.PLANTED]: [FIELD_STAGES.GROWING, FIELD_STAGES.READY, FIELD_STAGES.HARVESTED],
  [FIELD_STAGES.GROWING]: [FIELD_STAGES.READY, FIELD_STAGES.HARVESTED],
  [FIELD_STAGES.READY]: [FIELD_STAGES.HARVESTED],
  [FIELD_STAGES.HARVESTED]: [],
};

// Field Stage Labels
export const STAGE_LABELS = {
  [FIELD_STAGES.PLANTED]: 'Planted',
  [FIELD_STAGES.GROWING]: 'Growing',
  [FIELD_STAGES.READY]: 'Ready',
  [FIELD_STAGES.HARVESTED]: 'Harvested',
};

// Field Status Labels
export const STATUS_LABELS = {
  [FIELD_STATUS.ACTIVE]: 'Active',
  [FIELD_STATUS.AT_RISK]: 'At Risk',
  [FIELD_STATUS.COMPLETED]: 'Completed',
};

// Crop Types
export const CROP_TYPES = [
  'Corn',
  'Wheat',
  'Soybeans',
  'Barley',
  'Rice',
  'Cotton',
  'Tomatoes',
  'Potatoes',
  'Lettuce',
  'Carrots',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  FIELD_CREATED: 'Field created successfully!',
  FIELD_UPDATED: 'Field updated successfully!',
  FIELD_DELETED: 'Field deleted successfully!',
  UPDATE_CREATED: 'Field update created successfully!',
  AGENT_CREATED: 'Agent created successfully!',
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  FIELD_NAME_MIN_LENGTH: 2,
  FIELD_NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Loading Messages
export const LOADING_MESSAGES = {
  AUTHENTICATING: 'Authenticating...',
  LOADING_FIELDS: 'Loading fields...',
  LOADING_AGENTS: 'Loading agents...',
  CREATING_FIELD: 'Creating field...',
  UPDATING_FIELD: 'Updating field...',
  DELETING_FIELD: 'Deleting field...',
  CREATING_AGENT: 'Creating agent...',
  CREATING_UPDATE: 'Creating update...',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM d, yyyy',
  SHORT: 'MM/dd/yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMMM d, yyyy h:mm a',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#10b981',
  SECONDARY: '#3b82f6',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  SUCCESS: '#22c55e',
  INFO: '#6366f1',
};

// Time Thresholds for Field Status (in days)
export const FIELD_STATUS_THRESHOLDS = {
  [FIELD_STAGES.PLANTED]: 30,
  [FIELD_STAGES.GROWING]: 60,
  [FIELD_STAGES.READY]: 90,
};
