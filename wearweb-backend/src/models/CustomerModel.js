const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: String,
});

module.exports = mongoose.model("Customer", customerSchema);
