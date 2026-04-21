import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const VendorSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-[10px] px-[10px] py-[9px] rounded-[7px] mb-[1px] transition-colors ${
      isActive
        ? "bg-[#1d4ed8] text-[#ffffff] font-medium"
        : "bg-transparent text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#cbd5e1]"
    } text-[13px]`;

  return (
    <div className="w-[220px] h-[100vh] bg-[#0f172a] flex flex-col fixed left-0 top-0">
      {/* SIDEBAR HEADER */}
      <div className="pt-[20px] px-[18px] pb-[16px] border-b border-solid border-[#1e293b]">
        <div className="text-[#ffffff] text-[15px] font-semibold">Vendor Panel</div>
        <div className="text-[#64748b] text-[11px] mt-0.5">Wear Web</div>
      </div>

      {/* SIDEBAR NAV LINKS */}
      <nav className="flex-1 overflow-y-auto px-[10px] py-[16px] custom-scrollbar">
        {/* MAIN */}
        <div className="text-[#475569] text-[10px] font-semibold tracking-[0.08em] px-[8px] pt-[8px] pb-[4px]">MAIN</div>
        <NavLink to="/vendor/dashboard" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          Dashboard
        </NavLink>

        {/* PRODUCTS */}
        <div className="text-[#475569] text-[10px] font-semibold tracking-[0.08em] px-[8px] pt-[16px] pb-[4px]">PRODUCTS</div>
        <NavLink to="/vendor/products" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          My Products
        </NavLink>
        <NavLink to="/vendor/add-product" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Add Product
        </NavLink>
        <NavLink to="/vendor/inventory" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
          Manage Inventory
        </NavLink>

        {/* SALES */}
        <div className="text-[#475569] text-[10px] font-semibold tracking-[0.08em] px-[8px] pt-[16px] pb-[4px]">SALES</div>
        <NavLink to="/vendor/orders" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125z" /></svg>
          Orders
        </NavLink>
        <NavLink to="/vendor/sales-report" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
          Sales Report
        </NavLink>

        {/* OTHER */}
        <div className="text-[#475569] text-[10px] font-semibold tracking-[0.08em] px-[8px] pt-[16px] pb-[4px]">OTHER</div>
        <NavLink to="/vendor/reviews" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
          Reviews
        </NavLink>
        <NavLink to="/vendor/profile" className={navLinkClass}>
          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          My Store Profile
        </NavLink>
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="p-[10px] border-t border-solid border-[#1e293b]">
        <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-[7px] text-[#ef4444] text-[13px] font-medium hover:bg-[#1e293b] transition-colors">
          <svg className="w-[16px] h-[16px] text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
          Logout
        </button>
      </div>
    </div>
  );
};
