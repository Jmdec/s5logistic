import React from "react";
import Sidebar from "../../components/accounting/Layout/Sidebar";
import Navbar from "../../components/accounting/Layout/Navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
    <div
      className="lg:w-64 bg-gray-800 text-white "
    >
       <Sidebar/>
    </div>

    <div className="flex-1 flex flex-col">
      {/* <Navbar/> */}

      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>

      <footer className="w-full py-4 bg-white text-red-900 text-center dark:bg-gray-900 dark:text-white">
        <p>© 2025 S5Logistics Admin Panel</p>
      </footer>
    </div>
  </div>

  );
};

export default AdminLayout;
