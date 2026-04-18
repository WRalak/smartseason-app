import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, User } from 'lucide-react';

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

function FieldCard({ field, onClick, isAdmin }) {
  const status = statusConfig[field.computed_status] || statusConfig.active;
  const stage = stageConfig[field.current_stage] || stageConfig.planted;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{field.name}</h3>
            <p className="text-sm text-gray-500">{field.crop_type}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
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
          <div className="text-xs text-gray-400">
            Updated {formatDistanceToNow(new Date(field.updated_at), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldCard;