import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Backend URL
});

// ✅ Interceptor: Attach JWT token + user-id to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("customerId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["user-id"] = userId;
  }
  return config;
});

// ✅ Response interceptor: Auto-handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isExpired = error.response?.data?.expired;
      // Don't redirect if already on login/signup
      const path = window.location.pathname;
      if (
        path !== "/login" &&
        path !== "/signup" &&
        path !== "/forgot-password" &&
        path !== "/unauthorized" &&
        !path.startsWith("/reset-password")
      ) {
        // Clear stale auth
        localStorage.removeItem("token");
        localStorage.removeItem("customerId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Products
export const addProduct = (data) => api.post("/product/product", data);
export const fetchProducts = () => api.get("/product/products");
export const fetchAllProducts = () => api.get("/product/products");
export const fetchProductById = (id) => api.get(`/product/product/${id}`);


// Cart
export const addToCart = (data) => api.post("/cart/add", data);
export const getCart = (customerId) => api.get(`/cart/${customerId}`);
export const removeFromCart = (userId, productId) => api.delete(`/cart/${userId}/${productId}`);
export const clearCartAPI = (userId) => api.delete(`/cart/clear/${userId}`);


// Orders
export const createOrder = (data) => api.post("/order/create", data);
export const getOrders = (customerId) => api.get(`/order/${customerId}`);
export const fetchAllOrders = () => api.get('/order/all');

// Payment
export const makePayment = (data) => api.post("/payment/pay", data); // Legacy
export const createRazorpayOrder = (data) => api.post("/payment/create-order", data);
export const verifyRazorpayPayment = (data) => api.post("/payment/verify-payment", data);


// Users
export const registerUser = (data) => api.post("/user/register", data);
export const loginUser = (data) => api.post("/user/login", data);
export const fetchAllUsers = () => api.get('/user/users');

// Admin Vendor Requests
export const fetchVendorRequests = () => api.get("/api/admin/vendor-requests");
export const approveVendor = (id) => api.put(`/api/admin/vendors/${id}/approve`);
export const rejectVendor = (id) => api.put(`/api/admin/vendors/${id}/reject`);

// Vendor Panel API
export const fetchVendorDashboard = () => api.get("/api/vendor/dashboard");
export const fetchVendorProducts = () => api.get("/api/vendor/products");
export const addVendorProduct = (data) => api.post("/api/vendor/products", data, { headers: { 'Content-Type': 'multipart/form-data' }});
export const updateVendorProduct = (id, data) => api.put(`/api/vendor/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
export const updateVendorStock = (id, stock) => api.put(`/api/vendor/products/${id}/stock`, { stock });
export const deleteVendorProduct = (id) => api.delete(`/api/vendor/products/${id}`);

export const fetchVendorOrders = () => api.get("/api/vendor/orders");
export const fetchVendorOrderById = (id) => api.get(`/api/vendor/orders/${id}`);
export const updateVendorOrderStatus = (id, orderStatus) => api.put(`/api/vendor/orders/${id}/status`, { orderStatus });

export const fetchVendorReports = () => api.get("/api/vendor/reports");
export const fetchVendorReviews = () => api.get("/api/vendor/reviews");

export const fetchVendorProfile = () => api.get("/api/vendor/profile");
export const updateVendorProfile = (data) => api.put("/api/vendor/profile", data);


export default api;
