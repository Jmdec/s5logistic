import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalComponentProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: T;
  setFields: React.Dispatch<React.SetStateAction<T>>;
  handleSave: () => void;
  loading: boolean;
}

const ModalComponent = <T extends Record<string, any>>({
  isOpen,
  onOpenChange,
  fields,
  setFields,
  handleSave,
  loading,
}: ModalComponentProps<T>) => {
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlateNumbers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive-maintenance`);
        const data = await response.json();

        if (Array.isArray(data.preventive)) {
          const plates = Array.isArray(data.plateNumbers) ? data.plateNumbers : Object.values(data.plateNumbers);
          setPlateNumbers(plates);
        }
      } catch (error) {
        console.error("Error fetching plate numbers:", error);
      }
    };

    if (isOpen) {
      fetchPlateNumbers(); // Fetch plate numbers only when modal is open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = <TElement extends HTMLInputElement | HTMLSelectElement>(
    e: React.ChangeEvent<TElement>,
    fieldName: keyof T
  ) => {
    const { type, value } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;

      if (files && files.length > 0) {
        const validFiles = Array.from(files).filter((file) =>
          file.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
        );

        setFields((prev) => ({
          ...prev,
          [fieldName]: validFiles,
        }));

        const filePreviewsArray = validFiles.map((file) => URL.createObjectURL(file));
        setFilePreviews(filePreviewsArray);
      } else {
        setFields((prev) => ({
          ...prev,
          [fieldName]: null, // Set it to null if no file is selected
        }));
      }
    } else {
      setFields((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add Preventive Maintenance</h2>
          <XMarkIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800"
            onClick={() => onOpenChange(false)}
          />
        </div>

        <div className="space-y-4">
          {/* Plate Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Plate Number</label>
            <select
              value={fields.plate_number}
              onChange={(e) => setFields({ ...fields, plate_number: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border 
              border-gray-300 rounded-md shadow-sm
              dark:bg-white dark:text-gray-800"
            >
              <option value="">Select Plate Number</option>
              {plateNumbers.length > 0 ? (
                plateNumbers.map((plate) => (
                  <option key={plate} value={plate}>
                    {plate}
                  </option>
                ))
              ) : (
                <option disabled>No plate numbers available</option>
              )}
            </select>
          </div>

          {/* Truck Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Truck Model</label>
            <input
              type="text"
              value={fields.truck_model}
              onChange={(e) => setFields({ ...fields, truck_model: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
              shadow-sm dark:bg-white dark:text-gray-800"
            />
          </div>

          {/* Parts Replaced */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Parts Replaced</label>
            <input
              type="text"
              value={fields.parts_replaced}
              onChange={(e) => setFields({ ...fields, parts_replaced: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm dark:bg-white dark:text-gray-800"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={fields.quantity}
              onChange={(e) => setFields({ ...fields, quantity: Number(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm dark:bg-white dark:text-gray-800"
            />
          </div>

          {/* Price Per Part */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Per Part</label>
            <input
              type="number"
              value={fields.price_parts_replaced}
              onChange={(e) => setFields({ ...fields, price_parts_replaced: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300
               rounded-md shadow-sm dark:bg-white dark:text-gray-800"
            />
          </div>

          {/* Proof of Need to Fix */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Proof of Need to Fix</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setFields({ ...fields, proof_of_need_to_fixed: Array.from(files) });
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm dark:bg-white dark:text-gray-800"
            />
          </div>

          {/* Proof of Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Proof of Payment</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setFields({ ...fields, proof_of_payment: Array.from(files) });
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm dark:bg-white dark:text-gray-800"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            onPress={() => onOpenChange(false)}
            color="secondary"
            className="bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onPress={handleSave}
            color="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
