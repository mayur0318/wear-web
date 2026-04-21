const Payment = require("../models/PaymentModel");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

const createOrder = async (req, res) => {
  try {
    const { orderId, amount: bodyAmount, paymentMethod, upiId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Use amount from DB (totalPrice) as source of truth;
    // fall back to body amount only if DB has none.
    const amountInRupees = order.totalPrice || order.totalAmount || bodyAmount;

    if (!amountInRupees || amountInRupees <= 0) {
      return res.status(400).json({
        message: "Invalid order amount. Cannot create Razorpay order.",
      });
    }

    const amountInPaise = Math.round(Number(amountInRupees) * 100);

    console.log(
      `Creating Razorpay order: orderId=${orderId}, amount=${amountInPaise} paise`,
    );

    // Create Razorpay Order
    const razorpayOrder = await rzp.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderId.toString().slice(0, 40), // Razorpay receipt max 40 chars
    });

    // Store razorpay order id on order document if schema allows
    order.paymentStatus = "pending";
    await order.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
    });
  } catch (err) {
    // Razorpay SDK errors have an `error` property with full details
    const rzpError = err?.error || err;
    console.error(
      "Razorpay createOrder error:",
      JSON.stringify(rzpError, null, 2),
    );
    res.status(500).json({
      message:
        rzpError?.description ||
        rzpError?.message ||
        "Failed to create Razorpay order",
      code: rzpError?.code,
      field: rzpError?.field,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      customerId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Signature verification failed" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid", orderStatus: "placed" },
      { new: true },
    );

    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found after verification" });

    // Log in Payment collection
    const payment = await Payment.create({
      orderId,
      amount: order.totalPrice,
      paymentMethod: "Online",
      paymentStatus: "Success",
    });

    // Link payment to order
    order.paymentId = payment._id;
    await order.save();

    // Clear customer cart
    const cid = customerId || order.customerId;
    if (cid) {
      await Cart.findOneAndDelete({ customerId: cid });
    }

    res.json({ success: true, message: "Payment verified" });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
};

const makePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const payment = await Payment.create({
      orderId,
      amount: order.totalPrice,
      paymentMethod,
      paymentStatus: "Success",
    });
    order.paymentId = payment._id;
    order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({ message: "Payment successful", data: payment });
  } catch (err) {
    res.status(500).json({ message: "Error in payment", err: err });
  }
};

const getPaymentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching payment",
      error: err.message,
    });
  }
};

module.exports = {
  makePayment,
  getPaymentByOrder,

  createOrder,
  verifyPayment,
};
