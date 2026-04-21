import React, { useState, useEffect } from "react";
import { fetchVendorProducts, updateVendorStock } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const VendorInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetchVendorProducts();
      setProducts(res.data.data || []);
      
      const edits = {};
      (res.data.data || []).forEach(p => edits[p._id] = p.stock);
      setStockEdits(edits);
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, val) => {
    setStockEdits({ ...stockEdits, [id]: Number(val) });
  };

  const saveStock = async (id) => {
    try {
      await updateVendorStock(id, stockEdits[id]);
      toast.success("Stock updated successfully");
      setProducts(products.map(p => p._id === id ? { ...p, stock: stockEdits[id] } : p));
    } catch (err) {
      toast.error("Failed to update stock");
    }
  };

  const filteredProducts = products.filter(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));
  const lowStockCount = products.filter(p => p.stock < 5).length;

  return (
    <VendorLayout>
      <div className="max-w-[1200px] mx-auto">
         {/* PAGE HEADING */}
         <div className="mb-[20px]">
            <h1 className="text-[20px] font-bold text-[#0f172a]">Manage Inventory</h1>
            <p className="text-[13px] text-[#64748b] mt-[3px]">Quickly adjust stock quantities for all your products</p>
         </div>

         {/* LOW STOCK ALERT */}
         {lowStockCount > 0 && !loading && (
            <div className="bg-[#fefce8] border border-solid border-[#fde047] rounded-[8px] p-[10px_14px] mb-[20px] flex items-center gap-[10px]">
               <div className="w-[8px] h-[8px] rounded-full bg-[#eab308]"></div>
               <span className="text-[13px] text-[#854d0e] font-medium">
                 {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock (below 5 units).
               </span>
            </div>
         )}

         {/* TABLE CARD WRAPPER */}
         <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden">
            
            {/* TABLE TOOLBAR */}
            <div className="p-[14px_16px] border-b border-solid border-[#e2e5ea] flex flex-row gap-[10px]">
               <div className="flex-1 flex items-center bg-[#f8f9fb] border border-solid border-[#e2e5ea] rounded-[7px] px-[12px] py-[7px]">
                  <svg className="w-[14px] h-[14px] text-[#94a3b8] mr-[8px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                     type="text" 
                     placeholder="Search products..." 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className="bg-transparent border-none outline-none w-full text-[13px] text-[#0f172a]"
                  />
               </div>
               <select className="p-[7px_14px] bg-[#fff] border border-solid border-[#e2e5ea] rounded-[7px] text-[13px] text-[#374151] outline-none">
                  <option>All sizes</option>
                  <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
               </select>
               <select className="p-[7px_14px] bg-[#fff] border border-solid border-[#e2e5ea] rounded-[7px] text-[13px] text-[#374151] outline-none">
                  <option>All stock</option>
                  <option>Low stock</option>
                  <option>Out of stock</option>
               </select>
            </div>

            {loading ? (
               <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d4ed8]"></div></div>
            ) : filteredProducts.length > 0 ? (
               <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-[#f8f9fb]">
                     <tr>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] w-[25%]">Product Name</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Category</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Size</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Color</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Current Stock</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Status</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredProducts.map((product, index) => {
                        const currentStock = stockEdits[product._id] !== undefined ? stockEdits[product._id] : product.stock;
                        const hasChanged = currentStock !== product.stock;
                        const isOut = product.stock === 0;
                        const isLow = product.stock > 0 && product.stock < 5;

                        return (
                           <tr key={product._id} className="hover:bg-[#fafbfc] border-b border-solid border-[#f1f3f5] group">
                              <td className="p-[12px_14px] text-[13px] text-[#0f172a] font-medium truncate" title={product.productName}>
                                 {product.productName}
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#64748b] truncate">
                                 {product.categoryId?.name || product.categoryId?.categoryName || "Unknown"}
                              </td>
                              <td className="p-[12px_14px]">
                                 <span className="bg-[#f1f5f9] p-[2px_8px] rounded-[4px] text-[12px] text-[#374151]">
                                   {product.productSize || product.size || "N/A"}
                                 </span>
                              </td>
                              <td className="p-[12px_14px]">
                                 <div className="flex items-center gap-[6px]">
                                   <div className="w-[12px] h-[12px] rounded-full border border-solid border-[#e2e5ea]" style={{backgroundColor: (product.productColor || product.color || "").toLowerCase().replace(" ","") || '#ccc'}}></div>
                                   <span className="text-[13px] text-[#374151]">{product.productColor || product.color || "None"}</span>
                                 </div>
                              </td>
                              <td className="p-[12px_14px]">
                                 <input 
                                   type="number" 
                                   value={currentStock}
                                   onChange={(e) => handleStockChange(product._id, e.target.value)}
                                   className={`w-[70px] p-[5px_8px] rounded-[5px] text-[13px] text-center outline-none border border-solid ${
                                      isOut ? 'border-[#fca5a5]' : isLow ? 'border-[#fde047]' : 'border-[#e2e5ea]'
                                   } focus:border-[#3b82f6]`}
                                 />
                              </td>
                              <td className="p-[12px_14px]">
                                 <span className={`inline-flex px-[10px] py-[3px] rounded-[20px] text-[11px] font-medium ${
                                    isOut ? 'bg-[#fee2e2] text-[#991b1b]' : 
                                    isLow ? 'bg-[#fef9c3] text-[#854d0e]' : 
                                    'bg-[#dcfce7] text-[#166534]'
                                 }`}>
                                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                 </span>
                              </td>
                              <td className="p-[12px_14px] text-right">
                                 {hasChanged ? (
                                    <button 
                                      onClick={() => saveStock(product._id)}
                                      className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-none rounded-[5px] p-[5px_12px] text-[12px] font-medium cursor-pointer transition-colors"
                                    >
                                      Save
                                    </button>
                                 ) : (
                                    <span className="text-[12px] text-[#94a3b8]">Saved</span>
                                 )}
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
            ) : (
               <div className="p-[40px] flex flex-col items-center text-center">
                  <svg className="w-[40px] h-[40px] text-[#cbd5e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <h3 className="text-[15px] font-medium text-[#374151] mt-[12px]">No products yet</h3>
                  <p className="text-[13px] text-[#94a3b8] mt-[4px]">Add your first product to start managing inventory.</p>
                  <Link to="/vendor/add-product" className="mt-[16px] bg-[#1d4ed8] text-white px-[20px] py-[8px] rounded-[7px] text-[13px] font-medium hover:bg-[#1e40af] transition-colors">
                     Add Product
                  </Link>
               </div>
            )}
         </div>
      </div>
    </VendorLayout>
  );
};
