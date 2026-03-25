const vendorSchema = require("../models/VendorModel");

const getAllVendors = async (requestAnimationFrame, res) => {
  try {
    const getAllVendorObj = await vendorSchema.find();
    res.status(200).json({
      message: "All Vendors",
      data: getAllVendorObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching vendors",
      err: err,
    });
  }
};

const getVendorById = async (res, req) => {
  try {
    const getVendor = await vendorSchema.findById(req.params.id);
    res.status(200).json({
      message: "Vendor",
      data: getVendor,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching vendor",
      err: err,
    });
  }
};

const updateVendor = async (req, res) => {
  try {
    const updateVendorObj = await vendorSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json({
      message: "User updated successfully",
      data: updateVendorObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating the vendor",
      err: err,
    });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const deleteVendorObj = await vendorSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Vendor deleted successfully",
      data: deleteVendorObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting user",
      err: err,
    });
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
