const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/AuthMiddleware");

const {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  updateOrderStatus,
  getAllOrders,
  confirmCodPayment,
  updatePaymentMethod,
} = require("../controllers/OrderController");

router.post("/create", verifyToken, createOrder);
router.get("/all", verifyToken, getAllOrders);
router.post("/confirm-cod", verifyToken, confirmCodPayment);
router.get("/detail/:id", verifyToken, getOrderById);
router.get("/:customerId", verifyToken, getOrdersByCustomer);
router.put("/:id/payment-method", verifyToken, updatePaymentMethod);
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;
