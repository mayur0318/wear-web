const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shopName: {
    type: String,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["approved", "pending"],
  },
});

module.exports = mongoose.model("Vendor", vendorSchema);
