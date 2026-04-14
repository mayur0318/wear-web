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
    </header>
  );
};
