import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/api";
import api from "../services/api";

import { Navbar } from "./common/Navbar";
import { Footer } from "./common/Footer";

export const SignupPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");

  const submitHandler = async (data) => {
    try {
      if (role === "vendor") {
        const res = await api.post("/api/auth/vendor-signup", { ...data, role: "vendor" });
        if (res.status === 201 || res.status === 200) {
          toast.success(res.data.message || "Your vendor account is under review. Admin will approve it shortly.");
          navigate("/login");
        }
      } else {
        const res = await registerUser({ ...data, role: "customer" });
        if (res.status === 201 || res.status === 200) {
          toast.success("Account created successfully. Please login to continue.");
          navigate("/login");
        }

      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <ul className="list-inline list-unstyled">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="active">Signup</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="body-content">
        <div className="container">
          <div className="sign-in-page">
            <div className="row">
              <div className="col-md-6 col-sm-6 create-new-account">
                <h4 className="checkout-subtitle">Create a new account</h4>
                <p className="text title-tag-line">Choose your account type and fill in the details.</p>

                {/* Role Toggle */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => { setRole("customer"); reset(); }}
                    style={{
                      flex: 1, padding: '10px',
                      backgroundColor: role === "customer" ? '#0f6cb2' : '#e0e0e0',
                      color: role === "customer" ? '#fff' : '#333',
                      border: 'none', borderRadius: '4px', fontWeight: 'bold'
                    }}
                  >
                    Sign up as Customer
                  </button>
                  <button
                    onClick={() => { setRole("vendor"); reset(); }}
                    style={{
                      flex: 1, padding: '10px',
                      backgroundColor: role === "vendor" ? '#0f6cb2' : '#e0e0e0',
                      color: role === "vendor" ? '#fff' : '#333',
                      border: 'none', borderRadius: '4px', fontWeight: 'bold'
                    }}
                  >
                    Sign up as Vendor
                  </button>
                </div>

                <form
                  className="register-form outer-top-xs"
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="form-group">
                    <label className="info-title">
                      {role === "vendor" ? "Owner Name" : "Name"} <span>*</span>

                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      {...register("name", { required: true })}
                      className="form-control unicase-form-control text-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="info-title">
                      Email Address <span>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", { required: true })}
                      className="form-control unicase-form-control text-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="info-title">
                      Phone Number <span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      {...register("phoneNo", { required: true })}
                      className="form-control unicase-form-control text-input"
                    />
                  </div>

                  {role === "vendor" && (
                    <>
                      <div className="form-group">
                        <label className="info-title">
                          Shop Name <span>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your shop name"
                          {...register("shopName", { required: true })}
                          className="form-control unicase-form-control text-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="info-title">
                          Shop Address <span>*</span>
                        </label>
                        <textarea
                          placeholder="Enter store full address"
                          {...register("address", { required: true })}
                          className="form-control unicase-form-control text-input"
                          style={{ minHeight: '80px' }}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="info-title">
                      Password <span>*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      {...register("password", { required: true })}
                      className="form-control unicase-form-control text-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-upper btn btn-primary checkout-page-button w-100"
                    style={{ width: "100%", padding: "12px", fontSize: "16px", marginTop: "10px" }}
                  >
                    {role === "vendor" ? "Submit Application" : "Sign Up"}
                  </button>
                  <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <Link to="/login" className="forgot-password">Already have an account? Log In</Link>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
