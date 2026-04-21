import React, { useState, useEffect, useContext } from "react";
import api, { createOrder, makePayment, getCart } from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [shippingDetails, setShippingDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNo: "",
    address: "",
  });

  // Track whether the user's profile already has complete data
  const [hasProfileData, setHasProfileData] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        let customerId = localStorage.getItem("customerId");
        if (!customerId || customerId === "undefined" || customerId === "null") {
          toast.error("Please login to checkout");
          navigate("/login");
          return;
        }

        // Fetch Cart
        const cartRes = await getCart(customerId);
        setCartData(cartRes.data.data);

        // Fetch User Profile
        const userRes = await api.get('/user/user/' + customerId);
        const user = userRes.data.data;

        if (user) {
          const splitName = (user.name || localStorage.getItem("userName") || "").split(" ");
          const fname = splitName[0] || "";
          const lname = splitName.slice(1).join(" ") || "";

          const fetchedDetails = {
            firstname: fname,
            lastname: lname,
            email: user.email || "",
            phoneNo: user.phoneNo || "",
            address: user.address || "",
          };

          setShippingDetails(fetchedDetails);

          // Check if user has a complete profile (address + phone filled)
          const profileComplete =
            fetchedDetails.address.trim() !== "" &&
            fetchedDetails.phoneNo.trim() !== "" &&
            fetchedDetails.firstname.trim() !== "";

          if (profileComplete) {
            setHasProfileData(true);
            setIsEditingDetails(false); // Show summary, not form
          } else {
            setHasProfileData(false);
            setIsEditingDetails(true); // Show editable form
          }
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  const cartItems = cartData?.items || [];
  const subtotal = cartData?.totalPrice || 0;
  const deliveryCharges = 0;
  const grandTotal = subtotal + deliveryCharges;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = () => {
    // Validate before saving
    if (!shippingDetails.firstname.trim()) {
      toast.warning("Please enter your first name");
      return;
    }
    if (!shippingDetails.phoneNo.trim()) {
      toast.warning("Please enter your phone number");
      return;
    }
    if (!shippingDetails.address.trim()) {
      toast.warning("Please enter your delivery address");
      return;
    }
    setIsEditingDetails(false);
  };

  const handlePlaceOrder = async () => {
    if (!shippingDetails.firstname.trim() || !shippingDetails.phoneNo.trim() || !shippingDetails.address.trim()) {
      toast.warning("Please verify your shipping details");
      setIsEditingDetails(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setPlacing(true);

    try {
      const customerId = localStorage.getItem("customerId");

      const orderItems = cartItems.map((item) => ({
        productId: item.productId?._id || item.productId,
        quantity: item.quantity,
        price: item.productId?.productPrice || 0,
      }));

      const orderPayload = {
        customerId,
        firstName: shippingDetails.firstname.trim(),
        lastName: shippingDetails.lastname.trim(),
        email: shippingDetails.email.trim(),
        address: shippingDetails.address.trim(),
        city: "N/A",
        pincode: "000000",
        phoneNo: shippingDetails.phoneNo.trim(),
        items: orderItems,
        totalPrice: grandTotal,
        // paymentMethod is selected on the Payment page
      };

      const orderRes = await createOrder(orderPayload);
      const order = orderRes.data.data || orderRes.data;

      toast.info("Order created! Select your payment method on the next page.");
      navigate(`/payment?orderId=${order._id || order.id}`, {
        state: { orderId: order._id || order.id },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="checkout-page min-h-[50vh] flex items-center justify-center">
          <p className="text-xl animate-pulse text-gray-500 font-semibold">Loading checkout details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="checkout-page min-h-[50vh] flex flex-col items-center justify-center gap-4">
          <h3 className="text-3xl font-bold text-gray-800">Your cart is empty</h3>
          <p className="text-gray-500">Go grab some styles before checking out.</p>
          <a href="/products" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow mt-4">
            Continue Shopping
          </a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* ════ LEFT COLUMN ════ */}
          <div className="flex flex-col gap-6">

            {/* ── Shipping Details Section ── */}
            {!isEditingDetails ? (
              /* ▸ VIEW MODE: Show saved profile details as read-only summary */
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#e8f5e9", color: "#43a047", fontSize: 16 }}>✓</span>
                    <h3 className="text-lg font-bold text-gray-900">Delivery Details</h3>
                  </div>
                </div>

                {/* Name, Email, Phone — read-only */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18, padding: "12px 16px", background: "#f8f9fa", borderRadius: 8 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "#1a1a1a" }}>{shippingDetails.firstname} {shippingDetails.lastname}</p>
                  <p style={{ fontSize: 14, color: "#555" }}>{shippingDetails.email}</p>
                  <p style={{ fontSize: 14, color: "#555" }}>{shippingDetails.phoneNo}</p>
                </div>

                {/* Address — with a Change button */}
                <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "14px 16px", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Delivery Address</p>
                      <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6, whiteSpace: "pre-line" }}>{shippingDetails.address}</p>
                    </div>
                    <button
                      onClick={() => setIsEditingDetails(true)}
                      style={{
                        background: "none",
                        border: "1px solid #2979ff",
                        color: "#2979ff",
                        fontWeight: 600,
                        fontSize: 13,
                        padding: "6px 16px",
                        borderRadius: 6,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#2979ff"; e.target.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "#2979ff"; }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ▸ EDIT MODE: Show the form for filling / updating details */
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-6">
                  {hasProfileData ? "Update Delivery Details" : "Enter Delivery Information"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">First Name</label>
                    <input type="text" name="firstname" value={shippingDetails.firstname} onChange={handleInputChange} className="w-full p-3 border border-gray-300 outline-none rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <input type="text" name="lastname" value={shippingDetails.lastname} onChange={handleInputChange} className="w-full p-3 border border-gray-300 outline-none rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={shippingDetails.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 outline-none rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input type="text" name="phoneNo" value={shippingDetails.phoneNo} onChange={handleInputChange} className="w-full p-3 border border-gray-300 outline-none rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Delivery Address</label>
                    <textarea name="address" value={shippingDetails.address} onChange={handleInputChange} placeholder="Enter your full delivery address..." className="w-full p-3 border border-gray-300 outline-none rounded focus:ring-2 focus:ring-blue-500 bg-white min-h-[100px] resize-y"></textarea>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={handleSaveDetails} className="bg-blue-600 font-bold transition-colors hover:bg-blue-700 text-white px-6 py-3 rounded">
                    Save & Continue
                  </button>
                  {hasProfileData && (
                    <button
                      onClick={() => setIsEditingDetails(false)}
                      style={{
                        background: "none",
                        border: "1px solid #ccc",
                        color: "#666",
                        fontWeight: 600,
                        padding: "12px 24px",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ════ RIGHT COLUMN : Order Summary ════ */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Order Summary</h2>

              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                {cartItems.map((item, index) => (
                  <div className="flex items-center gap-4" key={index}>
                    <img src={item.productId?.imagePath || "/assets/images/products/p1.jpg"} alt={item.productId?.productName} className="w-16 h-16 rounded object-cover border border-gray-100" />
                    <div className="flex-1">
                      <p className="font-semibold text-[14px] text-gray-800 line-clamp-1">{item.productId?.productName || "Product"}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">₹{((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 text-[14px] text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-gray-200">
                  <span className="text-[16px] font-bold text-gray-900">Grand Total</span>
                  <span className="text-[18px] font-bold text-[#157ed2]">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={placing || isEditingDetails} className="w-full bg-[#1d6fd8] hover:bg-[#1558b0] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-white font-bold py-4 rounded-lg text-base shadow-md mt-6 flex items-center justify-center gap-2">
                {placing ? "Creating Order..." : <><span>Continue to Payment</span><span>→</span></>}
              </button>
              {isEditingDetails && <p className="text-xs text-center text-red-500 mt-2">Please save your delivery details first.</p>}

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};
