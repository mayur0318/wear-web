const vendorSchema = require("../models/VendorModel");

const getAllVendors = async (req, res) => {
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

const getVendorById = async (req, res) => {
  try {
    const getVendor = await vendorSchema.findById(req.params.id);
    if (!getVendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }
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
    if (!updateVendorObj) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }
    res.status(200).json({
      message: "Vendor updated successfully",
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
    if (!deleteVendorObj) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }
    res.status(200).json({
      message: "Vendor deleted successfully",
      data: deleteVendorObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting vendor",
      err: err,
    });
  }
};

const getVendorByUserId = async (req, res) => {
  try {
    const getVendorByUserIdObj = await vendorSchema.findOne({
      userId: req.body.userId,
    });
    if (!getVendorByUserIdObj) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }
    res.status(200).json({
      message: "Vendor data",
      data: getVendorByUserIdObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching vendor",
      err: err,
    });
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorByUserId,
};
