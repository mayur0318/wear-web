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
      message: "Error while featching customers",
      err: err,
    });
  }
};
module.exports = {
  getAllCustomer,
};
