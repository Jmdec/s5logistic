import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

interface DetailsModalProps {
  isOpenDetails: boolean;
  handleCloseModal: () => void;
  details: Record<string, any>;
  title: string;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpenDetails, handleCloseModal, details, title }) => {
  if (!isOpenDetails) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .image-preview { width: 100px; height: auto; border-radius: 5px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div>
            <h2>${title}</h2>
    `);
  
    Object.entries(details)
      .filter(([key]) => 
        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at" &&
        !key.includes("verified") &&
        !key.includes("provide") &&
        !key.includes("google_id")
      )
      .forEach(([key, value]) => {
        let displayValue: string | number = "N/A";
        if (typeof value === "string" && key.includes("date")) {
          displayValue = new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });        
        } else if (typeof value === "string" && (key.includes("image") || key.includes("proof"))) {
          displayValue = `<img src="${process.env.NEXT_PUBLIC_SERVER_PORT}/${value}" alt="${key}" class="image-preview" />`;
        } else if (typeof value === "string" || typeof value === "number") {
          displayValue = value.toString();
        }
  
        printWindow.document.write(`
          <div>
            <strong>${key.replace(/_/g, ' ')}</strong>: ${displayValue}
          </div>
        `);
      });
  
    printWindow.document.write(`
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Image
              src="/logo-without-bg.png"
              alt="Admin Panel Logo"
              width={100}
              height={100}
              className="mr-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <XMarkIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800"
              onClick={() => handleCloseModal()}
            />
          </div>
        </div>

        <h2 className="text-2xl text-center mb-6 font-semibold text-gray-800">{title}</h2>

        <div className="space-y-6">
          {Object.entries(details)
            .filter(([key]) =>
              key !== "id" && key !== "created_at" && key !== "updated_at"
            )
            .map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize mr-5">{key.replace(/_/g, " ")}</span>
                <span className="break-words whitespace-normal max-w-[600px]">
                  {value instanceof Date
                    ? value.toLocaleString()
                    : value instanceof File
                      ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${value}`}
                          alt="Image"
                        />
                      )
                      : typeof value === "string" &&
                        key.includes("proof")
                        ? (
                          <div>
                            <img
                              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${value}`}
                              alt={key}
                              className="h-10 w-10 rounded-full"
                            />
                          </div>
                        )
                        : typeof value === "string"
                          ? value
                          : null}
                </span>
              </div>
            ))}
        </div>
        <div className="mt-4 flex justify-end">
        <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Print
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default DetailsModal;
