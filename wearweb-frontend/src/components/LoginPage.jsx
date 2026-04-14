import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/api";
import { Navbar } from "./common/Navbar";
import { Footer } from "./common/Footer";

export const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await loginUser(data);
      if (res.status === 200) {
        toast.success("Login success");
        localStorage.setItem("customerId", res.data.user?._id || res.data._id);
        
        switch (res.data.role || res.data.user?.role) {
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
            break;
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
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
              <li className="active">Login</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="body-content">
        <div className="container">
          <div className="sign-in-page">
            <div className="row">
              {/* Sign-in */}
              <div className="col-md-6 col-sm-6 sign-in">
                <h4 className="">Sign in</h4>
                <p className="">Hello, Welcome to your account.</p>
                <form className="register-form outer-top-xs" onSubmit={handleSubmit(submitHandler)}>
                  <div className="form-group">
                    <label className="info-title">Email Address <span>*</span></label>
                    <input type="email" {...register("email", { required: true })} className="form-control unicase-form-control text-input" />
                  </div>
                  <div className="form-group">
                    <label className="info-title">Password <span>*</span></label>
                    <input type="password" {...register("password", { required: true })} className="form-control unicase-form-control text-input" />
                  </div>
                  <button type="submit" className="btn-upper btn btn-primary checkout-page-button">Login</button>
                  <a href="/signup" className="forgot-password pull-right">Don't have an account? Sign Up</a>
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
