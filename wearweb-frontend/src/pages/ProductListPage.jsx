import React, { useState, useEffect } from "react";
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/common/ProductCard";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("ProductListPage Loaded ");
  useEffect(() => {
    console.log("USE EFFECT RUNNING ");
    console.log("PRODUCTS:", products);
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        console.log("FULL RESPONSE:", response);
        console.log("DATA:", response.data.data);
        setProducts(response.data.data || []);
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
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <ul className="list-inline list-unstyled">
              <li>
                <a href="/">Home</a>
              </li>
              <li className="active">Products</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="body-content outer-top-xs">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12">
              <div className="search-result-container ">
                <div id="myTabContent" className="tab-content category-list">
                  <div className="tab-pane active" id="grid-container">
                    <div className="category-product">
                      <div className="row">
                        {loading ? (
                          <div className="text-center">Loading products...</div>
                        ) : products.length > 0 ? (
                          products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                          ))
                        ) : (
                          <div className="text-center">No products found.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
