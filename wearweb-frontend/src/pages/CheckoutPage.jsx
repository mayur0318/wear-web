import React, { useState } from "react";
import { createOrder, makePayment } from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { toast } from "react-toastify";

export const CheckoutPage = () => {
  const [address, setAddress] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return toast.error("Please login first");

      // 1. Create order
      const orderRes = await createOrder({ customerId, address });
      const order = orderRes.data.order || orderRes.data;

      // 2. Mock payment
      await makePayment({ orderId: order._id || order.id, amount: order.totalPrice });
      toast.success("Order placed successfully!");
      window.location.href = "/";
    } catch (error) {
      toast.error("Checkout failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <ul className="list-inline list-unstyled">
              <li><a href="/">Home</a></li>
              <li className="active">Checkout</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="body-content">
        <div className="container">
          <div className="checkout-box">
            <div className="row">
              <div className="col-md-8">
                <div className="panel-group checkout-steps" id="accordion">
                  <div className="panel panel-default checkout-step-01">
                    <div className="panel-heading">
                      <h4 className="unicase-checkout-title">
                        <a data-toggle="collapse" className="" data-parent="#accordion" href="#collapseOne">
                          <span>1</span>Checkout Details
                        </a>
                      </h4>
                    </div>
                    <div id="collapseOne" className="panel-collapse collapse in">
                      <div className="panel-body">
                        <form onSubmit={handleCheckout}>
                          <div className="form-group">
                            <label className="info-title">Shipping Address <span>*</span></label>
                            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="form-control unicase-form-control text-input" required></textarea>
                          </div>
                          <button type="submit" className="btn-upper btn btn-primary checkout-page-button">PLACE ORDER</button>
                        </form>
                      </div>
                    </div>
                  </div>
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
