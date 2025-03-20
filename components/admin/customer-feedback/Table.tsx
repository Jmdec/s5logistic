"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import DetailsModal from "../DetailsModal";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Chip } from "@heroui/chip";
import Export from "@/components/accounting/export";
import RowsPerPage from "@/components/RowsPerPage";

interface FeedbackData {
  id: number;
  name: string;
  position: string;
  message: string;
  status: string;
  [key: string]: any;
}

export default function App() {
  const [salaries, setSalaries] = useState<FeedbackData[]>([]);
  const [selectedData, setSelectedData] = useState<FeedbackData | null>(null);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [mode, setMode] = useState<"accept" | "decline">("accept");
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "position",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [fields, setFields] = useState<FeedbackData>({
    id: 0,
    name: "",
    position: "",
    message: "",
    status: "",
  });


  const fetchFeedbackData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/feedbacks`);
      const data = await response.json();
      console.log("Fetched data:", data);
      if (Array.isArray(data.feedbacks)) {
        setSalaries(data.feedbacks);
      } else {
        console.error("Expected computedSalaries to be an array");
      }
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
  };

  useEffect(() => {
    fetchFeedbackData();

    const intervalId = setInterval(fetchFeedbackData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredSalaries = [...salaries];

    if (filterValue) {
      filteredSalaries = filteredSalaries.filter((salary) =>
        salary.name.toLowerCase().includes(filterValue.toLowerCase())
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
      const first = a[sortDescriptor.column as keyof FeedbackData];
      const second = b[sortDescriptor.column as keyof FeedbackData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleOpenModal = async (mode: "accept" | "decline", id?: number) => {
    console.log(id);
    setMode(mode);

    if ((mode === "accept" || mode === "decline") && id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/feedbacks/${id}`);
        const data = await response.json();

        console.log("Feedback Data", data);

        setFields({
          id: id,
          name: data.name,
          position: data.position,
          message: data.message,
          status: data.status,
        });

        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    } else {
      setFields({
        id: 0,
        name: "",
        position: "",
        message: "",
        status: "",
      });
      setIsOpen(true);
    }
  };

  const handleAccept = async (id: number) => {
    setLoading(true)
    console.log(fields.id)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/feedback-accept/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Feedback accepted successfully!");
        fetchFeedbackData();
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(`Error accepting Feedback: ${errorData.message || "Unknown error"}`);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error accepting Feedback:", error);
      toast.error("Error accepting Feedback");
    }
    setLoading(false)
  };
  const handleDecline = async (id: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/feedback-decline/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Feedback declined successfully!");
        fetchFeedbackData();
      } else {
        const errorData = await response.json();
        toast.error(`Error accepting Feedback: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error accepting Feedback:", error);
      toast.error("Error accepting Feedback");
    }
    setLoading(false)
  };

  const renderCell = (data: FeedbackData, columnKey: React.Key) => {
    let cellValue = data[columnKey as keyof FeedbackData];

    if (columnKey === "message") {
      const truncatedMessage = cellValue.length > 100 ? `${cellValue.slice(0, 100)}...` : cellValue;
      return truncatedMessage;
    }

    const formatStatus = (status: string | null | undefined) => {
      if (!status) return "";
      return status
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    switch (columnKey) {
      case "status":
        return (
          <div>
            <Chip
              color={
                data.status === "DECLINED"
                  ? "danger"
                  : data.status === "ACCEPTED"
                    ? "success"
                    : data.status === "PENDING"
                      ? "default"
                      : "default"
              }
              variant="solid"
              className="px-4 py-2 text-white"
            >
              {formatStatus(data.status)}
            </Chip>
          </div>
        );
      case "actions":
        return (
          <div className="flex">
            {data.status === "PENDING" ? (
              <>
                <CheckCircleIcon
                  onClick={() => handleOpenModal("accept", data.id)}
                  className="text-green-700 w-7 h-7 cursor-pointer hover:text-green-500"
                />
                <XCircleIcon
                  onClick={() => handleOpenModal("decline", data.id)}
                  className="text-red-700 w-7 h-7 cursor-pointer hover:text-red-500"
                />
              </>
            ) : data.status === "DECLINED" ? (
              <CheckCircleIcon
                onClick={() => handleOpenModal("accept", data.id)}
                className="text-green-700 w-7 h-7 cursor-pointer hover:text-green-500"
              />
            ) : data.status === "ACCEPTED" ? (
              <XCircleIcon
                className="text-red-700 w-7 h-7 cursor-not-allowed"
              />
            ) : (
              <p>No action available</p>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns = [
    { name: "Name", uid: "name", sortable: true },
    { name: "Position", uid: "position", sortable: true },
    { name: "Message", uid: "message", sortable: false },
    { name: "Status", uid: "status", sortable: false },
    { name: "Actions", uid: "actions" },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedbacks");
    XLSX.writeFile(wb, "Feedbacks.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF(),
      margin = 20,
      lineHeight = 10,
      pageHeight = doc.internal.pageSize.height,
      pageWidth = doc.internal.pageSize.width,
      columnWidth = (pageWidth - 3 * margin) / 2,
      logoPath = '/logo.png',
      logoWidth = 30,
      logoHeight = 30,
      title = "S5 Logistics, Inc",
      totalWidth = logoWidth + doc.getTextWidth(title) + 5,
      logoX = (pageWidth - totalWidth) / 2;

    doc.addImage(logoPath, 'PNG', logoX, margin, logoWidth, logoHeight);
    doc.setFontSize(16);
    doc.text(title, logoX + logoWidth + 5, margin + logoHeight / 2);

    doc.setFontSize(10);
    const contactInfo = [
      "2nd Floor Total Pulo Cabuyao, Pulo Diezmo Rd, Cabuyao, Laguna",
      "Mobile: +639 270 454 343 / +639 193 455 535",
      "Email: gdrlogisticsinc@outlook.com"
    ];

    contactInfo.forEach((text, index) => {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth / 2) - textWidth / 2, margin + logoHeight + 5 + index * 10);
    });

    doc.setFontSize(18);
    const returnItemsTitle = "Feedbacks",
      returnItemsWidth = doc.getTextWidth(returnItemsTitle);
    doc.text(returnItemsTitle, (pageWidth / 2) - returnItemsWidth / 2, margin + logoHeight + 40);

    let y = margin + logoHeight + 50,
      columnIndex = 0;

    filteredItems.forEach((item, index) => {
      let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

      doc.setFontSize(8);
      doc.text(`Feedbacks # ${index + 1}:`, x, y);
      y += lineHeight;

      const details = [
        `Name: ${item.name}`,
        `Position: ${item.position}`,
        `Message: ${item.message}`,
        `Status: ${item.status}`,
      ];


      details.forEach((detail) => {
        const wrappedText = doc.splitTextToSize(detail, columnWidth);

        if (y + wrappedText.length * lineHeight > pageHeight - margin) {
          if (columnIndex === 0) {
            columnIndex = 1;
            y = margin + logoHeight + 50;
          } else {
            doc.addPage();
            columnIndex = 0;
            y = margin;
          }
          x = columnIndex === 0 ? margin : margin + columnWidth + margin;
        }

        wrappedText.forEach((line: string, idx: number) => {
          doc.text(line, x, y + idx * lineHeight);
        });

        y += wrappedText.length * lineHeight;
      });

      y += lineHeight;
    });

    doc.save("Feedbacks.pdf");
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedData(null);
  };
  const handleDetailsModal = (id: number) => {
    const foundData = salaries.find((emp) => emp.id === id);
    if (foundData) {
      setSelectedData(foundData);
      setIsOpenDetails(true);
    } else {
      toast.error("Data not found.");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-end mb-3 gap-4">
        {/* <Button className="text-xs lg:text-base" color="primary" onPress={() => handleOpenModal("add")}>
            + Add Data
          </Button> */}
        <div>
          <Export label="Export" />
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search by Name"
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
                        {sortDescriptor.column === column.uid ? (sortDescriptor.direction === "ascending" ? "↑" : "↓") : "↕"}
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
        title={mode === "accept" ? "Accept Feedback" : "Decline Feedback"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "accept" ? () => handleAccept(fields.id) : () => handleDecline(fields.id)}
        loading={loading}
      />
      {selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData}
          title="Feedback Data"
        />
      )}
    </div>

  );
}
