import React from "react";
import AdminLayout from "@/components/coordinator/AdminLayout"; 
import Dashboard from "@/components/coordinator/Dashboard";
 
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


