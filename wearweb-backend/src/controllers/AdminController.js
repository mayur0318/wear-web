const vendorSchema = require("../models/VendorModel");
const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");

const getVendorRequests = async (req, res) => {
  try {
    const pendingVendors = await vendorSchema.find({ status: "pending" }).populate("userId", "name email phoneNo");
    
    // We need to format the response to match the requested columns: Shop Name, Owner Name, Email, Phone, Address
    const formattedVendors = pendingVendors.map(vendor => ({
      _id: vendor._id,
      shopName: vendor.shopName,
      ownerName: vendor.userId ? vendor.userId.name : "N/A",
      email: vendor.userId ? vendor.userId.email : "N/A",
      phoneNo: vendor.userId ? vendor.userId.phoneNo : "N/A",
      address: vendor.address,
      status: vendor.status
    }));

    res.status(200).json({
      message: "Pending vendors",
      data: formattedVendors,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching pending vendors",
      err,
    });
  }
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await vendorSchema.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Ensure the associated user has vendor status
    await userSchema.findByIdAndUpdate(vendor.userId, { role: "vendor" });

    res.status(200).json({ message: "Vendor approved", data: vendor });
  } catch (err) {
    res.status(500).json({ message: "Error approving vendor", err });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const vendor = await vendorSchema.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json({ message: "Vendor rejected", data: vendor });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting vendor", err });
  }
};

/**
 * GET /api/admin/admins
 * Fetch all users with role = "admin"
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await userSchema
      .find({ role: "admin" })
      .select("name email phoneNo createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      admins: admins.map((admin) => ({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNo: admin.phoneNo,
        createdAt: admin.createdAt,
      })),
    });
  } catch (err) {
    console.error("getAllAdmins error:", err);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

/**
 * POST /api/admin/admins/create
 * Create a sub-admin with a temporary password.
 */
const createSubAdmin = async (req, res) => {
  try {
    const { name, email, phoneNo } = req.body;

    // Input validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!phoneNo || !/^\d{10}$/.test(phoneNo.replace(/\D/g, ""))) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // Check email uniqueness
    const existingUser = await userSchema.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate temporary password (16 chars)
    const tempPassword =
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10);

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create admin user
    const newAdmin = await userSchema.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNo: phoneNo.trim(),
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Sub-admin created successfully",
      tempPassword, // Shown once in the modal for the creating admin to copy
      adminEmail: newAdmin.email,
    });
  } catch (err) {
    console.error("createSubAdmin error:", err);
    res.status(500).json({ message: "Failed to create sub-admin" });
  }
};

/**
 * DELETE /api/admin/admins/:id
 * Remove an admin user. Prevents self-delete.
 */
const removeAdmin = async (req, res) => {
  try {
    const targetId = req.params.id;

    // Prevent self-delete
    if (req.user.userId === targetId) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    // Verify target exists and is an admin
    const targetUser = await userSchema.findById(targetId);
    if (!targetUser || targetUser.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    await userSchema.findByIdAndDelete(targetId);

    res.status(200).json({
      success: true,
      message: "Admin removed successfully",
    });
  } catch (err) {
    console.error("removeAdmin error:", err);
    res.status(500).json({ message: "Failed to remove admin" });
  }
};

module.exports = {
  getVendorRequests,
  approveVendor,
  rejectVendor,
  getAllAdmins,
  createSubAdmin,
  removeAdmin,
};
