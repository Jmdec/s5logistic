"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DetailsModal from "./ViewModal";
import { EyeIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Export from "../export";

interface ReportData {
  id: number;
  trip_ticket_no: string;
  account_waybill_no: string;
  date_time_of_incident: string;
  location_of_incident: string;
  reason: string;
  truck_plate_no: string;
  driver_name: string;
  driver_contact_no: string;
  preventive_measures: string;
  series_no: string;
  proof: string;
  prepared_by: string;
  approved_by: string;
  [key: string]: any;
}

export default function App() {
  const router = useRouter();
  const [ReportData, setReportData] = useState<ReportData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedData, setselectedData] = useState<ReportData | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "delete" | "archive">("add");
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [readMoreContent, setReadMoreContent] = useState<string | null>(null);
  const [plateNumbers, setPlateNumbers] = useState<string[]>([]);


  const [sortDescriptor, setSortDescriptor] = useState({
    column: "driver_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [fields, setFields] = useState({
    id: 0,
    trip_ticket_no: "",
    account_waybill_no: "",
    date_time_of_incident: "",
    location_of_incident: "",
    reason: "",
    truck_plate_no: "",
    driver_name: "",
    driver_contact_no: "",
    preventive_measures: "",
    series_no: "",
    proof: "",
    prepared_by: "",
    approved_by: "",
  });


  const fetchReportData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/incident-reports`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw Response:", text);

      const data: { status: string; incidents: ReportData[] } = JSON.parse(text);
      console.log("Parsed JSON:", data);

      if (data?.status === "success" && Array.isArray(data.incidents)) {
        const uniquePlateNumbers = Array.from(new Set(data.incidents.map((item) => item.truck_plate_no)));
        setPlateNumbers(uniquePlateNumbers);
        setReportData(data.incidents);
      } else {
        console.error("Unexpected response format:", data);
        toast.error("Invalid data format received.");
      }
    } catch (error) {
      console.error("Error fetching incidents data:", error);
      toast.error("Error fetching incidents data.");
    }
  };



  useEffect(() => {
    fetchReportData();
    const intervalId = setInterval(fetchReportData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    return ReportData.filter(
      (data) =>
        data.driver_name.toLowerCase().includes(filterValue.toLowerCase()) &&
        (fields.truck_plate_no === "" || data.truck_plate_no === fields.truck_plate_no)
    );
  }, [ReportData, filterValue, fields.truck_plate_no]);



  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ReportData];
      const second = b[sortDescriptor.column as keyof ReportData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleOpenModal = async (mode: "add" | "delete", id?: number) => {
    setMode(mode);
    if (mode === "delete" && id) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/incident-reports/${id}`);
      const data = await response.json();

      setFields({
        ...data,
      })
    } else {
      setFields({
        id: 0,
        trip_ticket_no: "",
        account_waybill_no: "",
        date_time_of_incident: "",
        location_of_incident: "",
        reason: "",
        truck_plate_no: "",
        driver_name: "",
        driver_contact_no: "",
        preventive_measures: "",
        series_no: "",
        proof: "",
        prepared_by: "",
        approved_by: "",
      });
    }
    setIsOpen(true);
  };


  const handleDetailsModal = (employeeId: number) => {
    const employee = ReportData.find((emp) => emp.id === employeeId);
    if (employee) {
      setselectedData(employee);
      setIsOpenDetails(true);
    } else {
      toast.error("Employee not found.");
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setselectedData(null);
  };

  const handleImageClick = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const handleReadMore = (content: string) => {
    setReadMoreContent(content);
    setIsReadModalOpen(true);
  };

  const closeReadModal = () => {
    setIsReadModalOpen(false);
    setReadMoreContent(null);
  };

  const columns = [
    { name: "Trip Ticket No", uid: "trip_ticket_no", sortable: true },
    { name: "Account Waybill No", uid: "account_waybill_no", sortable: true },
    { name: "Date & Time of Incident", uid: "date_time_of_incident", sortable: true },
    { name: "Location of Incident", uid: "location_of_incident", sortable: true },
    { name: "Reason", uid: "reason", sortable: true },
    { name: "Truck Plate No", uid: "truck_plate_no", sortable: true },
    { name: "Driver Name", uid: "driver_name", sortable: true },
    { name: "Driver Contact No", uid: "driver_contact_no", sortable: true },
    { name: "Preventive Measures", uid: "preventive_measures", sortable: false },
    { name: "Series No", uid: "series_no", sortable: true },
    { name: "Proof", uid: "proof", sortable: false },
    { name: "Prepared By", uid: "prepared_by", sortable: true },
    { name: "Approved By", uid: "approved_by", sortable: true },
    { name: "Actions", uid: "actions" },
  ];

  const renderCell = (data: ReportData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof ReportData];

    switch (columnKey) {
      case "date_time_of_incident":
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

      case "proof":
        if (cellValue) {
          const formattedUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue.replace(/\s/g, "%20")}`;

          return (
            <div>
              <img
                src={formattedUrl}
                alt="Image"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={() => handleImageClick(formattedUrl)}
              />
            </div>
          );
        } else {
          return <span>No Image Available</span>;
        }

      case "preventive_measures":
      case "reason":
        const truncatedText = cellValue.length > 50
          ? `${cellValue.substring(0, 50)}...`
          : cellValue;

        return (
          <>
            <span>{truncatedText} </span>
            {cellValue.length > 50 && (
              <a
                onClick={() => handleReadMore(cellValue)}
                className="text-blue-500 cursor-pointer underline flex"
              >
                Read More
              </a>
            )}
          </>
        );

      case "actions":
        return (
          <div className="flex flex-cols-4 gap-2 text-white">
            <EyeIcon className="text-blue-700 w-6 h-6 cursor-pointer hover:text-blue-500"
              onClick={() => handleDetailsModal(data.id)} />
            <TrashIcon className="text-red-700 w-6 h-6 cursor-pointer hover:text-red-500"
              onClick={() => handleOpenModal("delete", data.id)} />
          </div>
        );
      default:
        return <div>{cellValue}</div>;
    }
  };


  const handleSave = async () => {
    setLoading(true)
    try {
      const formData = new FormData();

      formData.append("trip_ticket_no", fields.trip_ticket_no);
      formData.append("account_waybill_no", fields.account_waybill_no);
      formData.append("date_time_of_incident", fields.date_time_of_incident);
      formData.append("location_of_incident", fields.location_of_incident);
      formData.append("reason", fields.reason);
      formData.append("truck_plate_no", fields.truck_plate_no);
      formData.append("driver_name", fields.driver_name);
      formData.append("driver_contact_no", fields.driver_contact_no);
      formData.append("preventive_measures", fields.preventive_measures);

      if (fields.proof) {
        formData.append("proof", fields.proof);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/incident-reports/store`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Added successfully!");
        handleCloseModal();
        fetchReportData();
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


  const handleDelete = async () => {
    setLoading(true)
    if (!fields.id) {
      toast.error("ID is missing");
      return;
    }
    console.log(fields.id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/reports-delete/${fields.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Data deleted successfully!");
        handleCloseModal();
        fetchReportData();
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

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };


  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-end space-x-2 mb-3">
        <Button className="text-xs lg:text-base" color="primary" onPress={() => handleOpenModal("add")}>
          + Add Data
        </Button>
        <Export label="Export" />
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2">
          <select
            value={fields.truck_plate_no}
            onChange={(e) => setFields({ ...fields, truck_plate_no: e.target.value })}
            className="px-4 py-2 border rounded-md min-w-[180px] dark:bg-white"
          >
            <option value="">Select Plate No:</option>
            {plateNumbers.map((plate, idx) => (
              <option key={idx} value={plate}>
                {plate}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Search by Driver Name"
            className="px-4 py-2 border rounded-md w-full lg:w-1/2 dark:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border px-2 py-1 rounded"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
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
                    <td
                      key={column.uid}
                      className="py-3 px-4 text-sm text-gray-700"
                      onClick={(e) => {
                        if (column.uid === "preventive_measures" || column.uid === "reason" || column.uid === "proof") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {column.uid === "actions" ? (
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
        title={mode === "add" ? "Add Incident Report" : "Delete Data"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "add" ? handleSave : handleDelete}
        loading={loading}
      />

      {isOpenDetails && selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData || {}}
          title="Incident Details"
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
      {isReadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-auto shadow-lg">

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={closeReadModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon width={30} />
              </button>
            </div>

            {/* Full Content */}
            <h2 className="text-xl font-bold mb-4 dark:text-gray-800">Preventive Measures</h2>
            <p className="text-gray-700 break-words">{readMoreContent}</p>
          </div>
        </div>
      )}


    </div>
  );
}
