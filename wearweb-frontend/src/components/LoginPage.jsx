import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/api";
import { Navbar } from "./common/Navbar";
import { Footer } from "./common/Footer";

export const LoginPage = () => {
<<<<<<< HEAD
  const { register, handleSubmit, getValues } = useForm();
=======
  const { register, handleSubmit } = useForm();
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await loginUser(data);
      if (res.status === 200) {
        toast.success("Login success");
<<<<<<< HEAD

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // Store user info (backward compatible)
        const user = res.data.data || res.data.user;
        const userId = user?._id || res.data._id;
        const role = res.data.role || user?.role;

        localStorage.setItem("customerId", userId);
        localStorage.setItem("userName", user?.name || "");
        localStorage.setItem("userRole", role || "customer");

        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "vendor":
            navigate("/vendor");
            break;
=======
        localStorage.setItem("customerId", res.data.user?._id || res.data._id);
        
        switch (res.data.role || res.data.user?.role) {
          case "admin":
            navigate("/admin");
            break;
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
          default:
            navigate("/");
            break;
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const handleForgotPassword = () => {
    const email = getValues("email")?.trim();
    if (!email) {
      toast.warning("Please enter your email address first");
      return;
    }
    navigate("/forgot-password", { state: { email } });
  };

  return (
    <>
      <Navbar />
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <ul className="list-inline list-unstyled">
<<<<<<< HEAD
              <li>
                <a href="/">Home</a>
              </li>
=======
              <li><a href="/">Home</a></li>
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
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
<<<<<<< HEAD
                <form
                  className="register-form outer-top-xs"
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className="form-group">
                    <label className="info-title">
                      Email Address <span>*</span>
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="form-control unicase-form-control text-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="info-title">
                      Password <span>*</span>
                    </label>
                    <input
                      type="password"
                      {...register("password", { required: true })}
                      className="form-control unicase-form-control text-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-upper btn btn-primary checkout-page-button"
                  >
                    Login
                  </button>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >
                    <span
                      onClick={handleForgotPassword}
                      style={{
                        fontSize: "13px",
                        color: "#1d6fd8",
                        fontWeight: "600",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      Forgot Password?
                    </span>
                    <Link
                      to="/signup"
                      style={{
                        fontSize: "13px",
                        color: "#374151",
                        textDecoration: "none",
                      }}
                    >
                      Don't have an account?{" "}
                      <span style={{ color: "#1d6fd8", fontWeight: "600" }}>
                        Sign Up
                      </span>
                    </Link>
                  </div>
=======
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
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
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
