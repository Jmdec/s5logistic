"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { ArrowUpIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface EmployeeData {
  id: number;
  employee_name: string;
  id_number: string;
  position: string;
  date_hired: string;
  birthday: string;
  birth_place: string;
  civil_status: string;
  gender: string;
  mobile: string;
  address: string;
  profile_image: File | null;
  files: File[];
  status: string;
  [key: string]: any;
}

export default function Archived() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit" | "delete" | "archive" | "unarchive">("add");
  const [loading, setLoading] = useState(false);
  const [salaries, setArchived] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "employee_name",
    direction: "ascending",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [fields, setFields] = useState<EmployeeData>({
    id: 0,
    employee_name: "",
    id_number: "",
    position: "",
    date_hired: "",
    birthday: "",
    birth_place: "",
    civil_status: "",
    gender: "",
    mobile: "",
    address: "",
    profile_image: null,
    files: [],
    status: "",
  });

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-archived`);
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setArchived(data.data);
      } else {
        console.error("Expected data.data to be an array");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    const intervalId = setInterval(fetchEmployeeData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return salaries.filter((employee) =>
      employee.employee_name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [salaries, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof EmployeeData];
      const second = b[sortDescriptor.column as keyof EmployeeData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleImageClick = (imageUrl: string) => {
    setImagePreview(imageUrl); // Set the image preview URL
    setIsImageModalOpen(true); // Open the modal
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false); // Close the modal
    setImagePreview(null); // Reset the image preview
  };

  const renderCell = (employee: EmployeeData, columnKey: React.Key) => {
    const cellValue = employee[columnKey as keyof EmployeeData];

    switch (columnKey) {
      case "profile_image":
        return (
          <div>
            {cellValue ? (
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
                alt="Profile Image"
                className="h-10 w-10 rounded-full"
                onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`)}
              />
            ) : (
              <span>No image</span>
            )}
          </div>
        );

      case "files":
        const parsedData = typeof employee.files === 'string'
          ? JSON.parse(employee.files)
          : employee.files;

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return (
            <div>
              {parsedData.map((filePath, index) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${filePath.replace(/\\/g, '/')}`;
                return (
                  <div key={index}>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      View File
                    </a>
                  </div>
                );
              })}
            </div>
          );
        } else {
          return <div>No files available</div>;
        }
      case "date_hired":
      case "birthday":
        if (cellValue && !isNaN(Date.parse(cellValue.toString()))) {
          const date = new Date(cellValue.toString());

          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).replace(/ /g, "-");

          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return `${formattedDate}, ${formattedTime}`;
        }
        return "";

      case "actions":
        return (
          <div className="relative">
            <Dropdown className="z-50">
              <DropdownTrigger>
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
              </DropdownTrigger>
              <DropdownMenu className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                <DropdownItem
                  key="unarchive"
                  onPress={() => handleOpenModal("unarchive", employee.id)}
                  className="flex items-center p-2 hover:bg-gray-100 text-green-600"
                >
                  <div className="flex">
                    <ArrowUpIcon className="mr-2 w-5" /> Unarchive
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
    { name: "Employee Name", uid: "employee_name", sortable: true },
    { name: "ID Number", uid: "id_number", sortable: true },
    { name: "Position", uid: "position", sortable: true },
    { name: "Date Hired", uid: "date_hired", sortable: true },
    { name: "Birthday", uid: "birthday", sortable: true },
    { name: "Birth Place", uid: "birth_place", sortable: true },
    { name: "Civil Status", uid: "civil_status", sortable: true },
    { name: "Gender", uid: "gender", sortable: true },
    { name: "Mobile", uid: "mobile", sortable: true },
    { name: "Address", uid: "address", sortable: true },
    { name: "Profile Image", uid: "profile_image", sortable: false },
    { name: "Files", uid: "files", sortable: false },
    { name: "Actions", uid: "actions", sortable: false },
  ];

  const handleNavigate = () => {
    router.push('/admin/employee/details');
  };

  const handleOpenModal = async (mode: "add" | "edit" | "delete" | "archive" | "unarchive", id?: number) => {
    setMode(mode);
    if (mode === "edit" || mode === "delete" || mode === "archive" || mode === "unarchive") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-details/${id}`);
        const data = await response.json();
        setFields(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedEmployee(null);
  };

  const handleUnarchive = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-unarchived/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" }),
      });

      if (response.ok) {
        toast.success("Employee unarchived successfully!");
        handleCloseModal();
        fetchEmployeeData();
      } else {
        const errorData = await response.json();
        toast.error(`Error unarchiving employee: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error unarchiving employee:", error);
      toast.error("Error unarchiving employee");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-start">
        <Button className="ml-2 bg-red-600 text-white border mb-4 " onPress={() => handleNavigate()}>
          Back
        </Button>
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Employee Name"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
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
                <tr key={item.id} className="border-t">
                  {columns.map((column) => (
                    <td key={column.uid} className="py-3 px-4 text-sm text-gray-700">
                      {renderCell(item, column.uid)}
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
        title={mode === "add" ? "Add Employee Data" :
          mode === "edit" ? "Edit Employee Data" :
            mode === "delete" ? "Delete Employee Data" :
              "Unarchive Employee Data"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "unarchive" ? handleUnarchive : () => { }}
        loading={loading}
      />
      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg w-1/2">
            <div className="flex justify-end">
              <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon
                  width={30}
                />
              </button>
            </div>
            <img src={imagePreview || ""} alt="Full-size Image" className="w-full h-auto mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}
