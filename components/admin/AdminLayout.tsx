"use client"
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`lg:w-64 bg-gray-800 text-white ${sidebarOpen ? "block" : "hidden"
          } lg:block flex-shrink-0`}
      >
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
          <ToastContainer />
        </main>
      </div>
    </div>

  );
};

export default AdminLayout;
