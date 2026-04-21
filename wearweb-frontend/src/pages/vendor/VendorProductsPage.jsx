import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchVendorProducts, deleteVendorProduct } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { toast } from "react-toastify";

export const VendorProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetchVendorProducts();
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteVendorProduct(id);
      toast.success("Product deleted successfully");
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => 
     p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (p.categoryId && p.categoryId.categoryName && p.categoryId.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <VendorLayout>
      <div className="max-w-[1200px] mx-auto">
         <div className="mb-[20px] flex justify-between items-center">
           <div>
              <h1 className="text-[20px] font-bold text-[#0f172a]">My Products</h1>
           </div>
           <Link to="/vendor/add-product" className="bg-[#1d4ed8] text-white px-[18px] py-[8px] rounded-[7px] text-[13px] font-medium hover:bg-[#1e40af] transition-colors">
              Add Product
           </Link>
         </div>

         <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden">
            <div className="p-[14px_16px] border-b border-solid border-[#e2e5ea]">
               <div className="flex items-center bg-[#f8f9fb] border border-solid border-[#e2e5ea] rounded-[7px] px-[12px] py-[7px] w-full md:w-[300px]">
                  <svg className="w-[14px] h-[14px] text-[#94a3b8] mr-[8px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                     type="text" 
                     placeholder="Search products..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="bg-transparent border-none outline-none w-full text-[13px] text-[#0f172a]"
                  />
               </div>
            </div>

            <div className="w-full">
               <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-[#f8f9fb]">
                     <tr>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] w-[35%]">Product</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Category</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Price</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Stock</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan="5" className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d4ed8] mx-auto"></div></td></tr>
                     ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                           <tr key={product._id} className="hover:bg-[#fafbfc] border-b border-solid border-[#f1f3f5]">
                              <td className="p-[12px_14px]">
                                 <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] border border-solid border-[#e2e5ea] rounded-[5px] overflow-hidden shrink-0 flex items-center justify-center bg-[#f8f9fb]">
                                      {(product.imagePath || product.imageUrl) ? (
                                         <img src={product.imagePath || product.imageUrl} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                         <svg className="w-[20px] h-[20px] text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                      )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                       <p className="font-medium text-[#0f172a] text-[13px] truncate">{product.productName}</p>
                                       <p className="text-[11px] text-[#64748b] mt-[2px]">{product.productColor || product.color || "No color"} &bull; {product.productSize || product.size || "No size"}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#64748b] truncate">
                                 {product.categoryId?.name || product.categoryId?.categoryName || product.category || "Unknown"}
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#0f172a] font-medium">
                                 {(product.productPrice != null || product.price != null) ? `₹${product.productPrice || product.price}` : "N/A"}
                              </td>
                              <td className="p-[12px_14px]">
                                 <span className={`inline-flex px-[10px] py-[3px] rounded-[20px] text-[11px] font-medium ${product.stock > 5 ? 'bg-[#dcfce7] text-[#166534]' : product.stock > 0 ? 'bg-[#fef9c3] text-[#854d0e]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                                    {product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                 </span>
                              </td>
                              <td className="p-[12px_14px] text-right">
                                 <div className="flex justify-end gap-[8px]">
                                    <Link to={`/vendor/edit-product/${product._id}`} className="bg-[#ffffff] border border-solid border-[#e2e5ea] text-[#374151] hover:bg-[#f8f9fb] rounded-[7px] px-[12px] py-[6px] text-[12px] font-medium transition-colors">Edit</Link>
                                    <button onClick={() => handleDelete(product._id)} className="bg-[#fee2e2] text-[#991b1b] border-none rounded-[7px] px-[12px] py-[6px] text-[12px] font-medium cursor-pointer hover:bg-[#fca5a5] transition-colors">Delete</button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5">
                              <div className="p-[40px] flex flex-col items-center text-center">
                                 <svg className="w-[40px] h-[40px] text-[#cbd5e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                 <h3 className="text-[15px] font-medium text-[#374151] mt-[12px]">No products yet</h3>
                                 <p className="text-[13px] text-[#94a3b8] mt-[4px]">Add your first product to start managing your catalog.</p>
                                 <Link to="/vendor/add-product" className="mt-[16px] bg-[#1d4ed8] text-white px-[20px] py-[8px] rounded-[7px] text-[13px] font-medium hover:bg-[#1e40af] transition-colors">
                                    Add Product
                                 </Link>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </VendorLayout>
  );
};
