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

interface budgetData {
  id: number;
  date: string;
  department: string;
  budget_amount: number;
  expense_details: string;
  voucher: string;
  requestee: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  approved_by: string;
  status: string;
}

export default function App() {
  const [data, setData] = useState<budgetData[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedData, setSelectedData] = useState<budgetData | null>(null);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"approve" | "deny">("approve");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "date",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [fields, setFields] = useState<budgetData>({
    id: 0,
    date: "",
    department: "",
    budget_amount: 0,
    expense_details: "",
    voucher: "",
    requestee: "",
    bank_name: "",
    account_name: "",
    account_number: "",
    approved_by: "",
    status: "",
  });

  const fetchData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/request-budgets`);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    console.log("Raw Response:", text);

    // Try parsing the response
    const data = JSON.parse(text);

    if (Array.isArray(data.budgets)) {
      setData(data.budgets);
    } else {
      console.error("Expected 'budgets' to be an array but got:", data);
      toast.error("Failed to load budgets data.");
    }
  };


  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredItems = React.useMemo(() => {
    let filtereddata = [...data];

    if (filterValue) {
      filtereddata = filtereddata.filter((salary) =>
        salary.department.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtereddata;
  }, [data, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof budgetData];
      const second = b[sortDescriptor.column as keyof budgetData];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleOpenModal = async (mode: "approve" | "deny", id?: number) => {
    console.log(id);
    setMode(mode);

    if ((mode === "approve" || mode === "deny") && id) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/budget/${id}`);
        const data = await response.json();
        console.log("Budget Data", data);

        setFields({
          id: id,
          date: data.date,
          department: data.department,
          budget_amount: data.budget_amount,
          expense_details: data.expense_details,
          voucher: data.voucher,
          requestee: data.requestee,
          bank_name: data.bank_name,
          account_name: data.account_name,
          account_number: data.account_number,
          approved_by: data.approved_by,
          status: data.status,
        });

        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    } else {
      setFields({
        id: 0,
        date: "",
        department: "",
        budget_amount: 0,
        expense_details: "",
        voucher: "",
        requestee: "",
        bank_name: "",
        account_name: "",
        account_number: "",
        approved_by: "",
        status: "",
      });
      setIsOpen(true);
    }
  };

  const handleApprove = async () => {
    setLoading(true)
    console.log(fields.id);
    let user_id = sessionStorage.getItem('user_id');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/budget-approve/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id })
      });

      if (response.ok) {
        setIsOpen(false);
        toast.success("Budget approved successfully!");
        fetchData();
      } else {
        const errorData = await response.json();
        setIsOpen(false);
        toast.error(`Error approving budget: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Error approveing budget");
      setIsOpen(false);
    }
    setLoading(false)
  };

  const handleDeny = async (id: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/budget-deny/${fields.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsOpen(false);
        toast.success("Budget denied successfully!");
        fetchData();
      } else {
        const errorData = await response.json();
        setIsOpen(false);
        toast.error(`Error denying budget: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      setIsOpen(false);
      toast.error("Error denying budget");
    }
    setLoading(false)
  };

  const renderCell = (data: budgetData, columnKey: React.Key) => {
    let cellValue = data[columnKey as keyof budgetData];

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
                data.status === "Denied"
                  ? "danger"
                  : data.status === "Approved"
                    ? "success"
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
          <div className="flex ">
            {data.status === "Pending" ? (
              <>
                <CheckCircleIcon
                  onClick={() => handleOpenModal("approve", data.id)}
                  className="text-green-600 font-bold w-7 h-7 cursor-pointer" />
                <XCircleIcon className="text-red-600 font-bold w-7 h-7 cursor-pointer"
                  onClick={() => handleOpenModal("deny", data.id)}
                />
              </>
            ) : (
              <>
                <CheckCircleIcon className="text-green-600 font-bold w-7 h-7 cursor-not-allowed opacity-65" />
                <XCircleIcon className="text-red-600 font-bold w-7 h-7 cursor-not-allowed opacity-65" />
              </>
            )}
          </div>
        );
      case "date":
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
      case "budget_amount":
        return <div>Php {cellValue}</div>;
      default:
        return cellValue;
    }
  };


  const columns = [
    { name: "Date", uid: "date", sortable: true },
    { name: "Department", uid: "department", sortable: true },
    { name: "Budget Amount", uid: "budget_amount", sortable: true },
    { name: "Expense Details", uid: "expense_details", sortable: false },
    { name: "Voucher", uid: "voucher", sortable: false },
    { name: "Requestee", uid: "requestee", sortable: true },
    { name: "Bank Name", uid: "bank_name", sortable: true },
    { name: "Account Name", uid: "account_name", sortable: true },
    { name: "Account Number", uid: "account_number", sortable: true },
    { name: "Approved By", uid: "approved_by", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Actions", uid: "actions" },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Request Budget");
    XLSX.writeFile(wb, "Request Budget.xlsx");
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
    const returnItemsTitle = "Request Budget",
      returnItemsWidth = doc.getTextWidth(returnItemsTitle);
    doc.text(returnItemsTitle, (pageWidth / 2) - returnItemsWidth / 2, margin + logoHeight + 40);

    let y = margin + logoHeight + 50,
      columnIndex = 0;

    filteredItems.forEach((item, index) => {
      let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

      doc.setFontSize(8);
      doc.text(`Request Budget # ${index + 1}:`, x, y);
      y += lineHeight;

      const details = [
        `Date: ${item.date}`,
        `Department: ${item.department}`,
        `Budget Amount: ${item.budget_amount}`,
        `Expense Details: ${item.expense_details}`,
        `Voucher: ${item.voucher}`,
        `Requestee: ${item.requestee}`,
        `Bank Name: ${item.bank_name}`,
        `Account Name: ${item.account_name}`,
        `Account Number: ${item.account_number}`,
        `Approved By: ${item.approved_by}`,
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

    doc.save("Request Budget.pdf");
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenDetails(false);
    setSelectedData(null);
  };

  const handleDetailsModal = (id: number) => {
    const foundData = data.find((emp) => emp.id === id);
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
        title={mode === "approve" ? "Approve budget" : "Deny budget"}
        fields={fields}
        setFields={setFields}
        mode={mode}
        handleSave={mode === "approve" ? () => handleApprove() : () => handleDeny(fields.id)}
        loading={loading}
      />

      {selectedData && (
        <DetailsModal
          isOpenDetails={isOpenDetails}
          handleCloseModal={handleCloseModal}
          details={selectedData}
          title="Budget Data"
        />
      )}
    </div>
  );
}
