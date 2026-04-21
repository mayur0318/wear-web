import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import api, { addVendorProduct, updateVendorProduct, fetchVendorProducts } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";

export const VendorAddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, reset } = useForm();
  const isEdit = Boolean(id);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Fetch categories
    api.get("/category/categories").then(res => setCategories(res.data.data)).catch(console.error);

    if (isEdit) {
      // Fetch existing product
      fetchVendorProducts().then(res => {
        const prod = (res.data.data || []).find(p => p._id === id);
        if (prod) {
          setValue("productName", prod.productName);
          setValue("description", prod.productDescription || prod.description);
          setValue("price", prod.productPrice || prod.price);
          setValue("size", prod.productSize || prod.size);
          setValue("color", prod.productColor || prod.color);
          setValue("stock", prod.stock);
          setValue("categoryId", prod.categoryId._id || prod.categoryId);
          setPreview(prod.imagePath || prod.imageUrl);
        } else {
          toast.error("Product not found");
          navigate("/vendor/products");
        }
      }).catch(console.error);
    }
  }, [id, isEdit, setValue, navigate]);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      
      const options = {
        maxSizeMB: 0.5, // 500KB maximum
        maxWidthOrHeight: 1200, 
        useWebWorker: true,
      };

      try {
        setIsCompressing(true);
        const compressedFile = await imageCompression(originalFile, options);
        setFile(compressedFile);
        setPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Compression warning:", error);
        // Fallback to original if compression randomly fails
        setFile(originalFile);
        setPreview(URL.createObjectURL(originalFile));
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append("imageUrl", file);

    try {
      if (isEdit) {
        await updateVendorProduct(id, formData);
        toast.success("Product updated successfully");
      } else {
        if (!file) return toast.error("Product image is required for new products");
        await addVendorProduct(formData);
        toast.success("Product created successfully");
      }
      navigate("/vendor/products");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save product";
      console.error("Product save error:", err.response?.data || err.message);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <div className="max-w-[800px] mx-auto">
         <div className="mb-[20px] flex justify-between items-center">
            <div>
               <h1 className="text-[20px] font-bold text-[#0f172a]">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
               <p className="text-[13px] text-[#64748b] mt-[3px]">Fill in the details to list your item.</p>
            </div>
            <button type="button" onClick={() => navigate(-1)} className="bg-[#ffffff] flex items-center gap-[5px] border border-solid border-[#e2e5ea] text-[#374151] hover:bg-[#f8f9fb] rounded-[7px] px-[12px] py-[6px] text-[13px] font-medium transition-colors">
               <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back
            </button>
         </div>

         <form onSubmit={handleSubmit(submitHandler)} className="bg-[#ffffff] p-[24px] rounded-[10px] border border-solid border-[#e2e5ea] flex flex-col gap-[20px]">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
               <div className="col-span-2 md:col-span-1">
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Product Name *</label>
                 <input type="text" {...register("productName", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" placeholder="e.g. Vintage Denim Jacket" />
               </div>

               <div className="col-span-2 md:col-span-1">
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Category *</label>
                 <select {...register("categoryId", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] bg-white focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                 </select>
               </div>

               <div className="col-span-2">
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Description</label>
                 <textarea {...register("description")} rows="4" className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all resize-y" placeholder="Detailed product description..."></textarea>
               </div>

               <div>
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Price (₹) *</label>
                 <input type="number" step="0.01" {...register("price", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" />
               </div>

               <div>
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Stock Quantity *</label>
                 <input type="number" {...register("stock", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" />
               </div>

               <div>
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Size *</label>
                 <input type="text" {...register("size", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" placeholder="S, M, L, XL" />
               </div>

               <div>
                 <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Color *</label>
                 <input type="text" {...register("color", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" placeholder="Red, Blue, etc." />
               </div>

               <div className="col-span-2 mt-[10px]">
                  <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Product Image {isEdit ? '' : '*'}</label>
                  <div className="flex items-center gap-[20px]">
                     <div className="w-[120px] h-[120px] border-2 border-dashed border-[#cbd5e1] rounded-[10px] flex justify-center items-center overflow-hidden bg-[#f8f9fb] relative cursor-pointer hover:bg-[#f1f5f9] transition-colors shrink-0 group">
                        <input type="file" accept="image/*" onChange={onFileChange} disabled={isCompressing} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                        {isCompressing ? (
                           <div className="flex flex-col items-center">
                              <div className="w-[20px] h-[20px] rounded-full border-2 border-solid border-[#1d4ed8] border-t-transparent animate-spin mb-[4px]"></div>
                              <span className="text-[12px] text-[#1d4ed8] font-medium">Compressing...</span>
                           </div>
                        ) : preview ? (
                           <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                           <div className="flex flex-col items-center">
                              <svg className="w-[24px] h-[24px] text-[#94a3b8] mb-[4px] group-hover:text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/></svg>
                              <span className="text-[12px] text-[#94a3b8] font-medium group-hover:text-[#64748b]">Upload</span>
                           </div>
                        )}
                     </div>
                     <div className="flex-1 text-[13px] text-[#64748b]">
                        Upload a high-quality rectangular image of the product. Minimum 500x500px recommended. <br /> (JPG, PNG, WebP format allowed)
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-[10px] pt-[20px] border-t border-solid border-[#e2e5ea] flex justify-end gap-[10px]">
               <button type="button" onClick={() => navigate("/vendor/products")} className="bg-[#ffffff] border border-solid border-[#e2e5ea] text-[#374151] hover:bg-[#f8f9fb] rounded-[7px] px-[18px] py-[8px] text-[13px] font-medium transition-colors">
                 Cancel
               </button>
               <button type="submit" disabled={loading || isCompressing} className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-none rounded-[7px] px-[18px] py-[8px] text-[13px] font-medium cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-[8px]">
                 {(loading || isCompressing) && <div className="w-[14px] h-[14px] rounded-full border-2 border-solid border-[#ffffff] border-t-transparent animate-spin"></div>}
                 {isEdit ? 'Save Changes' : 'Publish Product'}
               </button>
            </div>
         </form>
      </div>
    </VendorLayout>
  );
};
