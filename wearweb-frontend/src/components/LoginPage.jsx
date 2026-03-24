import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const validationSchema = {
    emailValidator: {
      required: {
        value: true,
        message: "email is required*",
      },
    },
    passwordValidator: {
      required: {
        value: true,
        message: "password is required*",
      },
      validate: {
        hasUpperCase: (value) =>
          /[A-Z]/.test(value) || "At least 1 capital letter required",
        hasNumber: (value) =>
          /[0-9]/.test(value) || "At least 1 number required",
        minLength: (value) =>
          value.length >= 8 || "Minimum 8 characters required",
      },
    },
  };

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);
      console.log("response...", res);

      if (res.status === 200) {
        toast.success("Login success");

        switch (res.data.role) {
          case "customer":
            console.log("Welcome Customer");
            navigate("/user");
            break;

          case "admin":
            console.log("Welcome Admin");
            navigate("/admin");
            break;

          case "vendor":
            console.log("Welcome Vendor");
            navigate("/vendor");
            break;

          default:
            toast.error("Invalid Role");
            console.log("Invalid Role");
            navigate("/login");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Login
        </h1>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", validationSchema.emailValidator)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", validationSchema.passwordValidator)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <span className="text-blue-500 cursor-pointer">Register</span>
        </p>
      </div>
    </div>
  );
};
