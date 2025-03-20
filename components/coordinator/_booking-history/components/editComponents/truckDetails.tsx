import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface TruckDetailsProps {
  updatedData: {
    id: any;
    driverName: string;
    driverLicenseNo: string;
    truckPlateNumber: string;
  };
  closeModal: () => void;
}

const TruckDetails: React.FC<TruckDetailsProps> = ({ updatedData, closeModal }) => {
  // Initialize tempDriverInfo independently from updatedData
const [tempDriverInfo, setTempDriverInfo] = useState<{
  id: number;
  name: string;
  licenseNo: string;
  truckPlateNumber: string;
}>({
  id: updatedData.id || 0, // Default to 0 if not provided
  name: updatedData.driverName || "", // Default to an empty string if not provided
  licenseNo: updatedData.driverLicenseNo || "", // Default to an empty string if not provided
  truckPlateNumber: updatedData.truckPlateNumber || "", // Default to an empty string if not provided
});


  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [driversData, setDriversData] = useState<any[]>([]);

  useEffect(() => {
    fetchDriverLicenses();
  }, []);

  const fetchDriverLicenses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/drivers`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const { data } = await res.json();
    
      setDriversData(data); 
      return data;
    } catch (error) {
      console.error("Error fetching driver licenses:", error);
      return [];
    }
  };

  const handleSave = async () => {
    console.log(tempDriverInfo)
    const compiledData = {
      id: updatedData?.id,
      driverName: tempDriverInfo.id,
      bookedCreateBy:tempDriverInfo.name,
      driverLicenseNo: tempDriverInfo.licenseNo,
      truckPlateNumber: tempDriverInfo.truckPlateNumber,
    };
console.log(compiledData)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/updateTruck`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compiledData),
      });

      if (response.ok) {
        toast.success("Successfully updating Truck Details");

        closeModal();
      } else {
        console.error("Error saving data:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const driverId = Number(e.target.value);
    console.log(driverId)
    setSelectedDriverId(driverId);

    // Find the selected driver by ID
    const selectedDriver = driversData.find((driver) => driver.id === driverId);

    // Store the driver's name and id in state
    if (selectedDriver) {
      setTempDriverInfo((prevInfo) => ({
        ...prevInfo,
        name: selectedDriver.name, // Set the name here
        id: driverId
          // Set the driver ID here
      }));
    }
 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update only the specific field in tempDriverInfo
    setTempDriverInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <div className="mb-4">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Current Driver:</p>
        <p className="text-sm text-gray-500">
          {`Name: ${updatedData.driverName} | License No: ${updatedData.driverLicenseNo} | Plate Number: ${updatedData.truckPlateNumber}`}
        </p>
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-2">Select New Driver</label>
      <select
        name="driverInfo"
        value={selectedDriverId?.toString() || ""}
        onChange={handleDriverChange}
        className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select Driver</option>
        {driversData.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {`${driver.name} (ID: ${driver.id})`}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-2">Driver License No</label>
      <input
        type="text"
        name="driverLicenseNo"
        value={tempDriverInfo.licenseNo}
        readOnly
        className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />

      <label className="block text-sm font-medium text-gray-700 mt-2">Truck Plate Number</label>
      <input
        type="text"
        name="truckPlateNumber"
        value={tempDriverInfo.truckPlateNumber}
        onChange={handleInputChange}
        className="bg-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      
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

export default TruckDetails;
