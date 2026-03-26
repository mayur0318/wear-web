const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");

const createOrder = async (req, res) => {
  try {
    const { customerId } = req.body;

    const cart = await Cart.findOne({ customerId });

    if (!cart || cart.productList.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const order = await Order.create({
      customerId,
      productList: cart.productList,
      totalAmount: cart.totalAmount,
    });

    cart.productList = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error placing order",
      err: err,
    });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId,
    })
      .populate("customerId")
      .populate("productList.productId");

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

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

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

module.exports = {
  createOrder,
  getOrdersByCustomer,
  updateOrderStatus,
};
