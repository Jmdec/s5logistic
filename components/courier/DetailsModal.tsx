import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface DetailsModalProps {
  isOpenDetails: boolean;
  handleCloseModal: () => void;
  details: Record<string, any>;
  title: string;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpenDetails, handleCloseModal, details, title }) => {
  if (!isOpenDetails) return null; // Only render the modal when it is open

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-xl">
        <div className="flex justify-end">
          <XMarkIcon
            className="flex justify-end h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-800"
            onClick={() => handleCloseModal()}
          />
        </div>
        <h2 className="text-2xl text-center mb-5 font-semibold text-gray-800">{title}</h2>

        {/* Details section */}
        <div className="space-y-4">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
              <span>
                {value instanceof Date
                  ? value.toLocaleString()
                  : value instanceof File
                    ? (
                      <div>
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${value}`}
                          alt="Image"
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                    )
                    : value}
              </span>
            </div>
          ))}
        </div>

        {/* Close button */}
        <div className="mt-4 flex justify-end">
          <button onClick={handleCloseModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
