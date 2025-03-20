import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, confirmDelete, cancelDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg mt-24 w-full sm:w-96  dark:bg-gray-400">
        <h5 className="text-xl font-semibold text-gray-800 mb-6 dark:text-white">Are you sure you want to delete this item?</h5>
        <div className="flex justify-end space-x-4">
          <button
            onClick={confirmDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Yes, Delete
          </button>
          <button
            onClick={cancelDelete}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
