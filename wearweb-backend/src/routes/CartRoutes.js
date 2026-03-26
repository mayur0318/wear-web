const router = require("express").Router();
const cartController = require("../controllers/CartController");

const {
  addToCart,
  getCartByCustomer,
  updateCartItem,
  removeFromCart,
} = require("../controllers/CartController");

router.post("/add", addToCart);
router.get("/:customerId", getCartByCustomer);
router.put("/:cartId/:productId", updateCartItem);
router.delete("/:cartId/:productId", removeFromCart);

module.exports = router;
