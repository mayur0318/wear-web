const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const savedUser = await userSchema.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully!!",
      data: savedUser,
    });
  } catch (error) {
    res.json({
      message: "error while creating user!!",
      error: error,
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

module.exports = {
  registerUser,
  getAllUsers,
};
