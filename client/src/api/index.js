// Main API exports
export { default as api } from './client';
export * from './services';
export * from './constants';
export * from './utils';

// Role-specific services
export { agentService } from './agentService';
export { adminService } from './adminService';

// Core functions (minimal, focused)
export { agentCore } from './agentCore';
export { adminCore } from './adminCore';

// Re-export commonly used combinations
export const apiService = {
  auth: {
    login: (email, password) => import('./services').then(s => s.authService.login(email, password)),
    registerAgent: (data) => import('./services').then(s => s.authService.registerAgent(data)),
    getAgents: () => import('./services').then(s => s.authService.getAgents()),
    getAgentsList: () => import('./services').then(s => s.authService.getAgentsList()),
  },
  fields: {
    getAll: () => import('./services').then(s => s.fieldService.getFields()),
    getById: (id) => import('./services').then(s => s.fieldService.getField(id)),
    create: (data) => import('./services').then(s => s.fieldService.createField(data)),
    update: (id, data) => import('./services').then(s => s.fieldService.updateField(id, data)),
    delete: (id) => import('./services').then(s => s.fieldService.deleteField(id)),
  },
  updates: {
    create: (data) => import('./services').then(s => s.updateService.createUpdate(data)),
  },
  dashboard: {
    getData: () => import('./services').then(s => s.smartSeasonService.getDashboardData()),
  },
  agents: {
    getManagementData: () => import('./services').then(s => s.smartSeasonService.getAgentManagementData()),
  }
};

export default {
  ...apiService,
  agentService,
  adminService
};
