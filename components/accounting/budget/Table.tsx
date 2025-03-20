'use client'

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import RowsPerPage from "@/components/RowsPerPage";
import { RiDeleteBin6Fill } from "react-icons/ri";



interface Budget {
  id: number;
  date: string;
  requestee: string;
  department: string;
  budget_amount: string;
  expense_details: string;
  voucher: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  status: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
  otp: string;
}

export default function App() {
  const [data, setData] = useState<Budget[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Budget | null>(null);
  const [isOtpValid, setIsOtpValid] = useState<boolean | null>(null);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    department: "",
    budget_amount: 0,
    expense_details: "",
    voucher: "",
    requestee: "",
    bank_name: "",
    account_name: "",
    account_number: "",
  });
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.requestee) newErrors.requestee = "Requestee is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.budget_amount || isNaN(Number(formData.budget_amount)) || Number(formData.budget_amount) <= 0) {
      newErrors.budget_amount = "Valid budget amount is required.";
    }
    if (!formData.expense_details) newErrors.expense_details = "Expense details are required.";
    if (!formData.voucher) newErrors.voucher = "Voucher is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/requestbudget`);
      const result = await response.json();

      if (JSON.stringify(result.budgets) !== JSON.stringify(data)) {
        setData(result.budgets);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);


  // OTP
  const handleOtpSubmit = async () => {
    try {
      const userId = sessionStorage.getItem('user_id');

      if (!userId) {
        toast.error("User is not authenticated.");
        return;
      }

      if (selectedItem?.otp === otpInput) {
        setData(prevData =>
          prevData.map(item =>
            item.requestee === selectedItem.requestee
              ? {
                ...item,
                status: "Approved",
                approved_by: userId,
              }
              : item
          )
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/budget-approve/${selectedItem.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "Approved",
              approved_by: userId,
            }),
          }
        );
        console.log(userId)
        if (response.ok) {
          toast.success("OTP is correct. Status updated to Approved.");
        } else {
          const errorResponse = await response.json();
          console.error("Failed to update status:", errorResponse);
          toast.error(`Error: ${errorResponse.message || "Failed to update"}`);
        }
      } else {
        setIsOtpValid(false);
        toast.error("Your entered OTP is incorrect.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("A network error occurred. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };


  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInput(e.target.value);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/budget-store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(`Backend Error: ${errorResponse.message}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setIsModalOpen(false);
      toast.success("Budget request saved successfully!");
    } catch (error) {
      toast.error("Failed to save budget request. Please try again.");
    }
  };

  const filteredData = useMemo(() => {
    if (!filterValue) return data;
    return data.filter((item) =>
      item.requestee.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [data, filterValue]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof Budget];
      const valB = b[sortDescriptor.column as keyof Budget];
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

  const renderCell = (item: Budget, columnKey: keyof Budget) => {
    const value = item[columnKey];

    if (columnKey === "date" && value) {
      const date = new Date(value as string);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} - ${month} - ${year}`;
    }

    if (value === "" || value === null || value === undefined) return "-";
    if (["amount"].includes(columnKey)) {
      const numericValue = parseFloat(value as string);
      if (isNaN(numericValue)) return "-";
      return numericValue.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      });
    }
    return value;
  };

  const deleteBudget = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/budgets/${id}`,
        {
          method: 'DELETE',
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error('Failed to delete budget.');
      }
    } catch (error) {
      toast.error('Error occurred while deleting budget.');
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end space-x-2">
        <Button onPress={() => setIsModalOpen(true)} color="primary">
          Add Request Budget
        </Button>
        <Export label="Export" />
      </div>

      <div className="mb-4 flex justify-between items-center space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search"
          className="px-4 py-2 border rounded-md lg:w-1/4"
        />
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <ModalComponent isOpen={isModalOpen} onOpenChange={setIsModalOpen} modalTitle="Budget Request Form" onSave={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="requestee" className="block">Requestee</label>
            <input
              id="requestee"
              type="text"
              name="requestee"
              value={formData.requestee}
              onChange={handleInputChange}
              placeholder="Enter Requestee"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.requestee && <p className="text-red-500 text-sm">{errors.requestee}</p>}
          </div>
          <div>
            <label htmlFor="department" className="block">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Department</option>
              <option value="Logistics">Logistics</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Miscellaneous">Miscellaneous</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
          </div>
          <div>
            <label htmlFor="budget_amount" className="block">Budget Amount</label>
            <input
              id="budget_amount"
              type="number"
              name="budget_amount"
              value={formData.budget_amount}
              onChange={handleInputChange}
              placeholder="Enter Amount"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.budget_amount && <p className="text-red-500 text-sm">{errors.budget_amount}</p>}
          </div>
          <div>
            <label htmlFor="expense_details" className="block">Expense Details</label>
            <input
              id="expense_details"
              type="text"
              name="expense_details"
              value={formData.expense_details}
              onChange={handleInputChange}
              placeholder="Expense details"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.expense_details && <p className="text-red-500 text-sm">{errors.expense_details}</p>}
          </div>
          <div>
            <label htmlFor="voucher" className="block">Voucher</label>
            <select
              id="voucher"
              name="voucher"
              value={formData.voucher}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Voucher</option>
              <option value="cash">Cash</option>
              <option value="cheques">Cheques</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            {errors.voucher && <p className="text-red-500 text-sm">{errors.voucher}</p>}
          </div>

          {formData.voucher === "bank_transfer" && (
            <>
              <div>
                <label htmlFor="bank_name" className="block">Bank Name</label>
                <input
                  id="bank_name"
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="Bank Name"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="account_name" className="block">Account Name</label>
                <input
                  id="account_name"
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleInputChange}
                  placeholder="Account Name"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="account_number" className="block">Account Number</label>
                <input
                  id="account_number"
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </>
          )}
        </div>
      </ModalComponent>
      {/* OTP Modal */}
      <ModalComponent isOpen={isOTPModalOpen} onOpenChange={setIsOTPModalOpen} modalTitle="Enter OTP" onSave={handleOtpSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="otp" className="block">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otpInput}
              onChange={handleOtpChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          {isOtpValid === false && (
            <div className="text-red-500 text-sm">Your entered OTP is incorrect.</div>
          )}
        </div>
      </ModalComponent>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Requester", "Department", "Amount", "Expense Details", "Voucher", "Bank Name", "Account Name", "Account Number", "Status", "Approved by", "Actions"].map(
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
                <tr key={item.requestee + item.date}>
                  <td className="py-3 px-4">{renderCell(item, "date")}</td>
                  <td className="py-3 px-4">{renderCell(item, "requestee")}</td>
                  <td className="py-3 px-4">{renderCell(item, "department")}</td>
                  <td className="py-3 px-4">{renderCell(item, "budget_amount")}</td>
                  <td className="py-3 px-4">{renderCell(item, "expense_details")}</td>
                  <td className="py-3 px-4">{renderCell(item, "voucher")}</td>
                  <td className="py-3 px-4">{renderCell(item, "bank_name")}</td>
                  <td className="py-3 px-4">{renderCell(item, "account_name")}</td>
                  <td className="py-3 px-4">{renderCell(item, "account_number")}</td>
                  <td className="py-3 px-4">{renderCell(item, "status")}</td>
                  <td className="py-3 px-4">{renderCell(item, "approved_by")}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <Button
                      onPress={() => {
                        setSelectedItem(item);
                        setIsOTPModalOpen(true);
                      }}
                      className="text-black font-extrabold" 
                    >
                      OTP
                    </Button>

                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteBudget(item.id)}
                    >
                      <RiDeleteBin6Fill size={24} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="py-3 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
  );
}
