import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
=======
import { Link } from "react-router-dom";
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/common/ProductCard";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const HomePage = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
<<<<<<< HEAD
        setProducts(response.data.data || []);
=======
        setProducts(response.data.products || response.data || []);
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

<<<<<<< HEAD
  const scrollToProducts = () => {
    document.getElementById("featured-products")?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      
      {/* 1. NEW HERO SECTION */}
      <section className="w-full bg-[#FFD700] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px] py-[40px] lg:py-[60px] min-h-[320px] flex flex-col md:flex-row items-center justify-between gap-[40px]">
          
          {/* Left Side: Typography */}
          <div className="flex-1 text-left flex flex-col items-start z-10 w-full">
            <span className="bg-[#1a1a1a] text-[#FFD700] text-[11px] font-[700] tracking-[0.08em] px-[12px] py-[4px] rounded-[20px] mb-[16px]">
              NEW COLLECTION 2025
            </span>
            <h1 className="text-[32px] sm:text-[42px] font-[800] text-[#1a1a1a] leading-[1.15] mb-[14px]">
              Discover the Best<br/>
              <span className="text-[#1d6fd8]">Fashion Wear</span><br/>
              on Wear Web
            </h1>
            <p className="text-[15px] text-[#4b4b4b] leading-[1.6] mb-[28px] max-w-[450px]">
              Shop top brands, latest styles, and exclusive deals — all in one place. Fresh arrivals every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto">
              <button 
                onClick={scrollToProducts}
                className="bg-[#1d6fd8] text-[#ffffff] px-[28px] py-[12px] rounded-[8px] text-[14px] font-[600] border-none hover:bg-[#1e40af] transition-colors cursor-pointer w-full sm:w-auto"
              >
                Shop Now
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="bg-transparent text-[#1d6fd8] px-[28px] py-[12px] rounded-[8px] text-[14px] font-[600] border-[2px] border-solid border-[#1d6fd8] hover:bg-blue-50 transition-colors cursor-pointer w-full sm:w-auto"
              >
                Browse Categories
              </button>
            </div>
          </div>

          {/* Right Side: Decorative Visual Box */}
          <div className="max-md:[display:none] flex flex-col items-center justify-center bg-white w-[260px] h-[240px] rounded-[16px] shadow-lg shrink-0 relative overflow-hidden p-[20px]">
             <div className="flex justify-center gap-[12px] mb-[20px]">
                 <div className="w-[60px] h-[80px] bg-[#FFD700] shadow-sm transform -translate-y-2" style={{borderRadius: '6px 6px 40% 40%'}}></div>
                 <div className="w-[60px] h-[80px] bg-[#1d6fd8] shadow-sm z-10 scale-110" style={{borderRadius: '6px 6px 40% 40%'}}></div>
                 <div className="w-[60px] h-[80px] bg-[#f472b6] shadow-sm transform translate-y-3" style={{borderRadius: '6px 6px 40% 40%'}}></div>
             </div>
             
             <div className="bg-[#1a1a1a] text-white text-[12px] font-bold px-[16px] py-[6px] rounded-full mb-[8px]">
               500+ Brands Available
             </div>
             <p className="text-[11px] text-[#64748b] font-medium text-center">
               Free shipping on orders over ₹499
             </p>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="w-full bg-[#f8f9fb]">
        <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px] py-[40px]">
           <h2 className="text-[20px] font-[800] text-[#0f172a] mb-[20px]">Shop by Category</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
             
             <div onClick={() => navigate('/products?category=men')} className="bg-white rounded-[10px] border border-solid border-[#e2e5ea] p-[20px_16px] text-center hover:border-[#1d6fd8] hover:shadow-md transition-all cursor-pointer group">
               <div className="w-[50px] h-[50px] rounded-full bg-[#dbeafe] text-[24px] flex items-center justify-center mx-auto mb-[12px] group-hover:scale-110 transition-transform">
                 👔
               </div>
               <h3 className="text-[15px] font-[700] text-[#0f172a]">Men</h3>
             </div>

             <div onClick={() => navigate('/products?category=women')} className="bg-white rounded-[10px] border border-solid border-[#e2e5ea] p-[20px_16px] text-center hover:border-[#1d6fd8] hover:shadow-md transition-all cursor-pointer group">
               <div className="w-[50px] h-[50px] rounded-full bg-[#fce7f3] text-[24px] flex items-center justify-center mx-auto mb-[12px] group-hover:scale-110 transition-transform">
                 👗
               </div>
               <h3 className="text-[15px] font-[700] text-[#0f172a]">Women</h3>
             </div>

             <div onClick={() => navigate('/products?category=kids')} className="bg-white rounded-[10px] border border-solid border-[#e2e5ea] p-[20px_16px] text-center hover:border-[#1d6fd8] hover:shadow-md transition-all cursor-pointer group">
               <div className="w-[50px] h-[50px] rounded-full bg-[#dcfce7] text-[24px] flex items-center justify-center mx-auto mb-[12px] group-hover:scale-110 transition-transform">
                 🧒
               </div>
               <h3 className="text-[15px] font-[700] text-[#0f172a]">Kids</h3>
             </div>

           </div>
        </div>
      </section>

      {/* 3. ORIGINAL FEATURED PRODUCTS SECTION */}
      <div className="w-full bg-white" id="featured-products">
        <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px] py-[60px]">
          <h2 className="text-[20px] font-[800] text-[#0f172a] mb-[30px]">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center w-full py-10">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-[#1d6fd8] animate-spin mx-auto"></div>
                <p className="text-[#64748b] mt-4 font-medium">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))
            ) : (
              <div className="col-span-full text-center w-full py-10 text-[#64748b] bg-[#f8f9fb] rounded-lg">No products found.</div>
            )}
          </div>
        </div>
      </div>

=======
  return (
    <>
      <Navbar />
      <div className="body-content outer-top-xs" id="top-banner-and-menu">
        <div className="container">
          <div className="row">
            {/* Main Content Area */}
            <div className="col-xs-12 col-sm-12 col-md-12">
              <div id="hero">
                <div className="item">
                  <div className="container-fluid">
                    <div className="caption bg-color vertical-center text-left">
                      <div className="slider-header fadeInDown-1">
                        Top Brands
                      </div>
                      <div className="big-text fadeInDown-1">
                        New Collections
                      </div>
                      <div className="excerpt fadeInDown-2 hidden-xs">
                        <span>Discover the best fashion wear on Wear Web.</span>
                      </div>
                      <div className="button-holder fadeInDown-3">
                        <a
                          href="/products"
                          className="btn-lg btn btn-uppercase btn-primary shop-now-button"
                        >
                          Shop Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section className="section featured-product wow fadeInUp">
                <h3 className="section-title">Featured Products</h3>
                <div className="row">
                  {loading ? (
                    <div className="text-center">Loading products...</div>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                      />
                    ))
                  ) : (
                    <div className="text-center">No products found.</div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
      <Footer />
    </>
  );
};
