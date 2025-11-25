'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/app/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    blogs: 0,
    testimonials: 0,
    gallery: 0,
    contacts: 0
  });
  const [visitorStats, setVisitorStats] = useState({
    today: 0,
    yesterday: 0,
    total: 0,
    last7Days: []
  });
  const [systemStatus, setSystemStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up interval to refresh visitor stats every 30 seconds
    const interval = setInterval(() => {
      fetchVisitorStats();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Test API connection first
      try {
        const testResult = await apiService.getAllBlogs();
        if (testResult && (testResult.success || Array.isArray(testResult.data))) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        console.log('API test failed, using demo mode');
        setApiStatus('offline');
        setDemoData();
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      await Promise.all([
        fetchStats(),
        fetchVisitorStats(),
        fetchSystemStatus()
      ]);

    } catch (error) {
      console.error('Error in dashboard:', error);
      setApiStatus('offline');
      setDemoData();
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  const fetchStats = async () => {
    try {
      const statsResponse = await apiService.getDashboardStats();
      if (statsResponse && statsResponse.success) {
        console.log('✅ Using dashboard stats from /api/dashboard/stats');
        setStats(statsResponse.data);
      } else {
        await fetchFallbackStats();
      }
    } catch (error) {
      console.log('❌ Dashboard stats failed, trying fallback');
      await fetchFallbackStats();
    }
  };

  const fetchVisitorStats = async () => {
    try {
      const visitorResponse = await apiService.getVisitorStats();
      if (visitorResponse && visitorResponse.success) {
        console.log(`✅ Loaded visitor stats: Today=${visitorResponse.data.today}, Total=${visitorResponse.data.total}`);
        setVisitorStats(visitorResponse.data);
      } else {
        // No demo data - just set empty stats
        setVisitorStats({
          today: 0,
          yesterday: 0,
          total: 0,
          last7Days: []
        });
      }
    } catch (error) {
      console.log('Visitor stats failed');
      // No demo data - just set empty stats
      setVisitorStats({
        today: 0,
        yesterday: 0,
        total: 0,
        last7Days: []
      });
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const statusResponse = await apiService.getSystemStatus();
      if (statusResponse && statusResponse.success) {
        setSystemStatus(statusResponse.data);
      }
    } catch (error) {
      console.log('System status failed, using default');
      setSystemStatus({ database: 'unknown', tables: 0 });
    }
  };

  const fetchFallbackStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/dashboard`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Using fallback dashboard data from /api/admin/dashboard');
          setStats(data.data);
          return;
        }
      }
    } catch (error) {
      console.log('Fallback dashboard also failed');
    }

    // If all else fails, use demo data for main stats only
    setStats({
      services: 5,
      blogs: 3,
      testimonials: 8,
      gallery: 12,
      contacts: 15,
    });
  };

  const setDemoData = () => {
    setStats({
      services: 5,
      blogs: 3,
      testimonials: 8,
      gallery: 12,
      contacts: 15,
    });
    // No demo data for visitor stats
    setVisitorStats({
      today: 0,
      yesterday: 0,
      total: 0,
      last7Days: []
    });
    setSystemStatus({ database: 'connected', tables: 15, api: 'online' });
  };

  const statCards = [
    { 
      title: 'Total Services', 
      value: stats.services, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/admin/services'
    },
    { 
      title: 'Blog Posts', 
      value: stats.blogs, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/admin/blogs'
    },
    { 
      title: 'Testimonials', 
      value: stats.testimonials, 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      link: '/admin/testimonials'
    },
    { 
      title: 'Gallery Images', 
      value: stats.gallery, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/admin/gallery'
    },
    { 
      title: 'Contact Messages', 
      value: stats.contacts, 
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      link: '/admin/contact'
    },
  ];

  const quickActions = [
    { 
      title: 'Add Service', 
      description: 'Create new security service', 
      link: '/admin/services/create', 
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      title: 'Write Blog', 
      description: 'Create new blog post', 
      link: '/admin/blogs/create', 
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      title: 'Add Testimonial', 
      description: 'Add customer testimonial', 
      link: '/admin/testimonials/create', 
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    { 
      title: 'Upload Image', 
      description: 'Add to gallery', 
      link: '/admin/gallery/create', 
      color: 'bg-purple-500 hover:bg-purple-600'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-blue-100 text-lg">Welcome to Forever Security Admin Panel</p>
            <p className="text-blue-200 text-sm mt-1">
              {apiStatus === 'online' ? 'Connected to live data' : 'Running in demo mode'}
              {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
            </p>
          </div>
          {apiStatus === 'offline' && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Demo Mode
            </div>
          )}
        </div>
      </div>

      {/* API Status Warning */}
      {apiStatus === 'offline' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-amber-500 mr-3">⚠️</div>
            <div>
              <p className="text-amber-800 font-medium">Backend Server Offline</p>
              <p className="text-amber-700 text-sm">
                Using demo data. Make sure your backend is running on {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}
              </p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 text-amber-700 hover:text-amber-800 font-medium text-sm"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.link}
            className="block transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className={`${stat.color} rounded-xl shadow-md p-6 text-white`}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium opacity-90">
                  {stat.title}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Visitor Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Website Visitors</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  Auto-refresh in 30s
                </span>
                <button 
                  onClick={fetchVisitorStats}
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {visitorStats.today}
                </div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {visitorStats.yesterday}
                </div>
                <div className="text-sm text-gray-600">Yesterday</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {visitorStats.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            
            {/* Simple bar chart for last 7 days */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Last 7 Days</h3>
              {visitorStats.last7Days && visitorStats.last7Days.length > 0 ? (
                <div className="space-y-2">
                  {visitorStats.last7Days.map((day, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500 w-16">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full"
                          style={{ 
                            width: `${Math.max((day.count / Math.max(...visitorStats.last7Days.map(d => d.count || 1)) * 100), 5)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-gray-700 w-8">
                        {day.count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No visitor data available yet</p>
                  <p className="text-sm">Visitor counts will appear as people visit your website</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className="block transform transition-all duration-300 hover:scale-105"
              >
                <div className={`${action.color} text-white rounded-lg p-6 text-center shadow-sm hover:shadow-md`}>
                  <h3 className="font-semibold text-lg mb-2">
                    {action.title}
                  </h3>
                  <p className="text-white text-opacity-90 text-sm">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg border ${
            apiStatus === 'online' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`font-bold text-lg ${
              apiStatus === 'online' ? 'text-green-600' : 'text-amber-600'
            }`}>
              {apiStatus === 'online' ? 'Online' : 'Offline'}
            </div>
            <div className="text-gray-600 text-sm">API Server</div>
          </div>
          <div className={`text-center p-4 rounded-lg border ${
            systemStatus.database === 'connected'
              ? 'bg-green-50 border-green-200'
              : systemStatus.database === 'disconnected'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`font-bold text-lg ${
              systemStatus.database === 'connected' ? 'text-green-600' : 
              systemStatus.database === 'disconnected' ? 'text-red-600' : 'text-amber-600'
            }`}>
              {systemStatus.database === 'connected' ? 'Connected' : 
               systemStatus.database === 'disconnected' ? 'Disconnected' : 'Unknown'}
            </div>
            <div className="text-gray-600 text-sm">Database</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-bold text-lg">Active</div>
            <div className="text-gray-600 text-sm">Admin Panel</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-amber-600 font-bold text-lg">
              {systemStatus.tables || 'N/A'} Tables
            </div>
            <div className="text-gray-600 text-sm">Database</div>
          </div>
        </div>
        {systemStatus.timestamp && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Last updated: {new Date(systemStatus.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}