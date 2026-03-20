import React from "react";
import { Link } from "react-router-dom";

export const AdminSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="flex flex-col p-4 space-y-3">
          <Link
            to="/admin/dashboard"
            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Manage Products
          </Link>

          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Orders
          </Link>

          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Users
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-red-500 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
};
