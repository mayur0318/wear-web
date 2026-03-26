const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviewsByProduct,
  deleteReview,
} = require("../controllers/ReviewController");

router.post("/", addReview);
router.get("/:productId", getReviewsByProduct);
router.delete("/:id", deleteReview);

module.exports = router;
