const cartSchema = require("../models/CartModel");
const productSchema = require("../models/ProductModel");

const addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;

    let cart = await cartSchema.findOne({ customerId });

    let product = await productSchema.findById(productId);
    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    }

    if (!cart) {
      cart = await cartSchema.create({
        customerId,
        productList: [{ productId, quantity }],
        totalAmount: product.productPrice * quantity,
      });
    } else {
    }
    const index = cartSchema.productList.findIndex((p) => {
      p.productId.toString() === productId;
    });
    if (index > -1) {
      cart.productList[index].quantity += quantity;
    } else {
      cart.productList.push({ productId, quantity });
    }
    let total = 0;

    for (let item of cart.productList) {
      const prod = await productSchema.findById(item.productId);
      total += prod.productPrice * item.quantity;
    }

    cart.totalAmount = total;

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in cart",
      err: err,
    });
  }
};

const getCartByCustomer = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({
        customerId: req.params.customerId,
      })
      .populate("customerId")
      .populate("productList.productId");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
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

    const item = cart.productList.find(
      (p) => p.productId.toString() === req.params.productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;

    let total = 0;

    for (let item of cart.productList) {
      const prod = await productSchema.findById(item.productId);
      total += prod.productPrice * item.quantity;
    }

    cart.totalAmount = total;

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
    const cart = await cartSchema.findById(req.params.cartId);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.productList = cart.productList.filter(
      (p) => p.productId.toString() !== req.params.productId,
    );

    let total = 0;

    for (let item of cart.productList) {
      const prod = await Product.findById(item.productId);
      total += prod.productPrice * item.quantity;
    }

    cart.totalAmount = total;

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

module.exports = {
  addToCart,
  getCartByCustomer,
  updateCartItem,
  removeFromCart,
};
