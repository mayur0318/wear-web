const customerSchema = require("../models/CustomerModel");

const getAllCustomer = async (req, res) => {
  try {
    const getAllcustomersObj = await customerSchema.find();
    res.status(200).json({
      message: "All Customers",
      data: getAllcustomersObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching customers",
      err: err,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const getCustomer = await customerSchema.findById(req.params.id);
    if (!getCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    res.status(200).json({
      message: "Customer data",
      data: getCustomer,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching customer",
      err: err,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const updateCustomerObj = await customerSchema.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!updateCustomerObj) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    res.status(200).json({
      message: "Customer updated successfully",
      data: updateCustomerObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error whihle updating customer",
      err: err,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deleteCustomerObj = await customerSchema.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteCustomerObj) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    res.status(200).json({
      message: "Customer deleted successfully",
      data: deleteCustomerObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting customer",
      err: err,
    });
  }
};

const getCustomerByUserId = async (req, res) => {
  try {
    const getCustomerByuserIdObj = await customerSchema.findOne({
      userId: req.params.userId,
    });
    if (!getCustomerByuserIdObj) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    res.status(200).json({
      message: "Customer data",
      data: getCustomerByuserIdObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching customer",
      err: err,
    });
  }
};

module.exports = {
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerByUserId,
};
