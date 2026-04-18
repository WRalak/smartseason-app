import React from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Field performance insights and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Yield</p>
              <p className="text-2xl font-bold text-green-600">1,250 tons</p>
              <p className="text-sm text-green-500">+12% from last season</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-blue-600">87%</p>
              <p className="text-sm text-blue-500">Above average</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Field Health</p>
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-sm text-purple-500">Excellent condition</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Analytics charts will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
