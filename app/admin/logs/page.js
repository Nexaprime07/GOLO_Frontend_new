'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getAdminLogs } from '@/app/lib/api';
import { 
  Activity, 
  ChevronLeft, 
  Search, 
  Filter, 
  RefreshCw,
  User,
  ExternalLink,
  Shield,
  FileText
} from 'lucide-react';

export default function AdminAuditLogs() {
  const router = useRouter();
  const [logsData, setLogsData] = useState({ logs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAdminLogs(page, 50);
      if (res.success) {
        setLogsData(res);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('DELETED')) return 'text-red-600 bg-red-100';
    if (action.includes('BANNED')) return 'text-red-700 bg-red-200';
    if (action.includes('UPDATED')) return 'text-blue-600 bg-blue-100';
    if (action.includes('UNBANNED')) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getTargetIcon = (type) => {
    if (type === 'Ad') return <FileText size={14} />;
    if (type === 'User') return <User size={14} />;
    return <Activity size={14} />;
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F8F6F2] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/admin')} className="p-2 hover:bg-white rounded-xl transition-all">
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Shield size={28} className="text-[#157A4F]" />
                  Internal Audit Ledger
                </h1>
                <p className="text-gray-500 text-sm">Review all administrator-level activities and security events</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter by admin or target ID..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl w-72 focus:ring-2 focus:ring-[#157A4F] outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchLogs}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-widest">
                Activity Stream
              </h3>
              <p className="text-xs text-gray-400">Showing {logsData.logs.length} entries of {logsData.total}</p>
            </div>

            <div className="divide-y divide-gray-100">
              {loading && logsData.logs.length === 0 ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="p-6 animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                  </div>
                ))
              ) : logsData.logs.length > 0 ? logsData.logs.map((log) => (
                <div key={log._id} className="p-6 hover:bg-gray-50 transition-all flex flex-col md:flex-row md:items-center gap-6 group">
                  
                  <div className="flex items-center gap-3 min-w-[300px]">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${getActionColor(log.action)}`}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                       <span className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">Admin:</span>
                       <span className="text-sm font-medium text-[#157A4F] bg-green-50 px-2.5 py-1 rounded-lg">
                          {log.adminEmail}
                       </span>
                       <span className="text-gray-300 mx-1">→</span>
                       <span className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">Target:</span>
                       <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {getTargetIcon(log.targetType)}
                          {log.targetType}: {log.targetId}
                       </div>
                    </div>
                    {log.details && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 hidden group-hover:block transition-all duration-300">
                         <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Impact Details</p>
                         <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                         </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white rounded-lg border border-gray-100 shadow-sm text-gray-400 hover:text-green-600">
                       <ExternalLink size={18} />
                    </button>
                  </div>

                </div>
              )) : (
                <div className="p-20 text-center text-gray-400">
                  No audit logs recorded yet
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-4">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-bold disabled:opacity-30 hover:shadow-sm"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-gray-500">Page {page}</span>
              <button 
                disabled={logsData.total <= page * 50}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-bold disabled:opacity-30 hover:shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
