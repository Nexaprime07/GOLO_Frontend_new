'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { adminGetAllUsers, adminBanUser, adminUnbanUser } from '@/app/lib/api';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Lock,
  MessageSquare
} from 'lucide-react';

export default function AdminUsersManagement() {
  const router = useRouter();
  const [usersData, setUsersData] = useState({ users: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminGetAllUsers(page, 10);
      if (res.success) {
        setUsersData(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!banReason.trim()) return alert('Please provide a reason for banning.');
    
    try {
      setLoading(true);
      const res = await adminBanUser(selectedUser.id, banReason);
      if (res.success) {
        setUsersData({
          ...usersData,
          users: usersData.users.map(u => u.id === selectedUser.id ? { ...u, isBanned: true } : u)
        });
        setShowBanModal(false);
        setBanReason('');
        alert('User has been banned.');
      }
    } catch (err) {
      alert('Failed to ban user');
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanUser = async (user) => {
    if (!window.confirm(`Are you sure you want to unban ${user.name}?`)) return;
    
    try {
      setLoading(true);
      const res = await adminUnbanUser(user.id);
      if (res.success) {
        setUsersData({
          ...usersData,
          users: usersData.users.map(u => u.id === user.id ? { ...u, isBanned: false } : u)
        });
        alert('User has been unbanned.');
      }
    } catch (err) {
      alert('Failed to unban user');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = usersData.users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-500 text-sm">Monitor user activity and enforce platform rules</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name or email..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl w-72 focus:ring-2 focus:ring-[#157A4F] outline-none shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Safety Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && usersData.users.length === 0 ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-8 py-10"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      </tr>
                    ))
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                            user.role === 'admin' ? 'bg-[#157A4F]' : 'bg-blue-500'
                          }`}>
                            {user.name?.charAt(0) || <Users size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                          user.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        {user.isBanned ? (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-tight">
                            <ShieldAlert size={14} />
                            Banned
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-tight">
                            <ShieldCheck size={14} />
                            Active
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {user.role !== 'admin' && (
                          user.isBanned ? (
                            <button 
                              onClick={() => handleUnbanUser(user)}
                              className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-all flex items-center gap-2 ml-auto"
                            >
                              <UserCheck size={16} />
                              Unban User
                            </button>
                          ) : (
                            <button 
                              onClick={() => { setSelectedUser(user); setShowBanModal(true); }}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-2 ml-auto"
                            >
                              <UserX size={16} />
                              Ban User
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {usersData.total} users</p>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  disabled={usersData.total <= page * 10}
                  onClick={() => setPage(page + 1)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ban User Account?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              You are about to suspend <span className="font-bold text-gray-800">{selectedUser.name}</span>. 
              The user will be immediately logged out and prevented from accessing their account.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Reason for Ban
                </label>
                <textarea 
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Repeated violation of policy, fraudulent listings..."
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
                <Lock className="text-blue-500 mt-1" size={16} />
                <p className="text-[10px] text-blue-800 font-medium leading-relaxed uppercase tracking-wider">
                  Banning a user maintains the integrity of the GOLO community. 
                  Audit logs will record this action under your profile.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowBanModal(false)}
                className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleBanUser}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 active:scale-95 transition-all"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
