import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";

export const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  return (
    <div className="group">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e5ea',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        className="hover:shadow-xl hover:-translate-y-1"
      >
        {/* Product Image */}
        <Link to={`/product/${product._id}`} style={{ display: 'block', position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '260px',
              backgroundColor: '#f8f9fb',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={product.imagePath || "/assets/images/products/p1.jpg"}
              alt={product.productName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              className="group-hover:scale-110"
              onError={(e) => { e.target.src = "/assets/images/products/p1.jpg"; }}
            />

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                zIndex: 2,
              }}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>

            {/* Stock Badge */}
            {product.stock !== undefined && product.stock <= 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                Out of Stock
              </div>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#f59e0b',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                Only {product.stock} left
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category */}
          {(product.category || product.categoryId?.categoryName) && (
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              {product.categoryId?.categoryName || product.category}
            </p>
          )}

          {/* Product Name */}
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '40px',
            }}>
              {product.productName}
            </h3>
          </Link>

          {/* Size & Color Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {product.productSize && (
              <span style={{ fontSize: '11px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '12px', fontWeight: 600 }}>
                {product.productSize}
              </span>
            )}
            {product.productColor && (
              <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#7c3aed', padding: '2px 10px', borderRadius: '12px', fontWeight: 600 }}>
                {product.productColor}
              </span>
            )}
          </div>

          {/* Price + Add to Cart */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              ₹{product.productPrice?.toLocaleString()}
            </span>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock !== undefined && product.stock <= 0}
              style={{
                backgroundColor: product.stock !== undefined && product.stock <= 0 ? '#cbd5e1' : '#1d6fd8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: product.stock !== undefined && product.stock <= 0 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              {product.stock !== undefined && product.stock <= 0 ? 'Sold Out' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
