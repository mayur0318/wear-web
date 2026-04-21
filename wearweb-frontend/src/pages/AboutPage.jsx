import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#ffffff] min-h-[calc(100vh-200px)] pt-[60px] pb-[80px]">
        <div className="max-w-[1000px] mx-auto px-[20px] lg:px-[32px] text-center">
           
           <h1 className="text-[32px] md:text-[40px] font-[800] text-[#0f172a] mb-[16px]">About Wear Web</h1>
           <p className="text-[16px] text-[#64748b] leading-[1.6] max-w-[700px] mx-auto mb-[48px]">
             Wear Web is an evolving fashion ecommerce marketplace designed to bridge the gap between trending apparel bands, talented independent vendors, and fashion-conscious customers searching for their next perfect piece.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mb-[64px]">
             
             <div className="bg-[#f8f9fb] rounded-[10px] p-[32px] text-center shadow-sm">
                <div className="text-[36px] font-[800] text-[#1d6fd8] mb-[8px]">500+</div>
                <div className="text-[14px] font-[600] text-[#64748b] tracking-wide uppercase">Brands Available</div>
             </div>

             <div className="bg-[#f8f9fb] rounded-[10px] p-[32px] text-center shadow-sm">
                <div className="text-[36px] font-[800] text-[#1d6fd8] mb-[8px]">10,000+</div>
                <div className="text-[14px] font-[600] text-[#64748b] tracking-wide uppercase">Unique Products</div>
             </div>

             <div className="bg-[#f8f9fb] rounded-[10px] p-[32px] text-center shadow-sm">
                <div className="text-[36px] font-[800] text-[#1d6fd8] mb-[8px]">50,000+</div>
                <div className="text-[14px] font-[600] text-[#64748b] tracking-wide uppercase">Happy Customers</div>
             </div>

           </div>

           <div className="text-left bg-[#FFD700] rounded-[12px] p-[40px] relative overflow-hidden flex flex-col md:flex-row items-center gap-[30px]">
             <div className="flex-1 z-10">
               <h2 className="text-[24px] font-[800] text-[#1a1a1a] mb-[12px]">Our Mission</h2>
               <p className="text-[15px] text-[#1a1a1a] leading-[1.6] opacity-90 max-w-[500px]">
                 We believe shopping for clothes should be as joyful as wearing them. Our goal is to build a unified platform offering vast choices, deeply seamless interfaces, and a robust ordering system giving you complete confidence every time you tap "Checkout".
               </p>
             </div>
             <div className="hidden md:flex w-[150px] h-[150px] bg-white rounded-full items-center justify-center shrink-0 z-10 shadow-lg">
               <span className="text-[42px]">🚀</span>
             </div>
           </div>

        </div>
      </div>
      <Footer />
    </>
  );
};
