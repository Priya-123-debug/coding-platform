import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { z } from "zod"; // or 'zod/v4' // use for schema validation for signup form
import { registerUser } from "../store/authSlice";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const signupSchema = z.object({
  firstname: z.string().min(3, "Name should contain at least three character"),
  emailid: z.string().email(),
  password: z.string().min(8, "password should contain atleast 8 character "),
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const submitteddata = (data) => {
    // console.log(data);
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // navigate towards home page
    }
  }, [isAuthenticated, navigate]);
  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };
  return (
    <div className=" flex flex-col items-center justify-center ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex flex-col bg-white p-10 rounded-lg shadow-lg border border-gray-200 justify-center items-center gap-y-6 w-full max-w-xl ml-10"
      >
        <h1 className="text-[50px] mb-12 text-black">Sign up</h1>

        {/* First Name */}
        <input
          {...register("firstname")}
          placeholder="Enter Name"
          className="border border-gray-300 rounded p-2 w-full text-black"
        />
        {errors.firstname && (
          <span className="text-red-600">{errors.firstname.message}</span>
        )}

        {/* Email */}
        <input
          {...register("emailid")}
          type="email"
          placeholder="Enter Email"
          className="border border-gray-300 rounded p-2 w-full text-black"
        />
        {errors.emailid && (
          <span className="text-red-500">{errors.emailid.message}</span>
        )}

        {/* Password with Icon */}
        <div className="relative w-full">
          <input
            {...register("password")}
            type={showPassword ? "password" : "type"}
            placeholder="Enter Password"
            className="border border-gray-300 rounded p-2 w-full text-black pr-10"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>
        <div className="form-control mt-8 flex justify-center">
          <button
            type="submit"
            className={`btn btn-primary ${loading ? loading : ""}`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>

        {/* Link to Login */}
        <p className="text-black mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
