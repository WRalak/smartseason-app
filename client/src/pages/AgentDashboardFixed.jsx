import React, { useEffect, useState } from 'react';
import { useAgentCore } from '../hooks/useAgentCore';
import { useAuthStore } from '../store/authStore';
import { Sprout, Calendar, User, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import UpdateForm from '../components/UpdateForm';
import FieldCard from '../components/FieldCard';

function AgentDashboard() {
  const { user } = useAuthStore();
  const {
    myFields,
    loading,
    error,
    updateFieldStage,
    addFieldObservation,
    getFieldDetails,
    refresh
  } = useAgentCore();

  const [selectedField, setSelectedField] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [fieldDetails, setFieldDetails] = useState(null);

  const handleFieldClick = async (field) => {
    const details = await getFieldDetails(field.id);
    setFieldDetails(details);
    setSelectedField(field);
  };

  const handleUpdate = async (fieldId, newStage, notes) => {
    const result = await updateFieldStage(fieldId, newStage, notes);
    if (result.success) {
      refresh(); // Refresh field list
      if (selectedField && selectedField.id === fieldId) {
        const updatedDetails = await getFieldDetails(fieldId);
        setFieldDetails(updatedDetails);
      }
    }
  };

  const handleAddObservation = async (fieldId, notes) => {
    const result = await addFieldObservation(fieldId, notes);
    if (result.success) {
      refresh(); // Refresh field list
      if (selectedField && selectedField.id === fieldId) {
        const updatedDetails = await getFieldDetails(fieldId);
        setFieldDetails(updatedDetails);
      }
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'planted': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'growing': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'ready': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'harvested': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Sprout className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your fields...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Agent Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back, {user?.name}! Here are your assigned fields.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Agent</span>
          <span className="sm:hidden">A</span>
        </div>
      </div>

              {/* My Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {myFields.map((field) => (
          <FieldCard
            key={field.id}
            field={field}
            onClick={() => handleFieldClick(field)}
            isAgent={true}
            onUpdate={(fieldId, newStage, notes) => handleUpdate(fieldId, newStage, notes)}
            onAddObservation={(fieldId, notes) => handleAddObservation(fieldId, notes)}
          />
        ))}
      </div>

      {/* Field Details Modal */}
      {selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 sm:m-0">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedField.name}</h2>
                  <p className="text-gray-600">{selectedField.crop_type}</p>
                </div>
                <button
                  onClick={() => setSelectedField(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Field Information</h3>
                
                <div className="flex items-center space-x-3">
                  {getStageIcon(selectedField.current_stage)}
                  <div>
                    <p className="text-sm text-gray-500">Current Stage</p>
                    <p className="font-medium capitalize">{selectedField.current_stage}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Planting Date</p>
                    <p className="font-medium">
                      {new Date(selectedField.planting_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedField.agent_name && (
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Assigned Agent</p>
                      <p className="font-medium">{selectedField.agent_name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => setShowUpdateForm(true)}
                    className="w-full btn-primary text-sm sm:text-base py-2 sm:py-3"
                    disabled={selectedField.current_stage === 'harvested'}
                  >
                    Update Stage
                  </button>
                  
                  <button
                    onClick={() => {
                      const notes = prompt('Add your observations:');
                      if (notes) {
                        handleAddObservation(selectedField.id, notes);
                      }
                    }}
                    className="w-full btn-secondary text-sm sm:text-base py-2 sm:py-3"
                  >
                    Add Observation
                  </button>
                </div>
              </div>
            </div>

            {/* Update History */}
            {fieldDetails?.updates && fieldDetails.updates.length > 0 && (
              <div className="border-t">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Update History</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {fieldDetails.updates.map((update) => (
                      <div key={update.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <div>
                            <span className="font-medium">{update.agent_name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(update.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Stage:</span>{' '}
                            <span className="font-medium capitalize">{update.previous_stage}</span>
                            <span className="mx-1">></span>
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* Update Form Modal */}
      {showUpdateForm && (
        <UpdateForm
          field={selectedField}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={(updatedField) => {
            setShowUpdateForm(false);
            handleUpdate(selectedField.id, updatedField.new_stage, updatedField.notes);
            setSelectedField(null);
          }}
        />
      )}
    </div>
  );
}

export default AgentDashboard;
