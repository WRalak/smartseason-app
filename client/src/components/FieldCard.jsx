import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, User, Edit, Trash2 } from 'lucide-react';

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  at_risk: { label: 'At Risk', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
};

const stageConfig = {
  planted: { label: 'Planted', color: 'text-purple-600' },
  growing: { label: 'Growing', color: 'text-blue-600' },
  ready: { label: 'Ready', color: 'text-yellow-600' },
  harvested: { label: 'Harvested', color: 'text-gray-600' },
};

function FieldCard({ field, onClick, isAdmin, isAgent, onEdit, onDelete, onUpdate, onAddObservation }) {
  const status = statusConfig[field.computed_status] || statusConfig.active;
  const stage = stageConfig[field.current_stage] || stageConfig.planted;

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(field);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${field.name}"?`)) {
      onDelete(field.id);
    }
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdate(field.id, 'growing', 'Field updated via card');
  };

  const handleAddObservation = (e) => {
    e.stopPropagation();
    const notes = prompt('Add your observations:');
    if (notes) {
      onAddObservation(field.id, notes);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{field.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{field.crop_type}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} mt-2 sm:mt-0`}>
            {status.label}
          </span>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Planted: {new Date(field.planting_date).toLocaleDateString()}
          </div>
          
          <div className="flex items-center text-sm">
            <span className={`font-medium ${stage.color}`}>
              Stage: {stage.label}
            </span>
          </div>

          {isAdmin && field.agent_name && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              Agent: {field.agent_name}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Updated {formatDistanceToNow(new Date(field.updated_at), { addSuffix: true })}
            </div>
            {isAdmin && (
              <div className="flex space-x-1">
                <button
                  onClick={handleEdit}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit field"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete field"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
            {isAgent && (
              <div className="flex space-x-1">
                <button
                  onClick={handleUpdate}
                  className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                  title="Update field stage"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={handleAddObservation}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Add observation"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldCard;