import React, { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../services/api";
import { toast } from "react-toastify";

export const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    image: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("productName", formData.name);
      data.append("productPrice", formData.price);
      data.append("productDescription", formData.description);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      //  IMAGE FILE
      data.append("image", formData.image);

      await api.post("/product/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully");

      setFormData({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        image: null,
      });
    } catch (err) {
      console.log("error...", err);
      toast.error("Failed to create product");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto w-full bg-white p-10 md:p-12 rounded-2xl shadow-xl border border-slate-100 my-8">
        
        <div className="mb-10 text-center md:text-left border-b border-slate-100 pb-6">
           <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add New Product</h2>
           <p className="text-slate-500 font-medium mt-2">Fill in the details below to add a new product to your store's catalog.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" onSubmit={handleSubmit}>
          
          {/* Left Column: Basic Info */}
          <div className="space-y-8">
             <div className="flex flex-col">
               <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Product Name</label>
               <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Cotton T-Shirt" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-lg outline-none transition-all duration-200 shadow-sm" required />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Price (₹)</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₹</span>
                     <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-lg outline-none transition-all duration-200 shadow-sm" required />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Enter quantity" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-lg outline-none transition-all duration-200 shadow-sm" />
                </div>
             </div>

             <div className="flex flex-col">
               <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
               <select 
                 name="category" 
                 value={formData.category} 
                 onChange={handleChange} 
                 className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                 required
               >
                 <option value="" disabled>Select a Category</option>
                 <option value="men">Men</option>
                 <option value="women">Women</option>
                 <option value="kids">Kids</option>
                 <option value="accessories">Accessories</option>
               </select>
             </div>
          </div>

          {/* Right Column: Advanced Info & Image */}
          <div className="space-y-8 flex flex-col">
             <div className="flex flex-col flex-1">
               <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
               <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the product details, fabric, fit, etc..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-lg outline-none transition-all duration-200 shadow-sm h-32 md:h-full resize-none min-h-[140px]" required></textarea>
             </div>

             <div className="flex flex-col">
               <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Product Image Format</label>
               <div className="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors duration-300 group overflow-hidden">
                  {formData.image ? (
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3 shadow-sm ring-4 ring-white">
                           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-sm font-bold text-slate-800">{formData.image.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">{(formData.image.size / 1024 / 1024).toFixed(2)} MB</p>
                     </div>
                  ) : (
                     <>
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-base font-bold text-blue-700 mb-1">Click to upload image</span>
                        <span className="text-sm text-slate-500 font-medium">SVG, PNG, JPG or GIF (max. 5MB)</span>
                     </>
                  )}
                  <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
               </div>
             </div>
          </div>

          {/* Full Width Submit */}
          <div className="md:col-span-2 pt-8 mt-4 border-t border-slate-100">
             <button type="submit" className="w-full md:w-auto md:px-16 md:min-w-[300px] mx-auto block bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                Publish Product
             </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};
