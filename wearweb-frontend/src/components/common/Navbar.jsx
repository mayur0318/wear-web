<<<<<<< HEAD
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { toast } from "react-toastify";
import api from '../../services/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  
  const checkAuth = () => {
     const cid = localStorage.getItem("customerId");
     const token = localStorage.getItem("token");
     return !!(cid && cid !== "undefined" && cid !== "null" && cid !== "false" && token);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());
  
  const { cartItems } = useContext(CartContext);
  const totalQuantity = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    setIsLoggedIn(checkAuth());
    // Read userName from localStorage (set during login)
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName.split(" ")[0] || "User");
    }
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await api.get('/category/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    localStorage.removeItem("vendorId");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    setUserName("User");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="w-full bg-[#FFD700] shadow-sm sticky top-0 z-50">
      
      {/* Top Yellow Bar */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between px-4 sm:px-6 py-3 max-w-[1200px] mx-auto gap-4">
        
        {/* Mobile Hamburger Trigger */}
        <button 
           className="lg:hidden text-[#1a1a1a] p-1"
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] tracking-tight italic">
            Wear<span className="text-[#1d6fd8]">Web</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <div className="max-lg:[display:none] flex flex-1 max-w-[400px] mx-4">
          <form className="flex w-full bg-white rounded-[7px] overflow-hidden border border-[#e2e5ea]" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for Products, Brands and More" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-[8px] outline-none text-[#1a1a1a] bg-transparent text-[14px]" 
            />
            <button type="submit" className="px-3 bg-white border-l border-[#e2e5ea] text-[#64748b] hover:text-[#1d6fd8]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          
          {!isLoggedIn ? (
            <div className="max-sm:[display:none] flex items-center gap-[10px]">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-[6px] bg-[#1d6fd8] text-white px-[16px] py-[8px] rounded-[7px] text-[13px] font-[600] border-none transition-colors hover:bg-[#1e40af] cursor-pointer"
              >
                <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="flex items-center gap-[6px] bg-[#ffffff] text-[#1d6fd8] px-[16px] py-[8px] rounded-[7px] text-[13px] font-[600] border-[1.5px] border-solid border-[#1d6fd8] transition-colors hover:bg-[#f0f5ff] cursor-pointer"
              >
                <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </button>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-[6px] text-[#1a1a1a] hover:text-[#1d6fd8] font-[600] text-[14px] transition-colors bg-black/5 px-3 py-1.5 rounded-full cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#1d6fd8] text-white flex items-center justify-center font-bold text-[12px]">
                   {userName.charAt(0).toUpperCase()}
                </div>
                <span className="max-sm:[display:none]">Hi, {userName}</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Enhanced Dropdown */}
              {isProfileOpen && (
                <>
                   <div className="fixed inset-0 z-[999]" onClick={() => setIsProfileOpen(false)}></div>
                   <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-[10px] border border-[#e2e5ea] min-w-[220px] z-[1000] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-2">
                     <div className="px-[16px] py-[12px] border-b border-solid border-[#f1f3f5] mb-1">
                       <p className="text-[14px] font-[600] text-[#0f172a]">{userName}</p>
                       <p className="text-[12px] text-[#64748b]">Welcome back!</p>
                     </div>
                     
                     <Link to="/my-account" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-[10px] px-[16px] py-[10px] text-[13px] text-[#374151] hover:bg-[#f8f9fb] transition-colors">
                        <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        My Account
                     </Link>
                     <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-[10px] px-[16px] py-[10px] text-[13px] text-[#374151] hover:bg-[#f8f9fb] transition-colors">
                        <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        My Orders
                     </Link>
                     <Link to="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-[10px] px-[16px] py-[10px] text-[13px] text-[#374151] hover:bg-[#f8f9fb] transition-colors">
                        <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Wishlist
                     </Link>
                     
                     <div className="border-t border-solid border-[#f1f3f5] my-1"></div>
                     
                     <button onClick={handleLogout} className="w-full text-left flex items-center gap-[10px] px-[16px] py-[10px] text-[13px] text-[#ef4444] hover:bg-[#fef2f2] transition-colors font-medium cursor-pointer border-none bg-transparent">
                        <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                     </button>
                   </div>
                </>
              )}
            </div>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center justify-center p-2 text-[#1a1a1a] hover:text-[#1d6fd8] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[24px] w-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute top-[2px] right-0 bg-[#ef4444] text-white text-[11px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center shadow-sm">
                {totalQuantity}
              </span>
            )}
          </Link>
           
        </div>
      </div>

      {/* Main Horizontal Navigation (Desktop) */}
      <div className="w-full bg-white border-b border-[#e2e5ea] max-lg:[display:none] block">
        <ul className="flex items-center justify-center gap-[28px] max-w-[1200px] mx-auto py-0 text-center m-0 p-0 list-none">
           {[
            {name: 'Home', path: '/'},
            {name: 'New Arrivals', path: '/products?sort=new'},
            {name: 'Categories', path: null, isDropdown: true},
            {name: 'Wishlist', path: '/wishlist'},
            {name: 'Contact Us', path: '/contact'},
            {name: 'About', path: '/about'}
          ].map((item, idx) => (
             <li 
               key={idx} 
               className="relative group p-0 m-0"
               onMouseEnter={() => item.isDropdown && setIsCategoriesOpen(true)}
               onMouseLeave={() => item.isDropdown && setIsCategoriesOpen(false)}
             >
               {item.isDropdown ? (
                 <>
                   <Link 
                     to="#"
                     onClick={(e) => e.preventDefault()}
                     className={`flex items-center gap-1 py-3 text-[14px] font-[500] transition-colors ${location.search.includes('category=') ? 'text-[#1d6fd8]' : 'text-[#374151] hover:text-[#1d6fd8]'}`}
                     style={{ textDecoration: 'none' }}
                   >
                     {item.name}
                     <svg className={`w-3 h-3 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                     </svg>
                   </Link>
                   
                   {/* Categories Dropdown */}
                   {isCategoriesOpen && (
                     <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-[10px] border border-[#e2e5ea] min-w-[200px] z-[1000] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                       <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                         {categories.length > 0 ? (
                           categories.map((cat) => (
                             <Link
                               key={cat._id}
                               to={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                               className="block px-5 py-2.5 text-[13.5px] text-[#475569] hover:bg-[#f0f7ff] hover:text-[#1d6fd8] transition-colors text-left"
                               style={{ textDecoration: 'none' }}
                               onClick={() => setIsCategoriesOpen(false)}
                             >
                               {cat.categoryName}
                             </Link>
                           ))
                         ) : (
                           <p className="px-5 py-3 text-[12px] text-[#94a3b8] italic">No categories found</p>
                         )}
                       </div>
                     </div>
                   )}
                 </>
               ) : (
                 <Link 
                   to={item.path} 
                   className={`block py-3 text-[14px] font-[500] text-[#374151] hover:text-[#1d6fd8] transition-colors ${location.pathname === item.path ? 'text-[#1d6fd8] border-b-2 border-solid border-[#1d6fd8]' : ''}`}
                   style={{ textDecoration: 'none' }}
                 >
                   {item.name}
                 </Link>
               )}
             </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
         <div className="lg:hidden w-full bg-white border-t border-b border-[#e2e5ea] absolute top-full left-0 z-40 shadow-lg">
           <ul className="flex flex-col text-[15px] font-[500] text-[#374151] m-0 p-0 list-none">
              <li className="p-[14px_20px] border-b border-solid border-[#f1f3f5]">
                <form className="flex w-full mb-2" onSubmit={handleSearch}>
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full border border-[#e2e5ea] px-3 py-2 rounded-l-[4px] outline-none text-sm" />
                  <button type="submit" className="bg-[#1a1a1a] text-[#FFD700] px-3 rounded-r-[4px] border-none"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                </form>
              </li>
             {[
               {name: 'Home', path: '/'},
               {name: 'New Arrivals', path: '/products?sort=new'},
               {name: 'Categories', path: null, isDropdown: true},
               {name: 'Wishlist', path: '/wishlist'},
               {name: 'Contact Us', path: '/contact'},
               {name: 'About', path: '/about'}
             ].map((item, idx) => (
               <li key={idx} className="m-0 p-0">
                 {item.isDropdown ? (
                   <>
                     <div 
                       onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                       className={`w-full flex items-center justify-between p-[14px_20px] border-b border-solid border-[#f1f3f5] hover:bg-[#f8f9fb] text-[15px] font-[500] cursor-pointer ${location.search.includes('category=') ? 'text-[#1d6fd8] bg-[#f0f5ff]' : 'text-[#374151]'}`}
                     >
                       {item.name}
                       <svg className={`w-4 h-4 transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </div>
                     {isMobileCategoriesOpen && (
                       <div className="bg-[#f8f9fb] py-1 border-b border-solid border-[#f1f3f5]">
                         {categories.map((cat) => (
                           <Link
                             key={cat._id}
                             to={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                             onClick={() => { setIsMobileMenuOpen(false); setIsMobileCategoriesOpen(false); }}
                             className="block p-[10px_40px] text-[14px] text-[#64748b] hover:text-[#1d6fd8]"
                             style={{ textDecoration: 'none' }}
                           >
                             {cat.categoryName}
                           </Link>
                         ))}
                       </div>
                     )}
                   </>
                 ) : (
                   <Link 
                     to={item.path} 
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={`block p-[14px_20px] border-b border-solid border-[#f1f3f5] hover:bg-[#f8f9fb] hover:text-[#1d6fd8] ${location.pathname === item.path ? 'text-[#1d6fd8] bg-[#f0f5ff]' : ''}`}
                     style={{ textDecoration: 'none' }}
                   >
                     {item.name}
                   </Link>
                 )}
               </li>
             ))}
             {!isLoggedIn && (
               <li className="p-[14px_20px] flex flex-col gap-3">
                 <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="flex items-center justify-center gap-2 w-full bg-[#1d6fd8] text-white py-[10px] rounded-[7px] text-sm font-[600] border-none hover:bg-[#1e40af] transition-colors">
                    <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Login
                 </button>
                 <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="flex items-center justify-center gap-2 w-full bg-white border-[1.5px] border-solid border-[#1d6fd8] text-[#1d6fd8] py-[10px] rounded-[7px] text-sm font-[600] hover:bg-[#f0f5ff] transition-colors">
                    <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Sign Up
                 </button>
               </li>
             )}
           </ul>
         </div>
      )}

=======
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header className="header-style-1 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="top-bar animate-dropdown">
        <div className="container">
          <div className="header-top-inner">
            <div className="cnt-account">
              <ul className="list-unstyled">
                <li className="login">
                  <Link to="/login"><span>Login</span></Link>
                </li>
                <li className="check">
                  <Link to="/signup"><span>Signup</span></Link>
                </li>
              </ul>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="row flex items-center justify-between">
            {/* Logo */}
            <div className="col-xs-12 col-sm-12 col-md-3 logo-holder mt-2">
              <div className="logo">
                <Link to="/">
                  <h1 className="text-3xl font-bold flex items-center">
                    <span className="text-yellow-500 mr-2">Wear</span> Web
                  </h1>
                </Link>
              </div>
            </div>

            {/* Empty space for search holder if you want to add it back later */}
            <div className="col-lg-7 col-md-6 col-sm-8 col-xs-12 top-search-holder">
            </div>

            {/* Cart */}
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12 animate-dropdown top-cart-row mt-2">
              <div className="dropdown dropdown-cart">
                <Link to="/cart" className="dropdown-toggle lnk-cart flex items-center">
                  <div className="items-cart-inner flex items-center space-x-2">
                    <div className="basket text-yellow-500">
                      <i className="fa fa-shopping-cart fa-2x"></i>
                    </div>
                    <div className="total-price-basket pl-2">
                      <span className="lbl text-lg font-bold text-gray-700">Cart</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Menu */}
      <div className="header-nav animate-dropdown">
        <div className="container">
          <div className="yamm navbar navbar-default bg-white shadow-sm" role="navigation">
            <div className="navbar-header">
              <button
                data-target="#mc-horizontal-menu-collapse"
                data-toggle="collapse"
                className="navbar-toggle collapsed"
                type="button"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span> 
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="nav-bg-class">
              <div className="navbar-collapse collapse" id="mc-horizontal-menu-collapse">
                <div className="nav-outer">
                  <ul className="nav navbar-nav flex items-center font-medium">
                    <li className="dropdown">
                      <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? "text-yellow-500 font-bold block py-4 px-6 bg-gray-50" : "text-gray-700 hover:text-yellow-500 block py-4 px-6"}
                      >
                        Home
                      </NavLink>
                    </li>
                    <li className="dropdown">
                      <NavLink 
                        to="/products"
                        className={({ isActive }) => isActive ? "text-yellow-500 font-bold block py-4 px-6 bg-gray-50" : "text-gray-700 hover:text-yellow-500 block py-4 px-6"}
                      >
                        Products
                      </NavLink>
                    </li>
                  </ul>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
    </header>
  );
};
