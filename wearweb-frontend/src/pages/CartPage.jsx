<<<<<<< HEAD
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { CartContext } from "../context/CartContext";

export const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { removeFromCart } = useContext(CartContext);

  const getValidCustomerId = () => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId || customerId === "undefined" || customerId === "null" || customerId === "false") {
      return null;
    }
    return customerId;
  };

  const fetchCart = async () => {
    try {
      const customerId = getValidCustomerId();
      if (!customerId) {
        setCart({ items: [], totalPrice: 0 });
        setLoading(false);
        return;
      }

      const response = await getCart(customerId);
      const cartData = response.data?.data || { items: [], totalPrice: 0 };

      // Filter out items whose product was deleted (productId is null after populate)
      if (cartData.items) {
        cartData.items = cartData.items.filter(item => item.productId && item.productId._id);
      }

      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    // Refetch cart from DB to get accurate totalPrice
    await fetchCart();
  };

  // Calculate total from valid items (in case totalPrice is stale)
  const calculatedTotal = cart?.items?.reduce((sum, item) => {
    return sum + ((item.productId?.productPrice || 0) * (item.quantity || 1));
  }, 0) || 0;

  return (
    <>
      <Navbar />

      <div style={{ backgroundColor: '#f8f9fb', minHeight: '70vh' }}>
        {/* Breadcrumb */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e5ea' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#0f172a', fontWeight: 700 }}>Shopping Cart</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Shopping Cart</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32, fontWeight: 500 }}>
            {cart?.items?.length || 0} item{(cart?.items?.length || 0) !== 1 ? 's' : ''} in your cart
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '4px solid #e2e5ea', borderTopColor: '#1d6fd8', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p style={{ color: '#64748b', fontWeight: 600 }}>Loading your cart...</p>
            </div>
          ) : !cart?.items?.length ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e5ea' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Your cart is empty</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Looks like you haven't added anything yet.</p>
              <button
                onClick={() => navigate('/products')}
                style={{ backgroundColor: '#1d6fd8', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="lg:grid-cols-3">
              <style>{`@media (min-width: 1024px) { .lg\\:grid-cols-3 { grid-template-columns: 2fr 1fr !important; } }`}</style>

              {/* Cart Items */}
              <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e5ea', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 100px 80px', alignItems: 'center', padding: '14px 20px', backgroundColor: '#f8f9fb', borderBottom: '1px solid #e2e5ea', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>Image</span>
                  <span>Product</span>
                  <span style={{ textAlign: 'center' }}>Qty</span>
                  <span style={{ textAlign: 'right' }}>Subtotal</span>
                  <span style={{ textAlign: 'center' }}></span>
                </div>

                {/* Cart Rows */}
                {cart.items.map((item, index) => (
                  <div
                    key={item.productId?._id || index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr 100px 100px 80px',
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderBottom: index < cart.items.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    {/* Image */}
                    <a href={`/product/${item.productId?._id}`}>
                      <img
                        src={item.productId?.imagePath || "/assets/images/products/p1.jpg"}
                        alt={item.productId?.productName || "Product"}
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e5ea' }}
                        onError={(e) => { e.target.src = "/assets/images/products/p1.jpg"; }}
                      />
                    </a>

                    {/* Product Info */}
                    <div style={{ paddingLeft: 12 }}>
                      <a
                        href={`/product/${item.productId?._id}`}
                        style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', textDecoration: 'none', display: 'block', marginBottom: 4 }}
                      >
                        {item.productId?.productName || "Unknown Product"}
                      </a>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1d6fd8' }}>
                        ₹{(item.productId?.productPrice || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: '#f8f9fb', border: '1px solid #e2e5ea', borderRadius: 6, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                        {item.quantity}
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div style={{ textAlign: 'right', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                      ₹{((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}
                    </div>

                    {/* Remove */}
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemove(item.productId?._id)}
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          borderRadius: 6,
                          padding: '6px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e5ea', padding: 24, position: 'sticky', top: 80 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: '#64748b', fontWeight: 500 }}>Subtotal ({cart.items.length} items)</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>₹{calculatedTotal.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: '#64748b', fontWeight: 500 }}>Shipping</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      {calculatedTotal >= 499 ? 'FREE' : '₹49'}
                    </span>
                  </div>

                  <div style={{ borderTop: '2px solid #0f172a', paddingTop: 16, marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>Total</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>
                      ₹{(calculatedTotal + (calculatedTotal >= 499 ? 0 : 49)).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    style={{
                      width: '100%',
                      marginTop: 20,
                      padding: '14px',
                      backgroundColor: '#1d6fd8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    style={{
                      width: '100%',
                      marginTop: 10,
                      padding: '12px',
                      backgroundColor: 'transparent',
                      color: '#64748b',
                      border: '1px solid #e2e5ea',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

=======
import React, { useState, useEffect } from "react";
import { getCart } from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        if (customerId) {
          const response = await getCart(customerId);
          setCart(response.data.cart || response.data);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  return (
    <>
      <Navbar />
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <ul className="list-inline list-unstyled">
              <li><a href="/">Home</a></li>
              <li className="active">Cart</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="body-content outer-top-xs">
        <div className="container">
          <div className="row">
            <div className="shopping-cart">
              <div className="shopping-cart-table">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="cart-description item">Image</th>
                        <th className="cart-product-name item">Product Name</th>
                        <th className="cart-qty item">Quantity</th>
                        <th className="cart-sub-total item">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center">Loading cart...</td></tr>
                      ) : cart && cart.items && cart.items.length > 0 ? (
                        cart.items.map((item, index) => (
                          <tr key={index}>
                            <td className="cart-image">
                              <a className="entry-thumbnail" href={`/product/${item.productId}`}>
                                <img src={item.image || "/assets/images/products/p1.jpg"} alt="" />
                              </a>
                            </td>
                            <td className="cart-product-name-info">
                              <h4 className='cart-product-description'>
                                <a href={`/product/${item.productId}`}>{item.name}</a>
                              </h4>
                            </td>
                            <td className="cart-product-quantity">
                              <div className="quant-input">
                                <input type="number" value={item.quantity} readOnly />
                              </div>
                            </td>
                            <td className="cart-product-sub-total">
                              <span className="cart-sub-total-price">${item.price * item.quantity}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center">Your cart is empty.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-4 col-sm-12 cart-shopping-total">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <div className="cart-sub-total">
                          Subtotal<span className="inner-left-md">${cart?.totalPrice || 0}</span>
                        </div>
                        <div className="cart-grand-total">
                          Grand Total<span className="inner-left-md">${cart?.totalPrice || 0}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="cart-checkout-btn pull-right">
                          <a href="/checkout" className="btn btn-primary checkout-btn">PROCEED TO CHECKOUT</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
      <Footer />
    </>
  );
};
