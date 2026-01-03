// pages/Signup.jsx
import { useForm } from "react-hook-form";
import { InputField } from "../ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/Apis";
import { toast } from "react-toastify";



export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();
  const signupMutation = useSignup();


  const onSubmit = (data: any) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    signupMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Account created successfully 🎉')
        navigate("/login");
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 400) {
          setError("email", {
            type: "manual",
            message: "This email is already registered. Please login instead.",
          });
        } else {
          toast.error(error?.response?.data?.message || "Signup failed");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h2>

        <InputField
          label="Name"
          register={register("name", { required: "Name is required" })}
          error={errors.name}
        />

        <InputField
          label="Email"
          type="email"
          register={register("email", { required: "Email is required" })}
          error={errors.email}
        />

        <InputField
          label="Password"
          type="password"
          register={register("password", {
            required: "Password required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
          error={errors.password}
        />

        <InputField
          label="Confirm Password"
          type="password"
          register={register("confirmPassword", {
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword}
        />

        <button
          disabled={isSubmitting}
          className="w-full bg-primary cursor-pointer hover:bg-primary-hover text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account? <span className="text-primary cursor-pointer">
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
}
