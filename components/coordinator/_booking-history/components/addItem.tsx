  import React, { useState, FormEvent, ChangeEvent } from "react";
  import { CalendarIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

  interface AddBookingHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
  updateTable: (newData: DataRow) => void;
  }

  interface DataRow {
    plateNumber: string;
    arrivalProof: File | null; // File
    proofOfDelivery: File | null; // File
    completionOfTrip: string; // String
    status: string; // Dropdown
  }

  const AddBookingHistoryModal: React.FC<AddBookingHistoryModalProps> = ({
    isOpen,
    onClose,
    updateTable,
  }) => {
    const [formData, setFormData] = useState<DataRow>({
      plateNumber: "",
      arrivalProof: null,
      proofOfDelivery: null,
      completionOfTrip: "",
      status: "Pending", // Default value
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const file = e.target.files ? e.target.files[0] : null;
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    };
    
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("plateNumber", formData.plateNumber);
    formDataToSend.append("completionOfTrip", formData.completionOfTrip);
    formDataToSend.append("status", formData.status);

    if (formData.arrivalProof) {
      formDataToSend.append("arrivalProof", formData.arrivalProof);
    }
    if (formData.proofOfDelivery) {
      formDataToSend.append("proofOfDelivery", formData.proofOfDelivery);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const responseData = await response.json();
      toast.success("Item added successfully!");

      // Pass the new item data to update the table
      updateTable(responseData);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add item. Please try again.");
    }
  };



    if (!isOpen) return null;

    return (
      <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-bold mb-6">Add Return Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Plate Number:</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg  bg-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Arrival Proof:</label>
              <input
                type="file"
                name="arrivalProof"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg  bg-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Proof of Delivery:</label>
              <input
                type="file"
                name="proofOfDelivery"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg  bg-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Completion of Trip:</label>
              <input
                type="text"
                name="completionOfTrip"
                value={formData.completionOfTrip}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg  bg-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Status:</label>
  <input
                type="text"
                name="status"
            value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                required
              />

              {/* <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select> */}
            </div>

            <div className="flex justify-end gap-5">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>

                <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
            </div>
          </form>

      
        </div>
      </div>
    );
  };

  export default AddBookingHistoryModal;
