import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.warning("Please fill in both fields");
      return;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      toast.success("Password updated successfully!");
      setResetSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f172a] to-[#1d6fd8] px-8 py-6 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
                🔑
              </div>
              <h1 className="text-white text-xl font-bold">Reset Password</h1>
              <p className="text-blue-200 text-sm mt-1">Create a new secure password</p>
            </div>

            {/* Body */}
            <div className="p-8">
              {!resetSuccess ? (
                <form onSubmit={handleSubmit}>
                  {/* New Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none
                          focus:ring-2 focus:ring-[#1d6fd8] focus:border-[#1d6fd8] transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none
                        focus:ring-2 focus:ring-[#1d6fd8] focus:border-[#1d6fd8] transition-all"
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">Passwords don't match</p>
                    )}
                    {confirmPassword && password === confirmPassword && password.length >= 6 && (
                      <p className="text-xs text-green-600 mt-1.5 font-medium">✓ Passwords match</p>
                    )}
                  </div>

                  {/* Password strength hint */}
                  <div className="mb-5 bg-slate-50 rounded-lg px-3 py-2.5 text-xs text-slate-500">
                    <p className="font-semibold text-slate-600 mb-1">Password tips:</p>
                    <ul className="space-y-0.5">
                      <li className={password.length >= 6 ? "text-green-600" : ""}>
                        {password.length >= 6 ? "✓" : "•"} At least 6 characters
                      </li>
                      <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                        {/[A-Z]/.test(password) ? "✓" : "•"} One uppercase letter
                      </li>
                      <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                        {/[0-9]/.test(password) ? "✓" : "•"} One number
                      </li>
                    </ul>
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
                        Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              ) : (
                /* Success state */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ✅
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Password Updated!</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Your password has been changed successfully. Redirecting to login...
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-[#1d6fd8] text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-[#1558b0] transition-colors"
                  >
                    Go to Login Now
                  </Link>
                </div>
              )}

              {/* Back link */}
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
