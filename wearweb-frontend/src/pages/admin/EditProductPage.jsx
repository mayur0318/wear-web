import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api, { fetchProductById } from "../../services/api";
import { toast } from "react-toastify";

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    stock: "",
    category: "",
  });
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetchProductById(id);
        const prod = res.data?.data || res.data;
        if (prod) {
          setFormData({
            productName: prod.productName || prod.name || "",
            productPrice: prod.productPrice || prod.price || "",
            productDescription: prod.productDescription || prod.description || "",
            stock: prod.stock || "",
            category: prod.category || prod.categoryId?._id || prod.categoryId || "",
          });
          setCurrentImage(prod.imagePath || prod.image);
        }
      } catch (err) {
        console.error("Error fetching product details", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend expects JSON for updateProduct (PUT /product/product/:id)
      await api.put(`/product/product/${id}`, formData);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product", err);
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
         <div className="flex justify-center items-center h-40">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button onClick={() => navigate("/admin/products")} className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Products
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side: Current Product Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Current Details
            </h3>
            
            <div className="mb-6 flex justify-center">
              <img 
                 src={currentImage || "/assets/images/products/p1.jpg"} 
                 alt="Current Product" 
                 className="w-48 h-48 object-cover rounded-xl shadow-sm border border-gray-100" 
              />
            </div>
            
            <div className="space-y-5">
              <div>
                 <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Product Name</span>
                 <p className="text-gray-800 font-medium text-lg leading-tight">{formData.productName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                   <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price</span>
                   <p className="text-gray-800 font-bold text-green-600 text-lg">₹{formData.productPrice}</p>
                </div>
                <div>
                   <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Stock</span>
                   <p className="text-gray-800 font-medium text-lg">{formData.stock}</p>
                </div>
              </div>
              <div>
                 <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</span>
                 <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">{formData.category || 'Uncategorized'}</span>
              </div>
              <div>
                 <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</span>
                 <p className="text-gray-600 text-sm mt-1 p-4 bg-gray-50 rounded-lg border border-gray-100 h-32 overflow-y-auto leading-relaxed">{formData.productDescription}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start gap-2 shadow-sm">
                 <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <span className="font-medium leading-relaxed">To update the actual image file, you must delete this product and create a new one, as the API only supports updating text data.</span>
              </p>
            </div>
          </div>

          {/* Right Side: Edit Form Component */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
                 <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                 Update Information
             </h3>
             <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                  <input type="text" name="productName" value={formData.productName} onChange={handleChange} className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" required />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                    <input type="number" name="productPrice" value={formData.productPrice} onChange={handleChange} className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" required />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} className="p-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition h-32 resize-y" required></textarea>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 flex gap-4">
                   <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-md mt-auto">Save Changes</button>
                   <button type="button" onClick={() => navigate("/admin/products")} className="bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm">Cancel</button>
                </div>
             </form>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};
