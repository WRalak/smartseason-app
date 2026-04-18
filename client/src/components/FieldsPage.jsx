import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Filter } from 'lucide-react';

function FieldsPage() {
  const navigate = useNavigate();

  const fields = [
    { id: 1, name: 'North Field', crop: 'Corn', status: 'Active', agent: 'John Agent' },
    { id: 2, name: 'South Field', crop: 'Wheat', status: 'At Risk', agent: 'John Agent' },
    { id: 3, name: 'East Field', crop: 'Soybeans', status: 'Completed', agent: 'Jane Agent' },
    { id: 4, name: 'West Field', crop: 'Corn', status: 'Active', agent: 'Jane Agent' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fields</h1>
          <p className="text-gray-600">Manage and monitor all agricultural fields</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary inline-flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="btn-primary inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Map className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{field.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{field.crop}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(field.status)}`}>
                      {field.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{field.agent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/field/${field.id}`)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FieldsPage;
