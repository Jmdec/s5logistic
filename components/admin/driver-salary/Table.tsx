"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import ActivityLog from "./ActivityLog";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Export from "@/components/accounting/export";
import DetailsModal from "../DetailsModal";
import RowsPerPage from "@/components/RowsPerPage";

interface SalaryData {
  id: number;
  delivery_routes: string;
  driver_salary: number;
  helper_salary: number;
}

interface LogData {
  id: number;
  activity: string;
  created_at: string;
}

interface UserData {
  name: string;
  email: string;
}


export default function App() {
  const [salaries, setSalaries] = useState<SalaryData[]>([]);
  const [logData, setLogData] = useState<LogData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [filterValue, setFilterValue] = React.useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SalaryData | null>(null);
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"add" | "edit" | "delete">("add");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "driver_salary",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = React.useState(1);
  const [fields, setFields] = useState<SalaryData>({
    id: 0,
    delivery_routes: "",
    driver_salary: 0,
    helper_salary: 0,
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.error("User ID is not found in sessionStorage");
      }
    }
  }, []);

  const fetchSalaryData = async (retryCount = 0) => {
    let user_id = sessionStorage.getItem("user_id");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/salary?userId=${user_id}`
      );

      const data = await response.json();
      console.log("API Response:", data); // Debugging log

      if (response.status === 429) {
        let retryDelay = Math.min(5000 * (retryCount + 1), 30000); // Max delay 30s
        console.warn(`Too many requests. Retrying in ${retryDelay / 1000} seconds...`);

        setTimeout(() => fetchSalaryData(retryCount + 1), retryDelay);
        return;
      }

      // Check if the response is valid and contains salaries
      if (data && Array.isArray(data.salaries)) {
        setSalaries(data.salaries);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
  };


  const fetchLogs = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/activity-logs?userId=${userId}`
      );
      const data = await response.json();

      if (Array.isArray(data.activityLogs)) {
        setLogData(data.activityLogs);
      } else {
        console.error("Expected data to be an array");
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const fetchUser = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/users?userId=${userId}`
      );
      const data = await response.json();

      setUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchLogs();
    }
  }, [userId]);

  useEffect(() => {
    fetchSalaryData();

    const intervalId = setInterval(() => {
      fetchSalaryData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredSalaries = [...salaries];

    if (filterValue) {
      filteredSalaries = filteredSalaries.filter((salary) =>
        salary.delivery_routes.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredSalaries;
  }, [salaries, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof SalaryData];
      const second = b[sortDescriptor.column as keyof SalaryData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);



  const handleDetailsModal = (id: number) => {
    const foundData = salaries.find((emp) => emp.id === id);
    if (foundData) {
      setSelectedData(foundData);
      setIsOpenDetails(true);
    } else {
      toast.error("Data not found.");
    }
  };

  const handleOpenModal = async (mode: "add" | "edit" | "delete", id?: number) => {
    setMode(mode);

    if (mode === "edit" || mode === "delete" && id) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/salary/${id}`);
      const data = await response.json();

      setFields({
        id: data.id,
        delivery_routes: data.delivery_routes,
        driver_salary: data.driver_salary,
        helper_salary: data.helper_salary,
      });
    } else {
      setFields({
        id: 0,
        delivery_routes: "",
        driver_salary: 0,
        helper_salary: 0,
      });
    }

    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedData(null);
  };

  const renderCell = (salary: SalaryData, columnKey: React.Key) => {
    let cellValue = salary[columnKey as keyof SalaryData];

    switch (columnKey) {
      case "delivery_routes":
        return <div>{cellValue}</div>;

      case "driver_salary":
      case "helper_salary":
        cellValue = Number(cellValue);
        if (!isNaN(cellValue)) {
          const formattedValue = cellValue.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
          });
          return <div>{formattedValue}</div>;
        } else {
          return <div>₱0.00</div>;
        }

      case "total_salary":
        const driverSalary = Number(salary.driver_salary);
        const helperSalary = Number(salary.helper_salary);
        const totalSalary = driverSalary + helperSalary;

        const formattedTotal = isNaN(totalSalary) ? "₱0.00" : totalSalary.toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
        });

        return <div>{formattedTotal}</div>;

      case "actions":
        return (
          <div className="flex">
            <PencilSquareIcon onClick={() => handleOpenModal("edit", salary.id)}
              className="text-blue-700 w-6 h-6 cursor-pointer hover:text-blue-500" />
            <TrashIcon onClick={() => handleOpenModal("delete", salary.id)}
              className="text-red-700 w-6 h-6 cursor-pointer hover:text-red-500" />
          </div>
        );

      default:
        return cellValue;
    }
  };

  const columns = [
    { name: "Delivery Routes", uid: "delivery_routes", sortable: true },
    { name: "Driver Salary", uid: "driver_salary", sortable: true },
    { name: "Helper Salary", uid: "helper_salary", sortable: true },
    { name: "Actions", uid: "actions" },
  ];

  // For Salary
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("delivery_routes", fields.delivery_routes);
      formData.append("driver_salary", fields.driver_salary.toString()); // Convert number to string
      formData.append("helper_salary", fields.helper_salary.toString()); // Convert number to string

      console.log("Request Payload:", Object.fromEntries(formData.entries())); // Debugging

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/salary-store`, {
        method: "POST",
        body: formData, // Send FormData correctly
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid JSON response from the server");
      }

      if (response.ok) {
        console.log("Response Data:", responseData);
        toast.success(responseData.message);
        handleCloseModal();
      } else {
        if (response.status === 422) {
          const validationErrors = responseData.errors || {};
          Object.keys(validationErrors).forEach((field) => {
            toast.error(`${field.replace("_", " ")}: ${validationErrors[field].join(", ")}`);
          });
        } else {
          toast.error(responseData.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Network error or server is unreachable");
    }
    setLoading(false);
  };

  const handleEditSave = async () => {
    setLoading(true);
    if (!fields.id) {
      toast.error("ID is missing");
      setLoading(false);
      return;
    }

    const payload = {
      id: fields.id,
      delivery_routes: fields.delivery_routes,
      driver_salary: fields.driver_salary,
      helper_salary: fields.helper_salary,
    };

    console.log("Edit Request Payload:", payload);

    const fetchData = async (retries = 3) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/salary-update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 429) {
          if (retries > 0) {
            console.log("Rate-limited. Retrying...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchData(retries - 1);
          } else {
            throw new Error("Too many requests. Please try again later.");
          }
        }

        const data = await response.json();
        console.log("Parsed JSON:", data);

        if (response.status === 200 && data.message) {
          toast.success(data.message);
          handleCloseModal();
        } else {
          toast.error(data.message || "Error submitting data");
        }

      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Error submitting data");
      } finally {
        setLoading(false);
      }
    };

    await fetchData();
  };


  const handleDelete = async () => {
    setLoading(true)
    console.log(fields.id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/salary-delete/${fields.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Deleted successfully!");
        fetchSalaryData();
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting data: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting data");
    }
    setLoading(false)
  };

  const openLogModal = async () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-start">
        <Button className="text-xs lg:text-base mb-2" color="primary" onPress={openLogModal}>
          View Activity Logs
        </Button>
        {isModalOpen && (
          <ActivityLog logData={logData} userData={userData} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
      <div className="flex justify-end space-x-1 mb-2">
        <Button className="text-xs lg:text-base" color="primary" onPress={() => handleOpenModal("add")}>
          + Add Data
        </Button>
        <Export label="Export" />
      </div>
      <div className="mb-4 flex justify-between items-center space-x-4">
        <input 
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Delivery Routes"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
        />
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <div className="w-full overflow-x-auto">
        <div className="max-h-[400px]">
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
                        {sortDescriptor.column === column.uid ? (sortDescriptor.direction === "ascending" ? "↑" : "↓") : "↕"}
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
        title={mode === "add" ? "Add Salary Data" : mode === "edit" ? "Edit Salary Data" : "Delete Salary Data"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "add" ? handleSave : mode === "edit" ? handleEditSave : handleDelete}
        loading={loading}
      />
      {selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData}
          title="Driver Salary Data"
        />
      )}
    </div>
  );
}
