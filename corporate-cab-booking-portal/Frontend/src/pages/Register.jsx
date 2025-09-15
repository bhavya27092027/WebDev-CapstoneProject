import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { request } from "../api";
import { toast } from "react-toastify";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["company", "vendor"], {
    required_error: "Please select a role",
  }),
});

const Register = ({ onRegisterSuccess }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await request("/api/auth/register", "POST", data);

      // Save user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: result.token,
          email: result.user.email,
          role: result.user.role,
          name: result.user.name,
        })
      );
      localStorage.setItem("token", result.token);

      toast.success("Registration successful!");
      onRegisterSuccess?.(result.user);
      window.location.href = "/home"; // ✅ go to home
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center font-['Poppins']">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-['Lato']">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("company")}
                className={`p-4 rounded-lg border flex flex-col items-center ${
                  selectedRole === "company"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Building className="h-6 w-6" />
                <span className="text-sm font-['Lato']">Company</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("vendor")}
                className={`p-4 rounded-lg border flex flex-col items-center ${
                  selectedRole === "vendor"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Truck className="h-6 w-6" />
                <span className="text-sm font-['Lato']">Vendor</span>
              </button>
            </div>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-['Lato']">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-['Lato']">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="border p-2 rounded w-full"
              placeholder="Email address"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-['Lato']">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="border p-2 rounded w-full"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-700 text-white py-2 rounded mt-2"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
