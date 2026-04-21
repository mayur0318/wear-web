import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const ForgotPasswordPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/auth/forgot-password", { email: email.trim() });
      toast.success("Reset link sent! Check your email inbox.");
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f172a] to-[#1d6fd8] px-8 py-6 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
                🔐
              </div>
              <h1 className="text-white text-xl font-bold">Forgot Password?</h1>
              <p className="text-blue-200 text-sm mt-1">No worries, we'll send you a reset link</p>
            </div>

            {/* Body */}
            <div className="p-8">
              {!emailSent ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none
                        focus:ring-2 focus:ring-[#1d6fd8] focus:border-[#1d6fd8] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all
                      ${isSubmitting
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#1d6fd8] to-[#2563eb] hover:from-[#1558b0] hover:to-[#1d4ed8] shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98]"
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              ) : (
                /* Success state */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ✉️
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Check Your Email</h3>
                  <p className="text-sm text-slate-500 mb-1">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-sm font-semibold text-[#1d6fd8] mb-4">{email}</p>
                  <p className="text-xs text-slate-400 mb-5">
                    The link expires in 15 minutes. Check your spam folder if you don't see it.
                  </p>
                  <button
                    onClick={() => { setEmailSent(false); setEmail(""); }}
                    className="text-sm text-[#1d6fd8] font-semibold hover:underline"
                  >
                    Didn't receive? Try again
                  </button>
                </div>
              )}

              {/* Back to login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-slate-500 hover:text-[#1d6fd8] font-medium transition-colors flex items-center justify-center gap-1"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
