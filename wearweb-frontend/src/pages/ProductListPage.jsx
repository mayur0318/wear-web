import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/common/ProductCard";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. URL Parameter Extraction
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get("category");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // 2. Filtering Logic — check both category string AND populated categoryId.categoryName
  const filteredProducts = categoryQuery
    ? products.filter((product) => {
        const query = categoryQuery.toLowerCase();
        // Check populated category name (from categoryId ref)
        const catName = (product.categoryId?.categoryName || "").toLowerCase();
        const catStr = (product.category || "").toLowerCase();
        // Use exact match to avoid collisions between categories like "mens wear" and "womens wear"
        return catName === query || catStr === query;
      })
    : products;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* 3. UI & Display - Dynamic Page Header */}
      <div className="bg-white border-b border-gray-200 py-8 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
            {categoryQuery ? `Shop ${categoryQuery}` : "All Products"}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl font-bold text-gray-400 animate-pulse">Loading amazing products...</div>
          </div>
        ) : filteredProducts.length > 0 ? (
          
          /* Tailwind Grid Display */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

        ) : (
          
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-80 bg-white rounded-lg border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">No products found in this category</h2>
            <p className="text-gray-500 mt-2 font-medium">Try checking another category or come back later.</p>
          </div>

        )}
      </div>

      <Footer />
    </div>
  );
};
