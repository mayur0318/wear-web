const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/AuthMiddleware");

const {
  makePayment,
  getPaymentByOrder,
  createOrder,
  verifyPayment,
} = require("../controllers/PaymentController");

router.post("/pay", verifyToken, makePayment);
router.get("/:orderId", verifyToken, getPaymentByOrder);
router.post("/create-order", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);

module.exports = router;
