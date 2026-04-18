import React, { useState } from 'react';
import api from '../api/client';
import { X } from 'lucide-react';

function FieldForm({ onClose, onSuccess, agents, field = null }) {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    crop_type: field?.crop_type || '',
    planting_date: field?.planting_date || '',
    current_stage: field?.current_stage || 'planted',
    assigned_agent_id: field?.assigned_agent_id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (field) {
        await api.put(`/fields/${field.id}`, formData);
      } else {
        await api.post('/fields', formData);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save field');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {field ? 'Edit Field' : 'Add New Field'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Field Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Crop Type</label>
            <input
              type="text"
              value={formData.crop_type}
              onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
              className="input-field"
              placeholder="e.g., Corn, Wheat, Soybeans"
              required
            />
          </div>

          <div>
            <label className="label">Planting Date</label>
            <input
              type="date"
              value={formData.planting_date}
              onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Current Stage</label>
            <select
              value={formData.current_stage}
              onChange={(e) => setFormData({ ...formData, current_stage: e.target.value })}
              className="input-field"
            >
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>

          <div>
            <label className="label">Assign to Agent</label>
            <select
              value={formData.assigned_agent_id}
              onChange={(e) => setFormData({ ...formData, assigned_agent_id: e.target.value })}
              className="input-field"
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>
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
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : field ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FieldForm;