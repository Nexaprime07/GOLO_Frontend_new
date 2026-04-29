'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Key, LogOut, ChevronRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MerchantNavbar from '../MerchantNavbar';

export default function MerchantSettingsPage() {
  const router = useRouter();
  const { user, loading, logout, getUserAccountType } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    promotionNotifications: true,
    pushNotifications: true,
  });
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/merchant/settings');
      return;
    }

    if (!loading && user?.accountType !== 'merchant') {
      router.replace('/');
      return;
    }
  }, [loading, user, router]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading2(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      setLoading2(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading2(false);
      return;
    }

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message || 'Failed to change password');
        return;
      }

      setSuccess('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setError(err?.message || 'Failed to change password');
    } finally {
      setLoading2(false);
    }
  };

  const handleNotificationChange = async () => {
    setError('');
    setSuccess('');
    setLoading2(true);

    try {
      const response = await fetch('/api/merchant/notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(notificationSettings),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message || 'Failed to update notification settings');
        return;
      }

      setSuccess('Notification settings updated successfully');
      setTimeout(() => setShowNotificationModal(false), 2000);
    } catch (err) {
      setError(err?.message || 'Failed to update notification settings');
    } finally {
      setLoading2(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-[#efefef]" />;
  }

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <MerchantNavbar activeKey="settings" />

      <main className="w-full px-6 lg:px-20 py-8">
        <div className="w-full space-y-6">
          <div className="mb-8">
            <h1 className="text-[40px] font-bold text-[#1f1f1f]">Settings</h1>
            <p className="text-[16px] text-[#666] mt-2">Manage your account and preferences</p>
          </div>

          {/* Notification Settings */}
          <button
            onClick={() => setShowNotificationModal(true)}
            className="w-full rounded-[16px] border border-[#d5d5d5] bg-white px-8 py-8 flex items-center justify-between hover:bg-[#fafafa] hover:border-[#1f8f4f] transition"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-[#f0f0f0] flex items-center justify-center">
                <Bell size={28} className="text-[#1f8f4f]" />
              </div>
              <div className="text-left">
                <h3 className="text-[18px] font-bold text-[#1f1f1f]">Notification Settings</h3>
                <p className="text-[14px] text-[#888] mt-2">Configure how you receive notifications</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#ccc]" />
          </button>

          {/* Password Reset */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full rounded-[16px] border border-[#d5d5d5] bg-white px-8 py-8 flex items-center justify-between hover:bg-[#fafafa] hover:border-[#e7a91d] transition"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-[#f0f0f0] flex items-center justify-center">
                <Key size={28} className="text-[#e7a91d]" />
              </div>
              <div className="text-left">
                <h3 className="text-[18px] font-bold text-[#1f1f1f]">Change Password</h3>
                <p className="text-[14px] text-[#888] mt-2">Update your account password</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#ccc]" />
          </button>

          {/* Account Info */}
          <div className="rounded-[16px] border border-[#d5d5d5] bg-white px-8 py-8">
            <h3 className="text-[18px] font-bold text-[#1f1f1f] mb-6">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#efefef]">
                <span className="text-[14px] font-medium text-[#666]">Email</span>
                <span className="text-[14px] font-semibold text-[#1f1f1f]">{user?.email || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[#efefef]">
                <span className="text-[14px] font-medium text-[#666]">Account Type</span>
                <span className="text-[14px] font-semibold text-[#1f1f1f] capitalize">{user?.accountType || 'Merchant'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#666]">Member Since</span>
                <span className="text-[14px] font-semibold text-[#1f1f1f]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full rounded-[16px] border border-[#e5a5a5] bg-[#fff5f5] px-8 py-8 flex items-center justify-between hover:bg-[#ffe5e5] hover:border-[#d32f2f] transition"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-[#ffe5e5] flex items-center justify-center">
                <LogOut size={28} className="text-[#d32f2f]" />
              </div>
              <div className="text-left">
                <h3 className="text-[18px] font-bold text-[#d32f2f]">Logout</h3>
                <p className="text-[14px] text-[#c62828] mt-2">Sign out from your account</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#ffb3b3]" />
          </button>
        </div>
      </main>

      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-[600px] rounded-[16px] bg-white p-8 shadow-lg mx-4">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#1f1f1f]">Notification Settings</h2>
              <p className="text-[13px] text-[#666] mt-2">Choose how you want to receive notifications</p>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                { key: 'orderNotifications', label: 'Order Notifications' },
                { key: 'promotionNotifications', label: 'Promotion Notifications' },
                { key: 'pushNotifications', label: 'Push Notifications' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer p-3 rounded-[10px] hover:bg-[#f5f5f5] transition">
                  <input
                    type="checkbox"
                    checked={notificationSettings[key]}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-[#d5d5d5] text-[#1f8f4f]"
                  />
                  <span className="text-[13px] font-medium text-[#1f1f1f]">{label}</span>
                </label>
              ))}
            </div>

            {error && <p className="text-[12px] text-[#d32f2f] mb-4">{error}</p>}
            {success && <p className="text-[12px] text-[#2e7d32] mb-4">{success}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="flex-1 h-10 rounded-[8px] border border-[#d5d5d5] bg-white text-[13px] font-semibold text-[#1f1f1f] hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleNotificationChange}
                disabled={loading2}
                className="flex-1 h-10 rounded-[8px] bg-[#1f8f4f] text-white text-[13px] font-semibold hover:bg-[#157a3c] disabled:opacity-50"
              >
                {loading2 ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-[600px] rounded-[16px] bg-white p-8 shadow-lg mx-4">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#1f1f1f]">Change Password</h2>
              <p className="text-[13px] text-[#666] mt-2">Enter your current and new password</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 mb-6">
              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#555]">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-[8px] border border-[#d5d5d5] bg-white px-3 text-[13px] outline-none focus:border-[#1f8f4f]"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#555]">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-[8px] border border-[#d5d5d5] bg-white px-3 text-[13px] outline-none focus:border-[#1f8f4f]"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#555]">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-[8px] border border-[#d5d5d5] bg-white px-3 text-[13px] outline-none focus:border-[#1f8f4f]"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && <p className="text-[12px] text-[#d32f2f]">{error}</p>}
              {success && <p className="text-[12px] text-[#2e7d32]">{success}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 h-10 rounded-[8px] border border-[#d5d5d5] bg-white text-[13px] font-semibold text-[#1f1f1f] hover:bg-[#f5f5f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading2}
                  className="flex-1 h-10 rounded-[8px] bg-[#1f8f4f] text-white text-[13px] font-semibold hover:bg-[#157a3c] disabled:opacity-50"
                >
                  {loading2 ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
