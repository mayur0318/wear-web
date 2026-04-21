import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { fetchAllProducts } from "../../services/api";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { toast } from "react-toastify";

export const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetchAllProducts();
        console.log("Fetched Products:", res);
        setProducts(res.data.data || res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    
    try {
      await api.delete('/product/product/' + productId);
      toast.success("Product deleted successfully");
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 my-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
          <div>
             <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manage Products</h2>
             <p className="text-slate-500 font-medium mt-1">View, edit, or delete the items in your store's catalog.</p>
          </div>
          <Link to="/admin/add-product" className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add New Product
          </Link>
        </div>

        <div className="overflow-x-auto w-full mt-6 rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider w-20 text-center">Image</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Product ID</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Product Name</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan="5" className="py-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-sm font-medium text-slate-500 bg-slate-50/50">No products found. Start by adding a new one.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id || product.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <img 
                          src={product.imagePath || product.image || "/assets/images/products/p1.jpg"} 
                          alt={product.name || product.productName} 
                          className="w-14 h-14 object-cover rounded-lg shadow-sm border border-slate-200 group-hover:shadow-md transition-shadow"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 font-mono font-medium tracking-wide">#{(product._id || product.id).slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-6 text-base text-slate-800 font-bold">{product.name || product.productName}</td>
                    <td className="py-4 px-6 text-base text-green-600 font-black">₹{product.price || product.productPrice}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <Link to={`/admin/edit-product/${product._id}`}>
                          <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100 flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                            Edit
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(product._id)} className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors shadow-sm border border-red-100 flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
