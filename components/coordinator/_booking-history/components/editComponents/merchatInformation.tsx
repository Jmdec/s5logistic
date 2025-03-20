import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RadioGroup, Radio } from "@heroui/react";

interface MerchantProps {
  closeModal: () => void;
  updatedData: {
    id: any;
    merchantName: string;
    merchantMobile: string;
    merchantEmail: string;
    merchantAddress: string;
  };
}

const Merchant: React.FC<MerchantProps> = ({ closeModal, updatedData }) => {
  const [merchantData, setMerchantData] = useState(updatedData);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);  // To store selected vehicle plate number
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<string | null>(null);  // To store selected subcontractor plate number
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [subcontractors, setSubcontractors] = useState<any[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/companyvehicle`);
        if (response.ok) {
          const data = await response.json();
          setVehicles(data.vehicles); 
        } else {
          console.error("Error fetching vehicles:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    const fetchSubcontractors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/subcontractor`);
        if (response.ok) {
          const data = await response.json();
          setSubcontractors(data.subcontractors); 
        } else {
          console.error("Error fetching subcontractors:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchVehicles();
    fetchSubcontractors();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);

  };

  const handleSave = async () => {
  const compiledData: any = {
    consigneeName: merchantData.merchantName,
    consigneeAddress: merchantData.merchantAddress,
    consigneeEmail: merchantData.merchantEmail,
    consigneeMobile: merchantData.merchantMobile,
    selectedOption: selectedOption,
  };

  // Conditionally add the selected vehicle or subcontractor based on the selectedOption
  if (selectedOption === "companyvehicle" && selectedVehicle) {
    compiledData.selectedVehicle = selectedVehicle;
  } else if (selectedOption === "subcontractor" && selectedSubcontractor) {
    compiledData.selectedSubcontractor = selectedSubcontractor;
  }

  console.log(compiledData); // View the compiled data before sending


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/updateConsignee/${merchantData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(compiledData),
        }
      );

      if (response.ok) {
        toast.success("Successfully updated Consignee Details");
        closeModal();
      } else {
        toast.error("Error updating data");
      }
    } catch (error) {
      toast.error("Error updating data");
    }
  };

  useEffect(() => {
    setMerchantData(updatedData);
  }, [updatedData]);

  return (
   <div className="max-sm:h-96 overflow-auto">
  <div className="space-y-4 ">
    <div>
      <label htmlFor="consigneeName" className="block text-sm font-medium text-gray-700">
        Consignee Name
      </label>
      <input
        id="consigneeName"
        type="text"
        value={merchantData.merchantName}
        onChange={(e) =>
          setMerchantData({ ...merchantData, merchantName: e.target.value })
        }
        className="bg-white mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div>
      <label htmlFor="consigneeAddress" className="block text-sm font-medium text-gray-700">
        Consignee Address
      </label>
      <input
        id="consigneeAddress"
        type="text"
        value={merchantData.merchantAddress}
        onChange={(e) =>
          setMerchantData({ ...merchantData, merchantAddress: e.target.value })
        }
        className="bg-white mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div>
      <label htmlFor="consigneeEmail" className="block text-sm font-medium text-gray-700">
        Consignee Email
      </label>
      <input
        id="consigneeEmail"
        type="email"
        value={merchantData.merchantEmail}
        onChange={(e) =>
          setMerchantData({ ...merchantData, merchantEmail: e.target.value })
        }
        className="bg-white mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div>
      <label htmlFor="consigneeMobile" className="block text-sm font-medium text-gray-700">
        Consignee Mobile
      </label>
      <input
        id="consigneeMobile"
        type="text"
        value={merchantData.merchantMobile}
        onChange={(e) =>
          setMerchantData({ ...merchantData, merchantMobile: e.target.value })
        }
        className="bg-white mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    {/* RadioGroup for Truck Type */}
    <div className="mt-4 space-y-4">
      <h1 className="text-sm sm:text-base">Select Truck Type</h1>
      <RadioGroup value={selectedOption} onChange={handleChange}>
        <div className="space-y-4">
          <Radio value="companyvehicle" className="flex items-center p-3 border rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all">
            <h1 className="text-black">Company Vehicles</h1>
          </Radio>

          <Radio value="subcontractor" className="flex items-center p-3 border rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all">
            <h1 className="text-black">Subcontractor</h1>
          </Radio>
        </div>
      </RadioGroup>
    </div>

    {selectedOption === "companyvehicle" && (
      <div>
        <label htmlFor="vehicleSelect" className="block text-sm font-medium text-gray-700">
          Select Vehicle
        </label>
        <select
          id="vehicleSelect"
          value={selectedVehicle || ""}
          onChange={(e) => setSelectedVehicle(e.target.value)} // Set the selected vehicle
          className="bg-white mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a Vehicle</option> {/* Default empty option */}
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.truck_name} ({vehicle.plate_number})
            </option>
          ))}
        </select>
      </div>
    )}

    {selectedOption === "subcontractor" && (
      <div>
        <label htmlFor="subcontractorSelect" className="block text-sm font-medium text-gray-700">
          Select Subcontractor
        </label>
        <select
          id="subcontractorSelect"
          value={selectedSubcontractor || ""}
          onChange={(e) => setSelectedSubcontractor(e.target.value)} // Set the selected subcontractor
          className="bg-white mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a Subcontractor</option> {/* Default empty option */}
          {subcontractors.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.company_name} ({sub.plate_number})
            </option>
          ))}
        </select>
      </div>
    )}
  </div>

  <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-end">
    <button
      onClick={handleSave}
      className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 transition-all w-full sm:w-auto"
    >
      Save Changes
    </button>

    <button
      onClick={closeModal}
      className="bg-gray-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700 transition-all w-full sm:w-auto"
    >
      Close
    </button>
  </div>
</div>

  );
};

export default Merchant;
