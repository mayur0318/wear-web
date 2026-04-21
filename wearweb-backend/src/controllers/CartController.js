const cartSchema = require("../models/CartModel");
const productSchema = require("../models/ProductModel");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    let cart = await cartSchema.findOne({ userId });

    let product = await productSchema.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!cart) {
      cart = await cartSchema.create({
        userId,
        items: [{ productId, quantity }],
        totalPrice: product.productPrice * quantity,
      });
    } else {
      const index = cart.items.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      let total = 0;
      for (let item of cart.items) {
        const prod = await productSchema.findById(item.productId);
        if (prod) {
          total += prod.productPrice * item.quantity;
        }
      }

      cart.totalPrice = total;
      await cart.save();
    }

    res.status(200).json({
      message: "Added to cart successfully",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in cart",
      err: err,
    });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({
        userId: req.params.userId,
      })
      .populate("userId")
      .populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        message: "Cart not found",
        data: { items: [], totalPrice: 0 },
      });
    }

    // Filter out items whose product has been deleted (productId is null after populate)
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId != null);

    // If we removed stale items, recalculate and save
    if (cart.items.length !== originalLength) {
      let total = 0;
      for (let item of cart.items) {
        if (item.productId && item.productId.productPrice) {
          total += item.productId.productPrice * item.quantity;
        }
      }
      cart.totalPrice = total;
      await cart.save();
    }

    res.status(200).json({
      message: "Cart data",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching cart",
      err: err,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await cartSchema.findById(req.params.cartId);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (p) => p.productId.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;

    let total = 0;
    for (let currentItem of cart.items) {
      const prod = await productSchema.findById(currentItem.productId);
      if (prod) {
        total += prod.productPrice * currentItem.quantity;
      }
    }

    cart.totalPrice = total;
    await cart.save();

    res.status(200).json({
      message: "Cart updated",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating cart",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await cartSchema.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (p) => p.productId.toString() !== req.params.productId
    );

    let total = 0;
    for (let item of cart.items) {
      const prod = await productSchema.findById(item.productId);
      if (prod) {
        total += prod.productPrice * item.quantity;
      }
    }

    cart.totalPrice = total;
    await cart.save();

    res.status(200).json({
      message: "Item removed",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error removing item",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await cartSchema.findOne({ userId: req.params.userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    res.status(200).json({
      message: "Cart cleared successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: "Error clearing cart"
    });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItem,
  removeFromCart,
  clearCart,
};
