import React from "react";

interface RowsPerPageSelectorProps {
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
}

const RowsPerPage: React.FC<RowsPerPageSelectorProps> = ({
  rowsPerPage,
  setRowsPerPage,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span>Rows per page:</span>
      <select
        value={rowsPerPage}
        onChange={(e) => setRowsPerPage(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        {[5, 10, 20, 50].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RowsPerPage;
