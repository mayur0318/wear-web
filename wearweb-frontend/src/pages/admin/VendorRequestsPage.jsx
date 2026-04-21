import React, { useState, useEffect } from "react";
import api, { fetchVendorRequests, approveVendor, rejectVendor } from "../../services/api";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";

export const VendorRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetchVendorRequests();
        const fetchedData = res?.data?.data || res?.data || [];
        setRequests(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("FETCH ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveVendor(id);
      toast.success("Vendor approved successfully");
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      toast.error("Failed to approve vendor");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectVendor(id);
      toast.success("Vendor rejected successfully");
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      toast.error("Failed to reject vendor");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 my-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
          <div>
             <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Vendor Requests</h1>
             <p className="text-slate-500 font-medium mt-1">Review and approve new vendor account applications.</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-6 rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Shop Name</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Address</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan="5" className="py-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></td></tr>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-base font-bold text-slate-800">{req.shopName || "N/A"}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-700">{req.ownerName || "N/A"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-700">{req.phoneNo || "N/A"}</div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{req.email || "No Email"}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {req.address || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleApprove(req._id)} className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-green-100 shadow-sm">
                          Approve
                        </button>
                        <button onClick={() => handleReject(req._id)} className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-100 shadow-sm">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="py-12 text-center text-sm font-medium text-slate-500 bg-slate-50/50">No pending vendor requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
