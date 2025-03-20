"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import Export from "../../export";
import RowsPerPage from "@/components/RowsPerPage";

interface RatePerMonth {
  date: string;
  rate_per_mile: number;
  km: number;
  operational_costs: number;
  gross_income: number;
  net: number;
}

export default function App() {
  const [data, setData] = useState<RatePerMonth[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState({ column: "date", direction: "ascending" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/rate-per-month`);
      const result = await response.json();
      const computedData = result.rates.map((rate: any) => ({
        ...rate,
        net: rate.gross_income - rate.operational_costs,
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
      const valA = a[sortDescriptor.column as keyof RatePerMonth];
      const valB = b[sortDescriptor.column as keyof RatePerMonth];
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

  const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-GB", { month: "short" });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} - ${month} - ${year}`;
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
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-1.5 dark:bg-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-300">
            <tr>
              {["Date", "Rate per Mile", "Kilometers", "Operational Costs", "Gross Income", "Net"].map(
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
              paginatedData.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4">{formatDate(item.date)}</td>
                  <td className="py-3 px-4">{formatCurrency(item.rate_per_mile)}</td>
                  <td className="py-3 px-4">{`${item.km || 0} km`}</td>
                  <td className="py-3 px-4">{formatCurrency(item.operational_costs)}</td>
                  <td className="py-3 px-4">{formatCurrency(item.gross_income)}</td>
                  <td className="py-3 px-4">{formatCurrency(item.net)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-3 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onPress={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {Math.ceil(data.length / rowsPerPage)}
        </span>
        <Button
          onPress={() => setPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
          disabled={page === Math.ceil(data.length / rowsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
