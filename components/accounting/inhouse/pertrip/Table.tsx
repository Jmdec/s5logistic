'use client'

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../../Modal";
import DeleteModal from "../../deletemodal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../../export";
import { IoCloseCircle } from "react-icons/io5";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FiEdit3 } from "react-icons/fi";
import RowsPerPage from "@/components/RowsPerPage";



interface PerTrip {
  id: number;
  date: string;
  plate_number: string;
  rate_per_mile: number;
  km: number;
  gross_income: number;
  operational_costs: number;
  proof_of_payment: File | string;
  earnings_per_trip: number;
}

export default function App() {
  const [data, setData] = useState<PerTrip[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<PerTrip | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);
  const [formData, setFormData] = useState({
    plate_number: "",
    date: "",
    rate_per_mile: 0,
    km: 0,
    gross_income: 0,
    operational_costs: 0,
    proof_of_payment: null,
  });
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);
  // const rowsPerPage = 5;



  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-mile`);
      const result = await response.json();

      const processedData = result.rates.map((item: any) => ({
        ...item,
        rate_per_mile: Number(item.rate_per_mile) || 0,
        km: Number(item.km) || 0,
        gross_income: Number(item.gross_income) || 0,
        operational_costs: Number(item.operational_costs) || 0,
      }));

      setData(processedData);

      const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/fetch/plate-numbers`);
      const bookings = await bookingsResponse.json();
      setPlateNumbers(bookings.data.map((booking: any) => booking.plate_number));
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
    e.preventDefault();
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (["rate_per_mile", "km", "operational_costs"].includes(name)) {
        const ratePerMile = Number(updatedData.rate_per_mile) || 0;
        const km = Number(updatedData.km) || 0;
        const operationalCosts = Number(updatedData.operational_costs) || 0;

        updatedData.gross_income = ratePerMile * km - operationalCosts || 0;
      }
      return updatedData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setEditData((prevState) => ({
        ...prevState,
        proof_of_payment: file,
      }) as PerTrip);
    }
  };


  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('plate_number', formData.plate_number);
      formDataToSend.append('rate_per_mile', formData.rate_per_mile.toString());
      formDataToSend.append('km', formData.km.toString());
      formDataToSend.append('gross_income', formData.gross_income.toString());
      formDataToSend.append('date', formData.date);
      formDataToSend.append('operational_costs', formData.operational_costs.toString());

      if (formData.proof_of_payment) {
        formDataToSend.append("proof_of_payment", formData.proof_of_payment);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-mile`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      console.log(response);
      if (response.ok) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    }
    setIsModalOpen(false);
  };

  // Edit
  const handleEdit = async (item: PerTrip) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/ratepermile-get/${item.id}`, {
        method: "GET",
      });
      const result = await response.json();

      console.log("Fetched Data:", result);

      if (result.success && result.data) {
        setEditData(result.data);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    }
  };
  const handleUpdate = async () => {
    if (!editData || !editData.id) {
      toast.error("Invalid data: ID is missing.");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(editData).forEach((key) => {
        const typedKey = key as keyof PerTrip;
        const value = editData[typedKey];

        if (value !== undefined && value !== null) {
          if (typeof value === "number") {
            formData.append(typedKey, value.toString());
          } else if (typeof value === "string") {
            formData.append(typedKey, value);
          }
        }
      });

      if (editData.proof_of_payment instanceof File) {
        formData.append("proof_of_payment", editData.proof_of_payment);
      } else if (typeof editData.proof_of_payment === "string" && editData.proof_of_payment.trim() !== "") {
        formData.append("proof_of_payment", editData.proof_of_payment);
      }

      console.log("Sending form data:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-mile/${editData.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating data:", errorData);

        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(", ");
          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          toast.error(`Error updating data: ${errorData.message || "Unknown error"}`);
        }
        return;
      }

      const result = await response.json();
      toast.success(result.message || "Data updated successfully!");
      fetchData();
      setIsEditModalOpen(false);

    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again.");
    }
  };



  // Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setSelectedItemId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedItemId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedItemId === null) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-mile/${selectedItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Record deleted successfully!");
        fetchData();
      } else {
        toast.error("Failed to delete record.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Error deleting record.");
    } finally {
      closeDeleteModal();
    }
  };

  const filteredData = useMemo(() => {
    if (!filterValue.trim()) return data;

    console.log("Filter Value:", filterValue);

    return data.filter((item) => {
      const plateNumberStr = item.plate_number?.toString().toLowerCase().trim();
      const filterValueStr = filterValue.toLowerCase().trim();

      console.log("Comparing:", plateNumberStr, "with", filterValueStr);

      return plateNumberStr.includes(filterValueStr);
    });
  }, [data, filterValue]);


  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof PerTrip];
      const valB = b[sortDescriptor.column as keyof PerTrip];

      if (valA === null) return 1;
      if (valB === null) return -1;

      if (valA < valB) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortDescriptor]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const renderCell = (item: PerTrip, columnKey: keyof PerTrip) => {
    const value = item[columnKey];


    if (["rate_per_mile", "gross_income", "operational_costs", "earnings_per_trip"].includes(columnKey)) {
      const numericValue = typeof value === "number" ? value : 0;

      return numericValue.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      });
    }


    return value || "-";
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <select
            value={formData.plate_number}
            onChange={handleInputChange}
            name="plate_number"
            className="px-4 py-2 border rounded-md w-full sm:w-[160px]"
          >
            <option value="">Select Plate No:</option>
            {plateNumbers.map((plate, idx) => (
              <option key={idx} value={plate}>
                {plate}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Search"
            className="px-4 py-2 border rounded-md w-full sm:w-[200px]"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button onPress={() => setIsModalOpen(true)} color="primary">
            IN
          </Button>
          <Export label="Export" />
        </div>
      </div>


      <div className="mb-4 flex justify-end items-center space-x-4">
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      {/* Add Modal */}
      <ModalComponent
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        modalTitle="In House Earning"
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => {
            if (key === "proof_of_payment") {
              return (
                <div key={key} className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">Proof of Payment</label>
                  <input
                    type="file"
                    name={key}
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border rounded-md mb-2"
                  />
                </div>
              );
            }

            if (key === "gross_income") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">Gross Income</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key as keyof typeof formData] ?? ""}
                    readOnly
                    className="w-full px-4 py-2 border rounded-md mb-2 bg-gray-100"
                  />
                </div>
              );
            }

            if (key === "plate_number") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">Plate Number</label>
                  <select
                    value={formData.plate_number}
                    onChange={handleInputChange}
                    name="plate_number"
                    className="w-full px-4 py-2 border rounded-md mb-2"
                  >
                    <option value="">Select a Plate Number</option>
                    {plateNumbers.map((plate, idx) => (
                      <option key={idx} value={plate}>
                        {plate}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  {key.replace("_", " ").charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                </label>

                <input
                  type={key === "date" ? "date" : "text"}
                  name={key}
                  value={formData[key as keyof typeof formData] ?? ""}
                  onChange={handleInputChange}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  className="w-full px-4 py-2 border rounded-md mb-2"
                />
              </div>
            );
          })}
        </div>
      </ModalComponent>

      {/* Edit Modal */}
      <ModalComponent
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        modalTitle="Edit Entry"
        onSave={handleUpdate}
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            "plate_number",
            "date",
            "rate_per_mile",
            "km",
            "gross_income",
            "operational_costs",
            "proof_of_payment"
          ].map((key) => {
            if (key === "proof_of_payment") {
              return (
                <div key={key} className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Proof of Payment</label>
                  <input
                    type="file"
                    name={key}
                    onChange={editData ? handleEditFileChange : handleFileChange}
                    className="w-full px-4 py-2 border rounded-md mb-2"
                  />
                </div>
              );
            }

            if (key === "gross_income") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">Gross Income</label>
                  <input
                    type="text"
                    name={key}
                    value={(editData?.rate_per_mile ?? 0) * (editData?.km ?? 0) - (editData?.operational_costs ?? 0)}
                    readOnly
                    className="w-full px-4 py-2 border rounded-md mb-2 bg-gray-100"
                  />
                </div>
              );
            }

            if (key === "plate_number") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                  <select
                    name={key}
                    value={editData?.plate_number?.toUpperCase() ?? ""}
                    onChange={(e) => setEditData({ ...editData!, plate_number: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md mb-2"
                  >
                    <option value="">Select a Plate Number</option>
                    {plateNumbers.map((plate) => (
                      <option key={plate} value={plate.toUpperCase()}>{plate}</option>
                    ))}
                  </select>

                </div>
              );
            }

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
                <input
                  type={key === "date" ? "text" : "text"}
                  name={key}
                  value={
                    key === "date"
                      ? editData?.date
                        ? new Date(editData.date)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .replace(" ", "-")
                        : ""
                      : editData?.[key as keyof PerTrip] instanceof File
                        ? ""
                        : (editData?.[key as keyof PerTrip] as string | number | undefined) ?? ""
                  }
                  onChange={(e) => setEditData({ ...editData!, [key]: e.target.value })}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  className="w-full px-4 py-2 border rounded-md mb-2"
                />
              </div>
            );
          })}
        </div>
      </ModalComponent>



      <div className="overflow-auto">
        <table className="min-w-full bg-white border-1.5 dark:bg-gray-800">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Plate Number", "Rate Per Mile", "Kilometers", "Gross Income", "Operational Costs", "Proof of Payment", "Earnings Per Trip", "Action"].map(
                (column, idx) => (
                  <th
                    key={idx}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                    onClick={() =>
                      setSortDescriptor({
                        column: column.toLowerCase().replace(" ", "_"),
                        direction:
                          sortDescriptor.column === column.toLowerCase().replace(" ", "_") &&
                            sortDescriptor.direction === "ascending"
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx}>
                  {[
                    "date",
                    "plate_number",
                    "rate_per_km",
                    "kilometers",
                    "gross_income",
                    "operational_costs",
                    "proof_of_payment",
                    "earnings_per_trip",
                  ].map((columnKey, idx) => (
                    <td key={idx} className="py-3 px-4">
                      {columnKey === "proof_of_payment" ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${(item as Record<string, any>).proof_of_payment}`}
                          alt="Payment proof"
                          className="h-10 w-10 rounded-full cursor-pointer"
                          onClick={() => {
                            setSelectedImage(
                              `${process.env.NEXT_PUBLIC_SERVER_PORT}/${(item as Record<string, any>).proof_of_payment}`
                            );
                            openImageModal();
                          }}
                        />
                      ) : columnKey === "date" ? (
                        (() => {
                          const dateObj = new Date((item as Record<string, any>).date);
                          const day = dateObj.getDate().toString().padStart(2, "0");
                          const month = dateObj.toLocaleString("en-GB", { month: "short" });
                          const year = dateObj.getFullYear().toString().slice(-2);
                          return `${day} - ${month} - ${year}`;
                        })()
                      ) : (
                        (item as Record<string, any>)[columnKey]
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-center flex items-center justify-center space-x-3">
                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700">
                      <FiEdit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => openDeleteModal(item.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-3 px-4 text-center text-sm font-medium text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
        <DeleteModal isOpen={isDeleteModalOpen} confirmDelete={handleDelete} cancelDelete={closeDeleteModal} />
      </div>


      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={closeImageModal}
        >
          <div
            className="bg-white p-8 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Payment proof"
              className="max-h-96 max-w-full object-contain"
            />
            <button
              className="absolute top-0 right-0 p-2 text-gray-600"
              onClick={closeImageModal}
            >
              <IoCloseCircle size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {Math.ceil(data.length / rowsPerPage)}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
          disabled={page === Math.ceil(data.length / rowsPerPage)}
        >
          Next
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}