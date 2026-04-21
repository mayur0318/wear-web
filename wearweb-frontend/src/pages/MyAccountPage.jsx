import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const MyAccountPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    profilePicture: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const customerId = localStorage.getItem("customerId");
  const userRole = localStorage.getItem("userRole") || "customer";

  // If vendor, redirect to vendor profile page
  useEffect(() => {
    if (userRole === "vendor") {
      navigate("/vendor/profile", { replace: true });
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (customerId && userRole !== "vendor") {
      fetchUserData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [customerId]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/user/user/${customerId}`);
      const user = response.data.data;

      setUserData({
        name: user.name || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        gender: user.gender || "",
        profilePicture: user.profilePicture || "",
      });
      setPreviewImage(user.profilePicture || "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phoneNo", userData.phoneNo);

      // Only send customer-specific fields for customers
      if (userRole !== "admin") {
        formData.append("address", userData.address);
        formData.append("gender", userData.gender);
      }

      if (imageFile) {
        formData.append("profilePicture", imageFile);
      }

      await api.put(`/user/user/${customerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await api.post("/user/change-password", {
        userId: customerId,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  // If Not Logged In
  if (!customerId) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col justify-center items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Please Login</h2>
          <p className="text-gray-500 mt-2">You need to log in to view your account details.</p>
        </div>
        <Footer />
      </>
    );
  }

  // If vendor, don't render (redirect will happen)
  if (userRole === "vendor") return null;

  // ===== ADMIN PROFILE =====
  if (userRole === "admin") {
    return (
      <>
        <Navbar />
        <div className="bg-[#f1f3f6] min-h-screen py-10">
          <div className="max-w-[800px] mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Profile</h1>
              <p className="text-gray-500 mb-10">Manage your admin account settings.</p>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-lg font-bold text-gray-400 animate-pulse">Loading profile...</p>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 border-b border-gray-100 pb-8">
                    <div className="relative group cursor-pointer w-28 h-28">
                      <div className="w-28 h-28 rounded-full bg-yellow-50 overflow-hidden shadow-inner border-2 border-gray-100 flex items-center justify-center">
                        {previewImage ? (
                          <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-yellow-600">
                            {userData.name?.charAt(0)?.toUpperCase() || "A"}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="flex flex-col justify-center text-center sm:text-left">
                      <h3 className="font-bold text-lg text-gray-800">{userData.name || "Admin"}</h3>
                      <p className="text-sm text-gray-500 mt-1">🔐 Administrator</p>
                    </div>
                  </div>

                  {/* Admin Info - No Gender, No Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                      <input type="text" name="name" value={userData.name} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-[15px] outline-none shadow-sm" required />
                    </div>

                    {/* Email (Read-only) */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                      <input type="email" value={userData.email} disabled className="w-full p-4 bg-gray-100 border border-gray-200 text-gray-400 rounded text-[15px] outline-none cursor-not-allowed shadow-sm" />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                      <input type="text" name="phoneNo" value={userData.phoneNo} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-[15px] outline-none shadow-sm" required />
                    </div>

                    {/* Role (Read-only) */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Role</label>
                      <input type="text" value="Administrator" disabled className="w-full p-4 bg-gray-100 border border-gray-200 text-gray-400 rounded text-[15px] outline-none cursor-not-allowed shadow-sm" />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-6">Security Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <p className="font-bold text-gray-900 text-[15px]">🔐 Password</p>
                          <p className="text-sm text-gray-500 mt-1">Change your account password</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(true)}
                          className="px-5 py-2.5 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold text-sm transition-colors cursor-pointer bg-white"
                        >
                          Change
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-bold text-gray-900 text-[15px]">🔑 Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500 mt-1">Recommended for admin accounts</p>
                        </div>
                        <span className="px-4 py-2 border border-gray-300 text-gray-400 rounded-lg font-semibold text-sm bg-white">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded text-lg transition-colors shadow-lg shadow-blue-600/30 w-full sm:w-auto disabled:opacity-50 cursor-pointer">
                      {saving ? "Saving Changes..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <Footer />

        {/* Password Change Modal */}
        {showPasswordModal && renderPasswordModal()}
      </>
    );
  }

  // ===== CUSTOMER PROFILE (default) =====
  return (
    <>
      <Navbar />
      <div className="bg-[#f1f3f6] min-h-screen py-10">
        <div className="max-w-[800px] mx-auto px-4">

          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-500 mb-10">Update your personal information and profile picture.</p>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-lg font-bold text-gray-400 animate-pulse">Loading profile...</p>
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-8">

                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 border-b border-gray-100 pb-8">
                        <div className="relative group cursor-pointer w-28 h-28">
                            <div className="w-28 h-28 rounded-full bg-blue-50 overflow-hidden shadow-inner border-2 border-gray-100 flex items-center justify-center">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div className="flex flex-col justify-center text-center sm:text-left">
                            <h3 className="font-bold text-lg text-gray-800">Profile Picture</h3>
                            <p className="text-sm text-gray-500 mt-1">Tap the image circle to upload a new avatar.<br/>Recommended size: 256x256px.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                            <input type="text" name="name" value={userData.name} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-[15px] outline-none shadow-sm" required />
                        </div>

                        {/* Email (Read-Only) */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                            <input type="email" value={userData.email} disabled className="w-full p-4 bg-gray-100 border border-gray-200 text-gray-400 rounded text-[15px] outline-none cursor-not-allowed shadow-sm" />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                            <input type="text" name="phoneNo" value={userData.phoneNo} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-[15px] outline-none shadow-sm" required />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Gender</label>
                            <select name="gender" value={userData.gender} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-[15px] outline-none shadow-sm">
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col sm:col-span-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Delivery Address</label>
                            <textarea name="address" value={userData.address} onChange={handleChange} placeholder="Enter your full home or office address..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-[15px] outline-none shadow-sm resize-y min-h-[100px]"></textarea>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                        <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded text-lg transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer">
                            {saving ? "Saving Changes..." : "Save Profile"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(true)}
                          className="py-4 px-8 border-2 border-gray-200 text-gray-700 rounded text-lg font-bold hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                        >
                          Change Password
                        </button>
                    </div>

                </form>
            )}

          </div>

        </div>
      </div>
      <Footer />

      {/* Password Change Modal */}
      {showPasswordModal && renderPasswordModal()}
    </>
  );

  // ===== PASSWORD MODAL (shared) =====
  function renderPasswordModal() {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={() => setShowPasswordModal(false)}>
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Change Password</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your current password and choose a new one.</p>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none shadow-sm"
                required
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none shadow-sm"
                required
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none shadow-sm"
                required
                placeholder="Re-enter new password"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={passwordSaving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {passwordSaving ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-bold text-sm transition-colors cursor-pointer bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
