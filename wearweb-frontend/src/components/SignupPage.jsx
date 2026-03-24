import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const validationSchema = {
    firstNameValidator: {
      required: {
        value: true,
        message: "firstname is required*",
      },
      maxLength: {
        value: 20,
        message: "max 20 char is allowed*",
      },
    },
    lastNameValidator: {
      required: {
        value: true,
        message: "lastname is required*",
      },
      maxLength: {
        value: 20,
        message: "max 20 char is allowed*",
      },
    },
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

  // const submitHandler = async (data) => {
  //   console.log("data ->", data);
  //   const res = await axios.post("/user/register", data);

  //   console.log("res", res);
  //   console.log("res.data..", res.data);
  //   console.log("res.data.data..", res.data.data);
  //   console.log("res.status..", res.status);
  //   toast.success("User registered successfully");
  //   navigate("/login");
  // };

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/register", data);
      if (res.status == 201) {
        toast.success("User registered successfully");
        navigate("/login");
      } else {
      }
    } catch (err) {
      console.log("error->", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              placeholder="firstname"
              {...register("firstname", validationSchema.firstNameValidator)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="lastname"
              {...register("lastname", validationSchema.lastNameValidator)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer">Login</span>
        </p>
      </div>
    </div>
  );
};
