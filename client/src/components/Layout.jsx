import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Sprout, Users, Map, Home, BarChart3 } from 'lucide-react';

function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/fields', label: 'Fields', icon: Map },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ path: '/agents', label: 'Agents', icon: Users });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <Sprout className="w-8 h-8 text-green-600" />
                <span className="ml-2 text-xl font-semibold text-gray-800">SmartSeason</span>
                <span className="ml-2 text-sm text-gray-500">Field Monitoring</span>
              </Link>
              
              <div className="hidden md:flex space-x-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.name}</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {user?.role === 'admin' ? 'Admin' : 'Field Agent'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;