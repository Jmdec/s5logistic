import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";

interface AddPDOReturnedModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateTable: (newData: DataRow) => void;
}

interface DataRow {
  plateNumber: string;
  arrivalProof: File | null;
  proofOfDelivery: File | null;
  completionOfTrip: string;
  status: string;
}

const AddPDOReturnedModal: React.FC<AddPDOReturnedModalProps> = ({
  isOpen,
  onClose,
  updateTable,
}) => {
  const [formData, setFormData] = useState<DataRow>({
    plateNumber: "",
    arrivalProof: null,
    proofOfDelivery: null,
    completionOfTrip: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned/trips-get`, {
          method: "GET",
        });
        const data = await response.json();
        setPlateNumbers(Object.values(data.plateNumbers));
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Failed to fetch trips. Please try again.");
      }
    };

    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen]);

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
    setLoading(true)
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("plateNumber", formData.plateNumber);
    formDataToSend.append("completionOfTrip", formData.completionOfTrip);
    formDataToSend.append("status", formData.completionOfTrip);
    if (formData.arrivalProof) {
      formDataToSend.append("arrivalProof", formData.arrivalProof);
    }
    if (formData.proofOfDelivery) {
      formDataToSend.append("proofOfDelivery", formData.proofOfDelivery);
    }


    console.log('Form Data:', formData);
    console.log('Form Data to Send:', formDataToSend);

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


      updateTable(responseData);

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add item. Please try again.");
    }
    setLoading(false)
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/3  max-sm:top-20 sm:left-[400px] max-sm:w-[260px] max-sm:absolute max-sm:overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Add Return Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Plate Number:</label>
            <select
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              required
            >
              <option value="" disabled>Select Plate Number</option>
              {plateNumbers.map((plateNumber) => (
                <option key={plateNumber} value={plateNumber}>
                  {plateNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Completion of Trip:</label>
            <select
              name="completionOfTrip"
              value={formData.completionOfTrip}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Returned Successfully">Returned Successfully</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Arrival Proof:</label>
            <input
              type="file"
              name="arrivalProof"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Proof of Delivery:</label>
            <input
              type="file"
              name="proofOfDelivery"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-5">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto"
              disabled = {loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Submit"
              )}
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPDOReturnedModal;
