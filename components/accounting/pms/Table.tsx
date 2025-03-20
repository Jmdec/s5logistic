'use client'

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import { IoCloseCircle } from "react-icons/io5";
import { TrashIcon } from "@heroicons/react/24/outline";
import RowsPerPage from "@/components/RowsPerPage";



interface PMS {
  id: string;
  plate_number: string;
  proof_of_payment: string[];
  parts_replaced: string;
  quantity: number;
  price_parts_replaced: number;
  truck_model: string;
  proof_of_need_to_fixed: string[];
  date: string;
}

export default function App() {
  const [dataPMS, setData] = useState<PMS[]>([]);
  const [selectedItem, setSelectedItem] = useState<PMS | null>(null);
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<"proof_of_need_to_fixed" | "proof_of_payment" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const [formData, setFormData] = useState({
    plate_number: "",
    truck_model: "",
    parts_replaced: "",
    quantity: 0,
    price_parts_replaced: "",
    proof_of_need_to_fixed: [] as File[],
    proof_of_payment: [] as File[],
  });

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-GB", { month: "short" });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} - ${month} - ${year}`;
  };



  const [sortDescriptorPMS, setSortDescriptorPMS] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);


  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plate_number) newErrors.plate_number = "Plate Number is required.";
    if (!formData.truck_model) newErrors.truck_model = "Truck model is required.";
    if (!formData.parts_replaced) newErrors.parts_replaced = "Parts replaced is required.";
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Valid quantity is required.";
    }
    if (!formData.proof_of_need_to_fixed) newErrors.proof_of_need_to_fixed = "Proofs are required.";
    if (!formData.proof_of_payment) newErrors.proof_of_payment = "Proofs are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive/maintenance`);
      const text = await response.text();
      // console.log("Raw API Response:", text);

      const result = JSON.parse(text, (key, value) => {
        if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value;
      });

      const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/fetch/plate-numbers`);
      const bookings: { data: { plate_number: string }[] } = await bookingsResponse.json();

      setPlateNumbers(bookings.data.map((booking) => booking.plate_number));
      setData(result.maintenances || []);

      if (result.fileInputValue) {
        setFormData((prev) => ({ ...prev, fileInput: result.fileInputValue }));
      }

      // console.log("PMS Data:", paginatedDataPMS);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const files = e.target.files ? Array.from(e.target.files) : [];
    console.log("Files selected:", files);
    setFormData((prevState) => ({
      ...prevState,
      [name]: files,
    }));
  };


  const handleSave = async () => {
    if (!validateForm()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }


    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    const formDataToSend = new FormData();

    if (Array.isArray(formData.proof_of_need_to_fixed)) {
      formData.proof_of_need_to_fixed.forEach((file) => {
        if (file && acceptedImageTypes.includes(file.type)) {
          formDataToSend.append("proof_of_need_to_fixed[]", file);
        } else {
          toast.error('Invalid file type for proof_of_need_to_fixed. Accepted formats are: jpg, png, jpeg.');
          return;
        }
      });
    }

    if (Array.isArray(formData.proof_of_payment)) {
      formData.proof_of_payment.forEach((file) => {
        if (file && acceptedImageTypes.includes(file.type)) {
          formDataToSend.append("proof_of_payment[]", file);
        } else {
          toast.error('Invalid file type for proof_of_payment. Accepted formats are: jpg, png, jpeg, webp.');
          return;
        }
      });
    }

    const otherFields: (keyof typeof formData)[] = [
      "plate_number",
      "truck_model",
      "parts_replaced",
      "quantity",
      "price_parts_replaced",
    ];

    otherFields.forEach((key) => {
      const value = formData[key];
      if (value || value === 0) {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventives/store`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false);
        setFormData({
          plate_number: "",
          truck_model: "",
          parts_replaced: "",
          quantity: 0,
          price_parts_replaced: "",
          proof_of_need_to_fixed: [],
          proof_of_payment: [],
        });
        toast.success(result.message || "Data saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("There was an error saving the data. Please try again later.");
    }

  };


  const handleDelete = async (item: PMS) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/maintenance/${selectedItem.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Item deleted successfully!");
          fetchData();
        } else {
          toast.error("Failed to delete the item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Error deleting item");
      }
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };



  const filteredDataPMS = useMemo(() => {
    if (!filterValue) return dataPMS;
    return dataPMS.filter((item) =>
      item.plate_number.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [dataPMS, filterValue]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredDataPMS].sort((a, b) => {
      const valA = a[sortDescriptorPMS.column as keyof PMS];
      const valB = b[sortDescriptorPMS.column as keyof PMS];

      if (valA === null) return 1;
      if (valB === null) return -1;

      if (valA < valB) return sortDescriptorPMS.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptorPMS.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDataPMS, sortDescriptorPMS]);


  const paginatedDataPMS = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  function handleOpenImageModal(images: string[] | string, index: number = 0, type: "proof_of_need_to_fixed" | "proof_of_payment") {
    const formattedImages = Array.isArray(images) ? images : [images];
    setCurrentImages(formattedImages);
    setSelectedIndex(index);
    const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${formattedImages[index]}`;
    setSelectedImage(imageUrl);
    openImageModal();
  }

  function showNextImage() {
    setSelectedIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, currentImages.length - 1);
      const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${currentImages[newIndex]}`;
      setSelectedImage(imageUrl);
      return newIndex;
    });
  }

  function showPreviousImage() {
    setSelectedIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${currentImages[newIndex]}`;
      setSelectedImage(imageUrl);
      return newIndex;
    });
  }


  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end space-x-2">
        <Button onPress={() => setIsModalOpen(true)} color="primary">
          Add New PMS
        </Button>
        <Export
          label="Export"
        />
      </div>
      <div className="mb-4 flex justify-between items-center space-x-4">
        {/* <Filter /> */}
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">Select Plate Number</option>
          {plateNumbers && plateNumbers.length > 0 ? (
            plateNumbers.map((plate, idx) => (
              <option key={idx} value={plate}>
                {plate}
              </option>
            ))
          ) : (
            <option disabled>No plate numbers available</option>
          )}
        </select>

        <div className="mb-4 flex justify-between items-center space-x-4">
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Search"
            className="px-4 py-2 border rounded-md "
          />
          <RowsPerPage
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
      <ModalComponent
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        modalTitle="Add PMS"
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="plate_number" className="block mb-2 text-sm">
              Plate Number
            </label>
            <select
              id="plate_number"
              name="plate_number"
              value={formData.plate_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a Plate Number</option>
              {plateNumbers.map((plate, idx) => (
                <option key={idx} value={plate}>
                  {plate}
                </option>
              ))}
            </select>
            {errors.plate_number && <p className="text-red-500 text-sm">{errors.plate_number}</p>}

          </div>
          <div>
            <label htmlFor="truck_model" className="block mb-2 text-sm">
              Truck Model
            </label>
            <input
              id="truck_model"
              type="text"
              name="truck_model"
              value={formData.truck_model}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.truck_model && <p className="text-red-500 text-sm">{errors.truck_model}</p>}
          </div>
          <div>
            <label htmlFor="parts_replaced" className="block mb-2 text-sm">
              Parts Replaced
            </label>
            <input
              id="parts_replaced"
              type="text"
              name="parts_replaced"
              value={formData.parts_replaced}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.parts_replaced && <p className="text-red-500 text-sm">{errors.parts_replaced}</p>}
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-sm">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
          <div>
            <label htmlFor="price_parts_replaced" className="block mb-2 text-sm">
              Price of Parts Replaced
            </label>
            <input
              id="price_parts_replaced"
              type="number"
              name="price_parts_replaced"
              value={formData.price_parts_replaced}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.parts_replaced && <p className="text-red-500 text-sm">{errors.parts_replaced}</p>}
          </div>
          <div>
            <label htmlFor="proof_of_need_to_fixed" className="block mb-2 text-sm">
              Proof of Need to Fixed
            </label>
            <input
              type="file"
              name="proof_of_need_to_fixed"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.proof_of_need_to_fixed && <p className="text-red-500 text-sm">{errors.proof_of_need_to_fixed}</p>}
          </div>
          <div>
            <label htmlFor="proof_of_payment" className="block mb-2 text-sm">
              Proof of Payment
            </label>
            <input
              type="file"
              name="proof_of_payment"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.proof_of_payment && <p className="text-red-500 text-sm">{errors.proof_of_payment}</p>}
          </div>
        </div>
      </ModalComponent>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Particulars", "Quantity", "Price per pc", "Total Cost", "Plate Number", "Truck Model", "Proof of Need to Fixed", "Proof of Payment", "Action"].map(
                (column, idx) => (
                  <th
                    key={idx}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                    onClick={() =>
                      setSortDescriptorPMS({
                        column: column.toLowerCase().replace(" ", "_"),
                        direction:
                          sortDescriptorPMS.column === column.toLowerCase().replace(" ", "_") &&
                            sortDescriptorPMS.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      })
                    }
                  >
                    {column}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedDataPMS.length > 0 ? (
              paginatedDataPMS.map((item) => (
                <tr key={item.plate_number + item.date}>
                  <td className="py-3 px-4">{formatDate(item.date)}</td>
                  <td className="py-3 px-4">{item.parts_replaced}</td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4">{(item.price_parts_replaced || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4">
                    {(item.quantity * (item.price_parts_replaced || 0)).toLocaleString("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">{item.plate_number}</td>
                  <td className="py-3 px-4">{item.truck_model}</td>
                  <td className="py-3 px-4">
                    {item.proof_of_need_to_fixed &&
                      Array.isArray(item.proof_of_need_to_fixed) &&
                      item.proof_of_need_to_fixed.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${item.proof_of_need_to_fixed[0]}`}
                        alt="Proof of need to fix"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        onClick={() => handleOpenImageModal(item.proof_of_need_to_fixed, 0, "proof_of_need_to_fixed")}
                      />
                    ) : (
                      <span>No proof</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {item.proof_of_payment &&
                      Array.isArray(item.proof_of_payment) &&
                      item.proof_of_payment.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${item.proof_of_payment[0]}`}
                        alt="Proof of payment"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        onClick={() => handleOpenImageModal(item.proof_of_payment, 0, "proof_of_payment")} />
                    ) : (
                      <span>No proof</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {item && (
                      <button
                        onClick={() => handleDelete(item)}
                        className=" text-red-600 px-3 py-1 rounded transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-3 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>


        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <Button onPress={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {page} of {Math.ceil(sortedData.length / rowsPerPage)}
          </span>
          <Button
            onPress={() => setPage(page < Math.ceil(sortedData.length / rowsPerPage) ? page + 1 : page)}
            disabled={page === Math.ceil(sortedData.length / rowsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>

      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50"
          onClick={closeImageModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Proof of need to fix / Proof of payment"
              className="max-h-96 mt-6 max-w-full object-contain"
            />
            <button
              className="absolute top-0 right-0 p-2 text-gray-600"
              onClick={closeImageModal}
            >
              <IoCloseCircle size={24} />
            </button>

            <div className="flex justify-between mt-2">
              <button
                onClick={showPreviousImage}
                className={`px-4 py-2 bg-gray-500 text-white rounded ${selectedIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={selectedIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={showNextImage}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${selectedIndex === currentImages.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={selectedIndex === currentImages.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg mt-24 w-full sm:w-96">
            <h5 className="text-xl font-semibold text-gray-800 mb-6">Are you sure you want to delete this item?</h5>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
