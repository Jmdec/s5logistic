"use client";
import React, { useState, useEffect } from "react";
import Modal from "./UpdateModal";
import { EllipsisVerticalIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import Export from "@/components/admin/export";

interface BookingData {
  id: number;
  date_from: string;
  date_to: string;
  order_number: string;
  plate_number: string;
  consignee_address: string;
  status: string;
  remarks: string | null;
  proof_of_delivery: string | null;
  driver_name: string;
  total_payment: string;
  merchant_name: string;
}

export default function App() {

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<"status" | "location">("status");
  const [bookingId, setBookingId] = useState<number>(0);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "date_from",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const fetchBookingData = async () => {
    let userId = sessionStorage.getItem('user_id');
    if (!userId) {
      console.error("User ID is not found in sessionStorage");
      return;
    }
    console.log(userId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/order-for-courier?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (Array.isArray(data.bookings)) {
        setBookingData(data.bookings);
      } else {
        console.error("Expected bookings data to be an array");
      }
      console.log(data)
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  useEffect(() => {
    fetchBookingData();
    const intervalId = setInterval(fetchBookingData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return bookingData.filter((booking) =>
      booking.order_number && booking.order_number.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [bookingData, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof BookingData];
      const second = b[sortDescriptor.column as keyof BookingData];

      const safeFirst = first ?? '';
      const safeSecond = second ?? '';

      const cmp = safeFirst < safeSecond ? -1 : safeFirst > safeSecond ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const handleImageClick = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const renderCell = (booking: BookingData, columnKey: React.Key) => {
    const cellValue = booking[columnKey as keyof BookingData];

    const formatStatus = (status: string | null) => {
      if (!status) return "No Status Available";
      return status
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
    const formatDate = (dateString: string) => {
      if (!dateString) return "No Date Available";

      return new Date(dateString)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    };

    switch (columnKey) {
      case "date_from":
      case "date_to":
        return <div>{formatDate(cellValue as string)}</div>;

      case "proof_of_delivery":
      case "proof_of_delivery":
        if (typeof cellValue === "string" && cellValue !== null) {
          const formattedUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue.replace(/\s/g, "%20")}`;

          return (
            <div>
              <img
                src={formattedUrl}
                alt="Image"
                className="h-10 w-10 rounded-full"
                onClick={() => handleImageClick(formattedUrl)}
              />
            </div>
          );
        } else {
          return <div>No valid image</div>;
        }


      case "order_number":
        return <div>{cellValue || "No Tracking Number"}</div>;

      case "status":
        return (
          <div>
            <Chip
              color={
                booking.status === "Pod_returned"
                  ? "secondary"
                  : booking.status === "For_Pick-up"
                    ? "primary"
                    : booking.status === "Delivery_successful"
                      ? "success"
                      : booking.status === "First_delivery_attempt"
                        ? "warning"
                        : booking.status === "In_Transit"
                          ? "primary"
                          : "default"
              }
              variant="solid"
              className="px-4 py-2 text-white"
            >
              {formatStatus(booking.status)}
            </Chip>
          </div>
        );
      case "actions":
        return <div>
          <div className="relative">
            <Dropdown className="z-50">
              <DropdownTrigger>
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
              </DropdownTrigger>
              <DropdownMenu className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                <DropdownItem
                  key="view"
                  onPress={() => handleShowModal("status", booking.id)}
                  className="flex items-center p-2 hover:bg-gray-100 dark:text-gray-800 dark:hover:gray-200"
                >
                  <div className="flex">
                    <PencilSquareIcon className="mr-2 w-5" /> Update Status
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onPress={() => handleShowModal("location", booking.id)}
                  className="flex items-center p-2 hover:bg-gray-100 dark:text-gray-800 dark:hover:gray-200"
                >
                  <div className="flex">
                    <PencilSquareIcon className="mr-2 w-5" /> Update Location
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>;

      default:
        return <div>{cellValue || "No Data Available"}</div>;
    }
  };

  const columns = [
    { name: "Date", uid: "date_from", sortable: true },
    { name: "Pick Up Date", uid: "date_to", sortable: true },
    { name: "Tracking Number", uid: "order_number", sortable: true },
    { name: "Plate Number", uid: "plate_number", sortable: true },
    { name: "Consignee Address", uid: "consignee_address", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Remarks", uid: "remarks", sortable: true },
    { name: "Proof of Delivery", uid: "proof_of_delivery", sortable: false },
    { name: "Actions", uid: "actions" },
  ];

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleShowModal = (type: "status" | "location", id: number,) => {
    setActionType(type);
    setBookingId(id);
    setShowModal(true);
  };

  return (
    <div className="text-black bg-white">
      <div className="flex justify-between items-center  p-4">
        {/* Title (Manage Order) */}
        <h1 className="text-xl font-bold text-black">Manage Order</h1>

        {/* Export Button */}
        <div>
          <Export label="Export" />
        </div>
      </div>

      <div className="bg-white rounded-lg mb-3">
        {/* Search Input */}
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Tracking Number"
          className="px-4 py-2 border rounded-md w-full lg:w-1/4 dark:bg-white"
        />
      </div>

      <div className="overflow-x-auto w-full dark:text-gray-800">
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
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <tr key={item.id} className="border-t">
                  {columns.map((column) => (
                    <td key={column.uid} className="py-3 px-4 text-sm text-gray-700">
                      {renderCell(item, column.uid)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No bookings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-black">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(filteredItems.length / rowsPerPage)}
        </span>
        <button
          disabled={page === Math.ceil(filteredItems.length / rowsPerPage)}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      <Modal
        show={showModal}
        onClose={handleModalClose}
        actionType={actionType}
        bookingId={bookingId}
      />
    </div>
  );
}
