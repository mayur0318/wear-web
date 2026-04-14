import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        // Assuming admin can fetch all orders from /order or similar route.
        // We'll just call the customer specific one with a generic admin id or generic /order route
        const response = await api.get("/order");
        setOrders(response.data.orders || response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="body-content">
        <div className="container">
          <h3>Manage Orders</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4">Loading...</td></tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id || order.id}>
                    <td>{order._id || order.id}</td>
                    <td>{order.customerId?.name || order.customerId || "Unknown"}</td>
                    <td>${order.totalPrice}</td>
                    <td>{order.status || "Pending"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};
