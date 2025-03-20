"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface BookingData {
  plate_number: string;
  origin: string;
  destination: string;
  order_number: string;
  created_at: string;
}

export default function App() {
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "plate_number",
    direction: "ascending",
  });

  const fetchBookingData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookings-per-plate-number`);
      const data = await response.json();

      if (Array.isArray(data.bookings)) {
        setBookingData(data.bookings); // Set the fetched data
      } else {
        console.error("Invalid data format", data);
        toast.error("Failed to load booking data.");
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
      toast.error("Error fetching booking data.");
    }
  };

  useEffect(() => {
    fetchBookingData();
    const intervalId = setInterval(fetchBookingData, 10000); // Refresh data every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Filtered and sorted items
  const filteredItems = React.useMemo(() => {
    return bookingData.filter((data) =>
      data.origin.toLowerCase().includes(filterValue.toLowerCase()) ||
      data.destination.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [bookingData, filterValue]);

  const pages = Math.ceil(filteredItems.length / 10);
  const [page, setPage] = useState(1);
  const items = React.useMemo(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof BookingData];
      const second = b[sortDescriptor.column as keyof BookingData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (data: BookingData, columnKey: string) => {
    const cellValue = data[columnKey as keyof BookingData];
    switch (columnKey) {
      case "created_at":
        return new Date(cellValue as string).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).replace(/ /g, "-") + ", " +
          new Date(cellValue as string).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
      default:
        return <div>{cellValue}</div>;
    }
  };





  const columns = [
    { name: "Plate Number", uid: "plate_number", sortable: true },
    { name: "Origin", uid: "origin", sortable: true },
    { name: "Destination", uid: "destination", sortable: true },
    { name: "Order Number", uid: "order_number", sortable: true },
    { name: "Created At", uid: "created_at", sortable: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Origin or Destination"
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 dark:bg-white"
        />
      </div>
      <div className="w-full overflow-x-auto">
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

            <tbody>
              {items.map((item) => (
                <tr key={item.order_number} className="border-t">
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
    </div>
  );
}
