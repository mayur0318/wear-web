import React, { useState, useEffect } from "react";
import api, { fetchAllUsers } from "../../services/api";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchAllUsers();
        console.log("SUCCESS PAYLOAD from [/users]:", res?.data);
        const fetchedData = res?.data?.data || res?.data || [];
        setUsers(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("FETCH ERROR in [UsersPage]:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleActionDropdown = async (userId, action, currentStatus) => {
    if (action === 'toggle_block') {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      try {
        await api.put('/user/user/' + userId, { status: newStatus });
        toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      } catch (err) {
        toast.error("Failed to block/unblock user");
      }
    } else if (action === 'deactivate') {
      if (!window.confirm("Are you sure you want to deactivate this user?")) return;
      try {
        await api.put('/user/user/' + userId, { status: 'deactivated' });
        toast.success("User deactivated successfully");
        setUsers(users.map(u => u._id === userId ? { ...u, status: 'deactivated' } : u));
      } catch (err) {
        toast.error("Failed to deactivate user");
      }
    } else if (action === 'delete') {
      if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;
      try {
        await api.delete('/user/user/' + userId);
        toast.success("User deleted successfully");
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(user => user.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRoleBadge = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin") return "bg-gray-200 text-gray-800";
    if (r === "vendor") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700"; // customer default
  };

  const getJoinedDate = (u) => {
    if (u.createdAt) return new Date(u.createdAt).toLocaleDateString();
    if (u._id && typeof u._id === 'string' && u._id.length === 24) {
      return new Date(parseInt(u._id.substring(0, 8), 16) * 1000).toLocaleDateString();
    }
    return "N/A";
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 my-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
          <div>
             <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
             <p className="text-slate-500 font-medium mt-1">Manage all registered accounts, block users, or assign roles.</p>
          </div>
          <div className="relative w-full md:w-80">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-6 rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Joined Date</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></td></tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-lg shadow-sm">
                          {(user.name || "U")[0].toUpperCase()}
                        </div>
                        <span className="text-base font-bold text-slate-800 w-32 truncate block">{user.name || "Unknown User"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-700">{user.phoneNo || "N/A"}</div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{user.email || "No Email"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${getRoleBadge(user.role)}`}>
                        {user.role || "Customer"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        {user.status === 'blocked' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>Blocked</span>
                        ) : user.status === 'deactivated' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>Deactivated</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Active</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                      {getJoinedDate(user)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setSelectedUser(user)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-indigo-100 shadow-sm flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                          Profile
                        </button>
                        <select
                           className="bg-white border-2 border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-2 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 cursor-pointer shadow-sm hover:border-slate-300 transition-all w-28"
                           value=""
                           onChange={(e) => handleActionDropdown(user._id, e.target.value, user.status)}
                        >
                           <option value="" disabled>Actions</option>
                           <option value="toggle_block">{user.status === 'blocked' ? 'Unblock User' : 'Block User'}</option>
                           <option value="deactivate">Deactivate</option>
                           <option value="delete">Delete</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="py-12 text-center text-sm font-medium text-slate-500 bg-slate-50/50">No users found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">User Profile</h2>
            <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl shadow-sm">
                {(selectedUser.name || "U")[0].toUpperCase()}
              </div>
              <div className="text-center">
                 <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h3>
                 <p className="text-sm text-gray-500">{selectedUser.role || "Customer"}</p>
                 <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {selectedUser.status === 'blocked' ? 'Blocked' : 'Active'}
                 </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                 <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email Address</label>
                 <p className="text-gray-800 text-md font-medium mt-1">{selectedUser.email}</p>
              </div>
              <div>
                 <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone Number</label>
                 <p className="text-gray-800 text-md font-medium mt-1">{selectedUser.phoneNo || "N/A"}</p>
              </div>
              <div>
                 <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Joined Date</label>
                 <p className="text-gray-800 text-md font-medium mt-1">{getJoinedDate(selectedUser)}</p>
              </div>
            </div>
            <div className="mt-8">
               <button onClick={() => setSelectedUser(null)} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition shadow-sm">Close Profile</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
