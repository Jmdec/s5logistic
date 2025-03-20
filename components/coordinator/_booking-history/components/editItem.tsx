import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TruckDetails from "./editComponents/truckDetails";
import DeliveryInformation from "./editComponents/deliveryInformation";
import Products from "./editComponents/listProducts";
import Consignee from "./editComponents/consigneeInformation";
import Merchant from "./editComponents/merchatInformation";

interface DataRow {
  id: number;
  date: string;
  driverName: string;
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
interface TruckDetails {
  driverName: string;
  driverLicenseNo: string;
  truckPlateNumber: string;
}


interface EditBookingHistoryProps {
  isOpen: boolean;
  closeModal: () => void;
  rowData: any; // Allow any type from API response
  handleEdit: (updatedRow: DataRow) => void;
}

const mapApiResponseToDataRow = (apiData: any): DataRow => {
  return {
    id: apiData.id,
    driverName: apiData.driver_name || "",
    date: apiData.updated_at || "", // Use `updated_at` or set as empty string
    tripTicketNumber: apiData.order_number || "",
    truckPlateNumber: apiData.plate_number || "",
    driverLicenseNo: apiData.driver_license_no || "",
    senderName: apiData.sender_name || "",
    transportMode: apiData.transport_mode || "",
    deliveryType: apiData.delivery_type || "",
    journeyType: apiData.journey_type || "",
    dateFrom: apiData.date_from || "",
    dateTo: apiData.date_to || "",
    origin: apiData.origin || "",
    destination: apiData.destination || "",
    eta: apiData.eta || "",
    consigneeName: apiData.consignee_name || "",
    consigneeAddress: apiData.consignee_address || "",
    consigneeEmail: apiData.consignee_email || "",
    consigneeMobile: apiData.consignee_mobile || "",
    merchantName: apiData.merchant_name || "",
    merchantAddress: apiData.merchant_address || "",
    merchantEmail: apiData.merchant_email || "",
    merchantMobile: apiData.merchant_mobile || "",
    products: JSON.stringify(apiData.products) || "", // Convert array to string
    backloads: apiData.backloads || null,
    truckType: apiData.truck_type || "",
    remarks: apiData.remarks || null,
    totalPayment: Number(apiData.total_payment) || 0, // Ensure it's a number
    reference: apiData.reference || "",
    bookingCreatedby: apiData.booking_create_by || null,
    locationUpdatedby: apiData.location_updated_by || null,
    locationUpdatedat: apiData.location_updated_at || null,
    status: apiData.status || "",
    updatedStatus: apiData.order_status || "", // Using order_status as updatedStatus
    proofOfDelivery: apiData.proof_of_delivery || null,
    qrCodePath: apiData.qr_code_path || "",
    orderNumber: apiData.order_number || "",
    updatedBy: apiData.updated_by || "",
  };
};

const EditBookingHistory: React.FC<EditBookingHistoryProps> = ({
  isOpen,
  closeModal,
  rowData,
  handleEdit,
}) => {
  if (!isOpen) return null;

  const [updatedData, setUpdatedData] = useState<DataRow | null>(null);
  const [driversData, setDriversData] = useState<any[]>([]); // Initialize as empty array
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
const [tempDriverLicenseNo, setTempDriverLicenseNo] = useState<string>("");
const [tempDriverInfo, setTempDriverInfo] = useState<{ name: string, licenseNo: string, truckPlateNumber: string }>({
  name: '',
  licenseNo: '',
  truckPlateNumber: ''
});
useEffect(() => {
  if (rowData) {
    // Update states based on rowData
    setUpdatedData(mapApiResponseToDataRow(rowData));
  }
}, [rowData]);




  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    console.log()
    
  };


return (
  <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50  ${isOpen ? "block" : "hidden"}`}>
    <div className="bg-white w-full md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg  max-sm:top-20 max-sm:left-[70px] max-sm:w-[260px] max-sm:absolute max-sm:overflow-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Booking Details</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Category to Edit:</label>
        <select
          onChange={handleCategoryChange}
          value={selectedCategory}
          className="mt-1 block bg-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          <option value="truckDetails">Truck Details</option>
          <option value="deliveryInformation">Delivery Information</option>
          <option value="products">List of Products</option>
          <option value="consignee">Consignee Information</option>
          <option value="merchant">Merchant Information</option>
        </select>
      </div>

      {selectedCategory === "truckDetails" && updatedData && (
          <TruckDetails updatedData={updatedData} closeModal={closeModal} />
        )}
            {selectedCategory === "deliveryInformation" && updatedData && (
          <DeliveryInformation updatedData={updatedData} closeModal={closeModal} />
        )}
            {selectedCategory === "products" && updatedData && (
          <Products updatedData={updatedData} closeModal={closeModal} />
        )}
          {selectedCategory === "consignee" && updatedData && (
          <Consignee updatedData={updatedData} closeModal={closeModal} />
        )}
           {selectedCategory === "merchant" && updatedData && (
          <Merchant updatedData={updatedData} closeModal={closeModal} />
        )}
    </div>
  </div>
);

};
export default EditBookingHistory;
