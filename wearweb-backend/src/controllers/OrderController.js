const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      firstName,
      lastName,
      email,
      address,
      city,
      pincode,
      phoneNo,
      items,
      totalPrice,
      paymentMethod = "COD",
    } = req.body;

    // Validate required fields
    if (!customerId || !address || !city || !pincode || !phoneNo || !items || items.length === 0) {
      return res.status(400).json({
        message: "All fields are required (customerId, address, city, pincode, phoneNo, items)",
      });
    }

    // Create the order with full checkout data
    const order = await Order.create({
      customerId,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      items,
      address,
      city,
      pincode,
      phoneNo,
      totalPrice,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    // Decrease stock for each ordered product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -(item.quantity || 1) },
      });
    }

    res.status(201).json({
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error placing order",
      err: err.message,
    });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId,
    })
      .populate("customerId")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Customer Orders",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("customerId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order fetched",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching order",
      err: err.message,
    });
  }
};

const confirmCodPayment = async (req, res) => {
  try {
    const { orderId, customerId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid", orderStatus: "placed" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Clear cart for COD now that order is confirmed
    const cid = customerId || order.customerId;
    if (cid) {
      await Cart.findOneAndDelete({ customerId: cid });
    }

    res.status(200).json({ success: true, message: "COD order confirmed", data: order });
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm COD order", err: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const previousStatus = order.orderStatus;

    // If cancelling an order that wasn't already cancelled, restore stock
    if (orderStatus === "cancelled" && previousStatus !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity || 1 },
        });
      }
    }

    order.orderStatus = orderStatus;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.status(200).json({
      message: "Order updated",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating order",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All Orders",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all orders",
    });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const allowed = ["COD", "Online", "upi", "card", "netbanking", "cod"];
    if (!allowed.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment method", err: err.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  updateOrderStatus,
  getAllOrders,
  confirmCodPayment,
  updatePaymentMethod,
};
