'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getAllReports, updateReportStatus, reviewAd } from '@/app/lib/api';
import { AlertTriangle, Eye, CheckCircle, XCircle, Edit2, Filter, RefreshCw, Bell } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const STATUS_LABELS = {
  pending: '⏳ Pending',
  reviewed: '👁️ Reviewed',
  action_taken: '✅ Action Taken',
};

const REASON_LABELS = {
  spam: '📢 Spam',
  inappropriate: '⚠️ Inappropriate',
  fraud: '🚫 Fraud',
  duplicate: '📋 Duplicate',
  other: '📝 Other',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  action_taken: 'bg-green-100 text-green-800',
};

export default function AdminReports() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState('approve');
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterReason, setFilterReason] = useState('all');
  const [socketConnected, setSocketConnected] = useState(false);
  const [newReportNotif, setNewReportNotif] = useState(0);
  const socketRef = useRef(null);
  const autoRefreshRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!authLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
    
    if (!authLoading && isAuthenticated && user?.role === 'admin') {
      fetchReports();
      setupSocketConnection();
      setupAutoRefresh();
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, [isAuthenticated, authLoading, user, router]);

  // Setup Socket.IO connection for real-time report notifications
  const setupSocketConnection = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('⚠️ No token available for socket connection');
        return;
      }

      const { io } = await import('socket.io-client');
      // Use correct backend port (3002)
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3002';
      console.log(`📡 Connecting to WebSocket at ${API_BASE}/reports`);
      
      const socket = io(`${API_BASE}/reports`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        reconnectionDelayFn: (attempt) => Math.min(attempt * 1000, 3000),
      });

      socket.on('connect', () => {
        setSocketConnected(true);
        console.log('✅ Connected to report notifications');
      });

      socket.on('disconnect', (reason) => {
        setSocketConnected(false);
        console.log(`❌ Disconnected from report notifications. Reason: ${reason}`);
      });

      socket.on('connected', (data) => {
        console.log('✅ Server confirmation:', data);
      });

      // Listen for new report events
      socket.on('new_report', (data) => {
        console.log('🔔 New report notification:', data);
        setNewReportNotif(prev => prev + 1);
        // Auto-fetch new reports
        fetchReports();
      });

      socket.on('report_submitted', (data) => {
        console.log('📋 Report submitted:', data);
        fetchReports();
      });

      socket.on('error', (err) => {
        console.error('❌ Socket error:', err);
        if (err?.message) {
          console.error(`   Message: ${err.message}`);
        }
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', {
          message: error.message,
          data: error.data,
        });
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('❌ Failed to setup socket connection:', err);
    }
  };

  // Setup auto-refresh every 30 seconds as a fallback
  const setupAutoRefresh = () => {
    autoRefreshRef.current = setInterval(() => {
      fetchReports();
    }, 30000); // 30 seconds
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📥 Fetching reports from API...');
      const response = await getAllReports();
      
      console.log('✅ API Response:', response);
      
      if (response.success) {
        console.log(`📊 Loaded ${response.data?.length || 0} reports`);
        setReports(response.data || []);
        setNewReportNotif(0); // Reset notification counter after refresh
      } else {
        const errorMsg = response.message || response.error || 'Failed to load reports';
        console.error('❌ API returned unsuccessful:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('❌ Error fetching reports:', {
        message: err.message,
        status: err.status,
        data: err.data,
        stack: err.stack,
      });
      setError(err.data?.message || err.message || 'Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      setIsProcessing(true);
      const response = await updateReportStatus(reportId, newStatus, adminNotes);
      
      if (response.success) {
        // Remove from list
        setReports(reports.filter(r => r.reportId !== reportId));
        setShowReviewModal(false);
        setAdminNotes('');
        alert('Report status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update report status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewAd = async (adId) => {
    if (!selectedReport) return;
    
    try {
      setIsProcessing(true);
      const response = await reviewAd(adId, reviewDecision, adminNotes);
      
      if (response.success) {
        // Remove from list
        setReports(reports.filter(r => r.adId !== adId));
        setShowReviewModal(false);
        setReviewDecision('approve');
        setAdminNotes('');
        alert(`Ad ${reviewDecision === 'approve' ? 'approved' : reviewDecision.replace('_', ' ')} successfully`);
      } else {
        alert('Failed to review ad');
      }
    } catch (err) {
      console.error('Error reviewing ad:', err);
      alert('Failed to review ad');
    } finally {
      setIsProcessing(false);
    }
  };

  const openReviewModal = (report) => {
    setSelectedReport(report);
    setShowReviewModal(true);
  };

  const filteredReports = filterReason === 'all' 
    ? reports 
    : reports.filter(r => r.reason === filterReason);

  // Show loading during auth check
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#F8F6F2] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw size={40} className="animate-spin text-[#157A4F] mx-auto mb-4" />
            <p className="text-gray-600">Verifying admin access...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Redirect non-authenticated users
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#F8F6F2] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw size={40} className="animate-spin text-[#157A4F] mx-auto mb-4" />
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="bg-[#F8F6F2] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                All Reports Queue
                {socketConnected && (
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Real-time connected" />
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                Review and moderate all flagged ads ({filteredReports.length} total)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {newReportNotif > 0 && (
                <div className="relative flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <Bell size={18} className="text-blue-600 animate-pulse" />
                  <span className="text-sm font-semibold text-blue-800">
                    {newReportNotif} new report{newReportNotif !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <button
                onClick={fetchReports}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-3">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by reason:</span>
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#157A4F] focus:border-transparent"
            >
              <option value="all">All Reasons</option>
              <option value="spam">📢 Spam</option>
              <option value="inappropriate">⚠️ Inappropriate</option>
              <option value="fraud">🚫 Fraud</option>
              <option value="duplicate">📋 Duplicate</option>
              <option value="other">📝 Other</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Reports Table */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filterReason === 'all' ? 'No reports found!' : `No ${filterReason} reports`}
              </h3>
              <p className="text-gray-600">
                {filterReason === 'all' 
                  ? 'No reports in the system at the moment.' 
                  : `No reports with "${filterReason}" reason.`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ad Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Reported By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Report Count
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.reportId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800 truncate max-w-xs">
                              {report.ad?.title || 'Unknown Ad'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {report.adId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            report.reason === 'fraud' || report.reason === 'inappropriate'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {REASON_LABELS[report.reason]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[report.status] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {STATUS_LABELS[report.status] || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {report.reportedBy.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            report.ad?.reportCount >= 10
                              ? 'bg-red-100 text-red-800'
                              : report.ad?.reportCount >= 5
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {report.ad?.reportCount || 0} reports
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openReviewModal(report)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#157A4F] text-white rounded-lg hover:bg-[#126b44] transition-colors text-sm font-medium"
                            >
                              <Eye size={16} />
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Review Flagged Ad</h2>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Ad Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Ad Details</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Title:</strong> {selectedReport.ad?.title || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedReport.ad?.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedReport.ad?.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedReport.ad?.status || 'unknown'}
                  </span>
                </p>
              </div>

              {/* Report Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Report Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {REASON_LABELS[selectedReport.reason]}
                  </p>
                  {selectedReport.description && (
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong> {selectedReport.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <strong>Total Reports:</strong>{' '}
                    <span className="font-semibold">
                      {selectedReport.ad?.reportCount || 0}
                    </span>
                  </p>
                </div>
              </div>

              {/* Decision */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Decision
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setReviewDecision('approve')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reviewDecision === 'approve'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle size={24} className={`mx-auto mb-2 ${
                      reviewDecision === 'approve' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      reviewDecision === 'approve' ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      Approve Ad
                    </p>
                  </button>
                  <button
                    onClick={() => setReviewDecision('remove')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reviewDecision === 'remove'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <XCircle size={24} className={`mx-auto mb-2 ${
                      reviewDecision === 'remove' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      reviewDecision === 'remove' ? 'text-red-800' : 'text-gray-600'
                    }`}>
                      Remove Ad
                    </p>
                  </button>
                  <button
                    onClick={() => setReviewDecision('request_changes')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reviewDecision === 'request_changes'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Edit2 size={24} className={`mx-auto mb-2 ${
                      reviewDecision === 'request_changes' ? 'text-orange-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      reviewDecision === 'request_changes' ? 'text-orange-800' : 'text-gray-600'
                    }`}>
                      Request Changes
                    </p>
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#157A4F] focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewAd(selectedReport.adId)}
                  disabled={isProcessing}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : reviewDecision === 'approve'
                      ? 'bg-green-500 hover:bg-green-600'
                      : reviewDecision === 'remove'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw size={18} className="animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Confirm ${reviewDecision === 'approve' ? 'Approval' : reviewDecision.replace('_', ' ')}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
