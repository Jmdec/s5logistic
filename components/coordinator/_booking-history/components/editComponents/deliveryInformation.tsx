import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface DeliveryInformationProps {
  updatedData: any; // Initial data for rendering the form (can be more specific type)
  closeModal: () => void;

}

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
  updatedData,
  closeModal,

}) => {
  // Local state to manage form data, initially set to updatedData values
  const [localData, setLocalData] = useState({
    senderName: "",
    transportMode: "",
    deliveryType: "",
    journeyType: "",
    dateFrom: "",
    dateTo: "",
    origin: "",
    destination: "",
    eta: "",
  });

  // Update localData when updatedData changes
  useEffect(() => {
    setLocalData({
      senderName: updatedData.senderName || "",
      transportMode: updatedData.transportMode || "",
      deliveryType: updatedData.deliveryType || "",
      journeyType: updatedData.journeyType || "",
      dateFrom: updatedData.dateFrom || "",
      dateTo: updatedData.dateTo || "",
      origin: updatedData.origin || "",
      destination: updatedData.destination || "",
      eta: updatedData.eta || "",
    });
  }, [updatedData]); // Only re-run this effect when updatedData changes

  // Handle input change for form fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setLocalData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

const handleFormSubmit = async () => {
  console.log("Submitting data:", localData);
  console.log("Booking ID:", updatedData.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/updateDelivery/${updatedData.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Ensure the server knows it's JSON
        },
        body: JSON.stringify(localData), // Convert object to JSON string
      }
    );

    if (response.ok) {
      const data = await response.json();
      toast.success("Successfully updating delivery information.");
      closeModal()
    } else {
      throw new Error('Failed to update');
    }
  } catch (error) {
    toast.error('Error updating return item');
  }
};


  return (
    <div className="mb-4 overflow-auto z-50 max-sm:h-96">
      <div className="mb-4">
        {/* Sender Name Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Sender Name</label>
        <input
          type="text"
          name="senderName"
          value={localData.senderName}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Transport Mode Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Transport Mode</label>
        <input
          type="text"
          name="transportMode"
          value={localData.transportMode}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Delivery Type Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Delivery Type</label>
        <input
          type="text"
          name="deliveryType"
          value={localData.deliveryType}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Journey Type Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Journey Type</label>
        <input
          type="text"
          name="journeyType"
          value={localData.journeyType}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Date From Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Date From</label>
        <input
          type="date"
          name="dateFrom"
          value={localData.dateFrom}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Date To Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Date To</label>
        <input
          type="date"
          name="dateTo"
          value={localData.dateTo}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Origin Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Origin</label>
        <input
          type="text"
          name="origin"
          value={localData.origin}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Destination Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">Destination</label>
        <input
          type="text"
          name="destination"
          value={localData.destination}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* ETA Input */}
        <label className="block text-sm font-medium text-gray-700 mt-2">ETA</label>
        <input
          type="text"
          name="eta"
          value={localData.eta}
          onChange={handleInputChange}
          className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {/* Save and Close Buttons */}
        <div className="mt-4">
          <button
            onClick={handleFormSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-600 text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInformation;
