"use client"
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div
        className={`lg:w-64 bg-gray-800 text-white ${sidebarOpen ? "block" : "hidden"
          } lg:block`}
      >
         <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 bg-gray-50">
          {children}
          <ToastContainer />
        </main>

        <footer className="w-full py-4 bg-white text-red-900 text-center">
          <p>© 2025 S5Logistics Admin Panel</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
