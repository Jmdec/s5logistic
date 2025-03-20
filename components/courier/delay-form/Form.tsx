"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

interface FormData {
    driver_name: string;
    plate_number: string;
    trip_ticket: string;
    date: Date;
    delay_duration: string;
    delay_cause: string;
    driver_license_no: string;
    additional_notes: string;
}

export default function DelayForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        driver_name: "",
        plate_number: "",
        trip_ticket: "",
        date: new Date(),
        delay_duration: "",
        delay_cause: "",
        driver_license_no: "",
        additional_notes: "",
    });

    useEffect(() => {
        const userName = sessionStorage.getItem("name") || "Unknown Driver";
        setFormData((prev) => ({
            ...prev,
            driver_name: userName,
        }));
    }, []);

    const handleSubmit = async () => {
        setLoading(true)
        const requestBody = {
            ...formData,
            user_id: sessionStorage.getItem("user_id"),
        };

        console.log(requestBody);

        try {
            let accessToken = sessionStorage.getItem("token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/delay-report/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success("Form submitted successfully!");
                console.log(result);
            } else {
                const errorData = await response.json();

                if (errorData.errors) {
                    Object.keys(errorData.errors).forEach((field) => {
                        (errorData.errors[field] as string[]).forEach((errorMessage: string) => {
                            toast.error(`${field}: ${errorMessage}`);
                        });
                    });
                } else {
                    toast.error(errorData.message || "Failed to submit form");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error submitting form");
        }
        setLoading(false)
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: keyof FormData
    ) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [field]: field === "date" ? new Date(value) : value,
        }));
    };

    const formatPhilippineTime = (date: Date): string => {
        const offset = 8 * 60; // UTC+8 in minutes
        const localDate = new Date(date.getTime() + offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg dark:text-gray-800">
            <div className="text-center mb-6">
                <Image
                    src="/logo-without-bg.png"
                    alt="Admin Panel Logo"
                    width={100}
                    height={100}
                    className="mx-auto w-24 mb-4"
                />
                <h1 className="text-2xl font-bold text-red-900">Delay Form</h1>
                <p className="text-sm">
                    Fill out the form below to report any delays encountered during the trip.
                </p>
            </div>

            {/* Truck Details */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Truck Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block">Trip Ticket</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Enter Trip Ticket"
                            value={formData.trip_ticket}
                            onChange={(e) => handleInputChange(e, "trip_ticket")}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block">Driver Name</label>
                        <input
                            type="text"
                            value={formData.driver_name}
                            readOnly
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 dark:bg-white"
                        />
                    </div>
                    <div>
                        <label className="block">Plate Number</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Enter Plate Number"
                            value={formData.plate_number}
                            onChange={(e) => handleInputChange(e, "plate_number")}
                        />
                    </div>

                </div>
            </div>

            {/* Delay Details */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Delay Details</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block">Date</label>
                        <input
                            id="date"
                            type="datetime-local"
                            value={formatPhilippineTime(formData.date)}
                            onChange={(e) => handleInputChange(e, "date")}
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 dark:bg-white"
                        />
                    </div>
                    <div>
                        <label className="block">Delay Duration</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                            placeholder="Enter Duration (e.g., 2 hours)"
                            value={formData.delay_duration}
                            onChange={(e) => handleInputChange(e, "delay_duration")}
                        />
                    </div>
                    <div>
                        <label className="block">Cause of Delay</label>
                        <select
                            className="w-full p-2 border rounded-lg border-red-900 text-red-900 dark:bg-white" 
                            value={formData.delay_cause}
                            onChange={(e) => handleInputChange(e, "delay_cause")}
                        >
                            <option disabled>Select Cause of Delay</option>
                            <option value="Traffic">Traffic</option>
                            <option value="Road Construction">Road Construction</option>
                            <option value="Accidents">Accidents</option>
                            <option value="Mechanical Breakdown">Mechanical Breakdown</option>
                            <option value="Weather Conditions">Weather Conditions</option>
                            <option value="Fuel Shortages">Fuel Shortages</option>
                            <option value="Driver Fatigue">Driver Fatigue</option>
                            <option value="Vehicle Inspections">Vehicle Inspections</option>
                            <option value="Tire Issues">Tire Issues</option>
                            <option value="Paperwork Problems">Paperwork Problems</option>
                            <option value="Overloading">Overloading</option>
                            <option value="Weight Restrictions">Weight Restrictions</option>
                            <option value="Other">Other</option>
                        </select>
                        {formData.delay_cause === "Other" && (
                            <div className="mb-6">
                                <label className="block">Please specify the cause</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg border-red-900 text-red-900"
                                    placeholder="Enter custom cause of delay"
                                    value={formData.delay_cause}
                                    onChange={(e) => handleInputChange(e, "delay_cause")}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Notes */}
            <div>
                <label className="block">Additional Notes</label>
                <textarea
                    className="w-full p-2 border rounded-lg border-red-900 text-red-900 placeholder:text-gray-400 dark:bg-white"
                    placeholder="Provide additional information here"
                    value={formData.additional_notes}
                    onChange={(e) => handleInputChange(e, "additional_notes")}
                    rows={4}
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
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
    );
}