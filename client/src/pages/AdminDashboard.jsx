import React, { useEffect, useState } from 'react';
import { useAdminCore } from '../hooks/useAdminCore';
import { Users, Activity, BarChart3, TrendingUp, Eye } from 'lucide-react';

function AdminDashboard() {
  const {
    allFields,
    allUpdates,
    allAgents,
    loading,
    error,
    getAgentUpdates,
    refresh
  } = useAdminCore();

  // Calculate statistics
  const stats = {
    totalFields: allFields.length,
    totalAgents: allAgents.length,
    activeAgents: allAgents.filter(a => a.status === 'Active').length,
    fieldStatusBreakdown: {
      active: allFields.filter(f => f.computed_status === 'active').length,
      at_risk: allFields.filter(f => f.computed_status === 'at_risk').length,
      completed: allFields.filter(f => f.computed_status === 'completed').length,
    },
    stageBreakdown: {
      planted: allFields.filter(f => f.current_stage === 'planted').length,
      growing: allFields.filter(f => f.current_stage === 'growing').length,
      ready: allFields.filter(f => f.current_stage === 'ready').length,
      harvested: allFields.filter(f => f.current_stage === 'harvested').length,
    }
  };

  // Agent performance metrics
  const agentMetrics = allAgents.map(agent => {
    const agentFields = allFields.filter(f => f.assigned_agent_id === agent.id);
    
    return {
      agentId: agent.id,
      agentName: agent.name,
      totalFields: agentFields.length,
      updatesCount: agentFields.reduce((total, field) => 
        total + (field.updates ? field.updates.length : 0), 0
      ),
      lastUpdate: agentFields.length > 0 ? 
        Math.max(...agentFields.map(f => 
          f.updated_at ? new Date(f.updated_at) : new Date(0)
        )) : null,
      efficiency: agentFields.length > 0 ? 
        agentFields.filter(f => f.computed_status === 'active').length / agentFields.length : 0
    };
  });

  // Recent activity
  const recentActivity = allUpdates.slice(0, 10).map(update => ({
    ...update,
    timeAgo: getTimeAgo(update.created_at),
    agentName: update.agent_name,
    fieldName: update.field_name || 'Unknown Field',
    stageChange: `${update.previous_stage} -> ${update.new_stage}`
  }));

  // Helper function for time ago
  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading admin dashboard...</div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and monitoring</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>Admin</span>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fields</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalFields}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Fields</p>
              <p className="text-2xl font-bold text-green-600">{stats.fieldStatusBreakdown.active}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500 text-white">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk Fields</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.fieldStatusBreakdown.at_risk}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 text-white">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Fields</p>
              <p className="text-2xl font-bold text-gray-600">{stats.fieldStatusBreakdown.completed}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-500 text-white">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agent Performance</h2>
        <div className="space-y-4">
          {agentMetrics.map((metric) => (
            <div key={metric.agentId} className="flex items-center justify-between p-4 border-b">
              <div>
                <p className="font-medium text-gray-800">{metric.agentName}</p>
                <p className="text-sm text-gray-500">{metric.totalFields} fields</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-green-600">{metric.efficiency * 100}% efficiency</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{activity.agentName}</span>
                <span className="text-sm text-gray-500">{activity.timeAgo}</span>
              </div>
              <div className="text-right text-sm text-gray-600">
                {activity.stageChange}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fields Overview */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allFields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{field.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(field.computed_status)}`}>
                      {field.computed_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium capitalize">{field.current_stage}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {field.agent_name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(field.updated_at).toLocaleDateString()}
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

export default AdminDashboard;
