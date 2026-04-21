const userSchema = require("../models/UserModel");
const vendorSchema = require("../models/VendorModel");

const verifyVendor = async (req, res, next) => {
  try {
    // Use userId from verifyToken (JWT decoded) first, then fall back to header
    const userId = req.userId || req.headers["user-id"] || req.headers["userid"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing User ID" });
    }

    const user = await userSchema.findById(userId);
    if (!user || user.role !== "vendor") {
      return res.status(403).json({ message: "Forbidden: Vendor access required" });
    }

    const vendorRecord = await vendorSchema.findOne({ userId });
    if (!vendorRecord || vendorRecord.status !== "approved") {
      return res.status(403).json({ message: "Forbidden: Vendor account is not approved" });
    }

    // Pass IDs to the next handler
    req.userId = userId;
    req.vendorId = vendorRecord._id;
    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error during vendor verification", error: err.message });
  }
};

module.exports = {
  verifyVendor,
};
