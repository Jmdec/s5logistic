"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, EllipsisVerticalIcon, EyeIcon, PencilSquareIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import AddPDOReturned from "./components/addItem";
import EditPDOReturned from "./components/editItem";
import DeletePDOReturned from "./components/deleteItem";
import ViewPDOReturned from "./components/viewItem";
import CloseTripPDOReturned from "./components/closeTrip";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
type DataRow = {
  plateNumber: string;
  completionOfTrip: string;
  status: string;
  arrivalProof: File | null;  // Ensure this matches in both components
  proofOfDelivery: File | null;
};


const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [data, setData] = useState<DataRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>(''); // Ensure it's a string


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const toggleMenu = (index: number) => {
    setActiveMenuIndex(prevIndex => (prevIndex === index ? null : index));
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleImageClick = (src: string) => {
    setSelectedImage(selectedImage === src ? null : src);
  };
  const closeModal = () => {
    setIsImageModalOpen(false);
    setCurrentImage('');
  };

  const getImageSrc = (image: File | string | null) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image || '';
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setIsViewModalOpen(false)
    setIsCloseModalOpen(false)
  };
  const fetchData = async () => {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/pdoreturned`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch data', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const updateTable = (newData: DataRow) => {
    setData((prevData) => [...prevData, newData]);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataRow;
    direction: "asc" | "desc";
  }>({
    key: "plateNumber",
    direction: "asc",
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    row.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (columnKey: keyof DataRow) => {
    const direction =
      sortConfig.key === columnKey && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: columnKey, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];

      if (aValue === null || aValue === undefined || bValue === null || bValue === undefined) {
        return 0;
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };


  const handleAction = (action: string, row: any, index: number) => {

    if (action === 'Edit') {
      setSelectedRow(row);
      setIsEditModalOpen(true);
    } else if (action === 'Delete') {
      setSelectedRow(row);
      setIsDeleteModalOpen(true);
    } else if (action === 'View') {
      setSelectedRow(row);
      setIsViewModalOpen(true);
    } else if (action === 'Close') {
      setSelectedRow(row);
      setIsCloseModalOpen(true)
    }
    setActiveMenuIndex(null)
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };
  const handleDelete = (row: DataRow) => {


    fetchData()
  };
  const handleClose = (row: DataRow) => {


    fetchData()
    setIsCloseModalOpen(false)
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Return Items");
    XLSX.writeFile(wb, "PDOReturned.xlsx");
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
    const pdoReturnedTitle = 'PDO Returned',
      pdoReturnedWidth = doc.getTextWidth(pdoReturnedTitle);
    doc.text(pdoReturnedTitle, (pageWidth / 2) - pdoReturnedWidth / 2, margin + logoHeight + 40);

    let y = margin + logoHeight + 50;
    let columnIndex = 0;
    filteredData.forEach((item, index) => {
      let x = columnIndex === 0 ? margin : margin + columnWidth + margin;

      doc.setFontSize(8);
      doc.text(`Return Item # ${index + 1}:`, x, y);
      y += lineHeight;

      const details = [
        `Plate Number: ${item.plateNumber}`,
        `Completion of Trip: ${item.completionOfTrip}`,
        `Status: ${item.status}`,
        `Arrival Proof: ${item.arrivalProof ? item.arrivalProof.name : 'N/A'}`,
        `Proof of Delivery: ${item.proofOfDelivery ? item.proofOfDelivery.name : 'N/A'}`
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

    doc.save('PDO Returned.pdf');
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleEdit = (updatedData: any) => {
    console.log('Updated Data:', updatedData);
    fetchData()
  };
  return (
    <div className="text-black">
<div className="p-1 bg-white">
  <div className="bg-white rounded-lg flex flex-wrap justify-between items-center gap-4 p-4">
    {/* Title (PDO-Returned) */}
    <h1 className="text-xl font-bold">PDO-Returned</h1>

    {/* Buttons */}
    <div className="flex flex-wrap justify-center sm:justify-end gap-4 w-full sm:w-auto">
      <Button
        color="success"
        onPress={exportToExcel}
        className="px-4 max-sm:w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
      >
        Export Excel
      </Button>

      <Button
        onPress={exportToPDF}
        className="px-4 py-2 max-sm:w-full text-white bg-blue-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
      >
        Export PDF
      </Button>

      <Button
        className="flex items-center max-sm:w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        onPress={handleOpenModal}
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add PDO Returned
      </Button>

      <AddPDOReturned
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        updateTable={updateTable}
      />
    </div>
  </div>
</div>




        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by Plate Number"
            className="px-4 py-2 w-full sm:w-1/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full table-auto border-1.5">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("plateNumber")}
                >
                  Plate Number{" "}
                  {sortConfig.key === "plateNumber" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("arrivalProof")}
                >
                  Arrival Proof{" "}
                  {sortConfig.key === "arrivalProof" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("proofOfDelivery")}
                >
                  Proof of Delivery{" "}
                  {sortConfig.key === "proofOfDelivery" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("completionOfTrip")}
                >
                  Completion of Trip{" "}
                  {sortConfig.key === "completionOfTrip" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center">No data available</td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-2">{row.plateNumber}</td>

                    <td className="px-4 py-2">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${getImageSrc(row.arrivalProof)}`}
                        alt="Arrival Proof"
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() =>
                          handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}${getImageSrc(row.arrivalProof)}`)
                        }
                      />
                    </td>

                    <td className="px-4 py-2">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${getImageSrc(row.proofOfDelivery)}`}
                        alt="Proof of Delivery"
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() =>
                          handleImageClick(`${process.env.NEXT_PUBLIC_SERVER_PORT}${getImageSrc(row.proofOfDelivery)}`)
                        }
                      />
                    </td>
                   {selectedImage && (
  <div
    className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
    onClick={() => setSelectedImage(null)}
  >
    <div
      className="relative max-w-full max-h-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button Positioned Relative to Image */}
      <button
        className="absolute -top-3 -right-1  text-black p-2 rounded-full  
                   transition-transform transform hover:scale-110"
        onClick={() => setSelectedImage(null)}
      >
        ✖
      </button>

      <img
        src={selectedImage}
        alt="Enlarged"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
      />
    </div>
  </div>
)}

                    <td className="px-4 py-2">{row.completionOfTrip}</td>
                    <td className="px-4 py-2">
                      <Chip
                        color={
                          row.status === "Closed"
                            ? "danger"
                            : row.status === "Pending"
                              ? "warning"
                              : row.status === "Returned Successfully"
                                ? "success"
                                : "default"
                        }
                        variant="solid"
                        className="px-4 py-2 text-white"
                      >
                        {row.status}
                      </Chip>
                    </td>

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
                              key="close"
                              onPress={() => handleAction("Close", row, index)}
                              className="flex items-center p-2 hover:bg-gray-100 text-yellow-600"
                            >
                              <div className="flex">
                                <XCircleIcon className="mr-2 w-5" /> Close Trip
                              </div>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {isViewModalOpen && selectedRow && (
              <ViewPDOReturned row={selectedRow} onClose={handleCloseModal} />
            )}
            {isEditModalOpen && selectedRow && (
              <EditPDOReturned
                isOpen={isEditModalOpen}
                closeModal={handleCloseModal}
                rowData={selectedRow}
                handleEdit={handleEdit}
              />
            )}
            {isDeleteModalOpen && selectedRow && (
              <DeletePDOReturned
                row={selectedRow}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={() => {
                  handleDelete(selectedRow);
                }}
              />
            )}
            {isCloseModalOpen && selectedRow && (
              <CloseTripPDOReturned row={selectedRow} onClose={handleCloseModal} onSubmit={() => {
                handleClose(selectedRow);

              }} />
            )}
          </table>
        </div>
<div className="mt-4 flex flex-wrap justify-between items-center gap-4 sm:gap-6">
  <div className="flex items-center w-full sm:w-auto">
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

  <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
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
