

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalComponentProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: T;
  setFields: React.Dispatch<React.SetStateAction<T>>;
  mode: "add" | "edit" | "delete" | "archive" | "unarchive" | "terminate" | "renew" | "accept" | "decline" | "approve" | "deny";
  handleSave: () => void;
  children?: React.ReactNode;
  loading: boolean;
}

const ModalComponent = <T extends Record<string, any>>({
  isOpen,
  onOpenChange,
  title,
  fields,
  setFields,
  mode,
  handleSave,
  loading,
}: ModalComponentProps<T>) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [orPreview, setOrPreview] = useState<string | null>(null);
  const [crPeview, setCrPreview] = useState<string | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  useEffect(() => {
    console.log("CurrentFields:", fields);
  }, [fields]);

  const handleFieldChange = <TElement extends HTMLInputElement | HTMLSelectElement>(
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

          if (fieldName === "profile_image") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (fieldName === "driver_license") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setLicensePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (fieldName === "file_upload") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setUploadPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (fieldName === "driver_image") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (fieldName === "or_docs") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setOrPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (fieldName === "cr_docs") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setCrPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (fieldName === "proof") {
            const reader = new FileReader();
            reader.onloadend = () => {
              setProofPreview(reader.result as string);
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <XMarkIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800"
            onClick={() => onOpenChange(false)}
          />

        </div>
        <div >
          {mode === "delete" || mode === "archive" || mode === "unarchive" ? (
            <div className="mb-6">
              <p className="dark:text-gray-800">
                Are you sure you want to{" "}
                {mode === "delete"
                  ? "delete"
                  : mode === "unarchive"
                    ? "unarchive"
                    : "archive"}{" "}
                this data?
              </p>
            </div>
          ) : mode === "terminate" || mode === "renew" ? (
            <div className="mb-6">
              <p className="dark:text-gray-800">
                Are you sure you want to {mode === "terminate" ? "terminate" : "renew"} this driver?
              </p>
            </div>
          ) : mode === "accept" || mode === "decline" ? (
            <div className="mb-6">
              <p className="dark:text-gray-800">
                Are you sure you want to {mode === "accept" ? "accept" : "decline"} this feedback?
              </p>
            </div>
          ) : mode === "approve" || mode === "deny" ? (
            <div className="mb-6">
              <p className="dark:text-gray-800">
                Are you sure you want to {mode === "approve" ? "approve" : "deny"} this request?
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${Object.keys(fields).length > 3 ? "grid-cols-2" : "grid-cols-1"}`}>
              {Object.keys(fields)
                .filter((field) => field !== "id" && field !== "status"
                  && field !== "approved_by" && field !== "prepared_by" && field !== "series_no" && field !== "is_verified"
                  && field !== "email_verified_at" && field !== "created_at" && field !== "updated_at" && field !== "role"
                  && field !== "verification_code" && field !== "provider" && field !== "google_id")

                .map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                      {field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                    </label>
                    {field === "gender" || field === "civil_status" ? (
                      <select
                        id={field}
                        name={field}
                        value={fields[field as keyof T]}
                        onChange={(e) => handleFieldChange(e, field as keyof T)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 
                        rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                         focus:border-indigo-500 sm:text-sm dark:bg-white
                         dark:text-gray-800"
                      >
                        {field === "gender" ? (
                          <>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </>
                        ) : (
                          <>
                            <option value="">Select Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Divorced">Divorced</option>
                          </>
                        )}
                      </select>
                    ) : field == "truck_status" ? (
                      <select
                        id={field}
                        name={field}
                        value={fields.truck_status?.toLowerCase() || ""}
                        onChange={(e) => handleFieldChange(e, "truck_status")}
                        className="mt-1 block w-full px-3 py-2 border 
                        border-gray-300 rounded-md shadow-sm focus:outline-none 
                        focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        dark:bg-white dark:text-gray-800"
                      >
                        <option disabled>Select Status</option>
                        <option value="available">Available</option>
                        <option value="maintenance">Maintenance</option>
                      </select>

                    ) : field.toLowerCase().includes("date") || field.toLowerCase().includes("birthday") ? (
                      <input
                        id={field}
                        name={field}
                        type="date"
                        value={fields[field as keyof T]}
                        onChange={(e) => handleFieldChange(e, field as keyof T)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 
                        rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 
                        focus:border-indigo-500 sm:text-sm
                       dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800
                        dark:[&::-webkit-calendar-picker-indicator]:invert 
               ark:[&::-webkit-calendar-picker-indicator]:filter-red"
                      />
                    ) : field.toLowerCase().includes("_salary") ? (
                      <input
                        id={field}
                        name={field}
                        type="number"
                        value={fields[field as keyof T]}
                        onChange={(e) => handleFieldChange(e, field as keyof T)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 
                        rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 
                        focus:border-indigo-500 sm:text-sm
                        dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"                      />
                    ) : field.toLowerCase().includes("driver_contact_no") ? (
                      <input
                        id={field}
                        name={field}
                        type="number"
                        value={fields[field as keyof T]}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 11) {
                            handleFieldChange(e, 'driver_contact_no');
                          }
                        }}
                        className="mt-1 block w-full px-3 py-2 border 
                          border-gray-300 rounded-md shadow-sm focus:outline-none
                           focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                          dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                      />
                    ) : field === "contact_number" ? (
                      <input
                        id={field}
                        name={field}
                        type="number"
                        value={fields[field as keyof T]}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 11) {
                            handleFieldChange(e, 'contact_number');
                          }
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300
                         rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 
                         focus:border-indigo-500 sm:text-sm
                         dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                      />
                    ) : field.toLowerCase().includes("mobile") ? (
                      <input
                        id={field}
                        name={field}
                        type="number"
                        value={fields[field as keyof T]}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 11) {
                            handleFieldChange(e, 'mobile');
                          }
                        }}
                        className="mt-1 block w-full px-3 py-2 border 
                        border-gray-300 rounded-md shadow-sm focus:outline-none 
                        focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm     
                        dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"

                      />
                    ) : field.toLowerCase().includes("phone_number") ? (
                      <input
                        id={field}
                        name={field}
                        type="number"
                        value={fields[field as keyof T]}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 11) {
                            handleFieldChange(e, 'phone_number');
                          }
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                        shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                        sm:text-sm dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                      />
                    ) : field.toLowerCase().includes("profile_image") ? (
                      <div>
                        <input
                          id="profile_image"
                          name="profile_image"
                          type="file"
                          onChange={(e) => handleFieldChange(e, "profile_image")}
                          className="mt-1 block w-full px-3 py-2 border 
                          border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                          dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {previewUrl && (
                          <div className="mt-4">
                            <p className="dark:text-gray-800">Selected Profile Image:</p>
                            <img
                              src={previewUrl}
                              alt="Profile Preview"
                              className="w-40 h-40 object-cover rounded-lg mt-2"
                            />
                          </div>
                        )}
                      </div>
                    ) : field.toLowerCase().includes("files") ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          multiple
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border 
                          border-gray-300 rounded-md shadow-sm focus:outline-none
                          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {filePreviews.length > 0 && (
                          <div className="mt-4">
                            <p className="dark:text-gray-800">Selected Files:</p>
                            <ul>
                              {filePreviews.map((url, index) => (
                                <li key={index}>
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                    {`File ${index + 1}`}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : field.toLowerCase().includes("driver_license") ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 
                          rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm
                          dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {licensePreview ? (
                          <img
                            src={licensePreview}
                            alt="Profile Preview"
                            className="w-40 h-40 object-cover rounded-lg mt-2"
                          />
                        ) : null}

                      </div>
                    ) : field.toLowerCase().includes("file_upload") ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 
                          rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm
                          dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {uploadPreview && (
                          <div className="mt-4">
                            <p className="dark:text-gray-800">Selected Image:</p>
                            <img
                              src={uploadPreview}
                              alt="Profile Preview"
                              className="w-40 h-40 object-cover rounded-lg mt-2"
                            />
                          </div>
                        )}
                      </div>
                    ) : field.toLowerCase().includes("driver_image") ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 
                          rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm
                          dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="w-40 h-40 object-cover rounded-lg mt-2"
                          />
                        )}
                      </div>
                    ) : field === "proof" ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border 
                          border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                                   dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {proofPreview ? (
                          <img
                            src={proofPreview}
                            alt="Profile Preview"
                            className="w-40 h-40 object-cover rounded-lg mt-2"
                          />
                        ) : null}
                      </div>
                    ) : field === "or_docs" ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border 
                          border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                                   dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {orPreview ? (
                          <div className="mt-4">
                            <p className="dark:text-gray-800">Selected Image:</p>
                            <img
                              src={orPreview}
                              alt="Profile Preview"
                              className="w-40 h-40 object-cover rounded-lg mt-2"
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : field === "cr_docs" ? (
                      <div>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          onChange={(e) => handleFieldChange(e, field as keyof T)}
                          className="mt-1 block w-full px-3 py-2 border 
                          border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                                   dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                        />
                        {crPeview ? (
                          <img
                            src={crPeview}
                            alt="Profile Preview"
                            className="w-40 h-40 object-cover rounded-lg mt-2"
                          />
                        ) : null}
                      </div>
                    ) : (
                      <input
                        id={field}
                        name={field}
                        type="text"
                        value={fields[field as keyof T] || ""}
                        onChange={(e) => handleFieldChange(e, field as keyof T)}
                        className="mt-1 block w-full px-3 py-2 border 
                        border-gray-300 rounded-md shadow-sm focus:outline-none
                         focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                         dark:bg-white dark:placeholder:text-gray-800 dark:text-gray-800"
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
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
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              mode === "add" ? "Add" : mode === "delete" ? "Delete" : "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;

