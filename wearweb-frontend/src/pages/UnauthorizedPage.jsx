import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f172a] to-[#dc2626] px-8 py-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl">
                🔒
              </div>
              <h1 className="text-white text-2xl font-bold">Access Denied</h1>
              <p className="text-red-200 text-sm mt-2">You don't have permission to access this area</p>
            </div>

            {/* Body */}
            <div className="p-8 text-center">
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                The admin panel is restricted to authorized administrators only.
                If you believe this is an error, please contact the site administrator.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-[#1d6fd8] to-[#2563eb] text-white hover:from-[#1558b0] hover:to-[#1d4ed8] shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98] cursor-pointer"
                >
                  Go Home
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
