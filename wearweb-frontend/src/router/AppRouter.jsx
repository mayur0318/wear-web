import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ProductListPage } from "../pages/ProductListPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../components/LoginPage";
import { SignupPage } from "../components/SignupPage";
import { AddProductPage } from "../pages/admin/AddProductPage";
import { ManageProductsPage } from "../pages/admin/ManageProductsPage";
import { OrdersPage } from "../pages/admin/OrdersPage";

const router = createBrowserRouter([
  // User Routes
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductListPage /> },
  { path: "/product/:id", element: <ProductDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },

  // Admin Routes
  { path: "/admin", element: <ManageProductsPage /> },
  { path: "/admin/add-product", element: <AddProductPage /> },
  { path: "/admin/products", element: <ManageProductsPage /> },
  { path: "/admin/orders", element: <OrdersPage /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default AppRouter;
