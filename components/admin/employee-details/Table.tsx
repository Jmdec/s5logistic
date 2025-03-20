"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DetailsModal from "./DetailsModal";
import { ArchiveBoxArrowDownIcon, EllipsisVerticalIcon, EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import Export from "@/components/accounting/export";
import RowsPerPage from "@/components/RowsPerPage";

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
  profile_image: string;
  files: File[];
  status: string;
  [key: string]: any;
}

export default function App() {
  const router = useRouter();
  const [EmployeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "delete" | "archive">("add");
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "employee_name",
    direction: "ascending",
  });
  // 
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
    profile_image: "",
    files: [],
    status: "",
  });

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-details`);
      const data = await response.json();
      if (Array.isArray(data.employeeData)) {
        setEmployeeData(data.employeeData);
      } else {
        console.error("Expected employeeData to be an array");
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
    return EmployeeData.filter((employee) =>
      employee.employee_name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [EmployeeData, filterValue]);

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

  const handleOpenModal = async (mode: "add" | "edit" | "delete" | "archive", id?: number) => {
    setMode(mode);
    if (mode === "edit" || mode === "delete" || mode === "archive") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-details/${id}`);
        const data = await response.json();
        setFields(data); -
          setIsOpen(true);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    } else {
      setFields({
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
        profile_image: "",
        files: [],
        status: "",
      });
      setIsOpen(true);
    }
  };

  const handleDetailsModal = (employeeId: number) => {
    const employee = EmployeeData.find((emp) => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setIsOpenDetails(true);
    } else {
      toast.error("Employee not found.");
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedEmployee(null);
  };

  const handleImageClick = (imageUrl: string) => {
    console.log("Opening image modal with URL:", imageUrl);
    setImagePreview(imageUrl);
    setIsImageModalOpen(true);
  };


  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const renderCell = (employee: EmployeeData, columnKey: React.Key) => {
    const cellValue = employee[columnKey as keyof EmployeeData];

    console.log(employee.profile_image)
    switch (columnKey) {
      case "profile_image":
        return (
          <div>
            <img
              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`}
              alt="Profile Image"
              className="h-10 w-10 rounded-full"
              onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`)}
            />
          </div>
        );

      case "files":
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
                    className="w-10 h-10 object-cover rounded-md border border-gray-300"
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
                  className="w-10 h-10 object-cover rounded-md border border-gray-300"
                  onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`)}
                />
              </div>
            );
          }
        }
      case "date_hired":
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
      case "birthday":
        if (cellValue && !isNaN(Date.parse(cellValue.toString()))) {
          return new Date(cellValue.toString()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).replace(/ /g, "-");
        }
        return "";
      case "status":
        return (
          <div>
            <Chip
              color={
                employee.status === "Active"
                  ? "success"
                  : "default"
              }
              variant="solid"
              className="px-4 py-2 text-white"
            >
              {employee.status}
            </Chip>
          </div>
        );
      case "actions":
        return (
          <div className="relative">
            <Dropdown className="z-50">
              <DropdownTrigger>
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
              </DropdownTrigger>
              <DropdownMenu className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                <DropdownItem
                  key="view"
                  onPress={() => handleDetailsModal(employee.id)}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <div className="flex">
                    <EyeIcon className="mr-2 w-5" /> View
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onPress={() => handleOpenModal("edit", employee.id)}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <div className="flex">
                    <PencilSquareIcon className="mr-2 w-5" /> Edit
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  onPress={() => handleOpenModal("delete", employee.id)}
                  className="flex items-center p-2 hover:bg-gray-100 text-red-600"
                >
                  <div className="flex">
                    <TrashIcon className="mr-2 w-5" /> Delete

                  </div>
                </DropdownItem>
                <DropdownItem
                  key="archive"
                  onPress={() => handleOpenModal("archive", employee.id)}
                  className="flex items-center p-2 hover:bg-gray-100 text-yellow-600"
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
    { name: "Status", uid: "status", sortable: true },
    { name: "Actions", uid: "actions" },
  ];


  const handleSave = async () => {
    setLoading(true)
    try {
      const formData = new FormData();

      if (fields.profile_image) {
        formData.append("profile_image", fields.profile_image);
        console.log(`Appended profile_image: ${fields.profile_image}`);
      }
      if (Array.isArray(fields.files)) {
        fields.files.forEach((file) => {
          formData.append("files[]", file);
          console.log(`Appended file: ${file.name}`);
        });
      }

      for (const key of Object.keys(fields)) {
        if (key !== "profile_image" && key !== "files") {
          const value = fields[key];
          if (value) {
            formData.append(key, value);
            console.log(`Appended: ${key} = ${value}`);
          }
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee/store`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setEmployeeData((prevData) => {
          const updatedEmployeeData = prevData.map((emp) => {
            if (emp.id === result.id) {
              return { ...emp, profile_image: result.profile_image };
            }
            return emp;
          });
          return updatedEmployeeData;
        });
        toast.success("Added successfully!");
        handleCloseModal();
        fetchEmployeeData();
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

      if (fields.profile_image) {
        formData.append("profile_image", fields.profile_image);
      }

      if (fields.files && Array.isArray(fields.files)) {
        fields.files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employees/${fields.id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        handleCloseModal();
        fetchEmployeeData();
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
    if (!fields.id) {
      toast.error("ID is missing");
      return;
    }
    console.log(fields.id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-delete/${fields.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Employee deleted successfully!");
        handleCloseModal();
        fetchEmployeeData();
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting employee: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
    setLoading(false)
  };

  const handleArchive = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/employee-archived/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARCHIVED" }),
      });

      if (response.ok) {
        toast.success("Employee archived successfully!");
        handleCloseModal();
        fetchEmployeeData();
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

  const handleNavigate = () => {
    router.push('/admin/employee/archived');
  }

  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(filteredItems);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Return Items");
  //   XLSX.writeFile(wb, "Employee Details.xlsx");
  // };
  // const exportToPDF = () => {
  //   const doc = new jsPDF(),
  //     margin = 20,
  //     lineHeight = 10,
  //     pageHeight = doc.internal.pageSize.height,
  //     pageWidth = doc.internal.pageSize.width,
  //     columnWidth = (pageWidth - 3 * margin) / 2,
  //     logoPath = '/logo.png',
  //     logoWidth = 30,
  //     logoHeight = 30,
  //     title = "S5 Logistics, Inc",
  //     totalWidth = logoWidth + doc.getTextWidth(title) + 5,
  //     logoX = (pageWidth - totalWidth) / 2;

  //   doc.addImage(logoPath, 'PNG', logoX, margin, logoWidth, logoHeight);
  //   doc.setFontSize(16);
  //   doc.text(title, logoX + logoWidth + 5, margin + logoHeight / 2);

  //   doc.setFontSize(10);
  //   const contactInfo = [
  //     "2nd Floor Total Pulo Cabuyao, Pulo Diezmo Rd, Cabuyao, Laguna",
  //     "Mobile: +639 270 454 343 / +639 193 455 535",
  //     "Email: gdrlogisticsinc@outlook.com"
  //   ];

  //   contactInfo.forEach((text, index) => {
  //     const textWidth = doc.getTextWidth(text);
  //     doc.text(text, (pageWidth / 2) - textWidth / 2, margin + logoHeight + 5 + index * 10);
  //   });

  //   doc.setFontSize(18);
  //   const returnItemsTitle = "Employee Details",
  //     returnItemsWidth = doc.getTextWidth(returnItemsTitle);
  //   doc.text(returnItemsTitle, (pageWidth / 2) - returnItemsWidth / 2, margin + logoHeight + 40);

  //   let y = margin + logoHeight + 50,
  //     columnIndex = 0;

  //   filteredItems.forEach((item, index) => {
  //     let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

  //     doc.setFontSize(8);
  //     doc.text(`Employee Detail # ${index + 1}:`, x, y);
  //     y += lineHeight;

  //     const details = [
  //       `Employee Name: ${item.employee_name}`,
  //       `ID Number: ${item.id_number}`,
  //       `Position: ${item.position}`,
  //       `Date Hired: ${item.date_hired}`,
  //       `Birthday: ${item.birthday}`,
  //       `Birth Place: ${item.birth_place}`,
  //       `Civil Status: ${item.civil_status}`,
  //       `Gender: ${item.gender}`,
  //       `Mobile: ${item.mobile}`,
  //       `Address: ${item.address}`,
  //       `Profile Image: ${item.profile_image}`,
  //       `Files: ${item.files}`,
  //       `Status: ${item.status}`,
  //     ];

  //     details.forEach((detail) => {
  //       const wrappedText = doc.splitTextToSize(detail, columnWidth);

  //       if (y + wrappedText.length * lineHeight > pageHeight - margin) {
  //         if (columnIndex === 0) {
  //           columnIndex = 1;
  //           y = margin + logoHeight + 50;
  //         } else {
  //           doc.addPage();
  //           columnIndex = 0;
  //           y = margin;
  //         }
  //         x = columnIndex === 0 ? margin : margin + columnWidth + margin;
  //       }

  //       wrappedText.forEach((line: string, idx: number) => {
  //         doc.text(line, x, y + idx * lineHeight);
  //       });

  //       y += wrappedText.length * lineHeight;
  //     });

  //     y += lineHeight;
  //   });

  //   doc.save("Employee Details.pdf");
  // };

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-end space-x-1 mb-5">
        <Button className="text-xs lg:text-base p-5" color="primary" onPress={() => handleOpenModal("add")}>
          + Add Employee Data
        </Button>
        <Export label="Export" />
      </div>
      <div className="flex justify-end">
        <Button className="text-xs lg:text-base p-5 ml-2 bg-transparent text-black border border-red-600" onPress={() => handleNavigate()}>
          View Archived Employees
        </Button>
      </div>
      <div className="mb-4 flex justify-between items-center space-x-4 mt-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Employee Name"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
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
        title={mode === "add" ? "Add Employee Data" :
          mode === "edit" ? "Edit Employee Data" :
            mode === "delete" ? "Delete Employee Data" :
              "Archive Employee Data  "
        }
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "add" ? handleSave :
          mode === "edit" ?
            handleEditSave : mode === "delete" ? handleDelete : handleArchive}
        loading={loading}
      />
      {selectedEmployee && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedEmployee}
          title="Employee Data"
        />
      )}
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
