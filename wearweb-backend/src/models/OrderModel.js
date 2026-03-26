const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    productList: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
    },

    orderStatus: {
      type: String,
      default: "Placed", // Placed, Shipped, Delivered
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment", // future use
    },
  },
  { timestamps: true }, // ✅ gives createdAt (orderDate)
);

module.exports = mongoose.model("Order", orderSchema);
