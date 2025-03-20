'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import { IoCloseCircle } from "react-icons/io5";
import RowsPerPage from "@/components/RowsPerPage";

interface S5Accounting {
  id: number;
  date: string;
  particulars: string;
  payment_amount: string;
  payment_channel: string;
  proof_of_payment: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function App() {
  const [data, setData] = useState<S5Accounting[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const [formData, setFormData] = useState({
    date: "",
    particulars: "",
    payment_amount: "",
    payment_channel: "",
    proof_of_payment: null,
    notes: "",
  });
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [startingBalance, setStartingBalance] = useState(10000);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-GB", { month: "short" });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} - ${month} - ${year}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.particulars) newErrors.particulars = "Particulars is required.";
    if (!formData.payment_channel) newErrors.payment_channel = "Payment channel is required.";
    if (!formData.payment_amount || isNaN(Number(formData.payment_amount)) || Number(formData.payment_amount) <= 0) {
      newErrors.payment_amount = "Valid payment amount is required.";
    }
    if (!formData.proof_of_payment) newErrors.proof_of_payment = "Proof of payment is required.";
    if (!formData.notes) newErrors.notes = "Notes is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/gdr-accounting/fetch-all`);
      const result = await response.json();
      setData(result.data || []);
      setStartingBalance(result.starting_balance || 10000);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("date", formData.date);
    formDataToSubmit.append("particulars", formData.particulars);
    formDataToSubmit.append("payment_amount", formData.payment_amount);
    formDataToSubmit.append("payment_channel", formData.payment_channel);
    if (formData.proof_of_payment) {
      formDataToSubmit.append("proof_of_payment", formData.proof_of_payment);
    }
    formDataToSubmit.append("notes", formData.notes);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/gdr-accounting`, {
        method: "POST",
        body: formDataToSubmit,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Entry added successfully");
        fetchData();
        setIsModalOpen(false);
        setFormData({
          date: "",
          particulars: "",
          payment_amount: "",
          payment_channel: "",
          proof_of_payment: null,
          notes: "",
        });
      } else {
        toast.error(result.message || "Error saving entry");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Error saving entry");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const createdAt = new Date(item.created_at);
      const itemYear = createdAt.getFullYear().toString();
      const itemMonth = (createdAt.getMonth() + 1).toString().padStart(2, "0");

      const filterValueStr = filterValue.toLowerCase().trim();
      const searchFields = Object.values(item);

      const matchesSearch = searchFields.some((value) =>
        value?.toString().toLowerCase().includes(filterValueStr)
      );

      return (
        (!filterYear || itemYear === filterYear) &&
        (!filterMonth || itemMonth === filterMonth) &&
        (filterValueStr === "" || matchesSearch)
      );
    });
  }, [data, filterYear, filterMonth, filterValue]);


  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof S5Accounting];
      const valB = b[sortDescriptor.column as keyof S5Accounting];
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

  const renderCell = (item: S5Accounting, columnKey: keyof S5Accounting) => {
    const value = item[columnKey as keyof S5Accounting];
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end space-x-2">
        <Button onPress={() => setIsModalOpen(true)} color="primary">
          IN
        </Button>
        <Export
          label="Export"
        />
      </div>

      <div className="mb-4 flex flex-col lg:flex-row justify-between items-center space-x-4">
        <div className="flex gap-2 w-full lg:w-auto">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border rounded-md w-full lg:w-3/4"
          >
            <option value="">Select Year</option>
            {Array.from(new Set(data.map((item) => new Date(item.created_at).getFullYear()))).map((year, idx) => (
              <option key={idx} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border rounded-md w-full lg:w-3/4"
          >
            <option value="">Select Month</option>
            {[...Array(12)].map((_, idx) => (
              <option key={idx} value={(idx + 1).toString().padStart(2, "0")}>
                {new Date(0, idx).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search"
          className="px-4 py-2 border rounded-md w-3/4 lg:w-1/4 mt-4 lg:mt-0"
        />

      </div>
      <div className="flex justify-between">
        <div className="mb-4 justify-start lg:w-1/5 alert alert-info p-2" style={{ backgroundColor: "rgb(93,164,84)", color: "white" }}>
          <strong>Remaining Balance:</strong> &nbsp; ₱{startingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </div>
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>


      <ModalComponent isOpen={isModalOpen} onOpenChange={setIsModalOpen} modalTitle="Add Data" onSave={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
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
            <label htmlFor="particulars" className="block text-sm font-medium text-gray-700">
              Particulars
            </label>
            <input
              id="particulars"
              type="text"
              name="particulars"
              value={formData.particulars}
              onChange={handleInputChange}
              placeholder="Particulars"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.particulars && <p className="text-red-500 text-sm">{errors.particulars}</p>}
          </div>
          <div>
            <label htmlFor="payment_amount" className="block text-sm font-medium text-gray-700">
              Payment Amount
            </label>
            <input
              id="payment_amount"
              type="number"
              name="payment_amount"
              value={formData.payment_amount}
              onChange={handleInputChange}
              placeholder="Payment Amount"
              className="w-full px-4 py-2 border rounded-md"
              min="0"
              step="any"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9.]/g, "");
              }}
            />
            {errors.payment_amount && <p className="text-red-500 text-sm">{errors.payment_amount}</p>}
          </div>
          <div>
            <label htmlFor="payment_channel" className="block text-sm font-medium text-gray-700">
              Payment Channel
            </label>
            <input
              id="payment_channel"
              type="text"
              name="payment_channel"
              value={formData.payment_channel}
              onChange={handleInputChange}
              placeholder="Payment Channel"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.payment_channel && <p className="text-red-500 text-sm">{errors.payment_channel}</p>}
          </div>
          <div>
            <label htmlFor="proof_of_payment" className="block text-sm font-medium text-gray-700">
              Proof of Payment (File)
            </label>
            <input
              id="proof_of_payment"
              type="file"
              name="proof_of_payment"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.proof_of_payment && <p className="text-red-500 text-sm">{errors.proof_of_payment}</p>}
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
          </div>
        </div>
      </ModalComponent>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Particulars", "Payment Amount", "Payment Channel", "Proof of Payment", "Notes"].map(
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
                <tr key={item.date + item.particulars}>
                  <td className="py-3 px-4">{formatDate(item.date)}</td>
                  <td className="py-3 px-4">{item.particulars}</td>
                  <td className="py-3 px-4">
                    {parseFloat(item.payment_amount).toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4">{item.payment_channel}</td>
                  <td className="py-3 px-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${item.proof_of_payment}`}
                      alt="Payment proof"
                      className="h-10 w-10 rounded-full cursor-pointer"
                      onClick={() => {
                        setSelectedImage(`${process.env.NEXT_PUBLIC_SERVER_PORT}/${item.proof_of_payment}`);
                        openImageModal();
                      }}
                    />
                  </td>

                  <td className="py-3 px-4">{item.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-3 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={closeImageModal}
        >
          <div
            className="bg-white p-8 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Payment proof"
              className="max-h-96 max-w-full object-contain"
            />
            <button
              className="absolute top-0 right-0 p-2 text-gray-600"
              onClick={closeImageModal}
            >
              <IoCloseCircle size={24} />
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-between items-center">
        <Button onPress={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {page} of {Math.ceil(sortedData.length / rowsPerPage)}
        </span>
        <Button
          onPress={() => setPage(page < Math.ceil(sortedData.length / rowsPerPage) ? page + 1 : page)}
          disabled={page === Math.ceil(sortedData.length / rowsPerPage)}
        >
          Next
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}
