import React from "react";
import AdminLayout from "@/components/admin/AdminLayout"; 
import Dashboard from "@/components/admin/Dashboard";
 
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


