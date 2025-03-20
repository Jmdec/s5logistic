import { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface EditItemProps {
  isOpen: boolean;
  closeModal: () => void;
  rowData: any;
  handleEdit: (updatedData: any) => void;
}

const EditItem: React.FC<EditItemProps> = ({ isOpen, closeModal, rowData, handleEdit }) => {
  const [formData, setFormData] = useState(rowData);
  const [loading, setLoading] = useState(false)
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  useEffect(() => {
    if (isOpen) {
      setFormData(rowData);
    }
  }, [isOpen, rowData]);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/trips-get`, {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, proofOfReturn: file }); // Add the file to the formData state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = formData[key];
        formDataToSend.append(key, value instanceof File ? value : value.toString());
      }
    }
    console.log("FormData contents:");
    formDataToSend.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/${formData.id}`,
        {
          method: 'POST',
          body: formDataToSend,
        }
      );
      if (response.ok) {
        const data = await response.json();
        toast.success('Return item updated successfully!');
        handleEdit(data);
        closeModal();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Error updating return item!');
    }
    setLoading(false)
  };

  if (!isOpen) return null;
return (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-1/3 sm:left-[630px] max-sm:top-10 max-sm:w-[270px] max-sm:h-[600px] max-sm:absolute max-sm:overflow-auto md:w-96">
      <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Return Date */}
          <div className="mb-4">
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Return Date:</label>
            <div className="relative">
              <input
                type="date"
                name="returnDate"
                id="returnDate"
                value={formData.returnDate || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
              <div className="absolute top-0 right-0 mt-3 mr-3 text-black pointer-events-none">
                <CalendarIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={formData.productName || ''}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-white"
            />
          </div>

          {/* Return Reason */}
          <div className="mb-4">
            <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700">Return Reason</label>
            <input
              type="text"
              name="returnReason"
              id="returnReason"
              value={formData.returnReason || ''}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-white"
            />
          </div>

          {/* Return Quantity */}
          <div className="mb-4">
            <label htmlFor="returnQuantity" className="block text-sm font-medium text-gray-700">Return Quantity</label>
            <input
              type="number"
              name="returnQuantity"
              id="returnQuantity"
              value={formData.returnQuantity || ''}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-white"
            />
          </div>

          {/* Condition */}
          <div className="mb-4">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
            <input
              type="text"
              name="condition"
              id="condition"
              value={formData.condition || ''}
              onChange={handleInputChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-white"
            />
          </div>

          {/* Driver Name */}
          <div className="mb-4">
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">Driver Name</label>
            <select
              name="driverName"
              value={formData.driverName}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Plate Number</option>
              {plateNumbers.map((plateNumber, index) => (
                <option key={index} value={plateNumber}>
                  {plateNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Return Status */}
          <div className="mb-4">
            <label htmlFor="returnStatus" className="block text-sm font-medium text-gray-700">Return Status</label>
            <select
              name="returnStatus"
              id="returnStatus"
              value={formData.returnStatus || ''}
              onChange={handleSelectChange}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full bg-white"
            >
              <option value="" disabled>Select a status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Proof of Return */}
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
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default EditItem;
