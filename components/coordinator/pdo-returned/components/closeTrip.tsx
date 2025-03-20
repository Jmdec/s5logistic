"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";

interface CloseTripProps {
  onClose: () => void;
  onSubmit: (id: string) => void;
  row: any;
}

const CloseTrip: React.FC<CloseTripProps> = ({ onClose, onSubmit, row }) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();

    if (row.id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned/close-trip/${row.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          onSubmit(row.id);
          toast.success(data.message);
        } else {
          toast.error(data.message || 'Error closing trip');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to close the trip.');
      }
    }
    setLoading(false)
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl max-sm:top-52 sm:left-[400px] max-sm:w-[300px] max-sm:absolute max-sm:overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Close Trip</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm sm:text-base">Are you sure you want to close the trip with: {row.plateNumber}?</p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                'Close Trip'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default CloseTrip;
