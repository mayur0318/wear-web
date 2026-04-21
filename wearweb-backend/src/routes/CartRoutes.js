const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/AuthMiddleware");

const {
  addToCart,
  getCartByUserId,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/CartController");

router.post("/add", verifyToken, addToCart);
router.get("/:userId", verifyToken, getCartByUserId);
router.put("/:userId/:productId", verifyToken, updateCartItem);
router.delete("/clear/:userId", verifyToken, clearCart);
router.delete("/:userId/:productId", verifyToken, removeFromCart);

module.exports = router;
