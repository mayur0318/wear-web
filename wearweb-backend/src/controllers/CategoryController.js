const categorySchema = require("../models/CategoryModel");

const createCategory = async (req, res) => {
  try {
    const addCategory = await categorySchema.create(req.body);
    res.status(201).json({
      message: "Category added successfully",
      data: addCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while creating category",
      err: err,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const getAllCategoryObj = await categorySchema.find();
    res.status(200).json({
      message: "All Categories",
      data: getAllCategoryObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching category",
      err: err,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleteCategoryObj = await categorySchema.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteCategoryObj) {
      res.status(404).json({
        message: "Category not found",
        data: deleteCategoryObj,
      });
    }
    res.status(200).json({
      message: "Category deleted successfully",
      data: deleteCategoryObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting category",
      err: err,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const getCategory = await categorySchema.findById(req.params.id);
    if (!getCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category Data",
      data: getCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updateCategoryObj = await categorySchema.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!updateCategoryObj) {
      return res.status(404).json({
        message: "Category is not found",
      });
    }
    res.status(200).json({
      message: "Category updated successfully",
      data: updateCategoryObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating category",
    });
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
};
