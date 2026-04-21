const userSchema = require("../models/UserModel");
const customerSchema = require("../models/CustomerModel");
const vendorSchema = require("../models/VendorModel");
const bcrypt = require("bcrypt");
const mailSend = require("../utils/MailUtils");
const uploadToCloudinary = require("../utils/CoudinaryUtils");
const { generateToken } = require("../middleware/AuthMiddleware");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNo, role, address, shopName } = req.body;

    if (!name || !email || !password || !phoneNo) {
      return res.status(400).json({
        message: "Name, email, password, and phone number are required",
      });
    }

    const existingUser = await userSchema.findOne({ email });
    console.log("BODY:", req.body);
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await userSchema.create({
      ...req.body,
      password: hashedPassword,
    });

    if (req.body.role === "vendor") {
      await vendorSchema.create({
        userId: savedUser._id,
        shopName: req.body.shopName,
        address: req.body.address || "",
      });
    }

    if (req.body.role === "customer" || !req.body.role) {
      await customerSchema.create({
        userId: savedUser._id,
        address: req.body.address || "",
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

const vendorSignup = async (req, res) => {
  try {
    const { name, email, password, phoneNo, shopName, address } = req.body;

    if (!name || !email || !password || !phoneNo || !shopName) {
      return res.status(400).json({
        message: "Name, email, password, phone number, and shop name are required",
      });
    }

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await userSchema.create({
      name, email, password: hashedPassword, phoneNo, role: "vendor", address
    });

    await vendorSchema.create({
      userId: savedUser._id,
      shopName: shopName,
      address: address || "",
      status: "pending"
    });

    await mailSend(
      savedUser.email,
      "Welcome to Wear Web as a Vendor",
      "Thank you for registering as a vendor. Admin will review and approve your account shortly.",
    );
    
    res.status(201).json({
      message: "Your vendor account is under review. Admin will approve it shortly.",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while creating vendor!!",
      err: err,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUserFromEmail = await userSchema.findOne({ email: email });
    if (findUserFromEmail) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        findUserFromEmail.password,
      );
      if (isPasswordMatched) {
        
        // Vendor Approval check
        if (findUserFromEmail.role === "vendor") {
          const vendorRecord = await vendorSchema.findOne({ userId: findUserFromEmail._id });
          if (!vendorRecord) {
            return res.status(404).json({ message: "Vendor record not found" });
          }
          if (vendorRecord.status === "pending") {
             return res.status(403).json({ message: "Your account is pending approval." });
          }
          if (vendorRecord.status === "rejected") {
             return res.status(403).json({ message: "Your account has been rejected. Contact support." });
          }
        }

        // Generate JWT token
        const token = generateToken(findUserFromEmail);

        res.status(200).json({
          message: "Login Success",
          token,
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
    let updateData = { ...req.body };

    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path);
      updateData.profilePicture = cloudinaryResponse.secure_url;
    }

    const updateUser = await userSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateData,
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
  vendorSignup,
  getAllUsers,
  loginUser,
  deleteUser,
  getUserById,
  updateUserById,
};
