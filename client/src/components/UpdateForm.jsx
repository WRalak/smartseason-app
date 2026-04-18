import React, { useState } from 'react';
import api from '../api/client';
import { X } from 'lucide-react';

function UpdateForm({ field, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    field_id: field.id,
    new_stage: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stages = ['planted', 'growing', 'ready', 'harvested'];
  const currentStageIndex = stages.indexOf(field.current_stage);
  const availableStages = stages.slice(currentStageIndex + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.new_stage) {
      setError('Please select a new stage');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/updates', formData);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update field');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Update Field: {field.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Current Stage</label>
            <input
              type="text"
              value={field.current_stage.charAt(0).toUpperCase() + field.current_stage.slice(1)}
              className="input-field bg-gray-50"
              disabled
            />
          </div>

          <div>
            <label className="label">New Stage</label>
            <select
              value={formData.new_stage}
              onChange={(e) => setFormData({ ...formData, new_stage: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select new stage...</option>
              {availableStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
            {availableStages.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                Field is already harvested. Cannot update further.
              </p>
            )}
          </div>

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Add any observations or notes about this update..."
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || availableStages.length === 0}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateForm;