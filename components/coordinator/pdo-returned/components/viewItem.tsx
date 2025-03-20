import React from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@heroui/button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ViewModalProps {
  row: DataRow | null; // Ensure row can be nullable
  onClose: () => void;
}

type DataRow = {
  plateNumber: string;
  completionOfTrip: string;
  status: string;
  arrivalProof: string | null; // This is the file URL
  proofOfDelivery: string | null; // This is the file URL
};

const ViewModal: React.FC<ViewModalProps> = ({ row, onClose }) => {
  if (!row) {
    return null; // Don't render if there's no row data
  }
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const margin = 20;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const logoPath = '/logo-without-bg.png';
    const logoWidth = 30;
    const logoHeight = 20;
    const title = 'Return Item Details';
    const totalWidth = logoWidth + doc.getTextWidth(title) + 5;
    const logoX = (pageWidth - totalWidth) / 2;

    // Add logo and title (only for the first page)
    doc.addImage(logoPath, 'PNG', logoX, margin, logoWidth, logoHeight);
    doc.setFontSize(16);
    doc.text(title, logoX + logoWidth + 5, margin + logoHeight / 2);

    // Add contact information (centered)
    doc.setFontSize(10);
    const contactInfo = [
      '2nd Floor Total Pulo Cabuyao, Pulo Diezmo Rd, Cabuyao, Laguna',
      'Mobile: +639 270 454 343 / +639 193 455 535',
      'Email: gdrlogisticsinc@outlook.com',
    ];

    contactInfo.forEach((text, index) => {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth / 2) - textWidth / 2, margin + logoHeight + 10 + index * 10);
    });

    // Add a line under the contact info for separation
    doc.setLineWidth(0.5);
    doc.line(margin, margin + logoHeight + 40, pageWidth - margin, margin + logoHeight + 40);

    // Set font for body content
    doc.setFont("helvetica", "normal");

    // Define container width for labels and values
    const containerWidth = pageWidth - 2 * margin; // Container width covering the page width
    const labelWidth = 80; // Fixed width for labels
    const valueXPos = labelWidth + 10; // Value should be positioned right after label with a small gap

    // Start position for content
    let y = margin + logoHeight + 50; // Adjusting starting point for content below title and contact info

    // Function to add text with a colon separator
    const addTextWithColon = (label: any, value: any, yPosition: any) => {
      doc.setFontSize(12);

      // Add label on the left (fixed width)
      const labelWithColon = `${label}:`; // Append colon to the label
      const labelX = margin; // Start at the left margin for the label

      // Ensure the value fits within the page width by wrapping if necessary
      const wrappedValue = doc.splitTextToSize(value, pageWidth - valueXPos - margin - 20);
      const valueX = labelX + labelWidth + 10; // Position value after label with a small space

      // Add label and wrapped value with colon separator
      doc.text(labelWithColon, labelX, yPosition);
      wrappedValue.forEach((line: string, idx: number) => {
        doc.text(line, valueX, yPosition + (idx * lineHeight)); // Add wrapped text, line by line
      });

      return yPosition + (wrappedValue.length * lineHeight); // Return new y-position based on number of wrapped lines
    };

    // Add data with labels and values (colon separator)
    const details = [
      { label: "Plate Number", value: row.plateNumber },
      { label: "Completion of Trip", value: row.completionOfTrip },
      { label: "Status", value: row.status },
      { label: "Arrival Proof", value: `${process.env.NEXT_PUBLIC_SERVER_PORT}${row.arrivalProof}` },
      { label: "Proof of Delivery", value: `${process.env.NEXT_PUBLIC_SERVER_PORT}${row.proofOfDelivery}` },
    ];

    // Add each detail row
    let yPosition = y;
    details.forEach(detail => {
      yPosition = addTextWithColon(detail.label, detail.value, yPosition);
    });

    // Add a line to separate sections (after the text)
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    // Add a footer (e.g., page number or custom text)
    doc.setFontSize(10);
    doc.text("Generated by Your Company", margin, doc.internal.pageSize.height - 10);

    // Save the PDF with a name
    doc.save(`return-item-details-${row.plateNumber}.pdf`);
    onClose()
  };


  return (
    <div className="fixed inset-0 flex justify-center items-center px-4 sm:px-6 bg-gray-500 bg-opacity-50">
      <div className="relative bg-white p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-4xl shadow-xl overflow-auto">

        <div className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600 transition duration-300">
          <XMarkIcon onClick={onClose} className="w-6 h-6" />
        </div>

        <p className="text-lg sm:text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-6">
          PDO Return Details
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center">
          <div>
            <p className="font-medium text-base sm:text-lg md:text-xl">Plate Number:</p>
            <p className="text-red-700">{row.plateNumber}</p>
          </div>
          <div>
            <p className="font-medium text-base sm:text-lg md:text-xl">Completion of Trip:</p>
            <p className="text-red-700">{row.completionOfTrip}</p>
          </div>
          <div>
            <p className="font-medium text-base sm:text-lg md:text-xl">Status:</p>
            <p className="text-red-700">{row.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {row.arrivalProof ? (
            <div className="text-center">
              <p className="font-medium text-lg">Arrival Proof:</p>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${row.arrivalProof}`}
                alt="Arrival Proof"
                className="mt-3 w-52 h-auto object-cover border rounded-lg shadow-md mx-auto"
              />
            </div>
          ) : (
            <p className="text-center text-gray-600">No Arrival Proof available</p>
          )}

          {row.proofOfDelivery ? (
            <div className="text-center">
              <p className="font-medium text-lg">Proof of Delivery:</p>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${row.proofOfDelivery}`}
                alt="Proof of Delivery"
                className="mt-3 w-52 h-auto object-cover border rounded-lg shadow-md mx-auto"
              />
            </div>
          ) : (
            <p className="text-center text-gray-600">No Proof of Delivery available</p>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Button onPress={handleDownloadPDF} color="danger">
            Download PDF
          </Button>
        </div>
      </div>
    </div>

  );

};

export default ViewModal;
