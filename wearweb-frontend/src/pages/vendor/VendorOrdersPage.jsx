import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchVendorOrders } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";

export const VendorOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchVendorOrders();
        console.log("Vendor Orders:", res.data);
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Error fetching vendor orders:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "all" || o.orderStatus === filter;
    const matchesSearch = o._id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <VendorLayout>
      <div className="max-w-[1200px] mx-auto">
         <div className="mb-[20px]">
            <h1 className="text-[20px] font-bold text-[#0f172a]">Orders</h1>
         </div>

         <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden">
            <div className="p-[14px_16px] border-b border-solid border-[#e2e5ea] flex flex-row gap-[10px]">
               <div className="flex-1 flex items-center bg-[#f8f9fb] border border-solid border-[#e2e5ea] rounded-[7px] px-[12px] py-[7px]">
                  <svg className="w-[14px] h-[14px] text-[#94a3b8] mr-[8px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                     type="text" 
                     placeholder="Search by Order ID..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="bg-transparent border-none outline-none w-full text-[13px] text-[#0f172a]"
                  />
               </div>
               <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-[7px_14px] bg-[#fff] border border-solid border-[#e2e5ea] rounded-[7px] text-[13px] text-[#374151] outline-none"
               >
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
               </select>
            </div>

            <div className="w-full">
               <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-[#f8f9fb]">
                     <tr>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Order ID</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Customer</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Date</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Amount</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Status</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan="6" className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d4ed8] mx-auto"></div></td></tr>
                     ) : filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                           <tr key={order._id} className="hover:bg-[#fafbfc] border-b border-solid border-[#f1f3f5]">
                              <td className="p-[12px_14px] text-[13px] font-medium text-[#0f172a] truncate" title={order._id}>
                                 ...{order._id.substring(order._id.length - 8).toUpperCase()}
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#374151] truncate">
                                 {order.customerId?.name || order.customerName || "Customer"}
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#64748b]">
                                 {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#0f172a] font-medium">
                                 ₹{order.vendorTotalAmount}
                              </td>
                              <td className="p-[12px_14px]">
                                 <span className={`inline-flex px-[10px] py-[3px] rounded-[20px] text-[11px] font-medium ${
                                    order.orderStatus === 'delivered' ? 'bg-[#dcfce7] text-[#166534]' :
                                    order.orderStatus === 'cancelled' ? 'bg-[#fee2e2] text-[#991b1b]' :
                                    order.orderStatus === 'shipped' ? 'bg-[#e0f2fe] text-[#0369a1]' :
                                    'bg-[#dbeafe] text-[#1e40af]'
                                 }`}>
                                    {order.orderStatus || 'placed'}
                                 </span>
                              </td>
                              <td className="p-[12px_14px] text-right">
                                 <Link to={`/vendor/orders/${order._id}`} className="bg-[#ffffff] border border-solid border-[#e2e5ea] text-[#374151] hover:bg-[#f8f9fb] rounded-[7px] px-[12px] py-[6px] text-[12px] font-medium transition-colors">Details</Link>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                          <td colSpan="6">
                             <div className="p-[40px] flex flex-col items-center text-center">
                                <svg className="w-[40px] h-[40px] text-[#cbd5e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125z" /></svg>
                                <h3 className="text-[15px] font-medium text-[#374151] mt-[12px]">No orders found</h3>
                                <p className="text-[13px] text-[#94a3b8] mt-[4px]">You don't have any orders matching the criteria.</p>
                             </div>
                          </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </VendorLayout>
  );
};
