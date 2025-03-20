'use client'

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import RowsPerPage from "@/components/RowsPerPage";

interface Loan {
  id: string;
  date: string;
  borrower: string;
  initial_amount: string;
  interest_percentage: string;
  payment_per_month: string;
  payment_terms: string;
  total_payment: string;
  mode_of_payment: string;
  status: string;
}

export default function App() {
  const [data, setData] = useState<Loan[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    borrower: "",
    date: "",
    initial_amount: "",
    interest_percentage: "",
    payment_per_month: "",
    payment_terms: "",
    total_payment: "",
    mode_of_payment: "",
  });
  const [formErrors, setFormErrors] = useState({
    borrower: "",
    date: "",
    initial_amount: "",
    interest_percentage: "",
    payment_terms: "",
    mode_of_payment: "",
  });
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loanamount`);
      const result = await response.json();
      setData(result.loans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      const { initial_amount, interest_percentage, payment_terms } = updatedData;

      if (initial_amount && interest_percentage && payment_terms) {
        const principal = parseFloat(initial_amount);
        const annualInterestRate = parseFloat(interest_percentage);
        const months = parseInt(payment_terms);

        const monthlyInterestRate = annualInterestRate / 12 / 100;

        let monthlyPayment = 0;
        if (monthlyInterestRate > 0) {
          monthlyPayment =
            (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
            (Math.pow(1 + monthlyInterestRate, months) - 1);
        } else {
          monthlyPayment = principal / months;
        }

        const totalPayment = monthlyPayment * months;

        updatedData.payment_per_month = monthlyPayment.toFixed(2);
        updatedData.total_payment = totalPayment.toFixed(2);
      }

      return updatedData;
    });
  };

  const handleSave = async () => {
    const errors = { ...formErrors };
    let isValid = true;

    if (!formData.borrower) {
      errors.borrower = "Borrower is required";
      isValid = false;
    } else {
      errors.borrower = "";
    }

    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    } else {
      errors.date = "";
    }

    if (!formData.initial_amount || isNaN(parseFloat(formData.initial_amount))) {
      errors.initial_amount = "Initial Amount is required";
      isValid = false;
    } else {
      errors.initial_amount = "";
    }

    if (!formData.interest_percentage || isNaN(parseFloat(formData.interest_percentage))) {
      errors.interest_percentage = "Interest Percentage is required";
      isValid = false;
    } else {
      errors.interest_percentage = "";
    }

    if (!formData.payment_terms || isNaN(parseInt(formData.payment_terms))) {
      errors.payment_terms = "Payment Terms are required";
      isValid = false;
    } else {
      errors.payment_terms = "";
    }

    if (!formData.mode_of_payment) {
      errors.mode_of_payment = "Mode of Payment is required";
      isValid = false;
    } else {
      errors.mode_of_payment = "";
    }

    setFormErrors(errors);

    if (isValid) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loanamount-store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Loan data saved successfully!");
          fetchData();
          setIsModalOpen(false);
        } else {
          toast.error("Error saving loan data");
        }
      } catch (error) {
        console.error("Failed to save!:", error);
        toast.error("Failed to save!");
      }
    } else {
      toast.error("Please complete the form");
    }
  };

  const filteredData = useMemo(() => {
    if (!filterValue.trim()) return data;

    console.log("Filter Value:", filterValue);

    return data.filter((item) => {
      const filterValueStr = filterValue.toLowerCase().trim();

      return [
        item.date,
        item.borrower,
        item.initial_amount,
        item.interest_percentage,
        item.payment_per_month,
        item.payment_terms,
        item.total_payment,
        item.mode_of_payment,
        item.status,
      ]
        .some(field => field?.toString().toLowerCase().includes(filterValueStr));
    });
  }, [data, filterValue]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof Loan];
      const valB = b[sortDescriptor.column as keyof Loan];
      if (valA < valB) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortDescriptor]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const renderCell = (item: Loan, columnKey: keyof Loan) => {
    const value = item[columnKey];

    if (columnKey === "date" && value) {
      const date = new Date(value as string);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} - ${month} - ${year}`;
    }

    if (["initial_amount", "interest_percentage", "payment_per_month", "total_payment"].includes(columnKey)) {
      const numericValue = parseFloat(value as string);
      if (isNaN(numericValue)) return "-";

      if (columnKey === "interest_percentage") {
        return numericValue.toFixed(2) + "%";
      }

      return numericValue.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      });
    }

    return value;
  };

  const handleStatusChange = async (loanId: string, status: string) => {
    try {
      const url = status === "paid"
        ? `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loan/${loanId}/mark-as-paid`
        : `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/loan/${loanId}/mark-as-unpaid`;

      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        toast.success(`Loan status updated to ${status}!`);
        fetchData();
      } else {
        toast.error(`Error updating loan status to ${status}`);
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast.error("Error updating loan status");
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search"
          className="px-4 py-2 border rounded-md w-full sm:w-1/4"
        />

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button onPress={() => setIsModalOpen(true)} color="primary">
            Add New Consign
          </Button>
          <Export label="Export" />
        </div>
      </div>

      <div className="mb-4 flex justify-end items-center">
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <ModalComponent
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        modalTitle="Loan Form"
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              {key === "mode_of_payment" ? (
                <div>
                  <label htmlFor="mode_of_payment" className="mb-2 text-sm text-gray-700">
                    Select Mode of Payment
                  </label>
                  <select
                    id="mode_of_payment"
                    name="mode_of_payment"
                    value={formData.mode_of_payment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors.mode_of_payment ? 'border-red-500' : ''}`}
                  >
                    <option value="" disabled selected>Select Mode of Payment</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                  </select>
                  {formErrors.mode_of_payment && <span className="text-red-500 text-sm">{formErrors.mode_of_payment}</span>}
                </div>
              ) : key === "date" ? (
                <div>
                  <label htmlFor="date" className="mb-2 text-sm text-gray-700">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors.date ? 'border-red-500' : ''}`}
                  />
                  {formErrors.date && <span className="text-red-500 text-sm">{formErrors.date}</span>}
                </div>
              ) : key === 'initial_amount' || key === 'interest_percentage' || key === 'payment_terms' ? (
                <div>
                  <label htmlFor={key} className="mb-2 text-sm text-gray-700">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = target.value;
                      if (!/^\d*\.?\d*$/.test(value)) {
                        target.value = value.replace(/[^\d\.]/g, '');
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors[key as keyof typeof formErrors] ? 'border-red-500' : ''}`}
                  />
                  {formErrors[key as keyof typeof formErrors] && <span className="text-red-500 text-sm">{formErrors[key as keyof typeof formErrors]}</span>}
                </div>
              ) : (
                <div>
                  <label htmlFor={key} className="mb-2 text-sm text-gray-700">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors[key as keyof typeof formErrors] ? 'border-red-500' : ''} ${key === 'total_payment' || key === 'payment_per_month' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
                    readOnly={key === 'total_payment' || key === 'payment_per_month'}
                  />
                  {formErrors[key as keyof typeof formErrors] && <span className="text-red-500 text-sm">{formErrors[key as keyof typeof formErrors]}</span>}
                </div>
              )}
            </div>
          ))}

        </div>
      </ModalComponent>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Borrower", "Initial Amount", "Interest Rate (%)", "Installment Payment (Per Month)", "Payment Terms", "Total Payment", "Mode of Payment", "Status", "Action"].map(
                (column, idx) => (
                  <th
                    key={idx}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                    onClick={() =>
                      setSortDescriptor({
                        column: column.toLowerCase().replace(" ", "_"),
                        direction:
                          sortDescriptor.column === column.toLowerCase().replace(" ", "_") &&
                            sortDescriptor.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      })
                    }
                  >
                    {column}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4">{renderCell(item, "date")}</td>
                  <td className="py-3 px-4">{renderCell(item, "borrower")}</td>
                  <td className="py-3 px-4">{renderCell(item, "initial_amount")}</td>
                  <td className="py-3 px-4">{renderCell(item, "interest_percentage")}</td>
                  <td className="py-3 px-4">{renderCell(item, "payment_per_month")}</td>
                  <td className="py-3 px-4">{renderCell(item, "payment_terms")}</td>
                  <td className="py-3 px-4">{renderCell(item, "total_payment")}</td>
                  <td className="py-3 px-4">{renderCell(item, "mode_of_payment")}</td>
                  <td className="py-3 px-4">{renderCell(item, "status")}</td>
                  <td className="py-3 px-4">
                    <select
                      value={item.status === "paid" || item.status === "unpaid" ? item.status : "Update Status"}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="px-2 py-1 border rounded-md w-31 text-sm"
                    >
                      <option value="Update Status" disabled={item.status !== "Update Status"}>Update Status</option>
                      <option value="paid" disabled={item.status === "paid"}>Paid</option>
                      <option value="unpaid" disabled={item.status === "unpaid"}>Unpaid</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-3 px-4 text-center text-sm font-medium text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
        <div className="flex justify-between items-center mt-4">
          <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Previous
          </Button>
          <span>
            Page {page} of {Math.ceil(data.length / rowsPerPage)}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
            disabled={page === Math.ceil(data.length / rowsPerPage)}
          >
            Next
          </Button>
        </div>
        <ToastContainer />
      </div>
    </div>

  );
}
