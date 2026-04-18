import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FieldDetails from './components/FieldDetails';
import Layout from './components/Layout';

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="field/:id" element={<FieldDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;