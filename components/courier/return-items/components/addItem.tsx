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
  const [driver, setDriver] = useState<Driver[]>([]);
  const [driverName, setDriverName] = useState("Unknown Driver");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user_id = sessionStorage.getItem("user_id"); // Ensure it runs only in the browser
      if (user_id) {
        fetchData(user_id);
      }
    }
  }, []);
  
  const fetchData = async (user_id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/return-items/courier?user_id=${user_id}`,
        { method: "GET" }
      );
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const result = await response.json();
      setDriver(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log(driver);
  }, [driver]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedDriverName = sessionStorage.getItem("name") || "Unknown Driver";
      setDriverName(loggedDriverName);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("returnDate", formData.returnDate);
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("returnReason", formData.returnReason);
      formDataToSend.append("returnQuantity", String(formData.returnQuantity));
      formDataToSend.append("condition", formData.condition);
      formDataToSend.append('returnStatus', 'Pending');
      formDataToSend.append("driverName", driverName);

      if (formData.proofOfReturn instanceof File) {
        formDataToSend.append('proofOfReturn', formData.proofOfReturn);
      }
      formDataToSend.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      toast.success("Return submitted successfully!");
    } catch (error) {
      console.error("Error submitting return:", error);
      toast.error("Failed to submit return. Please try again.");
    } finally {
      setLoading(false);
    }
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
