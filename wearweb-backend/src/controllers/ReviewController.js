const Review = require("../models/ReviewModel");

const addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);

    res.status(201).json({
      message: "Review added successfully",
      data: review,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding review",
      err: err,
    });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    })
      .populate("customerId")
      .populate("productId");

    res.status(200).json({
      message: "Product reviews",
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching reviews",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review deleted",
      data: review,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting review",
    });
  }
};

module.exports = {
  addReview,
  getReviewsByProduct,
  deleteReview,
};
