const productSchema = require("../models/ProductModel");

const createProduct = async (req, res) => {
  try {
    const addProduct = await productSchema.create(req.body);
    res.status(201).json({
      message: "Product added successfully",
      data: addProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while creating the product",
      err: err,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productSchema
      .find()
      .populate(["vendorId", "categoryId"]);
    res.status(200).json({
      message: "All Products",
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching products",
      err: err,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const getProduct = await productSchema
      .findById(req.params.id)
      .populate(["vendorId", "categoryId"]);
    if (!getProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product data",
      data: getProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching product",
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const searchProductObj = await productSchema.find({
      productName: { $regex: req.query.name, $options: "i" },
    });

    if (searchProductObj.length > 0) {
      return res.status(200).json({
        message: "Found the product",
        data: searchProductObj,
      });
    } else {
      res.status(404).json({
        message: "Product not found!!",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error while searching product",
      err: err,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateProductObj = await productSchema.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      },
    );
    if (!updateProductObj) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product updated successfully",
      data: updateProductObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating the product",
      err: err,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteProductObj = await productSchema.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteProductObj) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product deleted successfully",
      data: deleteProductObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting the product",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  searchProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
