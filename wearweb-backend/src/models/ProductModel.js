const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  productPrice: {
    type: Number,
  },
  productColor: {
    type: String,
  },
  productSize: {
    type: String,
  },
  stock: {
    type: Number,
  },
  imagePath: {
    type: String,
  },
  category: {
    type: String,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Product", productSchema);
