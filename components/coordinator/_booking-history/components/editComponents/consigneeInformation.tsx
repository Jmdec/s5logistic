import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ConsigneeProps {
  updatedData: {
    id: any;
    consigneeName: string;
    consigneeAddress: string;
    consigneeEmail: string;
    consigneeMobile: string;
  };
  closeModal: () => void;
}

const Consignee: React.FC<ConsigneeProps> = ({ updatedData, closeModal }) => {
  const [consigneeData, setConsigneeData] = useState({
    consigneeName: "",
    consigneeAddress: "",
    consigneeEmail: "",
    consigneeMobile: "",
  });

  useEffect(() => {
    // Populate the state with updatedData when it changes
    if (updatedData) {
      setConsigneeData({
        consigneeName: updatedData.consigneeName || "",
        consigneeAddress: updatedData.consigneeAddress || "",
        consigneeEmail: updatedData.consigneeEmail || "",
        consigneeMobile: updatedData.consigneeMobile || "",
      });
    }
  }, [updatedData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsigneeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const compiledData = {
      consigneeName: consigneeData.consigneeName,
      consigneeAddress: consigneeData.consigneeAddress,
      consigneeEmail: consigneeData.consigneeEmail,
      consigneeMobile: consigneeData.consigneeMobile,
    };
    console.log(compiledData)
    try {
      // Make the API call to update the consignee details
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/updateConsignee/${updatedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compiledData),
      });

      if (response.ok) {
        toast.success("Successfully updated Consignee Details");
        closeModal();
      } else {
        console.error("Error saving data:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="mb-4 overflow-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Consignee Name</label>
        <input
          type="text"
          name="consigneeName"
          value={consigneeData.consigneeName}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <label className="block text-sm font-medium text-gray-700 mt-2">Consignee Address</label>
        <input
          type="text"
          name="consigneeAddress"
          value={consigneeData.consigneeAddress}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <label className="block text-sm font-medium text-gray-700 mt-2">Consignee Email</label>
        <input
          type="email"
          name="consigneeEmail"
          value={consigneeData.consigneeEmail}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <label className="block text-sm font-medium text-gray-700 mt-2">Consignee Mobile</label>
        <input
          type="text"
          name="consigneeMobile"
          value={consigneeData.consigneeMobile}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md"
        >
          Save Changes
        </button>

        <button
          onClick={closeModal}
          className="bg-gray-600 text-white py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Consignee;
