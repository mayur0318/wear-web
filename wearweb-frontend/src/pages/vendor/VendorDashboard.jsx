import React, { useState, useEffect } from "react";
import { fetchVendorDashboard } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { Link } from "react-router-dom";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockAlerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetchVendorDashboard();
        if (res.data && res.data.data) {
           setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <VendorLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6">
           <h1 className="text-[20px] font-bold text-[#0f172a]">Dashboard</h1>
        </div>

        {loading ? (
             <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1d4ed8]"></div></div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[24px]">
              <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px] relative">
                <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Total Products</p>
                <p className="text-[24px] font-bold text-[#0f172a] mt-[6px]">{stats.totalProducts}</p>
                <div className="absolute top-[16px] right-[20px] w-[36px] h-[36px] rounded-full bg-[#f1f5f9] flex items-center justify-center">
                   <svg className="w-[18px] h-[18px] text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
              </div>
              <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px] relative">
                <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Total Orders</p>
                <p className="text-[24px] font-bold text-[#0f172a] mt-[6px]">{stats.totalOrders}</p>
                <div className="absolute top-[16px] right-[20px] w-[36px] h-[36px] rounded-full bg-[#f1f5f9] flex items-center justify-center">
                   <svg className="w-[18px] h-[18px] text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125z"/></svg>
                </div>
              </div>
              <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px] relative">
                <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Pending Orders</p>
                <p className="text-[24px] font-bold text-[#0f172a] mt-[6px]">{stats.pendingOrders}</p>
                <div className="absolute top-[16px] right-[20px] w-[36px] h-[36px] rounded-full bg-[#fef9c3] flex items-center justify-center">
                   <svg className="w-[18px] h-[18px] text-[#a16207]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px] relative">
                <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Total Revenue</p>
                <p className="text-[24px] font-bold text-[#0f172a] mt-[6px]">₹{stats.totalRevenue.toLocaleString()}</p>
                <div className="absolute top-[16px] right-[20px] w-[36px] h-[36px] rounded-full bg-[#dcfce7] flex items-center justify-center">
                   <svg className="w-[18px] h-[18px] text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden flex flex-col">
                <div className="p-[14px_16px] border-b border-solid border-[#e2e5ea] flex justify-between items-center bg-[#ffffff]">
                   <h2 className="text-[15px] font-semibold text-[#0f172a]">Recent Orders</h2>
                   <Link to="/vendor/orders" className="text-[#1d4ed8] text-[13px] font-medium hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fb]">
                      <tr>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Order ID</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Date</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Amount</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.length > 0 ? (
                        stats.recentOrders.map((order, idx) => (
                           <tr key={order._id} className="hover:bg-[#fafbfc] border-b border-solid border-[#f1f3f5]">
                             <td className="p-[12px_14px] text-[13px] font-medium text-[#0f172a]">{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                             <td className="p-[12px_14px] text-[13px] text-[#374151]">{new Date(order.createdAt || order.orderDate).toLocaleDateString()}</td>
                             <td className="p-[12px_14px] text-[13px] text-[#374151]">₹{order.totalPrice}</td>
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
                           </tr>
                        ))
                      ) : (
                         <tr><td colSpan="4" className="p-[20px] text-center text-[13px] text-[#64748b]">No recent orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden flex flex-col">
                 <div className="p-[14px_16px] border-b border-solid border-[#e2e5ea] bg-[#ffffff]">
                   <h2 className="text-[15px] font-semibold text-[#0f172a]">Low Stock Alert</h2>
                 </div>
                 <div className="flex-1 overflow-y-auto max-h-[300px]">
                    {stats.lowStockAlerts.length > 0 ? (
                       <ul className="flex flex-col">
                          {stats.lowStockAlerts.map((product, idx) => (
                             <li key={product._id} className="p-[12px_14px] flex justify-between items-center border-b border-solid border-[#f1f3f5] hover:bg-[#fafbfc]">
                                <div className="flex items-center gap-[12px]">
                                   <div className="w-[36px] h-[36px] border border-solid border-[#e2e5ea] rounded-[5px] overflow-hidden shrink-0 flex items-center justify-center bg-[#f8f9fb]">
                                     {(product.imagePath || product.imageUrl) ? (
                                        <img src={product.imagePath || product.imageUrl} alt="" className="w-full h-full object-cover" />
                                     ) : (
                                        <svg className="w-[20px] h-[20px] text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                     )}
                                   </div>
                                   <div className="flex flex-col justify-center">
                                     <p className="text-[13px] font-medium text-[#0f172a] line-clamp-1">{product.productName}</p>
                                     <p className="text-[11px] text-[#64748b] mt-[2px]">{product.productSize || product.size || "N/A"} &bull; {product.productColor || product.color || "N/A"}</p>
                                   </div>
                                </div>
                                <span className="text-[#991b1b] bg-[#fee2e2] px-[6px] py-[2px] rounded-[4px] text-[11px] font-semibold shrink-0">
                                  {product.stock} left
                                </span>
                             </li>
                          ))}
                       </ul>
                    ) : (
                       <div className="p-[30px] text-center flex flex-col items-center justify-center h-full text-[13px] text-[#64748b]">
                          <svg className="w-[30px] h-[30px] text-[#cbd5e1] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                          All products are well stocked!
                       </div>
                    )}
                 </div>
              </div>
            </div>
          </>
        )}
      </div>
    </VendorLayout>
  );
};
