import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import FieldDetails from './components/FieldDetails';
import Analytics from './components/Analytics';
import FieldsPage from './components/FieldsPage';
import AgentsPage from './components/AgentsPage';
import Layout from './components/Layout';
import RoleBasedRouter from './components/RoleBasedRouter';

function App() {
  const { token, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Homepage />} />
          <Route path="dashboard" element={<RoleBasedRouter />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="fields" element={<FieldsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="field/:id" element={<FieldDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;