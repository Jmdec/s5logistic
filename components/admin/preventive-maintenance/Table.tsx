"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "./Modal";
import Modal from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DetailsModal from "../DetailsModal";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Export from "@/components/accounting/export";
import RowsPerPage from "@/components/RowsPerPage";


interface maintenanceData {
  id: number;
  created_at: string;
  parts_replaced: string;
  quantity: number;
  price_parts_replaced: string;
  total_cost: number;
  plate_number: string;
  truck_model: string;
  proof_of_need_to_fixed: string[];
  proof_of_payment: string[];
  [key: string]: any;
}

export default function App() {
  const router = useRouter();
  const [maintenanceData, setMaintenanceData] = useState<maintenanceData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedData, setSelectedData] = useState<maintenanceData | null>(null);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"delete" | "add">("add");
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "truck_model",
    direction: "ascending",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [fields, setFields] = useState<maintenanceData>({
    id: 0,
    created_at: "",
    parts_replaced: "",
    quantity: 0,
    price_parts_replaced: "",
    total_cost: 0,
    plate_number: "",
    truck_model: "",
    proof_of_need_to_fixed: [],
    proof_of_payment: [],
  });

  const fetchmaintenanceData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive-maintenance`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMaintenanceData(data.preventive);
      const plates = Array.isArray(data.plateNumbers) ? data.plateNumbers : Object.values(data.plateNumbers);
      setPlateNumbers(plates);

    } catch (error) {
      console.error("Error fetching maintenance data:", error);
      toast.error(`Error fetching data`);
    }
  };


  useEffect(() => {
    fetchmaintenanceData();
    const intervalId = setInterval(fetchmaintenanceData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredData = maintenanceData;
    if (selectedPlate) {
      filteredData = filteredData.filter((data) => data.plate_number === selectedPlate);
    }
    return filteredData.filter((data) =>
      data.truck_model.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [maintenanceData, filterValue, selectedPlate]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof maintenanceData];
      const second = b[sortDescriptor.column as keyof maintenanceData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleOpenModal = async (mode: "delete", id?: number) => {
    setMode(mode);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive-maintenance/get/${id}`);
      const data = await response.json();

      console.log(data.preventive)
      setFields({
        ...data.preventive,
      });


      setIsOpenDelete(true);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    console.log("Fields after setFields:", fields);
  }, [fields]);

  const handleOpenCreateModal = () => {
    setFields({
      id: 0,
      created_at: "",
      parts_replaced: "",
      quantity: 0,
      price_parts_replaced: "",
      total_cost: 0,
      plate_number: "",
      truck_model: "",
      proof_of_need_to_fixed: [] as string[],
      proof_of_payment: [] as string[],
    });
    setIsOpenAdd(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append files
      if (fields.proof_of_need_to_fixed && Array.isArray(fields.proof_of_need_to_fixed)) {
        fields.proof_of_need_to_fixed.forEach((file) => {
          if (file) formData.append("proof_of_need_to_fixed[]", file);
        });
      }

      if (fields.proof_of_payment && Array.isArray(fields.proof_of_payment)) {
        fields.proof_of_payment.forEach((file) => {
          if (file) formData.append("proof_of_payment[]", file);
        });
      }

      // Append other fields
      for (const key of Object.keys(fields)) {
        if (key !== "proof_of_need_to_fixed" && key !== "proof_of_payment") {
          const value = fields[key];
          if (value || value === 0) { // Ensure non-empty values are appended
            formData.append(key, value);
          }
        }
      }

      // Sending the data via POST request
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive-maintenance/submit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message);
        setIsOpenAdd(false);
        fetchmaintenanceData(); // Refresh data
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.errors}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred while submitting the data.");
    }
    setLoading(false);
  };


  const handleDelete = async () => {
    setLoading(true)
    if (fields.id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/preventive-maintenance/delete/${fields.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.ok) {
          toast.success("Data deleted successfully!");
          fetchmaintenanceData();
          setIsOpenDelete(false);
        } else {
          const errorData = await response.json();
          toast.error(`Error deleting data: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        toast.error("Error deleting data");
      }
    } else {
      toast.error("ID is not valid for deletion");
    }
    setLoading(false)
  };

  const renderCell = (data: maintenanceData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof maintenanceData];
    console.log("DATA", data.proof_of_need_to_fixed);
    console.log("DATA", data.proof_of_payment);

    if (columnKey === "proof_of_need_to_fixed") {
      if (typeof cellValue === "string") {
        try {
          const fileArray: string[] = JSON.parse(cellValue);
          return (
            <div className="space-y-1">
              {fileArray.map((file, index) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${file}`}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${file}`)}
                />
              ))}
            </div>
          );
        } catch (error) {
          return (
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
                alt="Uploaded file"
                className="w-20 h-20 object-cover rounded-md border border-gray-300"
                onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`)}
              />
            </div>
          );
        }
      }
      return null;

    }

    if (columnKey === "proof_of_payment") {
      if (typeof cellValue === "string") {
        try {
          const fileArray: string[] = JSON.parse(cellValue);
          return (
            <div className="space-y-1">
              {fileArray.map((file, index) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${file}`}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${file}`)}
                />
              ))}
            </div>
          );
        } catch (error) {
          return (
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
                alt="Uploaded file"
                className="w-20 h-20 object-cover rounded-md border border-gray-300"
                onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`)}
              />
            </div>
          );
        }
      }
      return null;

    }

    if (columnKey === "total_cost") {
      return `PHP ${data.quantity * parseFloat(data.price_parts_replaced)}`;
    }

    if (columnKey === "created_at") {
      if (cellValue && !isNaN(Date.parse(cellValue.toString()))) {
        const date = new Date(cellValue.toString());
        return (
          date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).replace(/ /g, "-") +
          ", " +
          date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
      return "";
    }
    if (columnKey === "actions") {
      return (
        <div className="flex flex-cols-4 gap-2 text-white">
          <TrashIcon
            className="text-red-700 w-6 h-6 cursor-pointer hover:text-red-500"
            onClick={() => handleOpenModal("delete", data.id)}
          />
          Delete
        </div>
      );
    }

    return <div>{cellValue}</div>;
  };


  const columns = [
    { name: "Created At", uid: "created_at", sortable: true },
    { name: "Truck Model", uid: "truck_model", sortable: true },
    { name: "Plate Number", uid: "plate_number", sortable: true },
    { name: "Parts Replaced", uid: "parts_replaced", sortable: true },
    { name: "Quantity", uid: "quantity", sortable: true },
    { name: "Price Per Part", uid: "price_parts_replaced", sortable: true },
    { name: "Total Cost", uid: "total_cost", sortable: true },
    { name: "Proof of Need", uid: "proof_of_need_to_fixed", sortable: false },
    { name: "Proof of Payment", uid: "proof_of_payment", sortable: false },
    { name: "Actions", uid: "actions" },
  ];

  const handleImageClick = (imageUrl: string) => {
    console.log("Opening image modal with URL:", imageUrl);
    setImagePreview(imageUrl);
    setIsImageModalOpen(true);
  };


  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedData(null);
  };

  const handleDetailsModal = (id: number) => {
    const foundData = maintenanceData.find((emp) => emp.id === id);
    if (foundData) {
      setSelectedData(foundData);
      setIsOpenDetails(true);
    } else {
      toast.error("Data not found.");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-between">
        <div className="mb-4 flex flex-col sm:flex-row lg:justify-start items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="plateNumber" className="font-medium dark:text-gray-800">
              Plate Number:
            </label>
            <select
              id="plateNumber"
              value={selectedPlate || ""}
              onChange={(e) => setSelectedPlate(e.target.value || null)}
              className="px-4 py-2 border rounded-md dark:bg-white dark:text-gray-800"
            >
              <option value="">All</option>
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
        </div>
        <div className="flex justify-center lg:justify-end mb-3 space-x-1">
          <Button className="text-xs lg:text-base" color="primary" onPress={handleOpenCreateModal}>
            + Add Vehicle
          </Button>
          <Export label="Export" />
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Truck Model"
          className="px-4 py-2 border rounded-md w-1/2 dark:bg-white 
          dark:text-gray-800 dark:placeholder:text-gray-800"
        />
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <div className="w-full overflow-x-auto">
        <div className="max-h-[500px]">
          <table className="min-w-full">
            <thead className="bg-gray-200  top-0 z-20">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.uid}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() =>
                      column.sortable &&
                      setSortDescriptor({
                        column: column.uid,
                        direction:
                          sortDescriptor.column === column.uid && sortDescriptor.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      })
                    }
                  >
                    {column.name}
                    {column.sortable && (
                      <span className="ml-2 text-xs">
                        {sortDescriptor.column === column.uid
                          ? sortDescriptor.direction === "ascending"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.id} className="border-t" onClick={() => handleDetailsModal(item.id)}>
                  {columns.map((column) => (
                    <td
                      key={column.uid}
                      className="py-3 px-4 text-sm text-gray-700"
                      onClick={(e) => {
                        if (["proof_of_need_to_fixed", "proof_of_payment", "actions"].includes(column.uid)) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {column.uid === "actions" ? (
                        <div onClick={(e) => e.stopPropagation()}>{renderCell(item, column.uid)}</div>
                      ) : (
                        renderCell(item, column.uid)
                      )}
                    </td>
                  ))}
                </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          disabled={page === pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      <ModalComponent
        isOpen={isOpenAdd}
        onOpenChange={setIsOpenAdd}
        fields={fields}
        setFields={setFields}
        handleSave={handleSave}
        loading={loading}
      />

      <Modal
        title="Delete Data"
        isOpen={isOpenDelete}
        onOpenChange={setIsOpenDelete}
        fields={fields}
        setFields={setFields}
        mode="delete"
        handleSave={handleDelete}
        loading={loading}
      />
      {selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData}
          title="Data"
        />
      )}
      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-end">
              <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon
                  width={30}
                />
              </button>
            </div>
            <img src={imagePreview || ""} alt="Full-size Image" className="w-50 h-50 mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}
