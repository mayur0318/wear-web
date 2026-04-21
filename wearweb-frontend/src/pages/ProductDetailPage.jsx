import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../services/api";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { toast } from "react-toastify";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const isWished = product && wishlistItems.some((i) => i._id === product._id);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProductById(id);
        setProduct(response.data.data || response.data.product || response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    addToCart(product, qty);
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fb' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #e2e5ea', borderTopColor: '#1d6fd8', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
            <p style={{ color: '#64748b', fontWeight: 600 }}>Loading product details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Not Found
  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fb', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e5ea', padding: '48px', textAlign: 'center', maxWidth: 420 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Product Not Found</h2>
            <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Sorry, this product doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/products')}
              style={{ backgroundColor: '#1d6fd8', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <>
      <Navbar />

      <div style={{ backgroundColor: '#f8f9fb', minHeight: '80vh' }}>
        {/* Breadcrumb */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e5ea' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <Link to="/products" style={{ color: '#64748b', textDecoration: 'none' }}>Products</Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#0f172a', fontWeight: 700 }}>{product.productName}</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg:grid-cols-2">
            <style>{`
              @media (min-width: 1024px) {
                .lg\\:grid-cols-2 { grid-template-columns: 1fr 1fr !important; }
              }
            `}</style>

            {/* ===== LEFT: PRODUCT IMAGE ===== */}
            <div>
              <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e5ea', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: 480, backgroundColor: '#f8f9fb' }}>
                  <img
                    src={product.imagePath || "/assets/images/products/p1.jpg"}
                    alt={product.productName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "/assets/images/products/p1.jpg"; }}
                  />

                  {/* Stock Badge */}
                  {!inStock && (
                    <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#ef4444', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== RIGHT: PRODUCT DETAILS ===== */}
            <div>
              {/* Category Badge */}
              {(product.categoryId?.categoryName || product.category) && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#1d6fd8', backgroundColor: '#dbeafe', padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {product.categoryId?.categoryName || product.category}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 16 }}>
                {product.productName}
              </h1>

              {/* Vendor Info */}
              {product.vendorId?.shopName && (
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, fontWeight: 500 }}>
                  Sold by <span style={{ color: '#7c3aed', fontWeight: 700 }}>{product.vendorId.shopName}</span>
                </p>
              )}

              {/* Price */}
              <div style={{ backgroundColor: '#f8f9fb', borderRadius: 10, padding: '20px 24px', border: '1px solid #e2e5ea', marginBottom: 24 }}>
                <p style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  ₹{product.productPrice?.toLocaleString()}
                </p>
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  Inclusive of all taxes
                </p>
              </div>

              {/* Description */}
              {product.productDescription && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    About this Product
                  </h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
                    {product.productDescription}
                  </p>
                </div>
              )}

              {/* Size & Color */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
                {product.productSize && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</p>
                    <span style={{ display: 'inline-block', padding: '10px 24px', border: '2px solid #1d6fd8', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#1d6fd8', backgroundColor: '#eff6ff' }}>
                      {product.productSize}
                    </span>
                  </div>
                )}
                {product.productColor && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color</p>
                    <span style={{ display: 'inline-block', padding: '10px 24px', border: '2px solid #7c3aed', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#7c3aed', backgroundColor: '#f5f3ff' }}>
                      {product.productColor}
                    </span>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '12px 16px', borderRadius: 8, backgroundColor: inStock ? '#f0fdf4' : '#fef2f2', border: `1px solid ${inStock ? '#bbf7d0' : '#fecaca'}` }}>
                <span style={{ fontSize: 16 }}>{inStock ? '✅' : '❌'}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: inStock ? '#16a34a' : '#dc2626' }}>
                  {inStock
                    ? product.stock !== undefined
                      ? `In Stock (${product.stock} available)`
                      : 'In Stock'
                    : 'Out of Stock'
                  }
                </span>
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #e2e5ea', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ width: 44, height: 44, backgroundColor: '#f8f9fb', border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer', color: '#374151', borderRight: '1px solid #e2e5ea' }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    style={{ width: 56, height: 44, textAlign: 'center', border: 'none', fontSize: 15, fontWeight: 700, color: '#0f172a', outline: 'none' }}
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    style={{ width: 44, height: 44, backgroundColor: '#f8f9fb', border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer', color: '#374151', borderLeft: '1px solid #e2e5ea' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    backgroundColor: inStock ? '#1d6fd8' : '#cbd5e1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: inStock ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  🛒 {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => product && toggleWishlist(product)}
                  style={{
                    padding: '16px 20px',
                    backgroundColor: isWished ? '#fef2f2' : '#fff',
                    color: isWished ? '#ef4444' : '#374151',
                    border: `2px solid ${isWished ? '#fecaca' : '#e2e5ea'}`,
                    borderRadius: 10,
                    fontSize: 20,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {isWished ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Delivery Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                <div style={{ padding: '14px 16px', backgroundColor: '#f8f9fb', borderRadius: 8, border: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🚚</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Free Delivery</p>
                    <p style={{ fontSize: 11, color: '#64748b' }}>On orders above ₹499</p>
                  </div>
                </div>
                <div style={{ padding: '14px 16px', backgroundColor: '#f8f9fb', borderRadius: 8, border: '1px solid #e2e5ea', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🔄</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Easy Returns</p>
                    <p style={{ fontSize: 11, color: '#64748b' }}>7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== DETAILS TABS ===== */}
          <div style={{ marginTop: 48, backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e5ea', overflow: 'hidden' }}>
            {/* Tab Headers */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e5ea' }}>
              {[
                { key: 'description', label: 'Description' },
                { key: 'specifications', label: 'Specifications' },
                { key: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '16px 28px',
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? '3px solid #1d6fd8' : '3px solid transparent',
                    backgroundColor: activeTab === tab.key ? '#eff6ff' : 'transparent',
                    color: activeTab === tab.key ? '#1d6fd8' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '32px' }}>
              {activeTab === 'description' && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Product Description</h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
                    {product.productDescription || 'No detailed description available for this product.'}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Product Specifications</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        { label: 'Product Name', value: product.productName },
                        { label: 'Category', value: product.categoryId?.categoryName || product.category || '—' },
                        { label: 'Size', value: product.productSize || '—' },
                        { label: 'Color', value: product.productColor || '—' },
                        { label: 'Price', value: `₹${product.productPrice?.toLocaleString()}` },
                        { label: 'Stock', value: product.stock !== undefined ? `${product.stock} units` : 'Available' },
                        { label: 'Sold By', value: product.vendorId?.shopName || '—' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#374151', width: '40%', backgroundColor: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                            {row.label}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569', backgroundColor: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Customer Reviews</h3>
                  <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8f9fb', borderRadius: 10, border: '1px solid #e2e5ea' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No reviews yet</p>
                    <p style={{ fontSize: 13, color: '#64748b' }}>Be the first to review this product!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
