"use client";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface DelayReport {
  id: number;
  trip_ticket: string;
  plate_number: string;
  date: string;
  delay_duration: string;
  delay_cause: string;
  other_cause?: string | null;
  additional_notes?: string | null;
  created_at: string;
  updated_at: string;
  driver_name?: string | null;
}

const DelayReportTable: React.FC = () => {
  const [reports, setReports] = useState<DelayReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("date");  // Default sort by date
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/delayreport`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setReports(data.data);
        }
      })
      .catch((error) => {
        setError("Failed to fetch delay reports.");
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter((report) =>
    report.trip_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.delay_cause.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    const compareA = a[sortColumn as keyof DelayReport];
    const compareB = b[sortColumn as keyof DelayReport];

    if (compareA !== null && compareB !== null && compareA !== undefined && compareB !== undefined) {
      if (typeof compareA === "string" && typeof compareB === "string") {
        return sortDirection === "asc"
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      } else if (typeof compareA === "number" && typeof compareB === "number") {
        return sortDirection === "asc" ? compareA - compareB : compareB - compareA;
      }
    }
    return 0;
  });

  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);  // Reset to the first page when items per page changes
  };
const handleExportPDF = () => {
  const doc = new jsPDF(),
    margin = 20,
    lineHeight = 10,
    pageHeight = doc.internal.pageSize.height,
    pageWidth = doc.internal.pageSize.width,
    columnWidth = (pageWidth - 3 * margin) / 2, // 2 columns with margin between
    logoPath = '/logo.png', // Adjust the path of your logo here
    logoWidth = 30,
    logoHeight = 30,
    title = 'S5 Logistics, Inc',
    totalWidth = logoWidth + doc.getTextWidth(title) + 5,
    logoX = (pageWidth - totalWidth) / 2;

  // Add Logo and Title
  doc.addImage(logoPath, 'PNG', logoX, margin, logoWidth, logoHeight);
  doc.setFontSize(16);
  doc.text(title, logoX + logoWidth + 5, margin + logoHeight / 2);

  // Add Contact Info
  doc.setFontSize(10);
  const contactInfo = [
    '2nd Floor Total Pulo Cabuyao, Pulo Diezmo Rd, Cabuyao, Laguna',
    'Mobile: +639 270 454 343 / +639 193 455 535',
    'Email: gdrlogisticsinc@outlook.com',
  ];

  contactInfo.forEach((text, index) => {
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth / 2) - textWidth / 2, margin + logoHeight + 5 + index * 10);
  });

  // Add Title for Delay Reports
  doc.setFontSize(18);
  const delayReportsTitle = 'Delay Reports',
    delayReportsWidth = doc.getTextWidth(delayReportsTitle);
  doc.text(delayReportsTitle, (pageWidth / 2) - delayReportsWidth / 2, margin + logoHeight + 40);

  let y = margin + logoHeight + 50;
  let columnIndex = 0;

  // Loop through the delay report data
  reports.forEach((report, index) => {
    let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

    doc.setFontSize(8);
    doc.text(`Report # ${index + 1}:`, x, y);
    y += lineHeight;

    const details = [
      `Trip Ticket: ${report.trip_ticket}`,
      `Plate Number: ${report.plate_number}`,
      `Date: ${new Date(report.date).toLocaleString()}`,
      `Delay Duration: ${report.delay_duration}`,
      `Delay Cause: ${report.delay_cause}`,
      `Other Cause: ${report.other_cause || "N/A"}`,
      `Additional Notes: ${report.additional_notes || "N/A"}`,
      `Driver Name: ${report.driver_name || "N/A"}`
    ];

    details.forEach((detail) => {
      const wrappedText = doc.splitTextToSize(detail, columnWidth);

      // Check if content exceeds the page height
      if (y + wrappedText.length * lineHeight > pageHeight - margin) {
        if (columnIndex === 0) {
          columnIndex = 1; // Move to the second column
          y = doc.getNumberOfPages() === 1 ? margin + logoHeight + 50 : margin + 10;
        } else {
          doc.addPage(); // Add a new page and reset
          columnIndex = 0;
          y = margin + 10;
        }
        x = columnIndex === 0 ? margin : margin + columnWidth + margin;
      }

      // Render the wrapped text
      wrappedText.forEach((line:any, idx:any) => {
        doc.text(line, x, y + idx * lineHeight);
      });

      y += wrappedText.length * lineHeight; // Adjust Y position after content
    });

    y += lineHeight; // Space between reports
  });

  doc.save('DelayReports.pdf');
};


  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports.map((report) => ({
      "Trip Ticket": report.trip_ticket,
      "Plate Number": report.plate_number,
      "Date": new Date(report.date).toLocaleString(),
      "Delay Duration": report.delay_duration,
      "Delay Cause": report.delay_cause,
      "Other Cause": report.other_cause || "N/A",
      "Additional Notes": report.additional_notes || "N/A",
      "Driver Name": report.driver_name || "N/A",
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Delay Reports");

    XLSX.writeFile(wb, "delay_reports.xlsx");
  };

  return (
    <div className="container  text-black bg-white">
<div className="flex justify-between items-center  p-5">
  {/* Title (Delay Reports) */}
  <h1 className="text-xl font-bold">Delay Reports</h1>

  {/* Buttons */}
  <div className="flex justify-end space-x-2">
    {/* Export PDF Button */}
    <button
      onClick={handleExportPDF}
      className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 w-full sm:w-auto"
    >
      Export PDF
    </button>

    {/* Export Excel Button */}
    <button
      onClick={handleExportExcel}
      className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 w-full sm:w-auto"
    >
      Export Excel
    </button>
  </div>
</div>

<div className="bg-white rounded-lg p-4">
  {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4 flex justify-start">
        <input
          type="text"
          className="border border-gray-300 bg-white rounded p-2 w-1/4"
          placeholder="Search by Trip Ticket, Plate Number, or Cause..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!loading && !error && filteredReports.length === 0 && (
        <p className="text-center text-gray-500">No delay reports found.</p>
      )}

      {!loading && filteredReports.length > 0 && (
        <div className="overflow-x-auto">
       <table className="w-full table-auto border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
  <thead className="bg-gray-300 text-black">
    <tr>
      <th
        className="p-4 text-left cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => handleSort("trip_ticket")}
      >
        Trip Ticket
      </th>
      <th
        className="p-4 text-left cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => handleSort("plate_number")}
      >
        Plate Number
      </th>
      <th
        className="p-4 text-left cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => handleSort("date")}
      >
        Date
      </th>
      <th
        className="p-4 text-left cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => handleSort("delay_duration")}
      >
        Delay Duration
      </th>
      <th
        className="p-4 text-left cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => handleSort("delay_cause")}
      >
        Delay Cause
      </th>
      <th className="p-4 text-left">Other Cause</th>
      <th className="p-4 text-left">Additional Notes</th>
      <th className="p-4 text-left">Driver Name</th>
    </tr>
  </thead>
  <tbody>
    {paginatedReports.map((report) => (
      <tr key={report.id} className="bg-white hover:bg-gray-50 transition-colors">
        <td className="p-4 border-t border-gray-200">{report.trip_ticket}</td>
        <td className="p-4 border-t border-gray-200">{report.plate_number}</td>
        <td className="p-4 border-t border-gray-200">{new Date(report.date).toLocaleString()}</td>
        <td className="p-4 border-t border-gray-200">{report.delay_duration}</td>
        <td className="p-4 border-t border-gray-200">{report.delay_cause}</td>
        <td className="p-4 border-t border-gray-200">{report.other_cause || "N/A"}</td>
        <td className="p-4 border-t border-gray-200">{report.additional_notes || "N/A"}</td>
        <td className="p-4 border-t border-gray-200">{report.driver_name || "N/A"}</td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}

      <div className="flex justify-between mt-4">
        <div>
          <span className="mr-2">Items per page:</span>
          <select
            className="border border-gray-300 bg-white rounded p-2"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div className="flex items-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="mx-2">{currentPage}</span>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
</div>



      

  );
};

export default DelayReportTable;
