const userSchema = require("../models/UserModel");
const customerSchema = require("../models/CustomerModel");
const vendorSchema = require("../models/VendorModel");
const bcrypt = require("bcrypt");
const mailSend = require("../utils/MailUtils");

const registerUser = async (req, res) => {
  try {
    const existingUser = await userSchema.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const savedUser = await userSchema.create({
      ...req.body,
      password: hashedPassword,
    });

    if (req.body.role === "vendor") {
      await vendorSchema.create({
        userId: savedUser._id,
        shopName: req.body.shopName,
        address: req.body.address,
      });
    }

    if (req.body.role === "customer") {
      await customerSchema.create({
        userId: savedUser._id,
        address: req.body.address,
      });
    }

    await mailSend(
      savedUser.email,
      "Welcome to Wear Web",
      "Thank you for registering with our app",
    );
    res.status(201).json({
      message: "User created successfully!!",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while creating user!!",
      err: err,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const findUserFromEmail = await userSchema.findOne({ modelColumnName: req.body.email });
    const findUserFromEmail = await userSchema.findOne({ email: email });
    if (findUserFromEmail) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        findUserFromEmail.password,
      );
      if (isPasswordMatched) {
        res.status(200).json({
          message: "Login Success",
          data: findUserFromEmail,
          role: findUserFromEmail.role,
        });
      } else {
        res.status(400).json({
          message: "Invalid Credential",
        });
      }
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error while loging in",
      err: err,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const getAllUsersObj = await userSchema.find();
    res.status(200).json({
      message: "all users",
      data: getAllUsersObj,
    });
  } catch (error) {
    res.status(500).json({
      message: "error while featching users!!",
      error: error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUserObj = await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User deleted successfully",
      data: deleteUserObj,
    });
  } catch {
    res.status(404).json({
      message: "User not found",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const getUser = await userSchema.findById(req.params.id);
    res.status(200).json({
      message: "User",
      data: getUser,
    });
  } catch {
    res.status(404).json({
      message: "User not found",
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updateUser = await userSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json({
      message: "User updated successfully",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while updating user",
      err: err,
    });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  deleteUser,
  getUserById,
  updateUserById,
};
