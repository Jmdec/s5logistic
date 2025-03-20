'use client'

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import ModalComponent from "../Modal";
import { toast, ToastContainer } from "react-toastify";
import Export from "../export";
import RowsPerPage from "@/components/RowsPerPage";


interface Receivable {
  date_borrowed: string;
  issuer: string;
  borrower: string;
  mode_of_payment: string;
  principal: string;
  pay_now_date: string;
  pay_later_date: string;
}

export default function App() {
  const [data, setData] = useState<Receivable[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    issuer: "",
    borrower: "",
    principal: "",
    mode_of_payment: "",
    date_borrowed: "",
    pay_now_date: "",
    pay_later_date: "",
  });
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date_borrowed", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.issuer) newErrors.issuer = "Issuer is required.";
    if (!formData.borrower) newErrors.borrower = "Borrower is required.";
    if (!formData.date_borrowed) newErrors.payment_channel = "Date borrow is required.";
    if (!formData.principal) newErrors.principal = "Principal is required.";
    if (!formData.mode_of_payment) newErrors.mode_of_payment = "Mode of payment is required.";

    if (!formData.pay_now_date && !formData.pay_later_date) {
      newErrors.pay_now_date = "Either Pay Now Date or Pay Later Date is required.";
      newErrors.pay_later_date = "Either Pay Now Date or Pay Later Date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/getReceivable`);
      const result = await response.json();
      setData(result.records);
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

  const handleSave = async () => {
    if (!validateForm()) {
      // console.log("Validation failed!", formData);
      toast.error("Please input complete details!");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/receivables/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        setIsModalOpen(false);
        setFormData({
          issuer: "",
          borrower: "",
          principal: "",
          mode_of_payment: "",
          date_borrowed: "",
          pay_now_date: "",
          pay_later_date: "",
        });
        toast.success("Receivable added successfully!");
      } else {
        toast.error("Failed to save data.");
        console.error("Failed to save data");
      }
    } catch (error) {
      toast.error("An error occurred while saving data.");
      console.error("Error saving data:", error);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterValue.trim()) return data;

    console.log("Filter Value:", filterValue);

    return data.filter((item) => {
      const filterValueStr = filterValue.toLowerCase().trim();

      return [
        item.date_borrowed,
        item.issuer,
        item.borrower,
        item.mode_of_payment,
        item.principal,
        item.pay_now_date,
        item.pay_later_date
      ]
        .some(field => field?.toString().toLowerCase().includes(filterValueStr));
    });
  }, [data, filterValue]);



  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof Receivable];
      const valB = b[sortDescriptor.column as keyof Receivable];
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

  const renderCell = (item: Receivable, columnKey: keyof Receivable) => {
    const value = item[columnKey];

    if (["date_borrowed", "pay_now_date", "pay_later_date"].includes(columnKey) && value) {
      const date = new Date(value as string);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day} - ${month} - ${year}`;
    }

    return columnKey === "principal"
      ? parseFloat(value).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      })
      : value;
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end space-x-2">
        <Button onPress={() => setIsModalOpen(true)} color="primary">
          Add New Receivable
        </Button>
        <Export
          label="Export"
        />
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
      <ModalComponent isOpen={isModalOpen} onOpenChange={setIsModalOpen} modalTitle="Add Receivable" onSave={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="issuer" className="block font-medium text-gray-700">
              Issuer
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.issuer && <p className="text-red-500 text-sm">{errors.issuer}</p>}
          </div>
          <div>
            <label htmlFor="borrower" className="block font-medium text-gray-700">
              Borrower
            </label>
            <input
              type="text"
              name="borrower"
              value={formData.borrower}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.borrower && <p className="text-red-500 text-sm">{errors.borrower}</p>}
          </div>
          <div>
            <label htmlFor="principal" className="block font-medium text-gray-700">
              Principal Amount
            </label>
            <input
              type="number"
              name="principal"
              value={formData.principal}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.principal && <p className="text-red-500 text-sm">{errors.principal}</p>}
          </div>
          <div>
            <label htmlFor="mode_of_payment" className="block font-medium text-gray-700">
              Mode of Payment
            </label>
            <select
              name="mode_of_payment"
              value={formData.mode_of_payment}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select</option>
              <option value="principal">Principal</option>
              <option value="interest">Interest</option>
            </select>
            {errors.mode_of_payment && <p className="text-red-500 text-sm">{errors.mode_of_payment}</p>}
          </div>
          <div>
            <label htmlFor="date_borrowed" className="block font-medium text-gray-700">
              Date Borrowed
            </label>
            <input
              type="date"
              name="date_borrowed"
              value={formData.date_borrowed}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.date_borrowed && <p className="text-red-500 text-sm">{errors.date_borrowed}</p>}
          </div>
          <div>
            <label htmlFor="pay_now_date" className="block font-medium text-gray-700">
              Pay Now Date
            </label>
            <input
              type="date"
              name="pay_now_date"
              value={formData.pay_now_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              disabled={!!formData.pay_later_date}
            />
            {errors.pay_now_date && <p className="text-red-500 text-sm">{errors.pay_now_date}</p>}
          </div>
          <div>
            <label htmlFor="pay_later_date" className="block font-medium text-gray-700">
              Pay Later Date
            </label>
            <input
              type="date"
              name="pay_later_date"
              value={formData.pay_later_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
              disabled={!!formData.pay_now_date}
            />
            {errors.pay_later_date && <p className="text-red-500 text-sm">{errors.pay_later_date}</p>}
          </div>
        </div>
      </ModalComponent>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-collapse shadow-lg rounded-lg dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date Borrowed", "Issuer", "Borrower", "Principal Amount", "Mode of Payment", "Pay Now", "Pay Later"].map(
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
              paginatedData.map((item, index) => (
                <tr key={`${item.borrower}-${item.date_borrowed}-${index}`}>
                  <td className="py-3 px-4">{renderCell(item, "date_borrowed") || "-"}</td>
                  <td className="py-3 px-4">{renderCell(item, "issuer") || "-"}</td>
                  <td className="py-3 px-4">{renderCell(item, "borrower") || "-"}</td>
                  <td className="py-3 px-4">{renderCell(item, "principal") || "-"}</td>
                  <td className="py-3 px-4">{renderCell(item, "mode_of_payment") || "-"}</td>
                  <td className="py-3 px-4">{renderCell(item, "pay_now_date") || "-"}</td>
                  <td className="py-3 px-4">{renderCell(item, "pay_later_date") || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
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
