const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    amount: {
      type: Number,
    },

    paymentMethod: {
      type: String, // UPI, Card, COD
    },

    paymentStatus: {
      type: String,
      default: "Pending", // Pending, Success, Failed
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
