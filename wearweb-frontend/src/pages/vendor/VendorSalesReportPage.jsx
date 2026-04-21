import React, { useState, useEffect } from "react";
import { fetchVendorReports } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";

export const VendorSalesReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await fetchVendorReports();
        console.log("Vendor Reports:", res.data);
        setReport(res.data.data);
      } catch (err) {
        console.error("Error fetching vendor reports:", err);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  if (loading) return <VendorLayout><div className="flex justify-center items-center h-full py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1d4ed8]"></div></div></VendorLayout>;
  if (!report) return <VendorLayout><div className="flex flex-col items-center justify-center py-20 text-center"><svg className="w-[40px] h-[40px] text-[#cbd5e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3v18h18" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17l4-8 4 4 4-6" /></svg><h3 className="text-[15px] font-medium text-[#374151] mt-[12px]">No report data available</h3><p className="text-[13px] text-[#94a3b8] mt-[4px]">Sales data will appear once orders are placed.</p></div></VendorLayout>;

  return (
    <VendorLayout>
      <div className="max-w-[1200px] mx-auto">
         <div className="mb-[24px]">
            <h1 className="text-[20px] font-bold text-[#0f172a]">Sales Report</h1>
            <p className="text-[13px] text-[#64748b] mt-[3px]">Analytics and overall revenue for your store</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[24px]">
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px]">
              <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Total Revenue</p>
              <p className="text-[24px] font-bold text-[#16a34a] mt-[6px]">₹{report.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px]">
              <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Delivered Orders</p>
              <p className="text-[24px] font-bold text-[#0f172a] mt-[6px]">{report.orderCounts.delivered || 0}</p>
            </div>
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px]">
              <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Pending / Placed</p>
              <p className="text-[24px] font-bold text-[#1d4ed8] mt-[6px]">{report.orderCounts.placed || 0}</p>
            </div>
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] p-[16px_20px]">
              <p className="text-[12px] text-[#64748b] font-medium uppercase tracking-[0.04em]">Cancelled</p>
              <p className="text-[24px] font-bold text-[#dc2626] mt-[6px]">{report.orderCounts.cancelled || 0}</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden p-[20px]">
               <h2 className="text-[15px] font-bold text-[#0f172a] mb-[16px] border-b border-solid border-[#e2e5ea] pb-[16px]">Top Selling Products</h2>
               <div className="flex flex-col gap-[12px]">
                  {report.topProducts.length > 0 ? (
                    report.topProducts.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-[#f8f9fb] p-[12px_16px] rounded-[7px] border border-solid border-[#e2e5ea]">
                         <div className="flex items-center gap-[12px]">
                           <div className="w-[28px] h-[28px] bg-[#dbeafe] text-[#1d4ed8] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0">
                             {idx + 1}
                           </div>
                           <span className="text-[13px] font-medium text-[#0f172a] truncate">{p.productName}</span>
                         </div>
                         <div className="text-right shrink-0 ml-[10px]">
                           <p className="text-[11px] font-medium text-[#64748b]">Sold: {p.totalSold}</p>
                           <p className="text-[14px] font-bold text-[#16a34a]">₹{p.revenue.toLocaleString()}</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-[30px] text-[13px] text-[#64748b]">No products sold yet.</div>
                  )}
               </div>
            </div>

            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden p-[20px]">
               <h2 className="text-[15px] font-bold text-[#0f172a] mb-[16px] border-b border-solid border-[#e2e5ea] pb-[16px]">Lifetime Summary</h2>
               <div className="flex flex-col">
                  <div className="flex justify-between items-center py-[12px] border-b border-solid border-[#f1f3f5]">
                    <span className="text-[13px] font-medium text-[#374151]">Total Products Sold</span>
                    <span className="text-[15px] font-bold text-[#0f172a]">{report.topProducts.reduce((sum, p) => sum + p.totalSold, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-[12px] border-b border-solid border-[#f1f3f5]">
                    <span className="text-[13px] font-medium text-[#374151]">Total Orders (All statuses)</span>
                    <span className="text-[15px] font-bold text-[#0f172a]">
                      {Object.values(report.orderCounts).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-[12px]">
                    <span className="text-[13px] font-medium text-[#374151]">Average Order Value (Est)</span>
                    <span className="text-[15px] font-bold text-[#0f172a]">
                       {report.orderCounts.delivered > 0 ? `₹${Math.round(report.totalRevenue / report.orderCounts.delivered).toLocaleString()}` : "₹0"}
                    </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </VendorLayout>
  );
};
