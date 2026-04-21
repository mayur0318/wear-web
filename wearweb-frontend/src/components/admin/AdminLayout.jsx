import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const getInitials = () => {
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Shared nav-link class builder
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-[#1d6fd8] text-white shadow-lg shadow-blue-900/30'
        : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== DARK SIDEBAR ===== */}
      <aside
        className={`fixed inset-y-0 left-0 flex flex-col z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:w-[272px] w-64`}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1a1f36 100%)',
        }}
      >
        {/* ===== LOGO (clean text, no icon) ===== */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-white/[0.06]">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">Wear</span>
            <span className="text-[#FFD700]">Web</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ===== ADMIN PROFILE SECTION ===== */}
        <div className="px-4 pt-5 pb-2">
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-all duration-200 border border-white/[0.04]"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#f59e0b] flex items-center justify-center text-[#0f172a] font-bold text-sm shadow-lg shadow-yellow-500/20 shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 font-medium">Store Owner</p>
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              style={{
                marginTop: '8px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}
            >
              <button
                onClick={() => { setShowProfileMenu(false); navigate('/my-account'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg style={{ width: '16px', height: '16px', color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                👤 View Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg style={{ width: '16px', height: '16px', color: '#dc2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* ===== NAVIGATION MENU ===== */}
        <nav className="flex-1 px-4 pt-4 pb-6 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <NavLink to="/admin/dashboard" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Manage Products
          </NavLink>
          <NavLink to="/admin/add-product" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Product
          </NavLink>
          <NavLink to="/admin/categories" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            Categories
          </NavLink>
          <NavLink to="/admin/reviews" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            Reviews
          </NavLink>
          <NavLink to="/admin/orders" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            Orders
          </NavLink>
          <NavLink to="/admin/users" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Customers
          </NavLink>
          <NavLink to="/admin/vendor-requests" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Vendor Requests
          </NavLink>

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-3" />

          <NavLink to="/admin/manage-admins" className={navClass} onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Manage Admins
          </NavLink>
        </nav>

        {/* Bottom logout removed — only one logout in profile dropdown */}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none p-2 bg-slate-50 rounded-lg border border-slate-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">Admin Portal</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#f59e0b] flex items-center justify-center text-[#0f172a] font-bold text-sm shadow-sm ring-4 ring-white">
              {getInitials()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{userName}</p>
              <p className="text-xs text-slate-500 mt-1">Store Owner</p>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto w-full relative">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
