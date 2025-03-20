"use client"
import React, { useState, useEffect } from "react";
import { PlusIcon, EllipsisVerticalIcon, HomeIcon, CurrencyDollarIcon, BuildingLibraryIcon, WrenchScrewdriverIcon, InformationCircleIcon, ClockIcon, BookOpenIcon, UserIcon, ChevronDownIcon, UserGroupIcon, CogIcon, CalculatorIcon, TruckIcon, UserPlusIcon, WrenchIcon, ChatBubbleLeftIcon, CalendarIcon, DocumentIcon, EyeIcon, PencilSquareIcon, TrashIcon, ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import AddReturnItemModal from "./components/addItem";
import EditReturnItemModal from "./components/editItem";
import DeleteReturnItemModal from "./components/deleteItem";
import ViewReturnItemModal from "./components/viewItem";
import Status from "./components/statusItem";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
interface DataRow {
  id: number,
  returnDate: string;
  productName: string;
  returnReason: string;
  returnQuantity: number;
  condition: string;
  driverName: string;
  returnStatus: string;
  proofOfReturn: string;
}

const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null);

  const [data, setData] = useState<DataRow[]>([]);
  const [clickedImage, setClickedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  const toggleMenu = (index: number) => {
    setActiveMenuIndex(prevIndex => (prevIndex === index ? null : index));
  };


  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const fetchData = async () => {
    try {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        console.error("No user ID found in sessionStorage.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/return-items/courier?user_id=${user_id}`
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result.returnItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };


  const handleAccept = (row: DataRow) => {
    console.log("Accepted:", row);
    setIsStatusModalOpen(false);
  };

  const handleReject = (row: DataRow) => {
    console.log("Rejected:", row);
    setIsStatusModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = (row: DataRow) => {
    console.log("Action Approved on row:", row);
    setIsStatusModalOpen(false);
  };


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Return Items");
    XLSX.writeFile(wb, "Return_Items.xlsx");
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
      title = 'S5 Logistics, Inc',
      totalWidth = logoWidth + doc.getTextWidth(title) + 5,
      logoX = (pageWidth - totalWidth) / 2;

    doc.addImage(logoPath, 'PNG', logoX, margin, logoWidth, logoHeight);
    doc.setFontSize(16);
    doc.text(title, logoX + logoWidth + 5, margin + logoHeight / 2);

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

    doc.setFontSize(18);
    const returnItemsTitle = 'Return Items',
      returnItemsWidth = doc.getTextWidth(returnItemsTitle);
    doc.text(returnItemsTitle, (pageWidth / 2) - returnItemsWidth / 2, margin + logoHeight + 40);

    let y = margin + logoHeight + 50;
    let columnIndex = 0;

    filteredData.forEach((item, index) => {
      let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

      doc.setFontSize(8);
      doc.text(`Return Item # ${index + 1}:`, x, y);
      y += lineHeight;

      const details = [
        `Return Date: ${item.returnDate}`,
        `Product Name: ${item.productName}`,
        `Return Reason: ${item.returnReason}`,
        `Return Quantity: ${item.returnQuantity}`,
        `Condition: ${item.condition}`,
        `Driver Name: ${item.driverName}`,
        `Return Status: ${item.returnStatus}`,
        `Proof of Return: ${item.proofOfReturn}`
      ];

      details.forEach((detail) => {
        const wrappedText = doc.splitTextToSize(detail, columnWidth);

        if (y + wrappedText.length * lineHeight > pageHeight - margin) {
          if (columnIndex === 0) {
            columnIndex = 1;
            y = doc.getNumberOfPages() === 1 ? margin + logoHeight + 50 : margin + 10;
          } else {
            doc.addPage();
            columnIndex = 0;
            y = margin + 10;
          }
          x = columnIndex === 0 ? margin : margin + columnWidth + margin;
        }

        wrappedText.forEach((line: any, idx: any) => {
          doc.text(line, x, y + idx * lineHeight);
        });

        y += wrappedText.length * lineHeight;
      });

      y += lineHeight;
    });

    doc.save('ReturnItems.pdf');
  };


  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false)
    setIsViewModalOpen(false)
    setIsStatusModalOpen(false)
  };
  const handleAddSuccess = () => {
    fetchData();
  };
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataRow;
    direction: "asc" | "desc";
  }>({
    key: "returnDate",
    direction: "asc",
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

  };

  const filteredData = Array.isArray(data)
    ? data.filter((row) =>
      row.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleSort = (columnKey: keyof DataRow) => {
    const direction =
      sortConfig.key === columnKey && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: columnKey, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[columnKey] > b[columnKey]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  const handleAction = (action: string, row: DataRow, index: number) => {
    console.log(`Action: ${action} on`, row);

    if (action === "View") {
      setSelectedRow(row);
      setIsViewModalOpen(true);
    }
    else if (action === "Edit") {
      setSelectedRow(row);
      setIsEditModalOpen(true);
    } else if (action === "Delete") {
      setSelectedRow(row);
      setIsDeleteModalOpen(true);
    }
    else if (action === "Status") {
      setSelectedRow(row);
      setIsStatusModalOpen(true);
    }
    closeMenu()
    setActiveMenuIndex(null);
  };
  const handleEdit = (updatedData: any) => {
    console.log('Updated Data:', updatedData);
    fetchData()
  };
  const handleSuccess = () => {

    fetchData();
    setIsStatusModalOpen(false)
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle items per page change
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };
  const handleDelete = (row: DataRow) => {
    console.log(`Deleted row with id: ${row.id}`);

    fetchData()
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="text-black">
      <div className="p-1 bg-white max-sm:mt-10">
        <div className="bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 p-4">
          {/* Title (Return Items) */}
          <h1 className="text-xl font-bold">Return Items</h1>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-4 sm:flex-nowrap">
            {/* Export Excel Button */}
            <Button
              color="success"
              onPress={exportToExcel}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 w-full sm:w-auto"
            >
              Export Excel
            </Button>

            {/* Export PDF Button */}
            <Button
              onPress={exportToPDF}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 w-full sm:w-auto"
            >
              Export PDF
            </Button>

            {/* Add Return Items Button */}
            <Button
              onPress={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full sm:w-auto"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Return Items
            </Button>
          </div>
        </div>

        {/* Add Return Item Modal */}
        <AddReturnItemModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleAddSuccess}
        />
      </div>




      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Return Item"
          className="px-4 py-2 w-full sm:w-1/4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
      <div className="overflow-x-auto w-full">

        <table className="min-w-full table-auto border-1.5">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("returnDate")}
              >
                Return Date{" "}
                {sortConfig.key === "returnDate" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("productName")}
              >
                Product Name {" "}
                {sortConfig.key === "productName" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("returnReason")}
              >
                Return Reason{" "}
                {sortConfig.key === "returnReason" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("returnQuantity")}
              >
                Return Quantity{" "}
                {sortConfig.key === "returnQuantity" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("condition")}
              >
                Condition{" "}
                {sortConfig.key === "condition" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("driverName")}
              >
                Driver Name{" "}
                {sortConfig.key === "driverName" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("returnStatus")}
              >
                Return Status{" "}
                {sortConfig.key === "returnStatus" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleSort("proofOfReturn")}
              >
                Proof of Return{" "}
                {sortConfig.key === "proofOfReturn" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-2">
                  {new Date(row.returnDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).replace(/ /g, "-")}
                </td>

                <td className="px-4 py-2">{row.productName}</td>
                <td className="px-4 py-2">{row.returnReason}</td>
                <td className="px-4 py-2">{row.returnQuantity}</td>
                <td className="px-4 py-2">{row.condition}</td>
                <td className="px-4 py-2">{row.driverName}</td>
                <td className="px-4 py-2 flex">
                  <Chip
                    color={
                      row.returnStatus === "Rejected"
                        ? "danger"
                        : row.returnStatus === "Pending"
                          ? "warning"
                          : row.returnStatus === "Approved"
                            ? "success"
                            : "default"
                    }
                    variant="solid"
                    className="px-4 py-2 text-white"
                  >
                    {row.returnStatus}
                  </Chip>
                </td>

                <td className="px-4 py-2 relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${row.proofOfReturn}`}
                    alt="Proof of Return"
                    className="w-10 h-10 transition-transform duration-300 transform cursor-pointer"
                    onClick={() => setClickedImage(row.proofOfReturn)}
                  />
                </td>

                {clickedImage === row.proofOfReturn && (
                  <div
                    className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
                    onClick={() => setClickedImage(null)}
                  >
                    <div
                      className="relative max-w-full max-h-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close Button - Positioned Relative to Image */}
                      <button
                        className="absolute -top-3 -right-1 text-black p-2 rounded-full  
                   transition-transform transform hover:scale-110 "
                        onClick={() => setClickedImage(null)}
                      >
                        ✖
                      </button>

                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${row.proofOfReturn}`}
                        alt="Proof of Return"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}




                <td className="px-4 py-2 relative">
                  <div className="relative">
                    <Dropdown className="z-50">
                      <DropdownTrigger>
                        <EllipsisVerticalIcon className="h-6 w-6 text-gray-600 cursor-pointer" onClick={() => toggleMenu(index)} />
                      </DropdownTrigger>
                      <DropdownMenu className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                        <DropdownItem
                          key="view"
                          onPress={() => handleAction("View", row, index)}
                          className="flex items-center p-2 hover:bg-gray-100"
                        >
                          <div className="flex">
                            <EyeIcon className="mr-2 w-5" /> View
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          onPress={() => handleAction("Edit", row, index)}
                          className="flex items-center p-2 hover:bg-gray-100"
                        >
                          <div className="flex">
                            <PencilSquareIcon className="mr-2 w-5" /> Edit
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          onPress={() => handleAction("Delete", row, index)}
                          className="flex items-center p-2 hover:bg-gray-100 text-red-600"
                        >
                          <div className="flex">
                            <TrashIcon className="mr-2 w-5" /> Delete

                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="approve_reject"
                          onPress={() => handleAction("Status", row, index)}
                          className="flex items-center p-2 hover:bg-gray-100 text-yellow-600"
                        >
                          <div className="flex">
                            <ArchiveBoxArrowDownIcon className="mr-2 w-5" /> Approve/Reject
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isViewModalOpen && selectedRow && (
        <ViewReturnItemModal row={selectedRow} onClose={handleCloseModal} />
      )}
      {isEditModalOpen && selectedRow && (
        <EditReturnItemModal
          isOpen={isEditModalOpen}
          closeModal={handleCloseModal}
          rowData={selectedRow || {}}
          handleEdit={handleEdit}
        />
      )}
      {isDeleteModalOpen && selectedRow && (
        <DeleteReturnItemModal
          row={selectedRow}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => handleDelete(selectedRow)}
        />
      )}
      {isStatusModalOpen && selectedRow && (
        <Status
          isOpen={isStatusModalOpen}
          row={selectedRow} // Ensure selectedRow is passed correctly
          onClose={handleCloseModal}
          onSuccess={() => handleSuccess()}

        />
      )}

      <div className="mt-4 flex flex-wrap justify-between items-center gap-4 ">
        {/* Show items per page selection */}
        <div className="flex items-center  w-full sm:w-auto">
          <span>Show </span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span> entries</span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center w-full sm:w-auto justify-end gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="mx-2">
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

    </div>

  );
};

export default DataTable;
