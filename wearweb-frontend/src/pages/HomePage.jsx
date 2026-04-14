import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/common/ProductCard";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

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
      <Footer />
    </>
  );
};
