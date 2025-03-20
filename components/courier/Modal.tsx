import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalComponentProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: T;
  setFields: React.Dispatch<React.SetStateAction<T>>;
  actionType: "status" | "location"; 
  handleSave: () => void;
}

const ModalComponent = <T extends Record<string, any>>({
  isOpen,
  onOpenChange,
  title,
  fields,
  setFields,
  actionType,
  handleSave,
}: ModalComponentProps<T>) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleFieldChange = <TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    e: React.ChangeEvent<TElement>,
    fieldName: keyof T
  ) => {
    const { type, value } = e.target;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;

      if (files) {
        if (fileInput.multiple) {
          const validFiles = Array.from(files).filter(file =>
            file.size <= 5 * 1024 * 1024 && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
          );

          setFields((prev) => ({
            ...prev,
            [fieldName]: validFiles,
          }));

          const filePreviewsArray = validFiles.map((file) => URL.createObjectURL(file));
          setFilePreviews(filePreviewsArray);
        } else {
          const file = files[0];
          if (file.size > 5 * 1024 * 1024) {
            alert('File is too large!');
            return;
          }
          if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
            alert('Invalid file type!');
            return;
          }

          setFields((prev) => ({
            ...prev,
            [fieldName]: file,
          }));

          if (fieldName === "proof_of_delivery") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    } else {
      setFields((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <XMarkIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800"
            onClick={() => onOpenChange(false)}
            aria-label="Close modal"
          />
        </div>

        {/* Dynamic Fields Based on Action Type */}
        <div>
          {actionType === "status" && (
            <div>
              {/* Status Dropdown */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select className="w-full p-2 border rounded-lg border-black"

                  id="status"
                  name="status"
                  value={fields.status || ""}
                  onChange={(e) => handleFieldChange(e, "status" as keyof T)}
                >
                  <option disabled>Select Status</option>
                  <option value="POD Returned">POD Returned</option>
                  <option value="Delivery Successful">Delivery Successful</option>
                  <option value="For Pick-Up">For Pick-Up</option>
                  <option value="First Delivery Attempt">First Delivery Attempt</option>
                  <option value="In Transit">In Transit</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="mb-4">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={fields.remarks || ""}
                  onChange={(e) => handleFieldChange(e, "remarks" as keyof T)}
                  className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                  rows={3}
                />

              </div>

              {/* Proof of Delivery */}
              <div className="mb-4">
                <label htmlFor="proof_of_delivery" className="block text-sm font-medium text-gray-700">
                  Proof of Delivery (Optional)
                </label>
                <input
                  type="file"
                  id="proof_of_delivery"
                  name="proof_of_delivery"
                  accept="image/jpeg, image/png, application/pdf"
                  onChange={(e) => handleFieldChange(e, "proof_of_delivery" as keyof T)}
                  className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                />
                {previewUrl && <img src={previewUrl} alt="Proof of Delivery Preview" className="mt-2 rounded-md" />}
              </div>

              {/* Display Date of Pick-Up When "For Pick-Up" is Selected */}
              {fields.status === "For Pick-Up" && (
                <div className="mb-4">
                  <label htmlFor="date_of_pickup" className="block text-sm font-medium text-gray-700">
                    Date of Pick-Up
                  </label>
                  <input
                    type="date"
                    id="date_of_pickup"
                    name="date_of_pickup"
                    value={fields.date_of_pickup || ""}
                    onChange={(e) => handleFieldChange(e, "date_of_pickup" as keyof T)}
                    className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
          )}

          {actionType === "location" && (
            <div>
              {/* Location Input */}
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={fields.location || ""}
                  onChange={(e) => handleFieldChange(e, "location" as keyof T)}
                  className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                />
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                  Upload File (PDF, Image)
                </label>
                <input
                  type="file"
                  name="file-upload"
                  id="file-upload"
                  multiple
                  onChange={(e) => handleFieldChange(e, "location_file" as keyof T)}
                  className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* File Preview Section */}
          {filePreviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">File Previews:</h3>
              <div className="flex space-x-2">
                {filePreviews.map((previewUrl, index) => (
                  <img key={index} src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
          >
            Update
          </Button>
        </div>
      </div>
    </div>

  );
};

export default ModalComponent;
