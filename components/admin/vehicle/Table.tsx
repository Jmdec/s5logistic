"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DetailsModal from "../DetailsModal";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { ArchiveBoxArrowDownIcon, EllipsisVerticalIcon, EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Chip } from "@heroui/chip";
import Export from "@/components/accounting/export";
import RowsPerPage from "@/components/RowsPerPage";

interface VehicleData {
  id: number;
  truck_name: string;
  plate_number: string;
  operator_name: string;
  truck_model: string;
  truck_capacity: string;
  quantity: number;
  or_docs: File | null;
  cr_docs: File | null;
  truck_status: string;
  [key: string]: any;
}

export default function App() {
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "archive">("add");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "truck_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState<VehicleData>({
    id: 0,
    truck_name: "",
    plate_number: "",
    operator_name: "",
    truck_model: "",
    truck_capacity: "",
    quantity: 0,
    or_docs: null,
    cr_docs: null,
    truck_status: "",
  });

  const fetchVehicleData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/vehicle/active`);
      const data = await response.json();
      if (Array.isArray(data.vehicles)) {
        setVehicleData(data.vehicles);
      } else {
        console.error("Expected VehicleData to be an array");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    fetchVehicleData();
    const intervalId = setInterval(fetchVehicleData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return vehicleData.filter((data) =>
      data.truck_name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [vehicleData, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof VehicleData];
      const second = b[sortDescriptor.column as keyof VehicleData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleOpenModal = async (mode: "add" | "edit" | "archive", id?: number) => {
    setMode(mode);
    if (mode === "edit" || mode === "archive") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/vehicle-details/${id}`);
        const data = await response.json();

        console.log(data);
        setFields({
          ...data.data,
        });

        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    } else {
      setFields({
        id: 0,
        truck_name: "",
        plate_number: "",
        operator_name: "",
        truck_model: "",
        truck_capacity: "",
        quantity: 0,
        or_docs: null,
        cr_docs: null,
        truck_status: "",
      });
      setIsOpen(true);
    }
  };

  const renderCell = (data: VehicleData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof VehicleData];
    const formatStatus = (status: string | null | undefined) => {
      if (!status) return "";
      return status
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
    switch (columnKey) {
      case "or_docs":
      case "cr_docs":
        return typeof cellValue === "string" ? (
          <div>
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
              alt="Image"
              className="h-10 w-10 rounded-full"
            />
          </div>

        ) : (
          "No File"
        );
      case "truck_status":
        return (
          <div>
            <Chip
              color={
                data.truck_status === "AVAILABLE"
                  ? "success"
                  : "default"
              }
              variant="solid"
              className="px-4 py-2 text-white text-xs lg:text-base"
            >
              {formatStatus(data.truck_status)}
            </Chip>
          </div>
        );
      case "actions":
        return (
          <div className="relative">
            <Dropdown className="z-50 w-2 h-2">
              <DropdownTrigger>
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
              </DropdownTrigger>
              <DropdownMenu className="absolute right-0 mt-2 bg-white border 
              border-gray-300 rounded-lg shadow-lg w-48">
                <DropdownItem
                  key="view"
                  onPress={() => handleDetailsModal(data.id)}
                  className="flex items-center p-2 hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-200"
                >
                  <div className="flex">
                    <EyeIcon className="mr-2 w-5" /> View
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onPress={() => handleOpenModal("edit", data.id)}
                  className="flex items-center p-2 hover:bg-gray-100 dark:text-blue-600 dark:hover:bg-gray-200"
                >
                  <div className="flex">
                    <PencilSquareIcon className="mr-2 w-5" /> Edit
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="archive"
                  onPress={() => handleOpenModal("archive", data.id)}
                  className="flex items-center p-2 hover:bg-gray-100 text-yellow-600 dark:text-yellow-600 dark:hover:bg-gray-200"
                >
                  <div className="flex">
                    <ArchiveBoxArrowDownIcon className="mr-2 w-5" /> Archive
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return <div>{cellValue}</div>;
    }
  };

  const columns = [
    { name: "Truck Name", uid: "truck_name", sortable: true },
    { name: "Plate Number", uid: "plate_number", sortable: true },
    { name: "Operator", uid: "operator_name", sortable: true },
    { name: "OR Document", uid: "or_docs", sortable: false },
    { name: "CR Document", uid: "cr_docs", sortable: false },
    { name: "Status", uid: "truck_status", sortable: true },
    { name: "Actions", uid: "actions" },
  ];
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (fields.or_docs) {
        formData.append("or_docs", fields.or_docs);
        console.log(`Appended or: ${fields.or_docs}`);
      }
      if (fields.cr_docs) {
        formData.append("cr_docs", fields.cr_docs);
        console.log(`Appended cr: ${fields.cr_docs}`);
      }

      for (const key of Object.keys(fields)) {
        if (key !== "or_docs" && key !== "cr_docs") {
          const value = fields[key];
          if (value) {
            formData.append(key, value);
            console.log(`Appended: ${key} = ${value}`);
          }
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/vehicle-store`, {
        method: "POST",
        body: formData,
      });

      const errorData = await response.json();
      console.log("Error Data:", errorData);

      if (response.ok) {
        // Success scenario
        toast.success("Added successfully!");
        handleCloseModal();
        fetchVehicleData();
      } else {
        // Error scenario
        if (errorData.errors) {
          // Collect all validation error messages
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(", ");

          // Display the validation errors in a toast
          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          // General error if no specific validation errors
          toast.error(`Error adding data: ${errorData.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again");
    } finally {
      setLoading(false);  // Stop the loading indicator
    }
  };




  const handleEditSave = async () => {
    setLoading(true)
    if (!fields.id) {
      toast.error("Vehicle ID is missing");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(fields).forEach((key) => {
        if (key !== "image" && key !== "file") {
          formData.append(key, fields[key]);
        }
      });

      if (fields.image) {
        formData.append("image", fields.image);
      }

      if (fields.file) {
        formData.append("file", fields.file);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/vehicle-update/${fields.id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        handleCloseModal();
        fetchVehicleData();
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(", ");
          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          toast.error(`Error updating vehicle data: ${errorData.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error updating vehicle data:", error);
      toast.error("Error updating vehicle data");
    }
    setLoading(false)
  };

  const handleArchive = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/vehicle-archive/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Vehicle archived successfully!");
        fetchVehicleData();
      } else {
        const errorData = await response.json();
        toast.error(`Error archiving vehicle: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error archiving vehicle:", error);
      toast.error("Error archiving vehicle");
    }
    setLoading(false)
  };

  const handleDetailsModal = (id: number) => {
    const data = vehicleData.find((item) => item.id === id);
    if (data) {
      setSelectedVehicle(data);
      setIsOpenDetails(true);
    } else {
      toast.error("Vehicle not found.");
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedVehicle(null);
  };

  const handleNavigate = () => {
    router.push('/admin/vehicle/archived');
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto mb-4">
      <div className="flex justify-end mb-3 gap-4">
        <Button className="text-xs lg:text-base" color="primary" onPress={() => handleOpenModal("add")}>
          + Add Data
        </Button>
        <div>
          <Export label="Export" />
        </div>
      </div>
      <div className="flex justify-end mt-4 mb-3">
        <Button className="ml-2 bg-transparent text-black border border-red-600 text-xs lg:text-base" onPress={() => handleNavigate()}>
          View Archived Vehicles
        </Button>
      </div>
      <div className="mb-4 flex gap-4 lg:justify-between space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Truck Name"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
        />
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />

      </div>
      <div className="w-full overflow-x-auto">
        <div className="max-h-[300px]">
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
                    <td key={column.uid} className="py-3 px-4 text-sm text-gray-700">
                      {column.uid === 'actions' ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          {renderCell(item, column.uid)}
                        </div>
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
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center dark:text-gray-800">
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
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={
          mode === "add"
            ? "Add Vehicle Data"
            : mode === "edit"
              ? "Edit Vehicle Data"
              : mode === "archive"
                ? "Archive Vehicle Data"
                : "Vehicle Data"
        }
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={
          mode === "add"
            ? handleSave
            : mode === "edit"
              ? handleEditSave
              : handleArchive
        }
        loading={loading}
      />


      {selectedVehicle && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedVehicle}
          title="Vehicle Data"
        />
      )}
    </div>
  );
}
