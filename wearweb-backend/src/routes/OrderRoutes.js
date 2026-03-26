const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByCustomer,
  updateOrderStatus,
} = require("../controllers/OrderController");

router.post("/create", createOrder);
router.get("/:customerId", getOrdersByCustomer);
router.put("/:id", updateOrderStatus);

module.exports = router;
