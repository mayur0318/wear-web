import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { WishlistContext } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';

export const WishlistPage = () => {
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("customerId");

  if (!isLoggedIn) {
     return <Navigate to="/login" replace state={{ message: "Login to view your wishlist" }} />;
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f9fb] min-h-[calc(100vh-200px)] py-[40px]">
        <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px]">
          
          <h1 className="text-[28px] font-[700] text-[#0f172a] mb-[24px]">My Wishlist</h1>
          
          {wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
              {wishlistItems.map((product) => (
                <div key={product._id} className="relative">
                   <ProductCard product={product} />
                   {/* Remove from wishlist button is usually inside ProductCard if ctx provides it, or handled there */}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[12px] border border-solid border-[#e2e5ea] p-[60px_20px] text-center max-w-[600px] mx-auto shadow-sm">
              <svg className="w-[64px] h-[64px] mx-auto text-[#cbd5e1] mb-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-[20px] font-[700] text-[#0f172a] mb-[8px]">Your wishlist is empty</h2>
              <p className="text-[14px] text-[#64748b] mb-[24px]">Save items you love and find them here later.</p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-[#1d6fd8] text-white px-[28px] py-[12px] rounded-[8px] font-[600] text-[14px] hover:bg-[#1e40af] transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
