import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";


interface ModalProps {
  show: boolean;
  onClose: () => void;
  actionType: "status" | "location";
  bookingId: number;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, actionType, bookingId }) => {
  if (!show) return null;

  const [status, setStatus] = useState<string>("");
  const [dateOfPickUp, setDateOfPickUp] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [proofOfDelivery, setProofOfDelivery] = useState<File | null>(null);
  const [newLocation, setNewLocation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (actionType === "status") {
      setStatus("");
      setDateOfPickUp("");
      setRemarks("");
      setProofOfDelivery(null);
    } else {
      setNewLocation("");
    }
    console.log(proofOfDelivery)
  }, [actionType]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfPickUp(e.target.value);
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofOfDelivery(e.target.files[0]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation(e.target.value);
  };  
  const handleSubmit = async (formData: any, actionType: "status" | "location") => {
    setLoading(true)
    console.log(formData);
    try {
      let response;
      let accessToken = sessionStorage.getItem('token');
      let userId = sessionStorage.getItem('user_id');
      const form = new FormData();
      if (actionType === "status") {
        form.append("status", formData.status);
        form.append("remarks", formData.remarks);
        form.append("date_of_pickup", formData.date_of_pickup);
        if (formData.proof_of_delivery) {
          form.append("proof_of_delivery", formData.proof_of_delivery);
        }
      } else {
        form.append("new_location", formData.new_location);
      }

      if (actionType === "status") {
        response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/booking-status/${bookingId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: form,
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/booking-location/${bookingId}?userId=${userId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: form,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast.error("API Error: " + errorData.message);
      } else {
        const responseData = await response.json();
        console.log(responseData);
        toast.success("Submitted successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error occurred during submission:", error);
      toast.error("Error occurred during submission");
    }
    setLoading(false)
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {actionType === "status" ? "Update Status" : "Update Location"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 dark:text-gray-800">
          {actionType === "status" && (
            <>
              <div className="mb-4">
                <label htmlFor="order_status" className="form-label text-sm text-gray-700">
                  Order Status
                </label>
                <select
                  name="status"
                  className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-white"
                  required
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="Pod_returned">Pod returned</option>
                  <option value="Delivery_successful">Delivery successful</option>
                  <option value="For_Pick-up">For Pick-up</option>
                  <option value="First_delivery_attempt">First Delivery Attempt</option>
                  <option value="In_Transit">In Transit</option>
                </select>
              </div>

              {status === "For_Pick-up" && (
                <div className="mb-4">
                  <label htmlFor="date_of_pickup" className="form-label text-sm text-gray-700">
                    Date of Pick-up
                  </label>
                  <input
                    type="datetime-local"
                    name="date_of_pickup"
                    className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-white"
                    value={dateOfPickUp || ""}
                    onChange={handleDateChange}
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="remarks" className="form-label text-sm text-gray-700">
                  Add Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-white"
                  placeholder="Add remarks here"
                  value={remarks}
                  onChange={handleRemarksChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="proof_of_delivery" className="form-label text-sm text-gray-700 dark:text-gray-800">
                  Upload Proof of Delivery
                </label>
                <input
                  type="file"
                  name="proof_of_delivery"
                  className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-white dark:text-gray-800" 
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}

          {actionType === "location" && (
            <div className="mb-4">
              <label htmlFor="new_location" className="form-label text-sm text-gray-700">
                New Location
              </label>
              <input
                type="text"
                name="new_location"
                className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new location"
                value={newLocation}
                onChange={handleLocationChange}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit({
              status,
              remarks,
              date_of_pickup: dateOfPickUp,
              proof_of_delivery: proofOfDelivery,
              new_location: newLocation
            }, actionType)}  
            className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
            disabled={loading}
          >
             {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div> 
            ) : (
              "Submit"
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Modal;
