import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/api";
import { Navbar } from "./common/Navbar";
import { Footer } from "./common/Footer";

export const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await registerUser({ ...data, role: "customer" });
      if (res.status === 201 || res.status === 200) {
        toast.success("Account created successfully");
        navigate("/login");
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
                <p className="text title-tag-line">Create your new account.</p>
                <form
                  className="register-form outer-top-xs"
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="form-group">
                    <label className="info-title">
                      Name <span>*</span>
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
                    className="btn-upper btn btn-primary checkout-page-button"
                  >
                    Sign Up
                  </button>
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
