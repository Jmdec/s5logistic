import React from "react";
import AdminLayout from "@/components/coordinator/AdminLayout"; 
import Table from "@/components/coordinator/delay-report/Form";
 
const DelayReport = () => {
  return (
    <AdminLayout>
      <div>
        
        <Table/>

      </div>
    </AdminLayout>
  );
};

export default DelayReport;


