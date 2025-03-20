import React, { useRef } from "react";
import ReactQRCode from "react-qr-code";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface QRCodeProps {
  rowData: DataRow | null;
  onClose: () => void;
}


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
 plateNumber:string;
 destination:string;
 products:Product[],
 truckType:string,
 proofOfDelivery:string,
 remarks:string,
totalPayment:number,
 reference:string,
  tripTicket:string,
  bookingCreated:string,
  locationUpdatedby:string,
  locationUpdatedat:string,
 backloads:Backloads[],
   status:string,
   updatedStatus:string,
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

const QRCodeComponent: React.FC<QRCodeProps> = ({ rowData, onClose }) => {
  console.log(rowData)
  const qrCodeRef = useRef(null);
const assignRowDataToDataRow = (rowData: any): DataRow => {
  return {
    id: rowData.id,
    date: rowData.created_at, // Assuming 'created_at' is the 'date' field
    tripTicketNumber: rowData.order_number, // Map 'order_number' to 'tripTicketNumber'
    truckPlateNumber: rowData.plate_number, // Map 'plate_number' to 'truckPlateNumber'
    driverLicenseNo: rowData.driver_license_no, // Map 'driver_license_no' to 'driverLicenseNo'
    senderName: rowData.sender_name, // Map 'sender_name' to 'senderName'
    transportMode: rowData.transport_mode, // Map 'transport_mode' to 'transportMode'
    deliveryType: rowData.delivery_type, // Map 'delivery_type' to 'deliveryType'
    journeyType: rowData.journey_type, // Map 'journey_type' to 'journeyType'
    dateFrom: rowData.date_from, // Map 'date_from' to 'dateFrom'
    dateTo: rowData.date_to, // Map 'date_to' to 'dateTo'
    origin: rowData.origin, // Map 'origin' to 'origin'
    destination: rowData.destination, // Map 'destination' to 'destination'
    eta: rowData.eta, // Map 'eta' to 'eta'
    consigneeName: rowData.consignee_name, // Map 'consignee_name' to 'consigneeName'
    consigneeAddress: rowData.consignee_address, // Map 'consignee_address' to 'consigneeAddress'
    consigneeEmail: rowData.consignee_email, // Map 'consignee_email' to 'consigneeEmail'
    consigneeMobile: rowData.consignee_mobile, // Map 'consignee_mobile' to 'consigneeMobile'
    merchantName: rowData.merchant_name, // Map 'merchant_name' to 'merchantName'
    merchantAddress: rowData.merchant_address, // Map 'merchant_address' to 'merchantAddress'
    merchantEmail: rowData.merchant_email, // Map 'merchant_email' to 'merchantEmail'
    merchantMobile: rowData.merchant_mobile, // Map 'merchant_mobile' to 'merchantMobile'
    products: rowData.products, // Keep 'products' as it is
    backloads: rowData.backloads, // Map 'backloads' to 'backloads'
    truckType: rowData.truck_type, // Map 'truck_type' to 'truckType'
    remarks: rowData.remarks, // Map 'remarks' to 'remarks'
    totalPayment: parseFloat(rowData.total_payment), // Ensure 'total_payment' is a number
    reference: rowData.order_number, // 'reference' might map to 'order_number'
    bookingCreatedby: rowData.booking_create_by, // Map 'booking_create_by' to 'bookingCreatedby'
    locationUpdatedby: rowData.location_updated_by, // Map 'location_updated_by' to 'locationUpdatedby'
    locationUpdatedat: rowData.location_updated_at, // Map 'location_updated_at' to 'locationUpdatedat'
    status: rowData.order_status, // Map 'order_status' to 'status'
    updatedStatus: rowData.status, // Map 'status' to 'updatedStatus'
    proofOfDelivery: rowData.proof_of_delivery, // Map 'proof_of_delivery' to 'proofOfDelivery'
    qrCodePath: rowData.qr_code_path, // Map 'qr_code_path' to 'qrCodePath'
    orderNumber: rowData.order_number, // Map 'order_number' to 'orderNumber'
    updatedBy: rowData.updated_by, // Map 'updated_by' to 'updatedBy'
  };
};
 const dataRow: DataRow = assignRowDataToDataRow(rowData);
 console.log(dataRow)
  if (!rowData) return null;

const formattedProducts = Array.isArray(dataRow.products)
  ? dataRow.products
      .map((product: Product) => `${product.name} (${product.unit}): ${product.quantity}`)
      .join(', ')
  : 'No products available';

  const formattedBackloads = Array.isArray(dataRow.backloads)
  ? dataRow.backloads
      .map((backload: Backloads) => `${backload.name} (Location: ${backload.location}, Contact: ${backload.contact})`)
      .join(', ')
  : 'No backloads available';

const qrCodeValue = `
  Date: ${dataRow.date || ''}
  Trip Ticket Number: ${dataRow.tripTicketNumber || ''}
  Truck Plate Number: ${dataRow.truckPlateNumber || ''}
  Driver License No: ${dataRow.driverLicenseNo || ''}
  Sender Name: ${dataRow.senderName || ''}
  Transport Mode: ${dataRow.transportMode || ''}
  Delivery Type: ${dataRow.deliveryType || ''}
  Journey Type: ${dataRow.journeyType || ''}
  Date From: ${dataRow.dateFrom || ''}
  Date To: ${dataRow.dateTo || ''}
  Origin: ${dataRow.origin || ''}
  Destination: ${dataRow.destination || ''}
  ETA: ${dataRow.eta || ''}
  Consignee Name: ${dataRow.consigneeName || ''}
  Consignee Address: ${dataRow.consigneeAddress || ''}
  Consignee Email: ${dataRow.consigneeEmail || ''}
  Consignee Mobile: ${dataRow.consigneeMobile || ''}
  Merchant Name: ${dataRow.merchantName || ''}
  Merchant Address: ${dataRow.merchantAddress || ''}
  Merchant Email: ${dataRow.merchantEmail || ''}
  Merchant Mobile: ${dataRow.merchantMobile || ''}
   Products: ${formattedProducts}
  Backloads: ${formattedBackloads}
  Truck Type: ${dataRow.truckType || ''}
  Remarks: ${dataRow.remarks || ''}
  Total Payment: ${dataRow.totalPayment || ''}
  Reference: ${dataRow.reference || ''}
  Booking Created by: ${dataRow.bookingCreatedby || ''}
  Location Updated by: ${dataRow.locationUpdatedby || ''}
  Location Updated at: ${dataRow.locationUpdatedat || ''}
  Status: ${dataRow.status || ''}
  Updated Status: ${dataRow.updatedStatus || ''}
  Proof of Delivery: ${dataRow.proofOfDelivery || ''}
  QR Code Path: ${dataRow.qrCodePath || ''}
  Order Number: ${dataRow.orderNumber || ''}
  Updated By: ${dataRow.updatedBy || ''}
`;


const handlePrintPDF = () => {
  if (qrCodeRef.current) {
    // Capture the QR code with html2canvas
    html2canvas(qrCodeRef.current, {
      useCORS: true, // Ensure cross-origin images are loaded
      scale: 2, // Scale up for better quality
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF();

      // Add truck plate number text to the PDF
      const plateText = `Plate Number: ${dataRow.truckPlateNumber}`;

      // Calculate the center of the PDF page width
      const pageWidth = doc.internal.pageSize.width;

      // Calculate the x position to center the text horizontally
      const textWidth = doc.getTextWidth(plateText);
      const xPosText = (pageWidth - textWidth) / 2;

      // Add the truck plate number text to the PDF (centered horizontally)
      doc.text(plateText, xPosText, 20);

      // Make the QR code wider by adjusting the width and height
      const qrWidth = 60;  // Set desired width
      const qrHeight = 40;  // Set height to desired value

      // Calculate the x position to center the QR code horizontally
      const xPosQRCode = (pageWidth - qrWidth) / 2;

      // Adjust y position of QR code to remove space (use the same position as the text)
      const yPosQRCode = 25; // Set a close y position to the text

      // Add the QR code image to the PDF (centered horizontally)
      doc.addImage(imgData, "PNG", xPosQRCode, yPosQRCode, qrWidth, qrHeight); // Keep height same, adjust width

      // Save the generated PDF
      doc.save("qr-code.pdf");
    });
  }
};



  const logoUrl = "/logo.png"; // Your logo URL

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
  <div className="relative bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-sm">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-800 text-center flex-grow">
        Details for Plate Number: {dataRow.truckPlateNumber}
      </h1>
      <button
        onClick={onClose}
        className="text-xl text-gray-600 hover:text-gray-800"
      >
        X
      </button>
    </div>

    {/* QR Code with Logo */}
    <div className="relative flex justify-center items-center mb-6" ref={qrCodeRef}>
      <ReactQRCode
        value={qrCodeValue}
        size={256} // Ensure the QR code is square by setting size equally
        fgColor="#000000"
        bgColor="#ffffff"
      />
      <div
        className="absolute flex justify-center items-center"
        style={{ width: '256px', height: '256px' }}
      >
        <img
          src={logoUrl}
          alt="Logo"
          className="w-16 h-16 object-contain"
          style={{ maxWidth: '25%', maxHeight: '25%' }} // Adjust size to fit inside the QR code
        />
      </div>
    </div>

    {/* Print Button */}
    <div className="flex justify-center mt-4">
      <button onClick={handlePrintPDF} className="text-white bg-blue-500 p-2 rounded">
        Print QR Code
      </button>
    </div>
  </div>
</div>

  );
};

export default QRCodeComponent;
