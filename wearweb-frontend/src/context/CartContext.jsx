import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getCart, clearCartAPI as apiClearCart } from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getValidCustomerId = () => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId || customerId === "undefined" || customerId === "null" || customerId === "false") {
      return null; // Not logged in — don't use a fake ID
    }
    return customerId;
  };

  useEffect(() => {
    const customerId = getValidCustomerId();
    if (!customerId) {
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await getCart(customerId);
        const items = response.data?.data?.items || response.data?.cart?.items || response.data || [];
        if (Array.isArray(items)) {
          // Filter out items whose product was deleted (productId is null after populate)
          const validItems = items.filter(item => item.productId && item.productId._id);
          setCartItems(validItems);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart from DB:", error);
        setCartItems([]);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product, qty = 1) => {
    try {
      const customerId = getValidCustomerId();
      if (!customerId) {
        toast.error("Please login to add items to cart");
        return;
      }

      await apiAddToCart({
        userId: customerId,
        productId: product._id,
        quantity: qty,
      });

      // Update local state to ensure Navbar bubble is correctly updated
      setCartItems((prevItems) => {
        const existingProductIndex = prevItems.findIndex(
          (item) => (item.productId?._id || item._id) === product._id
        );

        if (existingProductIndex >= 0) {
          const newItems = [...prevItems];
          newItems[existingProductIndex].quantity += qty;
          toast.info(`Updated quantity of ${product.productName || "item"} in cart`);
          return newItems;
        } else {
          toast.success(`Product added to cart`);
          return [...prevItems, {
            _id: product._id,
            productId: {
              _id: product._id,
              productName: product.productName,
              productPrice: product.productPrice,
              imagePath: product.imagePath,
            },
            productName: product.productName,
            productPrice: product.productPrice,
            imagePath: product.imagePath,
            quantity: qty
          }];
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const customerId = getValidCustomerId();
      if (!customerId) {
        toast.error("Please login first");
        return;
      }

      await apiRemoveFromCart(customerId, productId);

      setCartItems((prev) => prev.filter(
        (item) => (item.productId?._id || item._id) !== productId
      ));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const clearCart = async () => {
    try {
      const customerId = getValidCustomerId();
      if (customerId) {
        await apiClearCart(customerId);
      }
    } catch (error) {
      console.error("Error clearing cart from DB:", error);
    }
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
