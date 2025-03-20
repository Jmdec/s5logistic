"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseCircleSharp } from "react-icons/io5";

interface Booking {
    tracking_number: string;
    plate_number: string;
    sender_name: string;
    origin: string;
    destination: string;
    order_number: string;
    total_payment: string;
    driver_license_no: string;
    transport_mode: string;
    delivery_type: string;
    journey_type: string;
    date_from: string;
    date_to: string;
    eta: string;
}

function Tracking() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingInfo, setTrackingInfo] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async () => {
        if (!trackingNumber) {
            toast.warn("Please enter a tracking number.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookings/${trackingNumber}`);
            const data = await response.json();

            if (response.ok) {
                setTrackingInfo(data.booking);
                setIsModalOpen(true);
                toast.success("Tracking details retrieved successfully!");
            } else {
                toast.error(data.error || "Tracking number not found.");
            }
        } catch (error) {
            console.error("Error fetching tracking data:", error);
            toast.error("Error fetching tracking data.");
        }

        setIsLoading(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />

            <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
                <p className="text-lg font-medium">
                    Provides specialized delivery services for packages, documents, and other items.
                </p>
            </div>

            <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl flex flex-col 
            md:flex-row items-center justify-center border py-4 px-4 mb-10 space-x-4 p-5">
                <input
                    placeholder="Enter Your Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="px-6 py-2 w-full mb-2 rounded-md outline-none bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                />

                <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="spinner-border animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></div>
                    ) : (
                        "Track"
                    )}
                </button>
            </div>

            {isModalOpen && trackingInfo && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl text-left space-y-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                        >
                            <IoCloseCircleSharp />
                        </button>

                        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Tracking Details</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <p><strong className="text-gray-700 dark:text-gray-300">Plate Number:</strong> {trackingInfo.plate_number}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Sender Name:</strong> {trackingInfo.sender_name}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Origin:</strong> {trackingInfo.origin}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Destination:</strong> {trackingInfo.destination}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Order Number:</strong> {trackingInfo.order_number}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Total Payment:</strong> {trackingInfo.total_payment}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Driver License No:</strong> {trackingInfo.driver_license_no}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Transport Mode:</strong> {trackingInfo.transport_mode}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Delivery Type:</strong> {trackingInfo.delivery_type}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">Journey Type:</strong> {trackingInfo.journey_type}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">From:</strong> {formatDate(trackingInfo.date_from)}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">To:</strong> {formatDate(trackingInfo.date_to)}</p>
                            <p><strong className="text-gray-700 dark:text-gray-300">ETA:</strong> {formatDate(trackingInfo.eta)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tracking;
