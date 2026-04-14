import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Backend URL
});

// Products
export const addProduct = (data) => api.post("/product/product", data);
export const fetchProducts = () => api.get("/product/products");
export const fetchProductById = (id) => api.get(`/product/${id}`);

// Cart
export const addToCart = (data) => api.post("/cart/add", data);
export const getCart = (customerId) => api.get(`/cart/${customerId}`);

// Orders
export const createOrder = (data) => api.post("/order/create", data);
export const getOrders = (customerId) => api.get(`/order/${customerId}`);

// Payment
export const makePayment = (data) => api.post("/payment", data);

// Users
export const registerUser = (data) => api.post("/user/register", data);
export const loginUser = (data) => api.post("/user/login", data);

export default api;
