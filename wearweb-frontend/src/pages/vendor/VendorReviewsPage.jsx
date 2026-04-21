import React, { useState, useEffect } from "react";
import { fetchVendorReviews } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";

export const VendorReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVendorReviews().then(res => {
      setReviews(res.data.data || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filteredReviews = reviews.filter(r => 
     (r.productId?.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
     (r.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <VendorLayout>
      <div className="max-w-[1200px] mx-auto">
         <div className="mb-[20px]">
            <h1 className="text-[20px] font-bold text-[#0f172a]">Customer Reviews</h1>
            <p className="text-[13px] text-[#64748b] mt-[3px]">Read feedback on your products</p>
         </div>

         <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden">
            
            <div className="p-[14px_16px] border-b border-solid border-[#e2e5ea]">
               <div className="flex items-center bg-[#f8f9fb] border border-solid border-[#e2e5ea] rounded-[7px] px-[12px] py-[7px] w-full md:w-[350px]">
                  <svg className="w-[14px] h-[14px] text-[#94a3b8] mr-[8px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                     type="text" 
                     placeholder="Search reviews..." 
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
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] w-[25%]">Product</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Customer</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Rating</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea] w-[35%]">Comment</th>
                        <th className="p-[10px_14px] text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] border-b border-solid border-[#e2e5ea]">Date</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan="5" className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d4ed8] mx-auto"></div></td></tr>
                     ) : filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                           <tr key={review._id} className="hover:bg-[#fafbfc] border-b border-solid border-[#f1f3f5]">
                              <td className="p-[12px_14px] text-[13px] font-medium text-[#0f172a] truncate">
                                 {review.productId?.productName || "Unknown"}
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#374151] truncate">
                                 {review.customerId?.userId?.name || review.name || "Anonymous"}
                              </td>
                              <td className="p-[12px_14px]">
                                 <div className="flex gap-[2px] text-[#eab308]">
                                   {[...Array(5)].map((star, i) => (
                                     <svg key={i} className={`w-[14px] h-[14px] ${i < review.rating ? 'fill-current' : 'text-[#cbd5e1]'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                     </svg>
                                   ))}
                                 </div>
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#374151] truncate break-words" title={review.comment}>
                                 "{review.comment}"
                              </td>
                              <td className="p-[12px_14px] text-[13px] text-[#64748b]">
                                 {new Date(review.createdAt).toLocaleDateString()}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5">
                              <div className="p-[40px] flex flex-col items-center text-center">
                                 <svg className="w-[40px] h-[40px] text-[#cbd5e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                 <h3 className="text-[15px] font-medium text-[#374151] mt-[12px]">No reviews</h3>
                                 <p className="text-[13px] text-[#94a3b8] mt-[4px]">You do not have any reviews matching the search.</p>
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
