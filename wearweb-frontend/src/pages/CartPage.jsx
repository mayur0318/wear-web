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
      <Footer />
    </>
  );
};
