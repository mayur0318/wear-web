const express = require("express");
const router = express.Router();

const {
  makePayment,
  getPaymentByOrder,
} = require("../controllers/PaymentController");
router.post("/pay", makePayment);
router.get("/:orderId", getPaymentByOrder);

module.exports = router;
