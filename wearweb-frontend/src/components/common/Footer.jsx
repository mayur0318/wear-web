
import React from 'react';

import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#1a1a1a] text-[#ffffff] py-[32px]">
      <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px]">
         
         <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-[24px] border-b border-solid border-[#333333] pb-[32px] mb-[32px]">
            
            {/* Left Side: Brand */}
            <div className="text-center md:text-left">
              <Link to="/">
                <h2 className="text-[24px] font-[900] tracking-tight italic mb-[8px] text-[#ffffff]">
                  Wear<span className="text-[#FFD700]">Web</span>
                </h2>
              </Link>
              <p className="text-[14px] text-[#a1a1aa] max-w-[300px]">
                Your ultimate fashion marketplace. Shop top brands, latest styles, and exclusive deals.
              </p>
            </div>

            {/* Right Side: Links */}
            <div className="flex flex-wrap justify-center gap-[24px] text-[14px] font-[500]">
               <Link to="/" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">Home</Link>
               <Link to="/products" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">Categories</Link>
               <Link to="/contact" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">Contact</Link>
               <Link to="/about" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">About</Link>
            </div>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-[#a1a1aa]">
            <p>&copy; 2025 Wear Web. All rights reserved.</p>
            <div className="flex gap-[16px] mt-[12px] md:mt-0">
               <span className="hover:text-white cursor-pointer">Privacy Policy</span>
               <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
         </div>
      </div>
    </footer>
  );
};
