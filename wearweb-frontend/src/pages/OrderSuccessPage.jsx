import React, { useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { CartContext } from "../context/CartContext";

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { clearCart } = useContext(CartContext);

  // BUG 3 FIX: ensure cart is cleared whenever success page mounts
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate estimated delivery (Current date + 4 days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f9fb] min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="bg-white max-w-[500px] w-full rounded-[16px] p-8 text-center shadow-lg border border-[#e2e5ea]">
          <div className="flex justify-center mb-6">
            <div className="w-[80px] h-[80px] bg-[#dcfce7] rounded-full flex items-center justify-center">
              <svg className="w-[40px] h-[40px] text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-[24px] font-[700] text-[#0f172a] mb-2">Order Placed Successfully!</h1>
          
          <p className="text-[14px] font-semibold text-[#64748b] mb-4 bg-gray-50 py-2 rounded">
            Order #{orderId}
          </p>

          <p className="text-[15px] text-[#475569] mb-6 leading-relaxed">
            Thank you for your purchase. We've received your order and will send you tracking updates via email shortly.
          </p>

          <div className="bg-[#f0f7ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-3 rounded-[8px] mb-8 text-[14px] font-semibold text-left flex items-center gap-3">
             <svg className="w-5 h-5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
             Expected Delivery: {formattedDate}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/orders" 
              className="flex-1 py-[12px] px-[20px] bg-[#1d6fd8] text-white rounded-[8px] font-[600] text-[14px] transition-colors hover:bg-[#1e40af]"
            >
              View Order
            </Link>
            <Link 
              to="/products" 
              className="flex-1 py-[12px] px-[20px] bg-white border border-[#e2e5ea] text-[#334155] rounded-[8px] font-[600] text-[14px] transition-colors hover:bg-[#f8f9fa]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
