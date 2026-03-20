import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../components/LoginPage";
import { SignupPage } from "../components/SignUpPage";
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/user",
    element: <UserNavbar />,
  },
  {
    path: "/admin",
    element: <AdminSidebar />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default AppRouter;
