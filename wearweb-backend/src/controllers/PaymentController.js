const Payment = require("../models/PaymentModel");
const Order = require("../models/OrderModel");

const makePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const payment = await Payment.create({
      orderId,
      amount: order.totalAmount,
      paymentMethod,
      paymentStatus: "Success",
    });

    order.paymentId = payment._id;
    order.paymentStatus = "Paid";

    await order.save();

    res.status(200).json({
      message: "Payment successful",
      data: payment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in payment",
      err: err,
    });
  }
};
