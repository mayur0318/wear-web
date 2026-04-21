import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import api from "../services/api";

export const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");
  const isLoggedIn = !!customerId;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/order/${customerId}`);
        // Assuming response structure has data array. Could be response.data or response.data.data
        const fetchedOrders =
          response.data.data !== undefined ? response.data.data : response.data;
        // Sort by date newest first
        const sorted = (Array.isArray(fetchedOrders) ? fetchedOrders : []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sorted);
      } catch (err) {
        setError("Could not load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return (
          <span className="bg-[#dbeafe] text-[#1e40af] px-[12px] py-[3px] rounded-[20px] text-[11px] font-[500]">
            Order Placed
          </span>
        );
      case "shipped":
        return (
          <span className="bg-[#e0f2fe] text-[#0369a1] px-[12px] py-[3px] rounded-[20px] text-[11px] font-[500]">
            Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="bg-[#dcfce7] text-[#166534] px-[12px] py-[3px] rounded-[20px] text-[11px] font-[500]">
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-[#fee2e2] text-[#991b1b] px-[12px] py-[3px] rounded-[20px] text-[11px] font-[500]">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-[#f1f3f5] text-[#374151] px-[12px] py-[3px] rounded-[20px] text-[11px] font-[500]">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f9fb] min-h-screen py-[40px]">
        <div className="max-w-[1000px] mx-auto px-[20px] lg:px-[32px]">
          <h1 className="text-[24px] font-[700] text-[#0f172a] mb-[4px]">
            My Orders
          </h1>
          <p className="text-[14px] text-[#64748b] mb-[24px]">
            Track and manage all your orders
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-[100px]">
              <div className="w-[40px] h-[40px] rounded-full border-[3px] border-t-transparent border-[#1d6fd8] animate-spin mb-[16px]"></div>
              <p className="text-[#64748b] font-medium text-[14px]">
                Fetching your orders...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-[16px] rounded-[8px] text-[14px] border border-red-100">
              {error}
            </div>
          ) : orders.length > 0 ? (
            <div className="flex flex-col gap-[14px]">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden shadow-sm"
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-center px-[20px] py-[16px] border-b border-solid border-[#f1f3f5] bg-[#fafbfc]">
                    <div>
                      <p className="text-[13px] font-[600] text-[#0f172a]">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[12px] text-[#64748b] mt-[2px]">
                        {new Date(
                          order.orderDate || Date.now(),
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>{getStatusBadge(order.orderStatus)}</div>
                  </div>

                  {/* Products List */}
                  <div className="px-[20px] py-[16px] flex flex-col gap-[16px]">
                    {(order.items || order.productList || [])?.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center gap-[12px]"
                        >
                          <div className="flex items-center gap-[16px]">
                            <div className="w-[50px] h-[50px] border border-solid border-[#e2e5ea] rounded-[6px] shrink-0 overflow-hidden bg-[#f8f9fb] flex items-center justify-center">
                              <img
                                src={
                                  item.productId?.imagePath ||
                                  item.productId?.imageUrl
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              : (
                              <svg
                                className="w-[20px] h-[20px] text-[#cbd5e1]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              )
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-[600] text-[#0f172a] line-clamp-1">
                                {item.productId?.productName ||
                                  item.productId?.name ||
                                  "Product Name"}
                              </p>
                              <p className="text-[12px] text-[#64748b] mt-[2px]">
                                Qty: {item.quantity || item.qty || 1} &bull;{" "}
                                {item.productId?.productColor ||
                                  item.productId?.color ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="text-[14px] font-[600] text-[#0f172a] shrink-0">
                            ₹
                            {(
                              item.price ||
                              item.productId?.productPrice ||
                              0
                            ).toLocaleString()}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Summary Footer */}
                  <div className="flex justify-between items-center px-[20px] py-[16px] border-t border-solid border-[#f1f3f5] bg-[#fafbfc]">
                    <div className="text-[13px] text-[#64748b] flex items-center gap-[6px]">
                      <svg
                        className="w-[16px] h-[16px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Payment:{" "}
                      {order.paymentId?.paymentMethod || "Credit/Debit Card"}
                    </div>
                    <div className="text-[16px] font-[700] text-[#0f172a]">
                      Total: ₹
                      {(
                        order.totalPrice ||
                        order.totalAmount ||
                        0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[12px] border border-solid border-[#e2e5ea] p-[80px_20px] text-center shadow-sm">
              <svg
                className="w-[48px] h-[48px] mx-auto text-[#cbd5e1] mb-[16px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-[18px] font-[600] text-[#374151] mb-[8px]">
                No orders yet
              </h2>
              <p className="text-[14px] text-[#64748b] mb-[24px]">
                Looks like you haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-[#1d6fd8] text-white px-[24px] py-[10px] rounded-[7px] font-[600] text-[14px] hover:bg-[#1e40af] transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
