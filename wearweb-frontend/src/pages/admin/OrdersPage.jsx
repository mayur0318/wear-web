import React, { useState, useEffect } from "react";
import api, { fetchAllOrders } from "../../services/api";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchAllOrders();
        console.log("Admin Orders Data:", res?.data);
        const fetchedData = res?.data?.data || res?.data || [];
        setOrders(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("FETCH ERROR in [OrdersPage]:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/order/${orderId}`, { orderStatus: newStatus });
      toast.success('Order status updated');
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus, status: newStatus } : o));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "processing") return "bg-blue-100 text-blue-700";
    if (s === "shipped") return "bg-purple-100 text-purple-700";
    if (s === "delivered") return "bg-green-100 text-green-700";
    if (s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700"; // pending default
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 my-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Order Management</h1>
            <p className="text-slate-500 font-medium mt-1">View, track, and update customer order statuses in real-time.</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-6 rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Total Amount</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Payment</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan="7" className="py-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></td></tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 text-sm text-slate-500 font-mono font-bold tracking-wide">
                      #{order._id ? order._id.slice(-6).toUpperCase() : "000000"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-800">{order.userId?.firstname || order.customerId?.name || "Guest"}</div>
                      <div className="text-xs font-medium text-slate-500">{order.userId?.email || order.customerId?.email || "No Email"}</div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-base font-black text-slate-800 text-right">
                      ₹{order.totalAmount || order.totalPrice || 0}
                    </td>
                    <td className="py-4 px-6 text-sm text-center">
                      {order.paymentStatus?.toLowerCase() === "paid" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                           Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                           Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${getStatusBadge(order.status || order.orderStatus)}`}>
                        {order.status || order.orderStatus || "placed"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        className="bg-white border-2 border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 cursor-pointer shadow-sm hover:border-slate-300 transition-all"
                        value={order.status || order.orderStatus || "placed"}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="py-12 text-center text-sm font-medium text-slate-500 bg-slate-50/50">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
