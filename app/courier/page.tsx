import React from "react";
import AdminLayout from "@/components/courier/Layout"; 
import Dashboard from "@/components/courier/Dashboard";
 
const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div>
        
        <Dashboard/>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;


