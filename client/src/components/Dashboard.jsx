import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import FieldCard from './FieldCard';
import FieldForm from './FieldForm';
import { Plus, Sprout, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

function Dashboard() {
  const [fields, setFields] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const fetchFields = async () => {
    try {
      const response = await api.get('/fields');
      setFields(response.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    if (isAdmin) {
      try {
        const response = await api.get('/fields/agents/list');
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    }
  };

  useEffect(() => {
    fetchFields();
    fetchAgents();
  }, []);

  const stats = {
    total: fields.length,
    active: fields.filter(f => f.computed_status === 'active').length,
    at_risk: fields.filter(f => f.computed_status === 'at_risk').length,
    completed: fields.filter(f => f.computed_status === 'completed').length,
  };

  const stageCounts = {
    planted: fields.filter(f => f.current_stage === 'planted').length,
    growing: fields.filter(f => f.current_stage === 'growing').length,
    ready: fields.filter(f => f.current_stage === 'ready').length,
    harvested: fields.filter(f => f.current_stage === 'harvested').length,
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading fields...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            {isAdmin ? 'All fields overview' : 'Your assigned fields'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Fields"
          value={stats.total}
          icon={Sprout}
          color="bg-blue-500"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="At Risk"
          value={stats.at_risk}
          icon={AlertTriangle}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="bg-gray-500"
        />
      </div>

      {/* Stage Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Growth Stage Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stageCounts.planted}</div>
            <div className="text-sm text-gray-600">Planted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stageCounts.growing}</div>
            <div className="text-sm text-gray-600">Growing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stageCounts.ready}</div>
            <div className="text-sm text-gray-600">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stageCounts.harvested}</div>
            <div className="text-sm text-gray-600">Harvested</div>
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <FieldCard
            key={field.id}
            field={field}
            onClick={() => navigate(`/field/${field.id}`)}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No fields found</p>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 btn-primary"
            >
              Create your first field
            </button>
          )}
        </div>
      )}

      {showForm && (
        <FieldForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchFields();
          }}
          agents={agents}
        />
      )}
    </div>
  );
}

export default Dashboard;