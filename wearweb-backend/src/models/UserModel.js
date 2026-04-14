const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "customer",
    enum: ["customer", "vendor", "admin"],
  },
  profilePicture: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "blocked"],
  },
});

module.exports = mongoose.model("User", userSchema);
