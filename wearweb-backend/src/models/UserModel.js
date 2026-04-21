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
  address: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", ""],
    default: "",
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "blocked"],
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
