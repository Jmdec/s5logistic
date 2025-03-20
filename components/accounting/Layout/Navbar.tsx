'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { ThemeSwitch } from "@/components/theme-switch";

const Navbar = () => {
  const router = useRouter();
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user_id");

      destroyCookie(null, "token", { path: "/" });
      destroyCookie(null, "role", { path: "/" });

      console.log("User logged out successfully.");

      setTimeout(() => {
        router.replace("/auth/login");
      }, 500);
    }
  };


  return (
    <div className="bg-white border-b-1 border-gray-200 text-white p-3 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">S5 Logistics Inc.</h1>
        <div className="flex items-center space-x-5 ">
          <ThemeSwitch />
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
