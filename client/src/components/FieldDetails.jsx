import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';
import UpdateForm from './UpdateForm';
import FieldForm from './FieldForm';
import { ArrowLeft, Edit, Calendar, User, Sprout, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: Sprout },
  at_risk: { label: 'At Risk', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
};

function FieldDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [agents, setAgents] = useState([]);

  const isAdmin = user?.role === 'admin';
  const canUpdate = isAdmin || (!isAdmin && field?.assigned_agent_id === user?.id);

  // Debug logging
  console.log('FieldDetails Debug:', {
    user: user?.name,
    userRole: user?.role,
    userId: user?.id,
    fieldId: field?.id,
    fieldAgentId: field?.assigned_agent_id,
    isAdmin,
    canUpdate,
    fieldStage: field?.current_stage
  });

  const fetchField = async () => {
    try {
      const response = await api.get(`/fields/${id}`);
      setField(response.data);
    } catch (error) {
      console.error('Error fetching field:', error);
      navigate('/');
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
    fetchField();
    fetchAgents();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
      try {
        await api.delete(`/fields/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting field:', error);
        alert('Failed to delete field');
      }
    }
  };

  const status = statusConfig[field?.computed_status] || statusConfig.active;
  const StatusIcon = status.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading field details...</div>
      </div>
    );
  }

  if (!field) return null;

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-800">{field.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4 inline mr-1" />
                  {status.label}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{field.crop_type}</p>
            </div>
            <div className="flex space-x-2">
              {isAdmin && (
                <button
                  onClick={() => setShowEditForm(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
              {canUpdate && field.current_stage !== 'harvested' && (
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="btn-primary"
                >
                  Update Stage
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Field Information</h2>
            
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Planting Date</p>
                <p className="font-medium">
                  {format(new Date(field.planting_date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Sprout className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Current Stage</p>
                <p className="font-medium capitalize">{field.current_stage}</p>
              </div>
            </div>

            {field.agent_name && (
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Assigned Agent</p>
                  <p className="font-medium">{field.agent_name}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(field.updated_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Update History */}
        {field.updates && field.updates.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Update History</h2>
            <div className="space-y-3">
              {field.updates.map((update) => (
                <div key={update.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{update.agent_name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Stage:</span>{' '}
                      <span className="font-medium capitalize">{update.previous_stage}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium capitalize">{update.new_stage}</span>
                    </div>
                  </div>
                  {update.notes && (
                    <p className="text-gray-600 text-sm mt-2">{update.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showUpdateForm && (
        <UpdateForm
          field={field}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={() => {
            setShowUpdateForm(false);
            fetchField();
          }}
        />
      )}

      {showEditForm && (
        <FieldForm
          field={field}
          agents={agents}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            fetchField();
          }}
        />
      )}
    </div>
  );
}

function CheckCircle(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default FieldDetails;