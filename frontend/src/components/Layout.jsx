import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  CloudIcon, 
  ExclamationTriangleIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  PlayIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { useDemoMode } from '../contexts/DemoModeContext';
import TourGuide from './TourGuide';
import TourButton from './TourButton';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Forecast', href: '/forecast', icon: CloudIcon },
    { name: 'Emergency Resources', href: '/emergency-resources', icon: MapPinIcon },
    { name: 'Hurricane Simulation', href: '/hurricane-simulation', icon: ExclamationTriangleIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const handleClearAll = () => {
    if (window.confirm('This will clear all saved data and chat history. Continue?')) {
      api.resetSession();
      navigate('/');
      window.location.reload();
    }
  };

  const handleToggleDemo = () => {
    toggleDemoMode();
    // Optional: show a toast notification
    const message = !isDemoMode 
      ? '🎬 Demo Mode Activated - Using realistic mock data' 
      : '📡 Live Mode Activated - Using real weather data';
    
    // Simple alert for now (you can replace with a toast library)
    setTimeout(() => {
      alert(message);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CloudIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Weather Insights & Forecast Advisor</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Tour Button */}
              <TourButton />
              
              {/* Demo Mode Toggle */}
              <button
                onClick={handleToggleDemo}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isDemoMode
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isDemoMode ? 'Switch to Live Data' : 'Switch to Demo Mode'}
                data-tour-id="demo-toggle"
              >
                {isDemoMode ? (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    <span className="text-sm font-bold">DEMO MODE</span>
                  </>
                ) : (
                  <>
                    <SignalIcon className="h-5 w-5" />
                    <span className="text-sm">Live Data</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleClearAll}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear all data and start fresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors
                    ${isActive(item.href)
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 border-b-4 border-yellow-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <PlayIcon className="h-6 w-6 text-gray-900 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    🎬 DEMO MODE ACTIVE
                  </p>
                  <p className="text-xs text-gray-800">
                    Showing realistic mock data for Hurricane Milton scenario • Click "Live Data" to switch to real weather data
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleDemo}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Switch to Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built for Agents for Impact '25 - Climate & Public Safety Track
          </p>
        </div>
      </footer>

      {/* Tour Guide Overlay */}
      <TourGuide />
    </div>
  );
};

export default Layout;
