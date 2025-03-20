"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";

interface StatusProps {
  isOpen: boolean;
  row: any;
  onClose: () => void;
  onSuccess: () => void;
}

const Status: React.FC<StatusProps> = ({ isOpen, onClose, row, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleApprove = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/approve/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onSuccess();
        toast.success("Item successfully approved");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Item failed to approve");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReject = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/return-items/reject/${row.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onSuccess();
        toast.success("Item successfully rejected");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Item failed to reject");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const renderActionButtons = () => {
    switch (row.returnStatus) {
      case "Pending":
        return (
          <>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Approve"
              )}
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Reject"
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Close
            </button>
          </>
        );
      case "Approved":
        return (
          <>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Reject"
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Close
            </button>
          </>
        );
      case "Rejected":
        return (
          <>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Approve"
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Close
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const renderMessage = () => {
    if (row.returnStatus === "Pending") {
      return "Please confirm if you want to approve, reject or close this action.";
    } else {
      return "Are you sure you want to change the status?";
    }
  };

  const renderHeader = () => {
    switch (row.returnStatus) {
      case "Pending":
        return "Do you want to approve or reject?";
      case "Approved":
        return "Do you want to reject the item?";
      case "Rejected":
        return "Do you want to approve the item?";
      default:
        return "Change the status of the item";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full  p-6 sm:left-[670px] max-sm:top-40  max-sm:w-[260px] max-sm:absolute max-sm:overflow-auto sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">{renderHeader()}</h2>

        <p className="mb-4 text-sm sm:text-base text-gray-600">{renderMessage()}</p>

        <div className="flex justify-start gap-4 mt-4 flex-wrap">
          {renderActionButtons()}
        </div>
      </div>
    </div>

  );
};

export default Status;
