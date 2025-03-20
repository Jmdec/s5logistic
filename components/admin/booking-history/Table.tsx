"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { toast } from "react-toastify";
import Export from "@/components/accounting/export";
import { EyeIcon, PrinterIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import html2canvas from "html2canvas";
import DetailsModal from "../DetailsModal";
import RowsPerPage from "@/components/RowsPerPage";


interface HistoryData {
  id: number;
  created_at: string;
  order_number: string;
  plate_number: string;
  destination: string;
  products: { name: string, unit: string, quantity: number }[];
  truck_type: string;
  proof_of_delivery: File | string | null;
  remarks: string | null;
  backloads: { name: string, location: number, contact_number: string }[];
  total_payment: number;
  order_status: string;
  booking_create_by: string;
  location_updated_by: string;
  location_updated_at: string;
  qr_code_path: string;
  status: string;
  trackingNumber: string;
  merchant_name: string;
  merchant_mobile: string;
  merchant_email: string;
  merchant_address: string;
  consignee_name: string;
  consignee_email: string;
  consignee_mobile: string;
  consignee_address: string;
  date_of_pickup: string;
}


export default function App() {
  const [HistoryData, setHistoryData] = useState<HistoryData[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPrintOpen, setIsPrintModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<HistoryData | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "driver_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);


  const fetchHistoryData = async () => {
    let userId = sessionStorage.getItem('user_id');
    if (!userId) {
      console.error("User ID is not found in sessionStorage");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/booking-history?userId=${userId}`);
      const text = await response.text();
      console.log("Raw Response:", text);

      const data = JSON.parse(text);

      if (Array.isArray(data.booking_history)) {
        setHistoryData(data.booking_history);
      } else {
        console.error("Expected 'driver' to be an array but got:", data);
        toast.error("Failed to load driver data.");
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      toast.error("Error fetching driver data.");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const handleDetailsModal = (id: number) => {
    const foundData = HistoryData.find((emp) => emp.id === id);
    if (foundData) {
      setSelectedData(foundData);
      setIsOpenDetails(true);
    } else {
      toast.error("Data not found.");
    }
  };
  useEffect(() => {
    fetchHistoryData();
    const intervalId = setInterval(fetchHistoryData, 10000);
    return () => clearInterval(intervalId);
  }, []);
  const filteredItems = React.useMemo(() => {
    return HistoryData.filter((data) => {
      const formattedDate = new Date(data.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return (
        (data.destination && data.destination.toLowerCase().includes(filterValue.toLowerCase())) ||
        (Array.isArray(data.products) && data.products.some((product) =>
          product.name && product.name.toLowerCase().includes(filterValue.toLowerCase())
        )) ||
        (data.order_number && data.order_number.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.plate_number && data.plate_number.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.truck_type && data.truck_type.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.proof_of_delivery && data.proof_of_delivery.toString().toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.remarks && data.remarks.toLowerCase().includes(filterValue.toLowerCase())) ||
        (Array.isArray(data.backloads) && data.backloads.some((backload) =>
          (backload.name && backload.name.toLowerCase().includes(filterValue.toLowerCase())) ||
          (backload.location && backload.location.toString().toLowerCase().includes(filterValue.toLowerCase())) ||
          (backload.contact_number && backload.contact_number.toLowerCase().includes(filterValue.toLowerCase()))
        )) ||
        (data.total_payment && data.total_payment.toString().includes(filterValue)) ||
        (data.order_status && data.order_status.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.booking_create_by && data.booking_create_by.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.location_updated_by && data.location_updated_by.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.location_updated_at && data.location_updated_at.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.qr_code_path && data.qr_code_path.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.status && data.status.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.trackingNumber && data.trackingNumber.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.merchant_name && data.merchant_name.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.merchant_mobile && data.merchant_mobile.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.merchant_email && data.merchant_email.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.merchant_address && data.merchant_address.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.consignee_name && data.consignee_name.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.consignee_email && data.consignee_email.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.consignee_mobile && data.consignee_mobile.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.consignee_address && data.consignee_address.toLowerCase().includes(filterValue.toLowerCase())) ||
        (data.date_of_pickup && data.date_of_pickup.toLowerCase().includes(filterValue.toLowerCase())) ||
        (formattedDate && formattedDate.toLowerCase().includes(filterValue.toLowerCase())) // Added formatted date filter
      );
    });
  }, [HistoryData, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof HistoryData];
      const second = b[sortDescriptor.column as keyof HistoryData];

      if (first == null && second == null) return 0;
      if (first == null) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (second == null) return sortDescriptor.direction === "ascending" ? 1 : -1;

      if (Array.isArray(first) && Array.isArray(second)) {
        const firstString = first.map((item) => item.name).join(", ");
        const secondString = second.map((item) => item.name).join(", ");
        return sortDescriptor.direction === "ascending"
          ? firstString.localeCompare(secondString)
          : secondString.localeCompare(firstString);
      }

      if (typeof first === "string" && typeof second === "string") {
        return sortDescriptor.direction === "ascending"
          ? first.localeCompare(second)
          : second.localeCompare(first);
      }

      if (typeof first === "number" && typeof second === "number") {
        return sortDescriptor.direction === "ascending" ? first - second : second - first;
      }

      if (first instanceof File && second instanceof File) {
        return sortDescriptor.direction === "ascending"
          ? first.name.localeCompare(second.name)
          : second.name.localeCompare(first.name);
      }

      return 0;
    });
  }, [sortDescriptor, items]);


  const renderCell = (data: HistoryData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof HistoryData];

    const formatStatus = (status: string | null | undefined) => {
      if (!status) return "";
      return status
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    switch (columnKey) {
      case "created_at":
        if (cellValue && !isNaN(Date.parse(cellValue.toString()))) {
          const date = new Date(cellValue.toString());

          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).replace(/ /g, "-");

          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return `${formattedDate}, ${formattedTime}`;
        }
        return "";
      case "products":
        if (Array.isArray(cellValue)) {
          return (
            <div>
              {cellValue.map((item, index) => {
                if ("unit" in item) {
                  return (
                    <div key={index}>
                      <span>{item.name}</span>
                      {item.unit && <span>({item.unit})</span>}
                      {item.quantity && <span> - Quantity: {item.quantity}</span>}
                      {index < cellValue.length - 1 && ", "}
                    </div>
                  );
                }
                return <div>No Products</div>;
              })}
            </div>
          );
        }
        return <div>No Products</div>;

      case "backloads":
        if (Array.isArray(cellValue)) {
          return (
            <div>
              {cellValue.map((item, index) => {
                if ("location" in item) {
                  return (
                    <div key={index}>
                      <span>{item.name}</span>
                      {item.contact_number && <span> - {item.contact_number}</span>}
                      {item.location && <span> ({item.location})</span>}
                      {index < cellValue.length - 1 && ", "}
                    </div>
                  );
                }
                return <div>No Backloads</div>;
              })}
            </div>
          );
        }
        return <div>No Backloads</div>;

      case "proof_of_delivery":
        const formattedUrl = cellValue
          ? `${process.env.NEXT_PUBLIC_SERVER_PORT}/${cellValue}`
          : "/S5Logo.png";

        return (
          <div>
            <img
              src={formattedUrl}
              alt="Proof of Delivery"
              className="h-10 w-10 rounded-full object-cover"
              onClick={() => handleImageClick(formattedUrl)}
            />
          </div>
        );

      case "total_payment":
        return <div>
          {data.total_payment}
        </div>
      case "status":
        return (
          <div>
            <Chip
              color={
                data.status === "Pod_returned"
                  ? "secondary"
                  : data.status === "For_Pick-up"
                    ? "primary"
                    : data.status === "Delivery_successful"
                      ? "success"
                      : data.status === "First_delivery_attempt"
                        ? "warning"
                        : data.status === "In_Transit"
                          ? "primary"
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
          <div className="flex flex-cols-4 gap-2 text-white">
            <EyeIcon className="text-blue-700 w-6 h-6 cursor-pointer hover:text-blue-500" onClick={() => handleOpenModal(data.id)} />
            <PrinterIcon className="text-black w-6 h-6 cursor-pointer hover:text-blue-500" onClick={() => handlePrintModal(data.id)} />
          </div>
        );
      default:
        return <div>{cellValue?.toString() || "N/A"}</div>;
    }
  };
  const handlePrintModal = (id: number) => {
    const data = HistoryData.find((item) => item.id === id);

    console.log('waybill', data);
    if (!data) {
      toast.error("Data not found.");
      return;
    }

    console.log("QR Code Path:", data.qr_code_path);

    setSelectedData(data);
    setIsPrintModalOpen(true);
  };

  const handleOpenModal = (id: number) => {
    const data = HistoryData.find((item) => item.id === id);

    if (!data) {
      toast.error("Data not found.");
      return;
    }

    console.log("QR Code Path:", data.qr_code_path);

    setSelectedData(data);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsPrintModalOpen(false);
    setSelectedData(null);
  };
  const handlePrint = () => {
    const formElement = document.getElementById('way-bill');

    if (formElement) {
      const originalStyles = formElement.getAttribute('style') || '';
      formElement.style.overflow = 'visible';

      html2canvas(formElement).then((canvas) => {
        formElement.style.cssText = originalStyles;

        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print Waybill</title><style>');

          printWindow.document.write(`
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        margin: 0;
                        padding: 20px;
                        background: #fff;
                        text-align: center;
                    }
                    .print-container {
                        width: 90%;
                        border: 2px dashed #000;
                        padding: 20px;
                        margin: auto;
                        text-align: center;
                    }
                    .header img {
                        width: 120px;
                        height: auto;
                        display: block;
                        margin: 0 auto 10px;
                    }
                    .waybill-details {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 12px;
                    }
                    .order-details,
                    .qr-section,
                    .product-info,
                    .seller-buyer {
                        font-size: 14px;
                        margin-bottom: 20px;
                        padding: 10px;
                    }
                    .qr-section img {
                        max-width: 200px;
                        height: auto;
                        display: block;
                        margin: auto;
                    }
                    .seller-buyer {
                        display: flex;
                        justify-content: space-between;
                        text-align: left;
                        border: 1px dashed #000;
                        padding: 10px;
                    }
                    .seller, .buyer {
                        width: 48%;
                        padding: 10px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 10px;
                    }
                `);

          printWindow.document.write('</style></head><body>');

          printWindow.document.write('<div class="print-container">');
          printWindow.document.write('<div class="header"><img src="/logo-without-bg.png" alt="Company Logo"></div>');

          printWindow.document.write(`
                    <div class="waybill-details">
                        Order Number: ${selectedData?.order_number}
                        <p><strong>Tracking Number:</strong> ${selectedData?.trackingNumber || "None"}</p>
                    </div>
                `);

          printWindow.document.write(`
                    <div class="order-details">
                        <p><strong>Product Name:</strong> ${selectedData?.products?.map(p => p.name).join(', ')}</p>
                        <p><strong>Product Quantity:</strong> ${selectedData?.products?.map(p => p.quantity).join(', ')}</p>
                    </div>
                `);

          printWindow.document.write(`
                    <div class="qr-section">
                        <img src="${process.env.NEXT_PUBLIC_SERVER_PORT}/${selectedData?.qr_code_path}" alt="QR Code">
                    </div>
                `);

          printWindow.document.write(`
                    <div class="seller-buyer">
                        <div class="seller">
                            <h3><strong>SELLER (Merchant)</strong></h3>
                            <p><strong>Name:</strong> ${selectedData?.merchant_name}</p>
                            <p><strong>Address:</strong> ${selectedData?.merchant_address}</p>
                            <p><strong>Phone:</strong> ${selectedData?.merchant_mobile}</p>
                        </div>
                        <div class="buyer">
                            <h3><strong>BUYER (Consignee)</strong></h3>
                            <p><strong>Name:</strong> ${selectedData?.consignee_name}</p>
                            <p><strong>Address:</strong> ${selectedData?.consignee_address}</p>
                            <p><strong>Phone:</strong> ${selectedData?.consignee_mobile}</p>
                        </div>
                    </div>
                `);



          printWindow.document.write('</div></body></html>');
          printWindow.document.close();
          printWindow.print();
        } else {
          console.error('Failed to open print window');
        }
      });
    } else {
      console.error('Form element not found');
    }
  };





  const columns = [
    { name: "Date", uid: "created_at", sortable: true },
    { name: "Order Number", uid: "order_number", sortable: true },
    { name: "Plate Number", uid: "plate_number", sortable: true },
    { name: "Destination", uid: "destination", sortable: true },
    { name: "Products", uid: "products", sortable: false },
    { name: "Truck Type", uid: "truck_type", sortable: true },
    { name: "Proof of Delivery", uid: "proof_of_delivery", sortable: false },
    { name: "Remarks", uid: "remarks", sortable: false },
    { name: "Backloads", uid: "backloads", sortable: false },
    { name: "Total Payment", uid: "total_payment", sortable: true },
    { name: "Order Status", uid: "order_status", sortable: true },
    { name: "Booking Create By", uid: "booking_create_by", sortable: true },
    { name: "Location Updated By", uid: "location_updated_by", sortable: true },
    { name: "Location Updated At", uid: "location_updated_at", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Actions", uid: "actions", sortable: false },
  ];
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, column) => {
      acc[column.uid] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleColumnVisibilityChange = (columnUid: string, isChecked: boolean) => {
    setVisibleColumns((prevState) => ({
      ...prevState,
      [columnUid]: isChecked,
    }));
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-10 overflow-x-auto">
      <div className="flex justify-end space-x-1 mb-4">
        <div className="relative">
          <Dropdown>
            <DropdownTrigger>
              <Button className="text-xs lg:text-base" color="primary">Select Columns</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Column Selection" >
              {columns.map((column) => (
                <DropdownItem key={column.uid} >
                  <label className="flex items-center" onClick={(e) => e.stopPropagation()} >
                    <input
                      type="checkbox"
                      checked={visibleColumns[column.uid]}
                      onChange={(e) =>
                        handleColumnVisibilityChange(column.uid, e.target.checked)
                      }
                      className="mr-2"
                    />
                    {column.name}
                  </label>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Export label="Export" />
      </div>
      <div className="mb-4 flex justify-between items-center space-x-4">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Search"
          className="px-4 py-2 border rounded-md w-full lg:w-1/2"
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
                {columns.map(
                  (column) =>
                    visibleColumns[column.uid] && (
                      <th
                        key={column.uid}
                        className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer min-w-10"
                        onClick={() =>
                          column.sortable &&
                          setSortDescriptor({
                            column: column.uid,
                            direction:
                              sortDescriptor.column === column.uid &&
                                sortDescriptor.direction === "ascending"
                                ? "descending"
                                : "ascending",
                          })
                        }
                      >
                        {column.name}
                        {column.sortable && (
                          <span className="ml-2 text-xs">
                            {sortDescriptor.column === column.uid
                              ? sortDescriptor.direction === 'ascending'
                                ? '↑'
                                : '↓'
                              : '↕'}
                          </span>
                        )}
                      </th>
                    )
                )}
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
      {isOpen && (
        <div>
          {/* Modal Container */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto">
              <div className="flex justify-end items-center">
                <XMarkIcon className="text-black items-end w-8 h-8 cursor-pointer" onClick={handleCloseModal} />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4">QR Code</h2>

              {selectedData?.qr_code_path && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${selectedData?.qr_code_path}`}
                    alt="QR Code"
                    className="w-96 h-96 object-contain p-2"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      <div>
        {isPrintOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-center flex-grow">Waybill</h2>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-black hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Waybill Structure Start */}
              <div id="way-bill">
                <div className="header flex justify-between mb-8">
                  <div className="logo">
                    <img src="/logo-without-bg.png" alt="Company Logo" className="w-24 h-auto" />
                  </div>
                  <div className="waybill-details text-right">
                    <div className="waybill-number font-bold text-lg">Order Number: {selectedData?.order_number}</div>
                    <div className="non-dg text-sm">Order Number</div>
                  </div>
                </div>

                <div className="order-details mb-6">
                  <div className="flex">
                    <p className="mr-2">Product Name:</p>
                    <ul>
                      {selectedData?.products?.map((product, index) => (
                        <li key={index} className="font-semibold">{product.name},</li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-type mt-2">Tracking Number: {selectedData?.trackingNumber}</div>
                </div>

                <div className="qr-section flex justify-center mb-8">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${selectedData?.qr_code_path}`}
                    alt="QR Code"
                    className="w-64 h-64 object-contain p-2"
                  />
                </div>

                {/* Seller & Buyer info in two columns */}
                <div className="flex text-center mb-8">
                  <div className="w-1/2 pr-4">
                    <div className="font-semibold text-lg mb-2">SELLER</div>
                    <div className="from-address">
                      <div className="name text-sm">{selectedData?.merchant_name}</div>
                      <div className="address-line text-sm">{selectedData?.merchant_address}</div>
                      <div className="postal-code text-sm">{selectedData?.merchant_mobile}</div>
                    </div>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="font-semibold text-lg mb-2">BUYER</div>
                    <div className="to-address">
                      <div className="name text-sm">{selectedData?.consignee_name}</div>
                      <div className="address-line text-sm">{selectedData?.consignee_address}</div>
                      <div className="postal-code text-sm">{selectedData?.consignee_mobile}</div>
                    </div>
                  </div>
                </div>

                <div className="additional-info mb-6">
                  <div className="pickup text-sm">Pickup Date: {selectedData?.date_of_pickup}</div>
                </div>

                <div className="product-info mb-6">
                  <div className="flex">
                    <p className="mr-2">Product Quantity:</p>
                    {selectedData?.products?.map((product, index) => (
                      <span key={index} className="font-semibold">{product.quantity},</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Waybill Structure End */}

              <div className="modal-footer flex justify-end mt-8">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Print Booking Details
                </button>
              </div>
            </div>
          </div>

        )}

        {isImageModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg max-h-[80vh] overflow-auto">
              <div className="flex justify-end">
                <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon width={30} />
                </button>
              </div>
              <img
                src={imagePreview || ""}
                alt="Full-size Image"
                className="w-full h-auto max-h-[70vh] object-contain mt-4"
              />
            </div>
          </div>
        )}

        {selectedData && (
          <DetailsModal
            isOpenDetails={isOpenDetails}
            handleCloseModal={handleCloseModal}
            details={selectedData}
            title="Booking History Data"
          />
        )}

      </div>
    </div>
  );
}
