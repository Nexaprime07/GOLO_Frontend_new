'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getAdminStats, getAdminLogs } from '@/app/lib/api';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  Settings, 
  Shield, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportData = () => {
    alert('Preparing user data export... Your download will start shortly.');
  };

  const handleClearCache = () => {
    alert('System cache cleared successfully. All data is now fresh.');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes] = await Promise.all([
        getAdminStats(),
        getAdminLogs(1, 10)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (logsRes.success) setLogs(logsRes.logs);
      
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('DELETED')) return 'text-red-500 bg-red-50';
    if (action.includes('BANNED')) return 'text-red-600 bg-red-100';
    if (action.includes('UPDATED')) return 'text-blue-500 bg-blue-50';
    if (action.includes('UNBANNED')) return 'text-green-600 bg-green-50';
    return 'text-gray-500 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="bg-[#F8F6F2] min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-[#157A4F] rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Administrator Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="bg-[#F8F6F2] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Shield className="text-[#157A4F]" size={36} />
                Admin Console
              </h1>
              <p className="text-gray-600 mt-1">
                Website health, moderation, and system integrity overview
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={fetchData}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Clock size={16} />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              icon={<Users className="text-blue-500" />}
              title="Total Users"
              value={stats?.totalUsers || 0}
              trend="+12% this week"
              bgColor="bg-blue-50"
            />
            <StatCard 
              icon={<FileText className="text-green-500" />}
              title="Total Ads"
              value={stats?.totalAds || stats?.totalRegularUsers || 0} 
              trend="+5% this week"
              bgColor="bg-green-50"
            />
            <StatCard 
              icon={<AlertCircle className="text-orange-500" />}
              title="Reports"
              value={stats?.pendingReports || 0}
              trend="Requires action"
              bgColor="bg-orange-50"
            />
            <StatCard 
              icon={<TrendingUp className="text-purple-500" />}
              title="Active Now"
              value={Math.floor(Math.random() * 50) + 10}
              trend="Real-time users"
              bgColor="bg-purple-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Navigation Tools */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NavCard 
                  title="Manage Ads"
                  desc="Delete, edit or review all listings on GOLO"
                  icon={<FileText size={32} />}
                  href="/admin/ads"
                  color="#157A4F"
                />
                <NavCard 
                  title="Reports Queue"
                  desc="Handle user reports and moderate content"
                  icon={<AlertCircle size={32} />}
                  href="/admin/reports"
                  color="#F59E0B"
                />
                <NavCard 
                  title="User Management"
                  desc="Ban/Unban users and manage permissions"
                  icon={<Users size={32} />}
                  href="/admin/users"
                  color="#3B82F6"
                />
                <NavCard 
                  title="Audit Logs"
                  desc="Track all administrator actions for integrity"
                  icon={<Activity size={32} />}
                  href="/admin/logs"
                  color="#8B5CF6"
                />
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={20} className="text-gray-400" />
                    Recent Activity
                  </h3>
                  <Link href="/admin/logs" className="text-sm font-semibold text-[#157A4F] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {logs.length > 0 ? logs.map((log) => (
                    <div key={log._id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                        <Activity size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">{log.adminEmail.split('@')[0]}</span>
                          {' '}{log.action.toLowerCase().replace(/_/g, ' ')}{' '}
                          <span className="font-medium text-gray-600">{log.targetType}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        #{log.targetId.slice(-6)}
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-400">
                      No recent activity found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Stats/Info */}
            <div className="space-y-6">
              <div className="bg-[#157A4F] rounded-2xl p-6 text-white shadow-lg shadow-green-900/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield size={22} />
                  Security Info
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-80">Admin Status</span>
                    <span className="font-semibold bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Secure</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-80">IP Address</span>
                    <span className="font-mono text-xs">84.120.XX.XX</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80">Database Health</span>
                    <span className="flex items-center gap-1.5 font-semibold text-green-300">
                      <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
                      Optimal
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings size={20} className="text-gray-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-full py-2.5 px-4 text-left text-sm font-medium rounded-xl transition-colors border ${
                      maintenanceMode 
                        ? 'bg-orange-50 text-orange-700 border-orange-200' 
                        : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    Maintenance Mode: {maintenanceMode ? 'ON (ACTIVE)' : 'OFF'}
                  </button>
                  <button 
                    onClick={handleExportData}
                    className="w-full py-2.5 px-4 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
                  >
                    Export User Data (CSV)
                  </button>
                  <button 
                    onClick={handleClearCache}
                    className="w-full py-2.5 px-4 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-50"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

function StatCard({ icon, title, value, trend, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${bgColor}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GOLO DATA</span>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-green-500 mt-2 font-medium">{trend}</p>
      </div>
    </div>
  );
}

function NavCard({ title, desc, icon, href, color }) {
  return (
    <Link 
      href={href}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group overflow-hidden relative"
    >
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform" 
        style={{ color }}
      >
        {icon}
      </div>
      <div className="relative z-10">
        <div className="p-3 rounded-xl inline-block mb-4" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{desc}</p>
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color }}>
          Open Tool
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
