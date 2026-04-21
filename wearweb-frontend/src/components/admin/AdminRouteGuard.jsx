import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AdminRouteGuard — Protects /admin routes.
 * Checks localStorage for auth token and admin role.
 * - No token → redirect to /login
 * - Role ≠ "admin" → redirect to /unauthorized
 * - Admin → render children
 */
export const AdminRouteGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Not logged in at all
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin
  if (userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Admin — allow access
  return children;
};
