import React from "react";
import { Link } from "react-router-dom";

export const UserNavbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">WearWeb</h1>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>

          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Cart
          </Link>

          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
