"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import DetailsModal from "../DetailsModal";
import { ArrowPathIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import Export from "@/components/accounting/export";
import RowsPerPage from "@/components/RowsPerPage";

interface DriverData {
  id: number;
  name: string;
  email: string;
  driver_license: string;
  license_number: string;
  contact_number: string;
  address: string;
  plate_number: string;
  driver_image: string;
  status: string;
  [key: string]: any;
}

export default function Table() {
  const [DriverData, setDriverData] = useState<DriverData[]>([]);
  const [selectedData, setSelectedData] = useState<DriverData | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"renew" | "terminate" | "edit" | "delete">("renew");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState<DriverData>({
    id: 0,
    name: "",
    email: "",
    driver_license: "",
    license_number: "",
    contact_number: "",
    address: "",
    plate_number: "",
    driver_image: "",
    license_expiration: "",
    status: "",
  });

  const fetchDriverData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/drivers`);
      const data = await response.json();
      if (Array.isArray(data.DriverData)) {
        setDriverData(data.DriverData);
      } else {
        console.error("Expected DriverData to be an array");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchDriverData();
    const intervalId = setInterval(fetchDriverData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return DriverData.filter((data) =>
      data.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [DriverData, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof DriverData];
      const second = b[sortDescriptor.column as keyof DriverData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (data: DriverData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof DriverData];

    const formatStatus = (status: string | null | undefined) => {
      if (!status) return "";
      return status
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    switch (columnKey) {
      case "driver_license":
        return (
          <div>
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
              alt="Driver Image"
              className="h-10 w-10 rounded-full"
            />
          </div>
        );
      case "driver_image":
        return (
          <div>
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
              alt="Driver Image"
              className="h-10 w-10 rounded-full"
            />
          </div>
        );
      case "status":
        const isLicenseExpired = new Date(data.license_expiration) < new Date();
        const hasStatus = data.status && data.status.trim() !== "";

        return (
          <div>
            {isLicenseExpired && !hasStatus ? (
              <Chip color="warning" variant="solid" className="px-4 py-2 text-white">
                License Expired
              </Chip>
            ) : data.status === "renewed" && isLicenseExpired ? (
              <Chip color="warning" variant="solid" className="px-4 py-2 text-white">
                License Expired
              </Chip>
            ) : (
              <Chip
                color={
                  data.status === "terminated"
                    ? "danger"
                    : data.status === "renewed"
                      ? "success"
                      : "default"
                }
                variant="solid"
                className="px-4 py-2 text-white"
              >
                {formatStatus(data.status)}
              </Chip>
            )}
          </div>

        );

      case "actions":
        return (
          <div>
            <div className="relative">
              <Dropdown className="z-50">
                <DropdownTrigger>
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
                </DropdownTrigger>
                <DropdownMenu className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                  {/* Edit Option */}
                  <DropdownItem
                    key="edit"
                    onPress={() => handleOpenModal("edit", data.id)}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-200 
                    dark:hover:text-gray-800 text-blue-700"
                  >
                    <div className="flex items-center gap-2 ">
                      <PencilSquareIcon className="mr-2 w-5" /> <p>Edit</p>
                    </div>
                  </DropdownItem>
                  {/* Delete Option */}
                  <DropdownItem
                    key="delete"
                    onPress={() => handleOpenModal("delete", data.id)}
                    className="flex items-center p-2 hover:bg-gray-100 text-red-600 dark:hover:bg-gray-200 
                    dark:hover:text-red-600"
                  >
                    <div className="flex items-center gap-2">
                      <TrashIcon className="mr-2 w-5" /> <p>Delete</p>
                    </div>
                  </DropdownItem>

                  {/* Terminate Option (if status is 'renewed' or expired) */}
                  {data.status === "renewed" || new Date(data.license_expiration) < new Date() ? (
                    <DropdownItem
                      key="terminate"
                      onPress={() => handleOpenModal("terminate", data.id)}
                      className="flex items-center p-2 hover:bg-gray-100 text-red-600 dark:hover:bg-gray-200 
                    dark:hover:text-red-600"
                    >
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="text-red-600 font-bold w-5 h-5 cursor-pointer" />
                        <span>Terminate</span>
                      </div>
                    </DropdownItem>
                  ) : null}

                  {/* Renew Option (if status is 'terminated') */}
                  {data.status === "terminated" ? (
                    <DropdownItem
                      key="renew"
                      onPress={() => handleOpenModal("renew", data.id)}
                      className="flex items-center p-2 hover:bg-gray-100 text-green-600
                      dark:hover:bg-gray-200 
                    dark:hover:text-green-600"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowPathIcon className="text-green-600 font-bold w-5 h-5 cursor-pointer" />
                        <p>Renew</p>
                      </div>
                    </DropdownItem>
                  ) : null}

                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        );

      default:
        return <div>{cellValue}</div>;
    }
  };

  const columns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Driver License", uid: "driver_license", sortable: true },
    { name: "License Number", uid: "license_number", sortable: true },
    { name: "Contact Number", uid: "contact_number", sortable: true },
    { name: "Address", uid: "address", sortable: true },
    { name: "Driver Image", uid: "driver_image", sortable: false },
    { name: "Status", uid: "status", sortable: true },
    { name: "Actions", uid: "actions" },
  ];

  const handleOpenModal = async (mode: "renew" | "terminate" | "delete" | "edit", id?: number) => {
    setMode(mode);

    if (id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/driver/${id}`);
        const data = await response.json();
        if (!data.id) {
          throw new Error("Driver ID is missing in the API response.");
        }

        setFields(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching driver data:", error);
        toast.error("Error fetching driver data.");
      }
    } else {
      console.error("Driver ID is missing in handleOpenModal.");
      toast.error("Driver ID is missing.");
    }
  };

  const handleRenew = async () => {
    setLoading(true)
    if (!fields.id) {
      toast.error("Driver ID is missing");
      console.error("Driver ID is missing in handleRenew. Fields:", fields);
      return;
    }

    console.log("Driver ID:", fields.id);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/driver/renew/${fields.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "renewed" }),
      });

      if (response.ok) {
        toast.success("Driver renewed successfully!");
        fetchDriverData();
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(`Error renewing driver: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error renewing driver:", error);
      toast.error("Error renewing driver.");
    }
    setLoading(false)
  };


  const handleTerminate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/driver/terminate/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "terminated" }),
      });

      if (response.ok) {
        toast.success("Employee terminated successfully!");
        fetchDriverData();
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(`Error archiving employee: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error archiving employee:", error);
      toast.error("Error archiving employee");
    }
    setLoading(false)
  };

  const handleEditSave = async () => {
    setLoading(true)
    if (!fields.id) {
      toast.error("ID is missing");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(fields).forEach((key) => {
        const value = fields[key];
        if (value && typeof value !== "object") {
          formData.append(key, value);
        }
      });

      if (fields.driver_image) {
        formData.append("driver_image", fields.driver_image);
      }
      if (fields.driver_license) {
        formData.append("driver_license", fields.driver_license);
      }


      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/driver/update/${fields.id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        handleCloseModal();
        fetchDriverData();
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(", ");
          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          toast.error(`Error updating data: ${errorData.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    }
    setLoading(false)
  };

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/driver/delete/${fields.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Deleted successfully!");
        fetchDriverData();
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting data: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error archiving employee:", error);
      toast.error("Error archiving employee");
    }
    setLoading(false)
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedData(null);
  };

  const handleDetailsModal = (id: number) => {
    const foundData = DriverData.find((emp) => emp.id === id);
    if (foundData) {
      setSelectedData(foundData);
      setIsOpenDetails(true);
    } else {
      toast.error("Data not found.");
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex flex-col items-end">
        <div className="flex justify-end mb-3 gap-4">
          {/* <Button className="text-xs lg:text-base" color="primary" onPress={() => handleOpenModal("add")}>
            + Add Data
          </Button> */}
          <div>
            <Export label="Export" />
          </div>
        </div>

        <div className="w-full mt-4 mb-2">
          <div className="flex justify-between items-center gap-4">

            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Search by Driver Name"
              className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
            />
            <RowsPerPage
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          </div>
        </div>
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
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={mode === "renew" ? "Renew Driver" : mode === "terminate" ? "Terminate Driver" : mode === "edit" ? "Edit Driver" : "Delete Driver"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "terminate" ? handleTerminate : mode === "renew" ?
          handleRenew : mode === "delete" ? handleDelete : handleEditSave}
        loading={loading}
      />

      {selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData}
          title="Driver Data"
        />
      )}
    </div>
  );
}
