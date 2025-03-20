"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); 
      if (response.ok) {
        toast.success("Reset link sent to your email.");
      } else {
        toast.error(data.error || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error:", error); 
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white p-9 border rounded-lg shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-without-bg.png"
            alt="Logo"
            width={120}
            height={60}
            className="mb-2"
          />
        </div>

        {/* Info Message */}
        <div className="bg-blue-100 text-gray-700 p-3 rounded mb-4 text-center">
          <p className="font-medium">Forgot Your Password?</p>
          <p className="text-sm">
            Enter your email address below, and we'll send you a password reset link.
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border-2 border-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-700 dark:bg-white"
            placeholder="Enter your email"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleForgotPassword}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {/* Back to Login */}
        <div className="mt-4 text-center text-sm">
          <p className="dark:text-gray-800">
            Remembered your password?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
