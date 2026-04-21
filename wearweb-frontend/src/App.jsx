import axios from "axios";
import AppRouter from "./router/AppRouter";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  return (
    <ErrorBoundary>
      <CartProvider>
        <WishlistProvider>
          <AppRouter></AppRouter>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Zoom}
          />
        </WishlistProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
