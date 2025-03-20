"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";

interface DataRow {
  id: number;
  returnDate: string;
  productName: string;
  returnReason: string;
  returnQuantity: number;
  condition: string;
  driverName: string;
  returnStatus: string;
  proofOfReturn: string;
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
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/${row.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (onDelete) {
        onDelete();
      }

      onClose();
      
      toast.success("Deleted Successfully!")
    } catch (error) {
       toast.error("Deletion Failed!")
    }
    setLoading(false)
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 ">
      <div className="bg-white p-6 rounded-md border-2 border-black max-sm:top-56 sm:left-[640px]  max-sm:w-72 max-sm:absolute">
        <h2>Are you sure you want to delete this item? {row.productName}</h2>

        <div className="mt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
            disabled={loading}
          >
             {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              "Delete"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReturnItemModal;
