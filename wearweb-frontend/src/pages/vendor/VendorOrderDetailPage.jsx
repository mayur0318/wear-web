import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVendorOrderById, updateVendorOrderStatus } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { toast } from "react-toastify";

export const VendorOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await fetchVendorOrderById(id);
      setOrder(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch order detail");
      navigate("/vendor/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateVendorOrderStatus(id, newStatus);
      toast.success("Order status updated");
      setOrder({ ...order, orderStatus: newStatus });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <VendorLayout><div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1d4ed8]"></div></div></VendorLayout>;
  if (!order) return null;

  return (
    <VendorLayout>
      <div className="max-w-[1000px] mx-auto">
         <div className="mb-[20px] flex justify-between items-center bg-[#f8f9fb]">
            <div>
               <h1 className="text-[20px] font-bold text-[#0f172a]">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</h1>
               <p className="text-[13px] text-[#64748b] mt-[3px]">Full ID: {order._id}</p>
            </div>
            <button onClick={() => navigate("/vendor/orders")} className="bg-[#ffffff] flex items-center gap-[5px] border border-solid border-[#e2e5ea] text-[#374151] hover:bg-[#f8f9fb] rounded-[7px] px-[12px] py-[6px] text-[13px] font-medium transition-colors">
               <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back to Orders
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[24px]">
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[24px] md:col-span-2">
               <h2 className="text-[15px] font-bold text-[#0f172a] mb-[20px]">Order Details</h2>
               <div className="grid grid-cols-2 gap-y-[16px] gap-x-[24px]">
                 <div>
                    <span className="block text-[12px] text-[#64748b] font-semibold uppercase tracking-[0.04em] mb-[4px]">Customer</span>
                    <span className="text-[14px] text-[#0f172a] font-medium">{order.customerId?.name || order.customerName || "Unknown"}</span>
                 </div>
                 <div>
                    <span className="block text-[12px] text-[#64748b] font-semibold uppercase tracking-[0.04em] mb-[4px]">Date Placed</span>
                    <span className="text-[14px] text-[#0f172a] font-medium">{new Date(order.orderDate || order.createdAt).toLocaleString()}</span>
                 </div>
                 <div className="col-span-2 pt-[16px] border-t border-solid border-[#f1f3f5]">
                    <span className="block text-[12px] text-[#64748b] font-semibold uppercase tracking-[0.04em] mb-[4px]">Shipping Address</span>
                    <span className="text-[14px] text-[#0f172a] font-medium">{order.shippingAddress || order.address || order.customerId?.address || "Address not provided"}</span>
                 </div>
                 <div className="col-span-2 pt-[16px] border-t border-solid border-[#f1f3f5]">
                    <span className="block text-[12px] text-[#64748b] font-semibold uppercase tracking-[0.04em] mb-[4px]">Payment</span>
                    <span className="text-[14px] text-[#0f172a] font-medium uppercase break-words">{order.paymentMethod || "COD"} &bull; <span className={order.paymentId?.paymentStatus === 'completed' || order.paymentStatus === 'completed' ? 'text-[#16a34a]' : 'text-[#854d0e]'}>{(order.paymentId?.paymentStatus || order.paymentStatus || "PENDING")}</span></span>
                 </div>
               </div>
            </div>

            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[24px] flex flex-col">
               <h2 className="text-[15px] font-bold text-[#0f172a] mb-[20px]">Fulfillment Status</h2>
               
               <div className="mb-[20px]">
                  <span className={`inline-flex px-[12px] py-[6px] rounded-[20px] text-[12px] font-bold uppercase w-full justify-center ${
                     order.orderStatus === 'delivered' ? 'bg-[#dcfce7] text-[#166534]' :
                     order.orderStatus === 'cancelled' ? 'bg-[#fee2e2] text-[#991b1b]' :
                     order.orderStatus === 'shipped' ? 'bg-[#e0f2fe] text-[#0369a1]' :
                     'bg-[#dbeafe] text-[#1e40af]'
                  }`}>
                     {order.orderStatus || 'placed'}
                  </span>
               </div>
               
               <div className="mt-auto pt-[20px] border-t border-solid border-[#f1f3f5] flex flex-col gap-[10px]">
                  {order.orderStatus === 'placed' && (
                     <button onClick={() => handleStatusChange('shipped')} className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-none rounded-[7px] px-[18px] py-[8px] text-[13px] font-medium cursor-pointer transition-colors w-full">
                        Mark as Shipped
                     </button>
                  )}
                  {order.orderStatus === 'shipped' && (
                     <button onClick={() => handleStatusChange('delivered')} className="bg-[#16a34a] hover:bg-[#15803d] text-white border-none rounded-[7px] px-[18px] py-[8px] text-[13px] font-medium cursor-pointer transition-colors w-full">
                        Mark as Delivered
                     </button>
                  )}
                  {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                     <button onClick={() => handleStatusChange('cancelled')} className="bg-[#ffffff] border border-solid border-[#e2e5ea] text-[#991b1b] hover:bg-[#fee2e2] rounded-[7px] px-[18px] py-[8px] text-[13px] font-medium cursor-pointer transition-colors w-full">
                        Cancel Order
                     </button>
                  )}
               </div>
            </div>
         </div>

         <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden">
            <div className="p-[16px_24px] border-b border-solid border-[#e2e5ea]">
                <h2 className="text-[15px] font-bold text-[#0f172a]">Items in this shipment</h2>
            </div>
            <div className="w-full">
               <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-[#f8f9fb]">
                     <tr>
                        <th className="p-[10px_24px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] w-[40%]">Product ID</th>
                        <th className="p-[10px_24px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Quantity</th>
                        <th className="p-[10px_24px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Price</th>
                        <th className="p-[10px_24px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] text-right">Subtotal</th>
                     </tr>
                  </thead>
                  <tbody>
                     {order.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-[#fafbfc] border-b border-solid border-[#f1f3f5]">
                           <td className="p-[12px_24px] text-[13px] font-medium text-[#0f172a] truncate">{item.productId?.productName || item.productId}</td>
                           <td className="p-[12px_24px] text-[13px] text-[#374151]">x{item.quantity}</td>
                           <td className="p-[12px_24px] text-[13px] text-[#374151]">₹{item.price}</td>
                           <td className="p-[12px_24px] text-[13px] font-bold text-[#0f172a] text-right">₹{item.price * item.quantity}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </VendorLayout>
  );
};
