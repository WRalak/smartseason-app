import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AgentDashboardFixed from '../pages/AgentDashboardFixed';
import AdminDashboardFixed from '../pages/AdminDashboardFixed';

function RoleBasedRouter() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Route based on user role
  if (user.role === 'admin') {
    return <AdminDashboardFixed />;
  } else if (user.role === 'agent') {
    return <AgentDashboardFixed />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default RoleBasedRouter;
