"use client"
import React, { useState, useEffect, useMemo } from "react";
import { EllipsisVerticalIcon, CheckIcon } from "@heroicons/react/24/outline";
import QRCodeComponent from "./components/qrCode"; // Import your QRCodeComponent
import EditBookingHistory from "./components/editItem"; // Import the child component
import DeleteBookingHistory from "./components/deleteItem"; // Import your DeleteBookingHistory component
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "@heroui/button";

interface DataRow {
  id: number;
  date: string;
  tripTicketNumber: string;
  truckPlateNumber: string;
  driverLicenseNo: string;
  senderName: string;
  transportMode: string;
  deliveryType: string;
  journeyType: string;
  dateFrom: string;
  dateTo: string;
  origin: string;
  destination: string;
  eta: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeEmail: string;
  consigneeMobile: string;
  merchantName: string;
  merchantAddress: string;
  merchantEmail: string;
  merchantMobile: string;
  products: string;
  backloads: string | null;
  truckType: string;
  remarks: string | null;
  totalPayment: number;
  reference: string;
  bookingCreatedby: string | null;
  locationUpdatedby: string | null;
  locationUpdatedat: string | null;
  status: string;
  updatedStatus: string;
  proofOfDelivery?: string | null;
  qrCodePath: string;
  orderNumber: string;
  updatedBy: string;
}
interface renderedRow {
  id: number;
  date: string;
  plateNumber: string;
  destination: string;
  products: Product[],
  truckType: string,
  proofOfDelivery: string,
  remarks: string,
  totalPayment: number,
  reference: string,
  tripTicket: string,
  bookingCreated: string,
  locationUpdatedby: string,
  locationUpdatedat: string,
  backloads: Backloads[],
  status: string,
  updatedStatus: string,
}
interface Product {
  name: any;
  unit: any;
  quantity: number;
}
interface Backloads {
  name: string;
  contact: any;
  location: string;
}
type Column = {
  name: string;
  uid: string;
  sortable?: boolean;
  width?: string;
};


const App = () => {
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const transformedDataRows: DataRow[] = dataRows.map((item: any) => ({
    id: item.id,
    date: item.created_at ? item.created_at.split('T')[0] : '', // Extract date if available
    tripTicketNumber: item.order_number || '',
    truckPlateNumber: item.plate_number || '',
    driverLicenseNo: item.driver_license_no || '',
    senderName: item.sender_name || '',
    transportMode: item.transport_mode || '',
    deliveryType: item.delivery_type || '',
    journeyType: item.journey_type || '',
    dateFrom: item.date_from || '',
    dateTo: item.date_to || '',
    origin: item.origin || '',
    destination: item.destination || '',
    eta: item.eta || '',
    consigneeName: item.consignee_name || '',
    consigneeAddress: item.consignee_address || '',
    consigneeEmail: item.consignee_email || '',
    consigneeMobile: item.consignee_mobile || '',
    merchantName: item.merchant_name || '',
    merchantAddress: item.merchant_address || '',
    merchantEmail: item.merchant_email || '',
    merchantMobile: item.merchant_mobile || '',
    products: JSON.stringify(item.products) || 'N/A', // Convert to string for display
    backloads: item.backloads || 'N/A',
    truckType: item.truck_type || '',
    remarks: item.remarks || 'N/A',
    totalPayment: item.total_payment ? parseFloat(item.total_payment) : 0,
    reference: item.reference || '',
    bookingCreatedby: item.booking_create_by || 'N/A',
    locationUpdatedby: item.location_updated_by || 'N/A',
    locationUpdatedat: item.location_updated_at || 'N/A',
    status: item.order_status || '',
    updatedStatus: item.status || '',
    proofOfDelivery: item.proof_of_delivery || 'N/A',
    qrCodePath: item.qr_code_path || '',
    orderNumber: item.order_number || '',
    updatedBy: item.updated_by || '',
  }));

  const [renderedRows, setRenderedRows] = useState<renderedRow[]>([]); // Stores data for rendering
  const [selectedRow, setSelectedRow] = useState<renderedRow | null>(null);
  const [selectedDataRow, setSelectedDataRow] = useState<DataRow | null>(null);

  const [filterValue, setFilterValue] = useState(""); // Holds the search input value
  const [selectedDate, setSelectedDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [currentPage, setCurrentPage] = useState(1);

  const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>({
    column: "id", // Default column to sort
    direction: "ascending", // Default direction
  });

  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [actionsVisibility, setActionsVisibility] = useState<{ [key: number]: boolean }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Toggle popup visibility
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const [columns, setColumns] = useState<{ [key: string]: boolean }>({
    date: true,
    plateNumber: true,
    destination: true,
    products: true,
    truckType: true,
    proofOfDelivery: true,
    remarks: true,
    totalPayment: true,
    reference: true,
    tripTicket: true,
    bookingCreated: true,
    locationUpdatedby: true,
    locationUpdatedat: true,
    backloads: true,
    status: true,
    updatedStatus: true,
  });

  const toggleColumn = (column: string) => {
    setColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };



  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory`);
      const data = await response.json();
      console.log(data);
      // Map the received data to include only the necessary fields
      const mappedData = data.map((item: any) => ({
        id: item.id,
        date: item.date_from,
        plateNumber: item.plate_number,
        destination: item.destination,
        products: Array.isArray(item.products)
          ? item.products.map((product: any) => ({
            name: product.name,
            quantity: product.quantity,
            unit: product.unit,
          }))
          : [],
        truckType: item.truck_type,
        proofOfDelivery: item.proof_of_delivery,
        remarks: item.remaks,
        backloads: Array.isArray(item.backloads)
          ? item.backloads.map((backloads: any) => ({
            location: backloads.location,
            name: backloads.name,
            contact: backloads.contact_number,
          }))
          : [],
        tripTicket: item.order_number,
        totalPayment: item.total_payment,
        reference: item.order_status,
        bookingCreated: item.booking_create_by,
        locationUpdatedby: item.location_updated_by,
        locationUpdatedat: item.location_updated_at,
        status: item.status,
        updatedStatus: item.updated_at,
      }));
      console.log(mappedData);

      setDataRows(data); // Store all data
      setRenderedRows(mappedData); // Initially render all data
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };
  useEffect(() => {
    // Fetch data from the API when the component mounts

    fetchData();
  }, []);
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Booking History");

    // Save the Excel file
    XLSX.writeFile(wb, "BookingHistory.xlsx");
  };
  const exportToPDF = (transformedDataRows: DataRow[]) => {
    console.log(transformedDataRows); // Log to check transformed data
    const doc = new jsPDF(),
      margin = 20,
      lineHeight = 10,
      pageHeight = doc.internal.pageSize.height,
      pageWidth = doc.internal.pageSize.width,
      columnWidth = (pageWidth - 3 * margin) / 2, // Divide remaining space into 2 columns
      logoPath = '/logo.png',
      logoWidth = 30,
      logoHeight = 30,
      title = 'S5 Logistics, Inc',
      totalWidth = logoWidth + doc.getTextWidth(title) + 5,
      logoX = (pageWidth - totalWidth) / 2;

    // Add logo and title (only for the first page)
    doc.addImage(logoPath, 'PNG', logoX, margin, logoWidth, logoHeight);
    doc.setFontSize(16);
    doc.text(title, logoX + logoWidth + 5, margin + logoHeight / 2);

    // Add contact information
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

    // Add "Return Items" title
    doc.setFontSize(18);
    const returnItemsTitle = 'Return Items',
      returnItemsWidth = doc.getTextWidth(returnItemsTitle);
    doc.text(returnItemsTitle, (pageWidth / 2) - returnItemsWidth / 2, margin + logoHeight + 40);

    let y = margin + logoHeight + 50;
    let columnIndex = 0; // This will track the column index (0 = left, 1 = right)

    // Iterate through transformedDataRows and fill columns
    transformedDataRows.forEach((item, index) => {
      console.log(item); // Log each item
      let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

      doc.setFontSize(10);
      doc.text(`Order #${item.id}:`, x, y);
      y += lineHeight;

      const details = [
        `Date: ${item.date}`,
        `Trip Ticket: ${item.orderNumber}`,
        `Truck Plate: ${item.truckPlateNumber}`,
        `Driver License: ${item.driverLicenseNo}`,
        `Sender: ${item.senderName}`,
        `Transport Mode: ${item.transportMode}`,
        `Delivery Type: ${item.deliveryType}`,
        `Journey Type: ${item.journeyType}`,
        `From: ${item.dateFrom} To: ${item.dateTo}`,
        `Origin: ${item.origin}`,
        `Destination: ${item.destination}`,
        `ETA: ${item.eta}`,
        `Consignee: ${item.consigneeName}`,
        `Address: ${item.consigneeAddress}`,
        `Email: ${item.consigneeEmail}`,
        `Mobile: ${item.consigneeMobile}`,
        `Merchant: ${item.merchantName}`,
        `Address: ${item.merchantAddress}`,
        `Email: ${item.merchantEmail}`,
        `Mobile: ${item.merchantMobile}`,
        `Products: ${item.products}`,
        `Backloads: ${item.backloads || 'N/A'}`,
        `Truck Type: ${item.truckType}`,
        `Remarks: ${item.remarks || 'N/A'}`,
        `Total Payment: $${item.totalPayment}`,
        `Reference: ${item.reference}`,
        `Booking Created By: ${item.bookingCreatedby || 'N/A'}`,
        `Location Updated By: ${item.locationUpdatedby || 'N/A'}`,
        `Location Updated At: ${item.locationUpdatedat || 'N/A'}`,
        `Status: ${item.status}`,
        `Updated Status: ${item.updatedStatus}`,
        `Proof of Delivery: ${item.proofOfDelivery || 'N/A'}`,
        `QR Code Path: ${item.qrCodePath}`,
        `Order Number: ${item.orderNumber}`,
        `Updated By: ${item.updatedBy}`,
      ];

      details.forEach((detail) => {
        const wrappedText = doc.splitTextToSize(detail, columnWidth);

        // Check if we need to move to a new column or page
        if (y + wrappedText.length * lineHeight > pageHeight - margin) {
          if (columnIndex === 0) {
            columnIndex = 1; // Move to second column
            y = doc.getNumberOfPages() === 1 ? margin + logoHeight + 50 : margin + 10; // Adjust y based on page
          } else {
            doc.addPage(); // Add new page
            columnIndex = 0; // Reset to first column
            y = margin + 10; // Start at margin, no extra space for the logo
          }
          x = columnIndex === 0 ? margin : margin + columnWidth + margin;
        }

        // Add wrapped text
        wrappedText.forEach((line: string, idx: number) => {
          doc.text(line, x, y + idx * lineHeight);
        });

        y += wrappedText.length * lineHeight; // Move down for the next line
      });

      y += lineHeight; // Add space between items
    });

    // Save the PDF
    doc.save('Booking History.pdf');
  };

  const handleAction = (action: string, row: renderedRow) => {
    console.log(`Action: ${action} on ${row.plateNumber}`);

    // Find the corresponding DataRow by matching the id from renderedRow
    const dataRow = dataRows.find((item: DataRow) => item.id === row.id);

    if (!dataRow) {
      console.error("DataRow not found for this renderedRow");
      return; // Exit if no corresponding DataRow found
    }
    console.log(dataRow)
    if (action === "View") {
      setSelectedRow(row); // Set rendered row for display
      setSelectedDataRow(dataRow); // Set corresponding data row
      setIsQRCodeVisible(true);
    } else if (action === "Edit") {
      setSelectedRow(row);
      setSelectedDataRow(dataRow); // Pass dataRow to be used in edit
      setIsEditModalOpen(true); // This opens the modal
    } else if (action === "Delete") {
      setSelectedRow(row);
      setSelectedDataRow(dataRow); // Pass dataRow to handle deletion
      setIsDeleteModalOpen(true);
    }
    setActionsVisibility((prevState) => ({
      ...prevState,
      [row.id]: false, // Close the dropdown for this specific row
    }));
  };

  const toggleActions = (id: number) => {
    setActionsVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSort = (column: string) => {
    const direction =
      sortDescriptor.column === column && sortDescriptor.direction === "ascending" ? "descending" : "ascending";

    setSortDescriptor({ column, direction });
  };
  const handleCloseModal = () => {
    setIsQRCodeVisible(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };
  const handleDelete = () => {
    fetchData();
  };

  // Filter the rows based on the search input
  const filteredRows = useMemo(() => {
    return renderedRows.filter((row) => {
      // Filter by plate number and date
      const rowString = `${row.plateNumber}`.toLowerCase(); // Focus on plate number column

      // Filter by date if selectedDate exists
      const matchesPlateNumber = rowString.includes(filterValue.toLowerCase());
      const matchesDate =
        !selectedDate || new Date(row.date).toISOString().split("T")[0] === selectedDate;

      return matchesPlateNumber && matchesDate;
    });
  }, [renderedRows, filterValue, selectedDate]);

  // Sorted rows
  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = a[sortDescriptor.column as keyof renderedRow];
      const bValue = b[sortDescriptor.column as keyof renderedRow];

      if (aValue < bValue) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortDescriptor]);
  const totalRows = sortedRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (newPage: any) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mr-4 flex-wrap sm:flex-nowrap">
        <div className="flex space-x-4 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search by Truck Plate Number"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white w-full sm:w-auto"
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white w-full sm:w-auto"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Right-aligned buttons */}
        <div className="flex space-x-4 mt-4 sm:mt-0 sm:ml-4">
          <Button
            onPress={exportToExcel}
            className="px-4 py-2 bg-green-500 text-white rounded-md w-full sm:w-auto"
          >
            Export to Excel
          </Button>
          <Button
            onPress={() => exportToPDF(transformedDataRows)}
            className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
          >
            Export to PDF
          </Button>
          <Button
            onPress={togglePopup}
            className="text-white bg-blue-500 px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Columns
          </Button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="absolute mr-10 right-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Select Columns</h3>
            <button onClick={togglePopup} className="text-gray-500">
              ✖
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {Object.keys(columns).map((col) => (
              <div key={col} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={columns[col]}
                  onChange={() => toggleColumn(col)}
                  className="cursor-pointer"
                />
                <span className="text-sm">{col.charAt(0).toUpperCase() + col.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-1 bg-white rounded-lg flex justify-between items-center overflow-auto w-full sm:w-[1550px] absolute mt-10">
        {displayedRows.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md w-full sm:w-[1800px] h-[580px]">
            <table className="min-w-full text-sm text-gray-600">
              <thead className="bg-gray-200">
                <tr>
                  {["date", "plateNumber", "destination", "products", "truckType", "proofOfDelivery", "remarks", "totalPayment", "reference", "tripTicket", "bookingCreated", "locationUpdatedby", "locationUpdatedat", "backloads", "status", "updatedStatus"].map((col) => (
                    columns[col] && (
                      <th key={col} onClick={() => handleSort(col)} className="px-10 py-5 text-center justify-center">
                        {col.charAt(0).toUpperCase() + col.slice(1)} {/* Capitalize column name */}
                        {sortDescriptor.column === col && (
                          <span className="ml-2">{sortDescriptor.direction === "ascending" ? "▲" : "▼"}</span>
                        )}
                      </th>
                    )
                  ))}
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayedRows.length > 0 ? (
                  displayedRows.map((row) => (
                    <tr key={row.id} className="border-b text-center justify-center">
                      {columns.date && <td className="px-4 py-2">{row.date || <span className="text-red-500">No Data</span>}</td>}
                      {columns.plateNumber && <td className="px-4 py-2">{row.plateNumber || <span className="text-red-500">No Data</span>}</td>}
                      {columns.destination && <td className="px-4 py-2">{row.destination || <span className="text-red-500">No Data</span>}</td>}
                      {columns.products && (
                        <td className="px-4 py-2">
                          {Array.isArray(row.products) && row.products.length > 0 ? (
                            row.products.map((product, index) => (
                              <div key={index}>
                                Name: {product.name || <span className="text-red-500">No Data</span>}
                                (Unit: {product.unit || <span className="text-red-500">No Data</span>},
                                Quantity: {product.quantity || <span className="text-red-500">No Data</span>})
                              </div>
                            ))
                          ) : (
                            <span className="text-red-500">No Data</span>
                          )}
                        </td>
                      )}
                      {columns.truckType && <td className="px-4 py-2">{row.truckType || <span className="text-red-500">No Data</span>}</td>}
                      {columns.proofOfDelivery && (
                        <td className="px-4 py-2">
                          {row.proofOfDelivery ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${row.proofOfDelivery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                              onClick={() => console.log(row.proofOfDelivery)}
                            >
                              View Proof
                            </a>
                          ) : (
                            <span className="text-red-500">No Data</span>
                          )}
                        </td>
                      )}
                      {columns.remarks && <td className="px-4 py-2">{row.remarks || <span className="text-red-500">No Data</span>}</td>}
                      {columns.totalPayment && <td className="px-4 py-2">{row.totalPayment || <span className="text-red-500">No Data</span>}</td>}
                      {columns.reference && <td className="px-4 py-2">{row.reference || <span className="text-red-500">No Data</span>}</td>}
                      {columns.tripTicket && <td className="px-4 py-2">{row.tripTicket || <span className="text-red-500">No Data</span>}</td>}
                      {columns.bookingCreated && <td className="px-4 py-2">{row.bookingCreated || <span className="text-red-500">No Data</span>}</td>}
                      {columns.locationUpdatedby && <td className="px-4 py-2">{row.locationUpdatedby || <span className="text-red-500">No Data</span>}</td>}
                      {columns.locationUpdatedat && <td className="px-4 py-2">{row.locationUpdatedat || <span className="text-red-500">No Data</span>}</td>}
                      {columns.backloads && (
                        <td className="px-4 py-2">
                          {Array.isArray(row.backloads) && row.backloads.length > 0 ? (
                            row.backloads.map((backload, index) => (
                              <div key={index}>
                                <div>Location: {backload.location || <span className="text-red-500">No Data</span>}</div>
                                <div>Name: {backload.name || <span className="text-red-500">No Data</span>}</div>
                                <div>Contact: {backload.contact || <span className="text-red-500">No Data</span>}</div>
                              </div>
                            ))
                          ) : (
                            <span className="text-red-500">No Data</span>
                          )}
                        </td>
                      )}
                      {columns.status && <td className="px-4 py-2">{row.status || <span className="text-red-500">No Data</span>}</td>}
                      {columns.updatedStatus && <td className="px-4 py-2">{row.updatedStatus || <span className="text-red-500">No Data</span>}</td>}
                      {/* Actions Column */}
                      <td className="px-4 py-2 relative">
                        <button className="focus:outline-none" onClick={() => toggleActions(row.id)}>
                          <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
                        </button>
                        {actionsVisibility[row.id] && (
                          <div className="absolute bg-white shadow-lg rounded-md mt-2 w-56 py-2 right-0 z-50">
                            <button
                              onClick={() => handleAction("View", row)}
                              className="block text-left px-4 py-2 w-full text-sm text-gray-600 hover:bg-gray-100"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleAction("Edit", row)}
                              className="block text-left px-4 py-2 w-full text-sm text-gray-600 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAction("Delete", row)}
                              className="block text-left px-4 py-2 w-full text-sm text-gray-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Object.keys(columns).length + 1} className="px-4 py-2 text-center text-red-500">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No data available</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-[620px] flex-wrap sm:flex-nowrap">
        {/* Rows per page dropdown */}
        <div className="flex items-center space-x-4 mb-6">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-700">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {/* Pagination Controls (Previous & Next Buttons) */}
        <div className="flex items-center space-x-2 mb-6 mt-5 ml-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            Previous
          </button>

          <span className="mx-2 w-24">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {isQRCodeVisible && selectedRow && (
        <QRCodeComponent rowData={selectedDataRow} onClose={handleCloseModal} />
      )}
      {isEditModalOpen && selectedRow && (
        <EditBookingHistory
          isOpen={isEditModalOpen}
          closeModal={handleCloseModal}
          rowData={selectedDataRow}
          handleEdit={(updatedRow) => console.log(updatedRow)}
        />
      )}
      {isDeleteModalOpen && selectedRow && (
        <DeleteBookingHistory
          row={selectedRow}
          onClose={handleCloseModal}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default App;
