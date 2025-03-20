import React from "react";
import AdminLayout from "@/components/coordinator/AdminLayout"; 
import Table from "@/components/coordinator/pdo-returned/page";
 
const ReturnItems = () => {
  return (
    <AdminLayout>
      <div>
        
        <Table/>

      </div>
    </AdminLayout>
  );
};

export default ReturnItems;


