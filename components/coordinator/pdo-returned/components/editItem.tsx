import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

interface EditItemProps {
  isOpen: boolean;
  closeModal: () => void;
  rowData: DataRow | null;  // Allow null for rowData
  handleEdit: (updatedData: DataRow) => void;
}

type DataRow = {
  id: number;
  plateNumber: string;
  completionOfTrip: string;
  status: string;
  arrivalProof: File | null;
  proofOfDelivery: File | null;
};

const EditItem: React.FC<EditItemProps> = ({ isOpen, closeModal, rowData, handleEdit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DataRow>({
    id: 0,
    plateNumber: '',
    completionOfTrip: '',
    status: '',
    arrivalProof: null,
    proofOfDelivery: null,
  });

  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  const [statusOptions] = useState<string[]>(['Pending', 'Returned Successfully']);  // Example status options

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned/trips-get`, {
          method: "GET",
        });
        const data = await response.json();
        setPlateNumbers(Object.values(data.plateNumbers)); // Set plate numbers from API
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Failed to fetch trips. Please try again.");
      }
    };

    if (isOpen && rowData) {
      setFormData(rowData); // Reset the form data when the modal is opened and rowData is available
    }

    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen, rowData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'arrivalProof' | 'proofOfDelivery') => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      [field]: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault();

    if (!formData.id) {
      console.error('ID is missing');
      return;
    }

    console.log("Form Data being sent:", formData);

    const formPayload = new FormData();
    formPayload.append('id', formData.id.toString());
    formPayload.append('plateNumber', formData.plateNumber);
    formPayload.append('completionOfTrip', formData.completionOfTrip);
    formPayload.append('status', formData.status);

    if (formData.arrivalProof) {
      formPayload.append('arrivalProof', formData.arrivalProof);
    }
    if (formData.proofOfDelivery) {
      formPayload.append('proofOfDelivery', formData.proofOfDelivery);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned/store-or-update/${formData.id}`, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const responseData = await response.json();
      toast.success('PDO updated successfully!');
      handleEdit(formData);
      closeModal();
    } catch (error) {
      toast.error('Error updating return item');
    }
    setLoading(false)
  };

  if (!isOpen || !rowData) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 sm:left-[390px]  max-sm:top-10 max-sm:w-[300px] md:w-96 max-sm:absolute max-sm:overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Return Item</h2>
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
              <option value="" disabled>Select Completion Status</option>
              <option value="Pending">Pending</option>
              <option value="Returned Successfully">Returned Successfully</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              required
            >
              <option value="" disabled>Select Completion Status</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Arrival Proof:</label>
            <input
              type="file"
              name="arrivalProof"
              onChange={(e) => handleFileChange(e, 'arrivalProof')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            />
            {formData.arrivalProof && <span className="text-sm text-gray-500">{formData.arrivalProof.name}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Proof of Delivery:</label>
            <input
              type="file"
              name="proofOfDelivery"
              onChange={(e) => handleFileChange(e, 'proofOfDelivery')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            />
            {formData.proofOfDelivery && <span className="text-sm text-gray-500">{formData.proofOfDelivery.name}</span>}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-5">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Submit"
              )}
            </button>

            <button
              onClick={closeModal}
              type="button"
              className="mt-3 sm:mt-0 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default EditItem;
