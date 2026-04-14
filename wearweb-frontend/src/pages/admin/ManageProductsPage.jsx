import React, { useState, useEffect } from "react";
import { fetchProducts } from "../../services/api";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";

export const ManageProductsPage = () => {
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
      <div className="body-content">
        <div className="container">
          <h3>Manage Products</h3>
          <a href="/admin/add-product" className="btn btn-primary m-b-20">Add New Product</a>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4">Loading...</td></tr>
              ) : products.map((product) => (
                <tr key={product._id || product.id}>
                  <td>{product._id || product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <button className="btn btn-sm btn-info">Edit</button>
                    <button className="btn btn-sm btn-danger ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};
