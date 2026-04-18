import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, BarChart3, Map, Users, TrendingUp, Shield, Clock } from 'lucide-react';

function Homepage() {
  const features = [
    {
      icon: Map,
      title: 'Field Management',
      description: 'Track and manage all your agricultural fields in one place',
      link: '/fields'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into crop performance and field status',
      link: '/analytics'
    },
    {
      icon: Users,
      title: 'Team Coordination',
      description: 'Assign fields to agents and track their progress',
      link: '/agents'
    }
  ];

  const stats = [
    { icon: Sprout, label: 'Active Fields', value: '4', color: 'text-green-600' },
    { icon: TrendingUp, label: 'Growth Rate', value: '87%', color: 'text-blue-600' },
    { icon: Shield, label: 'Health Score', value: '92%', color: 'text-purple-600' },
    { icon: Clock, label: 'Avg. Growth Time', value: '45 days', color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to SmartSeason
          </h1>
          <p className="text-xl mb-6 text-green-50">
            Your comprehensive field monitoring system for smarter agricultural management
          </p>
          <div className="flex space-x-4">
            <Link
              to="/fields"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              View Fields
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/analytics"
              className="inline-flex items-center px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Learn more
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">North Field updated to Growing stage</p>
                <p className="text-sm text-gray-500">Updated 2 hours ago by John Agent</p>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">South Field marked as At Risk</p>
                <p className="text-sm text-gray-500">Updated 5 hours ago by Jane Agent</p>
              </div>
            </div>
            <span className="text-sm text-yellow-600 font-medium">At Risk</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">East Field harvested successfully</p>
                <p className="text-sm text-gray-500">Updated 1 day ago by Jane Agent</p>
              </div>
            </div>
            <span className="text-sm text-gray-600 font-medium">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
