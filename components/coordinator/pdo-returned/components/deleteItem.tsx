import React, { useState } from "react";
import { toast } from "react-toastify";

interface DataRow {
  id: number,
  plateNumber: string;
  completionOfTrip: string;
  status: string;
  arrivalProof: File | null;
  proofOfDelivery: File | null;
}

interface DeleteReturnItemModalProps {
  row: DataRow;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteReturnItemModal: React.FC<DeleteReturnItemModalProps> = ({ row, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned/${row.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (onDelete) {
        onDelete();
      }
      toast.success('Deleted Successfully')
      onClose();
      console.log(`Deleted item with plate number: ${row.plateNumber}`);
    } catch (error) {
      toast.error("Error deleting item!");
    }
    setLoading(false)
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 ">
      <div className="bg-white p-6 rounded-md border-2 border-black w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-sm:top-56 sm:left-[400px] max-sm:w-[260px] max-sm:absolute max-sm:overflow-auto">
        <h2 className="text-lg sm:text-xl font-semibold">Are you sure you want to delete the item with plate number: {row.plateNumber}?</h2>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md sm:w-auto"
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              "Delete Item"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

  );
};

export default DeleteReturnItemModal;
