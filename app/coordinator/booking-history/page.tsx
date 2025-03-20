import React from "react";
import AdminLayout from "@/components/coordinator/AdminLayout"; 
import Table from "@/components/coordinator/booking-history/Table";
 
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


