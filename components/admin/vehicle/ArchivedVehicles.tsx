"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import DetailsModal from "../DetailsModal";
import { useRouter } from "next/navigation";
import { Chip } from "@heroui/chip";

interface VehicleData {
  id: number;
  truck_name: string;
  plate_number: string;
  operator_name: string;
  truck_model: string;
  truck_capacity: string;
  quantity: number;
  or: File | null | string;
  cr: File | null | string;
  truck_status: string;
  [key: string]: any;
}

export default function App() {
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [filterValue, setFilterValue] = useState("");
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
    or: null,
    cr: null,
    truck_status: "",
  });

  const fetchVehicleData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/vehicle/archived`);
      const data = await response.json();
      if (Array.isArray(data.archived_vehicles)) {
        setVehicleData(data.archived_vehicles);
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

  const renderCell = (data: VehicleData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof VehicleData];
    const formatStatus = (status: string | null | undefined) => {
      if (!status) return "";
      return status
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
    switch (columnKey) {
      
      case "or":
      case "cr":
        return typeof cellValue === "string" ? (
          <img src={cellValue} alt={`${columnKey} preview`} className="h-10 w-10 rounded-full" />
        ) : (
          "No File"
        );
        case "truck_status":
          return (
            <div>
              <Chip
                color="warning"
                variant="solid"
                className="px-4 py-2 text-white text-xs lg:text-base"
              >
                {formatStatus(data.truck_status)}
              </Chip>
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
    { name: "OR Document", uid: "or", sortable: false },
    { name: "CR Document", uid: "cr", sortable: false },
    { name: "Status", uid: "truck_status", sortable: true },
  ];


  const handleNavigate = () => {
    router.push('/admin/employee/details');
  }


  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start">
        <Button className="ml-2 bg-red-600 text-white border mb-4 " onPress={() => handleNavigate()}>
          Back
        </Button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border-1.5">
          <thead className="bg-gray-200">
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
    </div>
  );
}
