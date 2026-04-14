import React from "react";
import { Link } from "react-router-dom";

export const ProductCard = ({ product }) => {
  return (
    <div className="col-sm-6 col-md-4">
      <div className="products">
        <div className="product">
          <div className="product-image">
            <div className="image">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.imagePath || "/assets/images/products/p1.jpg"}
                  alt={product.productName}
                />
              </Link>
            </div>
            {product.isNew && (
              <div className="tag new">
                <span>new</span>
              </div>
            )}
            {product.sale && (
              <div className="tag sale">
                <span>sale</span>
              </div>
            )}
          </div>

          <div className="product-info text-left">
            <h3 className="name">
              <Link to={`/product/${product._id}`}>{product.productName}</Link>
            </h3>

            <div className="product-price">
              <span className="price">₹{product.productPrice}</span>
            </div>
          </div>
          <div className="cart clearfix animate-effect">
            <div className="action">
              <ul className="list-unstyled">
                <li className="add-cart-button btn-group">
                  <button
                    className="btn btn-primary icon"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="fa fa-shopping-cart"></i>
                  </button>
                  <button className="btn btn-primary cart-btn" type="button">
                    Add to cart
                  </button>
                </li>
                <li className="lnk wishlist">
                  <a className="add-to-cart" href="#" title="Wishlist">
                    <i className="icon fa fa-heart"></i>
                  </a>
                </li>
                <li className="lnk">
                  <a className="add-to-cart" href="#" title="Compare">
                    <i className="fa fa-signal"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
