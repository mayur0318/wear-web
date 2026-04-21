import React from "react";
import { VendorSidebar } from "./VendorSidebar";
import { useLocation } from "react-router-dom";

export const VendorLayout = ({ children }) => {
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Vendor";
  const initials = userName.substring(0, 2).toUpperCase();

  // Helper to get robust page title from path
  const getPageTitle = (path) => {
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("inventory")) return "Manage Inventory";
    if (path.includes("add-product")) return "Add Product";
    if (path.includes("edit-product")) return "Edit Product";
    if (path.includes("products")) return "My Products";
    if (path.includes("orders/") && path.length > 20) return "Order Detail";
    if (path.includes("orders")) return "Orders";
    if (path.includes("sales-report")) return "Sales Report";
    if (path.includes("reviews")) return "Reviews";
    if (path.includes("profile")) return "My Store Profile";
    return "Vendor Panel";
  };

  return (
    <div className="flex h-[100vh] w-full font-sans bg-[#f8f9fb]">
      
      {/* Sidebar - fixed left */}
      <VendorSidebar />

      {/* Main Content Area - shifts right */}
      <div className="flex-1 flex flex-col ml-[220px]">
        
        {/* TOP BAR */}
        <header className="h-[56px] bg-[#ffffff] border-b border-solid border-[#e2e5ea] px-[24px] flex items-center justify-between shrink-0">
           <div className="text-[17px] font-semibold text-[#0f172a]">
              {getPageTitle(location.pathname)}
           </div>
           
           <div className="flex items-center gap-[10px]">
              <span className="text-[#64748b] text-[12px]">{userName}</span>
              <div className="w-[32px] h-[32px] rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[12px] font-semibold flex items-center justify-center">
                 {initials}
              </div>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-[24px] bg-[#f8f9fb]">
            {children}
        </main>

      </div>
    </div>
  );
};
