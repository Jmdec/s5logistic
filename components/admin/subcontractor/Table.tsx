"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DetailsModal from "../DetailsModal";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { EllipsisVerticalIcon, EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import Export from "@/components/accounting/export";
import RowsPerPage from "@/components/RowsPerPage";

interface SubcontractorData {
  id: number;
  company_name: string;
  subcontractor_id: string;
  full_name: string;
  address: string;
  email_address: string;
  phone_number: string;
  file_upload: string;
  plate_number: string;
  truck_capacity: string;
}

export default function App() {
  const router = useRouter();
  const [SubcontractorData, setSubcontractorData] = useState<SubcontractorData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedData, setselectedData] = useState<SubcontractorData | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "delete" | "archive">("add");
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "full_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState({
    id: 0,
    company_name: "",
    subcontractor_id: "",
    full_name: "",
    address: "",
    email_address: "",
    plate_number: "",
    truck_capacity: "",
    phone_number: "",
    file_upload: null,
  });


  const fetchSubcontractorData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/subcontractor`);
      const text = await response.text();

      console.log("Raw Response:", text);
      const data = JSON.parse(text);

      if (Array.isArray(data.subcontractor)) {
        setSubcontractorData(data.subcontractor);
      } else {
        console.error("Expected 'subcontractor' to be an array but got:", data);
        toast.error("Failed to load subcontractor data.");
      }
    } catch (error) {
      console.error("Error fetching subcontractor data:", error);
      toast.error("Error fetching subcontractor data.");
    }
  };


  useEffect(() => {
    fetchSubcontractorData();
    const intervalId = setInterval(fetchSubcontractorData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return SubcontractorData.filter((data) =>
      data.full_name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [SubcontractorData, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof SubcontractorData];
      const second = b[sortDescriptor.column as keyof SubcontractorData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const handleOpenModal = async (mode: "add" | "edit" | "delete" | "archive", id?: number) => {
    setMode(mode);
    if (mode === "edit" || mode === "archive" || mode === "delete") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/subcontractor-get/${id}`);
        const data = await response.json();
        setFields({
          id: data.data.id || 0,
          company_name: data.data.company_name || "",
          subcontractor_id: data.data.subcontractor_id || "",
          full_name: data.data.full_name || "",
          address: data.data.address || "",
          email_address: data.data.email_address || "",
          plate_number: data.data.plate_number || "",
          truck_capacity: data.data.truck_capacity || "",
          phone_number: data.data.phone_number || "",
          file_upload: data.data.file_upload || "",
        });
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching Subcontractor data:", error);
      }
    } else {
      setFields({
        id: 0,
        company_name: "",
        subcontractor_id: "",
        full_name: "",
        address: "",
        email_address: "",
        plate_number: "",
        truck_capacity: "",
        phone_number: "",
        file_upload: null,
      });
      setIsOpen(true);
    }
  };

  const handleEditSave = async () => {
    setLoading(true);

    if (!fields || !fields.id) {
      toast.error("ID is missing or fields are empty");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      (Object.keys(fields) as (keyof SubcontractorData)[]).forEach((key) => {
        const value = fields[key];

        if (value) {
          formData.append(key, value.toString());
        }
      });

      if (fields.file_upload && typeof fields.file_upload !== "string") {
        formData.append("file_upload", fields.file_upload);
      }

      console.log("Submitting FormData:", Object.fromEntries(formData.entries()));

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/subcontractor-update/${fields.id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        handleCloseModal();
        fetchSubcontractorData();
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

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true)
    if (!fields.id) {
      toast.error("ID is missing");
      return;
    }
    console.log(fields.id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/subcontractor-delete/${fields.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Subcontractor deleted successfully!");
        handleCloseModal();
        fetchSubcontractorData();
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting Subcontractor: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting Subcontractor:", error);
      toast.error("Error deleting Subcontractor");
    }
    setLoading(false)
  };


  const handleDetailsModal = (SubcontractorId: number) => {
    const Subcontractor = SubcontractorData.find((emp) => emp.id === SubcontractorId);
    if (Subcontractor) {
      setselectedData(Subcontractor);
      setIsOpenDetails(true);
    } else {
      toast.error("Subcontractor not found.");
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setselectedData(null);
  };

  const renderCell = (data: SubcontractorData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof SubcontractorData];

    switch (columnKey) {
      case "file_upload":
        if (typeof cellValue === "string") {
            return (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
                  alt="Uploaded file"
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                />
              </div>
            );
        }
        return null;


      case "actions":
        return (
          <div>
            <div className="relative dark:text-gray-800">
              <Dropdown className="z-50">
                <DropdownTrigger>
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer " />
                </DropdownTrigger>
                <DropdownMenu className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                  <DropdownItem
                    key="view"
                    onPress={() => handleDetailsModal(data.id)}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-300"
                  >
                    <div className="flex dark:text-gray-800">
                      <EyeIcon className="w-6 h-6 cursor-pointer 
                      hover:text-blue-500" /> View
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleOpenModal("edit", data.id)}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-300"
                  >
                    <div className="flex dark:text-blue-800">
                      <PencilSquareIcon className="mr-2 w-5" /> Edit
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    onPress={() => handleOpenModal("delete", data.id)}
                    className="flex items-center p-2 hover:bg-gray-100 
                    text-red-600 dark:hover:bg-gray-300 dark:hover:text-red-600"
                  >
                    <div className="flex " >
                      <TrashIcon className="mr-2 w-5" /> Delete

                    </div>
                  </DropdownItem>
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
    { name: "Company Name", uid: "company_name", sortable: true },
    { name: "Subcontractor ID", uid: "subcontractor_id", sortable: true },
    { name: "Full Name", uid: "full_name", sortable: true },
    { name: "Address", uid: "address", sortable: true },
    { name: "Email Address", uid: "email_address", sortable: true },
    { name: "Phone Number", uid: "phone_number", sortable: true },
    { name: "File Upload", uid: "file_upload", sortable: false },
    { name: "Plate Number", uid: "plate_number", sortable: true },
    { name: "Truck Capacity", uid: "truck_capacity", sortable: true },
    { name: "Actions", uid: "actions" },
  ];

  const handleSave = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("company_name", fields.company_name);
      formData.append("subcontractor_id", fields.subcontractor_id);
      formData.append("full_name", fields.full_name);
      formData.append("address", fields.address);
      formData.append("email_address", fields.email_address);
      formData.append("plate_number", fields.plate_number);
      formData.append("truck_capacity", fields.truck_capacity);
      formData.append("phone_number", fields.phone_number);
      if (fields.file_upload) {
        formData.append("file_upload", fields.file_upload);
        console.log("Appended file_upload:", fields.file_upload);
      }

      // Send the form data
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/subcontractor/store`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Added successfully!");
        handleCloseModal();
        fetchSubcontractorData();
      } else {
        const errorData = await response.json();

        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(", ");

          toast.error(`Validation failed: ${errorMessages}`);
        } else {
          toast.error(`Error adding data: ${errorData.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    }
    setLoading(false)
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
         <div className="flex justify-end mb-3 gap-4">
          <Button className="text-xs lg:text-base" color="primary" onPress={() => handleOpenModal("add")}>
            + Add Data
          </Button>
          <div>
            <Export label="Export" />
          </div>
        </div>
      <div className="mb-4 flex justify-between space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Subcontractor Name"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
        />
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      <div className="w-full overflow-auto">
        <div className="max-h-[400px]">
          <table className="min-w-full">
            <thead className="bg-gray-200 top-0 z-20">
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

            <tbody className="overflow-y-auto">
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
        title={mode === "add" ? "Add Subcontractor Data" : mode === "edit" ? "Edit Data" : "Delete Data"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "add" ? handleSave :
          mode === "edit" ?
            handleEditSave : mode === "delete" ? handleDelete : handleCloseModal}
        loading={loading}
      />
      {isOpenDetails && selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData || {}}
          title="Subcontractor Details"
        />
      )}


    </div>
  );
}
