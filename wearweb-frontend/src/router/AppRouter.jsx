import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../components/LoginPage";
import { SignupPage } from "../components/SignupPage";
<<<<<<< HEAD
import { MyAccountPage } from "../pages/MyAccountPage";
import { WishlistPage } from "../pages/WishlistPage";
import { ContactPage } from "../pages/ContactPage";
import { AboutPage } from "../pages/AboutPage";
import { UserOrdersPage } from "../pages/UserOrdersPage";
import { AddProductPage } from "../pages/admin/AddProductPage";
import { ManageProductsPage } from "../pages/admin/ManageProductsPage";
import { EditProductPage } from "../pages/admin/EditProductPage";
import { OrdersPage } from "../pages/admin/OrdersPage";
import { UsersPage } from "../pages/admin/UsersPage";
import { Dashboard } from "../pages/admin/Dashboard";
import { ManageCategoriesPage } from "../pages/admin/ManageCategoriesPage";
import { ManageReviewsPage } from "../pages/admin/ManageReviewsPage";
import { ManageAdminsPage } from "../pages/admin/ManageAdminsPage";

import { VendorRequestsPage } from "../pages/admin/VendorRequestsPage";
import { VendorDashboard } from "../pages/vendor/VendorDashboard";
import { VendorProductsPage } from "../pages/vendor/VendorProductsPage";
import { VendorAddEditProductPage } from "../pages/vendor/VendorAddEditProductPage";
import { VendorInventoryPage } from "../pages/vendor/VendorInventoryPage";
import { VendorOrdersPage } from "../pages/vendor/VendorOrdersPage";
import { VendorOrderDetailPage } from "../pages/vendor/VendorOrderDetailPage";
import { VendorSalesReportPage } from "../pages/vendor/VendorSalesReportPage";
import { VendorReviewsPage } from "../pages/vendor/VendorReviewsPage";
import { VendorProfilePage } from "../pages/vendor/VendorProfilePage";

import { PaymentPage } from "../pages/PaymentPage";
import { OrderSuccessPage } from "../pages/OrderSuccessPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { AdminRouteGuard } from "../components/admin/AdminRouteGuard";

const router = createBrowserRouter([
  // Public Routes
=======
import { AddProductPage } from "../pages/admin/AddProductPage";
import { ManageProductsPage } from "../pages/admin/ManageProductsPage";
import { OrdersPage } from "../pages/admin/OrdersPage";

const router = createBrowserRouter([
  // User Routes
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductListPage /> },
  { path: "/product/:id", element: <ProductDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
<<<<<<< HEAD
  { path: "/payment", element: <PaymentPage /> },
  { path: "/order-success/:orderId", element: <OrderSuccessPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  { path: "/my-account", element: <MyAccountPage /> },
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/orders", element: <UserOrdersPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  // Admin Routes (Protected — admin role required)
  { path: "/admin", element: <AdminRouteGuard><Dashboard /></AdminRouteGuard> },
  { path: "/admin/dashboard", element: <AdminRouteGuard><Dashboard /></AdminRouteGuard> },
  { path: "/admin/add-product", element: <AdminRouteGuard><AddProductPage /></AdminRouteGuard> },
  { path: "/admin/products", element: <AdminRouteGuard><ManageProductsPage /></AdminRouteGuard> },
  { path: "/admin/edit-product/:id", element: <AdminRouteGuard><EditProductPage /></AdminRouteGuard> },
  { path: "/admin/orders", element: <AdminRouteGuard><OrdersPage /></AdminRouteGuard> },
  { path: "/admin/users", element: <AdminRouteGuard><UsersPage /></AdminRouteGuard> },
  { path: "/admin/categories", element: <AdminRouteGuard><ManageCategoriesPage /></AdminRouteGuard> },
  { path: "/admin/reviews", element: <AdminRouteGuard><ManageReviewsPage /></AdminRouteGuard> },
  { path: "/admin/vendor-requests", element: <AdminRouteGuard><VendorRequestsPage /></AdminRouteGuard> },
  { path: "/admin/manage-admins", element: <AdminRouteGuard><ManageAdminsPage /></AdminRouteGuard> },

  // Vendor Routes
  { path: "/vendor", element: <VendorDashboard /> },
  { path: "/vendor/dashboard", element: <VendorDashboard /> },
  { path: "/vendor/products", element: <VendorProductsPage /> },
  { path: "/vendor/add-product", element: <VendorAddEditProductPage /> },
  { path: "/vendor/edit-product/:id", element: <VendorAddEditProductPage /> },
  { path: "/vendor/inventory", element: <VendorInventoryPage /> },
  { path: "/vendor/orders", element: <VendorOrdersPage /> },
  { path: "/vendor/orders/:id", element: <VendorOrderDetailPage /> },
  { path: "/vendor/sales-report", element: <VendorSalesReportPage /> },
  { path: "/vendor/reviews", element: <VendorReviewsPage /> },
  { path: "/vendor/profile", element: <VendorProfilePage /> },
=======
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },

  // Admin Routes
  { path: "/admin", element: <ManageProductsPage /> },
  { path: "/admin/add-product", element: <AddProductPage /> },
  { path: "/admin/products", element: <ManageProductsPage /> },
  { path: "/admin/orders", element: <OrdersPage /> },
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
]);

const AppRouter = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default AppRouter;
