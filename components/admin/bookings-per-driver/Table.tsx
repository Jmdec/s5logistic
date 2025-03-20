"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DetailsModal from "../DetailsModal";

interface DriverData {
  id: number;
  driver_id: string;
  driver_name: string;
  created_at: string;
  products: string;
  origin: string;
  destination: string;
}

export default function App() {
  const router = useRouter();
  const [driverData, setDriverData] = useState<DriverData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedData, setSelectedData] = useState<DriverData | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "delete" | "archive">("add");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "driver_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState({
    driver_id: "",
    driver_name: "",
    created_at: "",
    products: "",
    origin: "",
    destination: "",
  });

  const fetchDriverData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookings-per-driver`);
      const text = await response.text(); // Get the response as plain text
      console.log("Raw Response:", text); // Log the raw response

      // Try parsing it only if the response seems to be JSON
      const data = JSON.parse(text); // Attempt to parse as JSON

      if (Array.isArray(data.bookings)) {
        setDriverData(data.bookings);
      } else {
        console.error("Expected 'driver' to be an array but got:", data);
        toast.error("Failed to load driver data.");
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      toast.error("Error fetching driver data.");
    }
  };

  useEffect(() => {
    fetchDriverData();
    const intervalId = setInterval(fetchDriverData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return driverData.filter((data) =>
      data.driver_name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [driverData, filterValue]);

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

  const handleDetailsModal = (driverId: number) => {
    const driver = driverData.find((drv) => drv.id === driverId);
    if (driver) {
      setSelectedData(driver);
      setIsOpenDetails(true);
    } else {
      toast.error("Driver not found.");
    }
  };


  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedData(null);
  };

  const renderCell = (data: DriverData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof DriverData];

    switch (columnKey) {
      case "created_at":
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
      

      case "products":
        if (Array.isArray(cellValue)) {
          // Loop over products and display only the name of each product
          return (
            <div>
              {cellValue.map((product, index) => (
                <span key={index}>
                  {product.name}
                  {index < cellValue.length - 1 && ", "} {/* Add comma between products */}
                </span>
              ))}
            </div>
          );
        } else {
          // If no products found
          return <div>No products</div>;
        }
      case "actions":
        return (
          <div className="flex flex-cols-4 gap-2 text-white">
            <Button
              onPress={() => handleDetailsModal(data.id)}
              className="bg-blue-200 w-full text-black text-left p-2"
            >
              View
            </Button>
          </div>
        );
      default:
        return <div>{cellValue}</div>;
    }
  };


  const columns = [
    { name: "Driver ID", uid: "driver_id", sortable: true },
    { name: "Driver Name", uid: "driver_name", sortable: true },
    { name: "Created At", uid: "created_at", sortable: true },
    { name: "Product Name", uid: "products", sortable: true },
    { name: "Origin", uid: "origin", sortable: true },
    { name: "Destination", uid: "destination", sortable: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Driver Name"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
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
      {isOpenDetails && selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData || {}}
          title="Driver Details"
        />
      )}
    </div>
  );
}
