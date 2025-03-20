import React from "react";
import { toast } from "react-toastify";



type Backload = {
  name: string;
  contact: string;
  location: string;
};
interface renderedRow {
  id: number;
  date: string;
 plateNumber:string;
 destination:string;
 products:Product[],
 truckType:string,
 proofOfDelivery:string,
 remarks:string,
totalPayment:number,
 reference:string,
  tripTicket:string,
  bookingCreated:string,
  locationUpdatedby:string,
  locationUpdatedat:string,
 backloads:Backloads[],
   status:string,
   updatedStatus:string,
}
interface Product {
    name: any;
    unit: any;
    quantity: number;
}
interface Backloads {
    name: string;
    contact: any;
    location: string;  
}
interface DeleteBookingHistoryModalProps {
  row: renderedRow;
  onClose: () => void;
  onDelete: (row: renderedRow) => void;  // Update the onDelete type to accept row
}


const DeleteBookingHistoryModal: React.FC<DeleteBookingHistoryModalProps> = ({
  row,
  onClose,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/${row.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

  if (onDelete) {
      onDelete(row); // Pass the row as an argument
    }
      toast.success("Deleted Successfully");
      onClose();
    } catch (error) {
      toast.error("Error deleting item!");
    }
  };

  return (
   <div className="fixed inset-0 flex justify-center items-center p-4 bg-gray-500 bg-opacity-50 z-50">
  <div className="bg-white p-6 rounded-md border-2 border-black max-w-sm w-full">
    <h2 className="text-lg font-semibold mb-4">
      Are you sure you want to delete the item with plate number:{" "}
      {row.plateNumber}?
    </h2>
    <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4">
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
      >
        Delete
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 rounded-md w-full sm:w-auto"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

  );
};

export default DeleteBookingHistoryModal;
