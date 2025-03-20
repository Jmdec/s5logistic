import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { CalendarIcon } from '@heroicons/react/24/outline';
import { toast } from "react-toastify";

interface AddReturnItemModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSuccess: () => void;
}

interface FormData {
  returnDate: string;
  productName: string;
  returnReason: string;
  returnQuantity: number;
  condition: string;
  driverName: string;
  proofOfReturn: File | null;
}
interface Driver {
  id: string;  // or number, based on your API response
  name: string;
}


const AddReturnItemModal: React.FC<AddReturnItemModalProps> = ({
  isOpen,
  onClose,

  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    returnDate: "",
    productName: "",
    returnReason: "",
    returnQuantity: 0,
    condition: "",
    driverName: "",
    proofOfReturn: null,
  });
  const [plateNumbers, setPlateNumbers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/trips-get`, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data.users);
        // Set the plate numbers with id and name
        setPlateNumbers(data.users);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Failed to fetch trips. Please try again.");
      }
    };

    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen]);

  useEffect(() => {
    console.log(plateNumbers);  // Log the plateNumbers when it changes
  }, [plateNumbers]);  // Dependency array with plateNumbers

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      proofOfReturn: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append('returnDate', formData.returnDate);
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('returnReason', formData.returnReason);
    formDataToSend.append('returnQuantity', String(formData.returnQuantity));
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('driverName', formData.driverName || '');
    formDataToSend.append('returnStatus', 'Pending');

    if (formData.proofOfReturn instanceof File) {
      formDataToSend.append('proofOfReturn', formData.proofOfReturn);
    }
    formDataToSend.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Return item created successfully.');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to create.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create.');
    }
    setLoading(false)
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/3 sm:left-[630px] max-sm:top-10 max-sm:w-[300px] max-sm:absolute sm:overflow-auto max-h-[90%] overflow-y-auto md:w-96 ">
        <h2 className="text-2xl font-bold mb-6">Add Return Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Return Date:</label>
            <div className="relative">
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
              <div className="absolute top-0 right-0 mt-3 mr-3 text-black pointer-events-none">
                <CalendarIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Return Reason:</label>
            <input
              type="text"
              name="returnReason"
              value={formData.returnReason}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Return Quantity:</label>
            <input
              type="number"
              name="returnQuantity"
              value={formData.returnQuantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Condition:</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Driver Name:</label>
            <select
              name="driverName"
              value={formData.driverName}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Driver</option>
              {plateNumbers.map((driver, index) => (
                <option key={index} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Proof of Return:</label>
            <input
              type="file"
              name="proofOfReturn"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Submit"
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default AddReturnItemModal;
