"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import Export from "../../export";
import RowsPerPage from "@/components/RowsPerPage";


interface RatePerYear {
  month: string;
  total_amount: number;
}

export default function App() {
  const [data, setData] = useState<RatePerYear[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState({ column: "month", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-year`);
      const result = await response.json();
      const computedData = Object.keys(result.monthlyTotals).map((month) => ({
        month,
        total_amount: result.monthlyTotals[month],
      }));
      setData(computedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const valA = a[sortDescriptor.column as keyof RatePerYear];
      const valB = b[sortDescriptor.column as keyof RatePerYear];
      if (valA < valB) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortDescriptor]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const renderCell = (item: RatePerYear, columnKey: keyof RatePerYear) => {
    const value = item[columnKey as keyof RatePerYear];
    if (columnKey === "total_amount") {
      return value.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      });
    }
    return value;
  };


  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end">
        <div className="px-4 py-2">
          <Export
            label="Export"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <RowsPerPage
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-1.5 dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Month", "Total Amount"].map((column, idx) => (
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
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="py-3 px-4">
                  <td>{item.month}</td>
                  <td>{renderCell(item, "total_amount")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-3 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
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
    </div>
  );
}
