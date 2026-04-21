import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../components/admin/AdminLayout';
import api from '../../services/api';

export const ManageAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phoneNo: '' });
  const [errors, setErrors] = useState({});
  const [modalState, setModalState] = useState('form'); // 'form' | 'loading' | 'success' | 'error'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/admins');
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phoneNo.trim() || !/^\d{10}$/.test(formData.phoneNo.replace(/\D/g, ''))) {
      newErrors.phoneNo = 'Phone must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalState('loading');
    try {
      const res = await api.post('/api/admin/admins/create', formData);
      setTempPassword(res.data.tempPassword);
      setNewAdminEmail(res.data.adminEmail);
      setModalState('success');
      fetchAdmins();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create admin';
      setErrors({ submit: errorMsg });
      setModalState('error');
    }
  };

  const handleRemoveAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Remove admin "${adminName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/admin/admins/${adminId}`);
      toast.success('Admin removed successfully');
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove admin');
    }
  };

  const handleClose = () => {
    setModalState('form');
    setFormData({ name: '', email: '', phoneNo: '' });
    setErrors({});
    setTempPassword('');
    setNewAdminEmail('');
    setShowModal(false);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast.success('Password copied to clipboard');
  };

  const currentUserId = localStorage.getItem('customerId');

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Admins</h1>
        <p className="text-slate-500 mt-2 font-medium">Create and manage sub-administrators</p>
      </div>

      {/* Add Sub-Admin Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-[#1d6fd8] to-[#2563eb] text-white rounded-xl hover:from-[#1558b0] hover:to-[#1d4ed8] font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Add Sub-Admin
      </button>

      {/* ==================== MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">

            {/* STATE: FORM */}
            {modalState === 'form' && (
              <>
                <div className="bg-gradient-to-r from-[#0f172a] to-[#1d6fd8] px-6 py-5">
                  <h2 className="text-lg font-bold text-white">Add New Sub-Admin</h2>
                  <p className="text-blue-200 text-sm mt-1">A temporary password will be generated</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                      {errors.submit}
                    </div>
                  )}
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#1d6fd8] ${errors.name ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. admin@wearweb.com"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#1d6fd8] ${errors.email ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNo}
                      onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#1d6fd8] ${errors.phoneNo ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {errors.phoneNo && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phoneNo}</p>}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#1d6fd8] to-[#2563eb] text-white rounded-xl text-sm font-bold hover:from-[#1558b0] hover:to-[#1d4ed8] shadow-lg shadow-blue-200 active:scale-[0.98] transition-all cursor-pointer">
                      Create Admin
                    </button>
                    <button type="button" onClick={handleClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STATE: LOADING */}
            {modalState === 'loading' && (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#1d6fd8] rounded-full animate-spin mx-auto" />
                <p className="text-slate-600 mt-5 font-medium text-sm">Creating admin account...</p>
              </div>
            )}

            {/* STATE: SUCCESS */}
            {modalState === 'success' && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
                  <h3 className="text-xl font-bold text-slate-900">Admin Created!</h3>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                  <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-800">Email:</span> {newAdminEmail}</p>
                  <p className="text-sm text-slate-600 mt-3 mb-2 font-semibold text-slate-800">Temporary Password:</p>
                  <div className="flex gap-2">
                    <input type="text" value={tempPassword} readOnly className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-lg font-mono text-sm text-slate-800" />
                    <button onClick={handleCopyPassword} className="px-4 py-2.5 bg-[#1d6fd8] text-white rounded-lg hover:bg-[#1558b0] font-semibold text-sm transition-colors cursor-pointer">
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    ⚠️ Save this password — it won't be shown again. The new admin should change it after first login.
                  </p>
                </div>
                <button onClick={handleClose} className="w-full py-3 bg-gradient-to-r from-[#1d6fd8] to-[#2563eb] text-white rounded-xl text-sm font-bold hover:from-[#1558b0] hover:to-[#1d4ed8] shadow-lg shadow-blue-200 active:scale-[0.98] transition-all cursor-pointer">
                  Done
                </button>
              </div>
            )}

            {/* STATE: ERROR */}
            {modalState === 'error' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">❌</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to Create Admin</h3>
                <p className="text-slate-500 text-sm mb-6">{errors.submit}</p>
                <div className="flex gap-3">
                  <button onClick={() => setModalState('form')} className="flex-1 py-3 bg-[#1d6fd8] text-white rounded-xl text-sm font-bold hover:bg-[#1558b0] transition-colors cursor-pointer">
                    Try Again
                  </button>
                  <button onClick={handleClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== ADMINS TABLE ==================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : admins.length === 0 ? (
          <div className="py-12 text-center text-sm font-medium text-slate-500">No admins found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-500 uppercase tracking-wider text-xs">
                  <th className="py-4 px-6 font-bold">Name</th>
                  <th className="py-4 px-6 font-bold">Email</th>
                  <th className="py-4 px-6 font-bold">Phone</th>
                  <th className="py-4 px-6 font-bold">Joined</th>
                  <th className="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFD700] to-[#f59e0b] flex items-center justify-center text-[#0f172a] font-bold text-xs shrink-0">
                        {admin.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'}
                      </div>
                      {admin.name}
                      {admin._id === currentUserId && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">YOU</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{admin.email}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{admin.phoneNo || '—'}</td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-4 px-6 text-sm text-right">
                      {admin._id === currentUserId ? (
                        <span className="text-xs text-slate-400 font-medium">Current</span>
                      ) : (
                        <button
                          onClick={() => handleRemoveAdmin(admin._id, admin.name)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
