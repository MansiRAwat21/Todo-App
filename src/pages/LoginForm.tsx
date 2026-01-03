// pages/Login.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/auth.api";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const { loginToken } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res: any) => {
      loginToken(res.data);
      toast.success("Logged in successfully")
      navigate("/home");
    },
    onError: (error: any) => {
      const status = error?.response?.status;

      if (status === 401) {
        setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
      } else if (status === 404) {
        setError("email", {
          type: "manual",
          message: "User not found",
        });
      } else {
        toast.error(error?.response?.data?.message || "Login failed");
      }
    },
  });

  const onSubmit = (data: any) => {
    // reset old server errors
    setError("email", {});
    setError("password", {});
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-5 transition-all"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <InputField
          label="Email"
          type="email"
          register={register("email", { required: "Email is required" })}
          error={errors.email}
        />

        <div className="relative">
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            register={register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            error={errors.password}
          />
          <button
            type="button"
            className="absolute right-3 top-8.25 text-gray-500 dark:text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
          </button>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
