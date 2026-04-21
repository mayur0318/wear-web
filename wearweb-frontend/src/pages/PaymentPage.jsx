import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { createRazorpayOrder, verifyRazorpayPayment } from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const PaymentPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { clearCart } = useContext(CartContext);

  const orderId =
    new URLSearchParams(window.location.search).get("orderId") ||
    location.state?.orderId;

  const [orderData,     setOrderData]     = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [error,         setError]         = useState("");

  const customerId = localStorage.getItem("customerId");

  /* ── Fetch order ── */
  useEffect(() => {
    if (!orderId || !customerId) {
      setError("Valid order not found. Please return to checkout.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res     = await api.get(`/order/detail/${orderId}`);
        const fetched = res.data?.data || res.data;
        if (!fetched) throw new Error("No order data received");
        if (!fetched.totalPrice && !fetched.totalAmount)
          throw new Error("Order data is incomplete");
        setOrderData(fetched);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, customerId]);

  /* ── Payment handler ── */
  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");
    const amount = orderData.totalPrice || orderData.totalAmount;

    try {
      // Save chosen method to order record
      await api.put(`/order/${orderData._id}/payment-method`, { paymentMethod });

      /* ──── COD ──── */
      if (paymentMethod === "cod") {
        const res = await api.post("/order/confirm-cod", {
          orderId:    orderData._id,
          customerId,
        });
        if (res.data?.success) {
          clearCart();
          toast.success("Order confirmed! 🎉 Pay on delivery.");
          navigate(`/order-success/${orderData._id}`);
        } else {
          setError("Failed to confirm COD order. Please try again.");
          setIsProcessing(false);
        }
        return;
      }

      /* ──── Online (Razorpay handles UPI / Card / NetBanking internally) ──── */
      const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!sdkLoaded) {
        setError("Razorpay failed to load. Please check your connection.");
        setIsProcessing(false);
        return;
      }

      const orderRes = await createRazorpayOrder({
        orderId: orderData._id,
        amount,
        paymentMethod,
      });
      const { razorpayOrderId, razorpayKeyId } = orderRes.data;

      const rzpOptions = {
        key:         razorpayKeyId,
        amount:      amount * 100,
        currency:    "INR",
        name:        "WearWeb",
        description: `Order #${orderData._id}`,
        order_id:    razorpayOrderId,
        prefill: {
          name:    orderData.firstName ? `${orderData.firstName} ${orderData.lastName}` : "Customer",
          contact: orderData.phoneNo || "",
          email:   orderData.email   || "",
        },
        // Pass method hint so Razorpay opens on the right tab
        method: paymentMethod === "upi"        ? { upi: true }
               : paymentMethod === "card"       ? { card: true }
               : paymentMethod === "netbanking" ? { netbanking: true }
               : undefined,
        theme:  { color: "#1d6fd8" },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.warn("Payment cancelled");
          },
        },
        handler: async (response) => {
          try {
            const vRes = await verifyRazorpayPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              orderId:   orderData._id,
              customerId,
            });
            if (vRes.data.success) {
              clearCart();
              navigate(`/order-success/${orderData._id}`);
            }
          } catch (err) {
            setError("Verification failed: " + (err.response?.data?.message || err.message));
          }
        },
      };

      new window.Razorpay(rzpOptions).open();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#1d6fd8] animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading your order…</p>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Fatal error ── */
  if (error && !orderData) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-10 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">❌</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => navigate("/cart")}
              className="bg-[#1d6fd8] hover:bg-[#1558b0] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              ← Back to Cart
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!orderData) return null;

  const amount   = orderData.totalPrice || orderData.totalAmount || 0;
  const delivery = orderData.deliveryCharges || 0;
  const items    = orderData.items || [];
  const isCod    = paymentMethod === "cod";

  /* Payment method definitions */
  const methods = [
    {
      value: "cod",
      icon:  "🚚",
      label: "Cash on Delivery",
      sub:   "Pay when your order arrives at your door",
      badge: null,
    },
    {
      value: "upi",
      icon:  "📱",
      label: "UPI",
      sub:   "Google Pay · PhonePe · BHIM · Paytm",
      badge: "Instant",
    },
    {
      value: "card",
      icon:  "💳",
      label: "Credit / Debit Card",
      sub:   "Visa · Mastercard · RuPay · Amex",
      badge: null,
    },
    {
      value: "netbanking",
      icon:  "🏦",
      label: "Net Banking",
      sub:   "All major Indian banks supported",
      badge: null,
    },
  ];

  return (
    <>
      <Navbar />

      {/* ── Hero gradient bar ── */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1d6fd8] py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white text-lg">💰</div>
            <div>
              <h1 className="text-white text-xl font-bold leading-tight">Complete Your Payment</h1>
              <p className="text-blue-200 text-xs mt-0.5">
                Order&nbsp;
                <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">#{orderId?.slice(-8)}</span>
              </p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-4 text-xs">
            {["Cart", "Checkout", "Payment", "Success"].map((step, i) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-1.5 ${i <= 2 ? "text-white" : "text-blue-400"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${i < 2 ? "bg-white text-[#1d6fd8]" : i === 2 ? "bg-[#1d6fd8] border-2 border-white text-white" : "bg-white/10 text-blue-300"}`}>
                    {i < 2 ? "✓" : i + 1}
                  </div>
                  <span className={i === 2 ? "font-semibold" : ""}>{step}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-px ${i < 2 ? "bg-white/50" : "bg-white/20"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Inline error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-700 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* ══ TWO-COLUMN LAYOUT ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

            {/* ═══ LEFT – Payment methods ═══ */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-base font-bold text-slate-900">Choose Payment Method</h2>
                  <p className="text-xs text-slate-400 mt-0.5">All transactions are secured and encrypted</p>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  {methods.map((m) => {
                    const active = paymentMethod === m.value;
                    return (
                      <label
                        key={m.value}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer
                          transition-all duration-200 select-none
                          ${active
                            ? "border-[#1d6fd8] bg-gradient-to-r from-blue-50 to-sky-50 shadow-md shadow-blue-100"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
                          }`}
                      >
                        {/* Radio */}
                        <input
                          type="radio"
                          name="pm"
                          value={m.value}
                          checked={active}
                          onChange={() => setPaymentMethod(m.value)}
                          className="sr-only"
                        />

                        {/* Icon bubble */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
                          ${active ? "bg-[#1d6fd8]/10" : "bg-slate-100"}`}>
                          {m.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${active ? "text-[#1d6fd8]" : "text-slate-800"}`}>
                              {m.label}
                            </p>
                            {m.badge && (
                              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{m.sub}</p>
                        </div>

                        {/* Check indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                          transition-all ${active ? "border-[#1d6fd8] bg-[#1d6fd8]" : "border-slate-300 bg-white"}`}>
                          {active && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Active left accent */}
                        {active && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#1d6fd8] rounded-r-full" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Security footer */}
                <div className="mx-6 mb-6 mt-2 bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm shrink-0">🔒</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">256-bit SSL Encryption</p>
                    <p className="text-[11px] text-slate-400">Your payment info is never stored on our servers</p>
                  </div>
                  <div className="ml-auto text-slate-300 text-xl shrink-0">
                    <img
                      src="https://razorpay.com/assets/razorpay-glyph.svg"
                      alt="Razorpay"
                      className="w-6 h-6 opacity-40"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                </div>
              </div>

              {/* Info about Razorpay (shown for online methods) */}
              {!isCod && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700">
                  <span className="mt-0.5 text-base">ℹ️</span>
                  <p>
                    Clicking <strong>"Pay Now"</strong> will open the secure Razorpay payment window where you
                    can complete your {paymentMethod === "upi" ? "UPI" : paymentMethod === "card" ? "card" : "net banking"} payment safely.
                    No payment details are shared with WearWeb.
                  </p>
                </div>
              )}
            </div>

            {/* ═══ RIGHT – Order summary ═══ */}
            <div className="flex flex-col gap-4">

              {/* Summary card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-24">
                <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                  <h2 className="text-base font-bold text-slate-900">Order Summary</h2>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Items */}
                <div className="px-5 py-4 flex flex-col gap-3 max-h-56 overflow-y-auto">
                  {items.map((item, idx) => {
                    const name  = item.productId?.productName || "Product";
                    const price = item.price || item.productId?.productPrice || 0;
                    const img   = item.productId?.imagePath || "/assets/images/products/p1.jpg";
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={img}
                            alt={name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                          />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1d6fd8] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <p className="flex-1 text-sm font-medium text-slate-700 truncate">{name}</p>
                        <p className="text-sm font-bold text-slate-900 shrink-0">
                          ₹{(price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Price breakdown */}
                <div className="px-5 pb-5 pt-3 border-t border-dashed border-slate-200">
                  <div className="flex flex-col gap-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-800">₹{(amount - delivery).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className={`font-semibold ${delivery === 0 ? "text-green-600" : "text-slate-800"}`}>
                        {delivery === 0 ? "🎉 FREE" : `₹${delivery.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900">Grand Total</span>
                    <span className="text-xl font-extrabold text-[#1d6fd8]">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* COD notice */}
                {isCod && (
                  <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-700 font-medium">
                    <span>🚚</span> You'll pay <strong>₹{amount.toLocaleString("en-IN")}</strong> when delivered
                  </div>
                )}

                {/* CTA button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-3.5 px-5 rounded-xl text-white text-base font-bold
                      flex items-center justify-center gap-2 transition-all duration-200
                      ${isProcessing
                        ? "bg-slate-300 cursor-not-allowed"
                        : isCod
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-200 hover:shadow-xl active:scale-[0.98]"
                        : "bg-gradient-to-r from-[#1d6fd8] to-[#2563eb] hover:from-[#1558b0] hover:to-[#1d4ed8] shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98]"
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing…
                      </>
                    ) : isCod ? (
                      <><span>✓</span> Confirm COD Order</>
                    ) : (
                      <><span>🔒</span> Pay ₹{amount.toLocaleString("en-IN")}</>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 mt-3 leading-relaxed">
                    By placing this order you agree to our{" "}
                    <span className="underline cursor-pointer hover:text-slate-600">Terms &amp; Conditions</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
