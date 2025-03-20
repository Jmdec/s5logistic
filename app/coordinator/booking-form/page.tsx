import React from "react";
import AdminLayout from "@/components/coordinator/AdminLayout"; 
import Table from "@/components/coordinator/booking-form/Form";
 
const BookingForm = () => {
  return (
    <AdminLayout>
      <div>
        
        <Table/>

      </div>
    </AdminLayout>
  );
};

export default BookingForm;


