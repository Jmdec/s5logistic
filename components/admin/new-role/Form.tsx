"use client"
import React, { useState } from "react";
import { Input } from "@heroui/input";
import Image from "next/image";
import { Button } from "@heroui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const role = [
    { key: "accounting", label: "Accounting" },
    { key: "courier", label: "Courier" },
    { key: "admin", label: "Admin" },
    { key: "coordinator", label: "Coordinator" },
];

export default function App() {
    const [selectedRole, setSelectedRole] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        driver_license: null,
        license_number: "",
        contact_number: "",
        address: "",
        plate_number: "",
        driver_image: null,
        license_expiration: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const files = fileInput.files;
            setFormData((prevData) => ({
                ...prevData,
                [name]: files ? files[0] : null,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key of Object.keys(formData) as (keyof typeof formData)[]) {
            const value = formData[key];
            if (value) {
                formDataToSend.append(key, value);
            }
        }

        console.log(formData)
        try {
            let accessToken = sessionStorage.getItem("token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formDataToSend,
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Response Data:", data);
                toast.success("Account created successfully");
                router.replace("/admin/new-role/verification");
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors)
                        .flat()
                        .join(", ");
                    toast.error(`Validation failed: ${errorMessages}`);
                } else {
                    toast.error(`Error adding data: ${errorData.message || "Unknown error"}`);
                }
                console.error("Error Response:", errorData);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Error submitting data");
        }
        setLoading(false)
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center p-8 w-full max-w-md border rounded-lg shadow-lg">
                <Image
                    src="/logo-without-bg.png"
                    alt="GDR Logo"
                    width={100}
                    height={75}
                    className="mb-6"
                />
                <h1 className="text-xl font-bold mb-6 dark:text-gray-800">Create an Account</h1>
                <form className="w-full space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2 dark:bg-white">
                        <input
                            className="w-full focus:ring-red-700 border-2
                             border-red-700 rounded-lg bg-transparent p-2  placeholder:text-gray-600 dark:text-gray-800"
                            // label="Full Name"
                            placeholder="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            className="w-full focus:ring-red-700 
                            border-2 border-red-700 rounded-lg p-2 bg-transparent placeholder:text-gray-600 dark:text-gray-800"
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            className="w-full focus:ring-red-700 p-2 border-2 border-red-700 placeholder:text-gray-600  dark:text-gray-800 rounded-lg bg-transparent"
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <input
                            className="w-full focus:ring-red-700 p-2 placeholder:text-gray-600 border-2 border-red-700 dark:text-gray-800 rounded-lg bg-transparent"
                            placeholder="Confirm Password"
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm  dark:bg-white dark:text-gray-800"
                            value={formData.role}
                            onChange={(e) => {
                                const roleValue = e.target.value;
                                setSelectedRole(roleValue);
                                setFormData({
                                    ...formData,
                                    role: roleValue,
                                });
                            }}
                        >
                            <option disabled className="dark:text-gray-800">Select your role</option>
                            {role.map((item) => (
                                <option key={item.key} value={item.key}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedRole === "courier" && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800"
                                    placeholder="Driver License"
                                    type="file"
                                    name="driver_license"
                                    onChange={handleChange}
                                />
                                <input
                                    className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800"
                                    placeholder="License Number"
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                />
                                <input
                                    className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800"
                                    placeholder="Contact Number"
                                    type="number"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    maxLength={11}
                                    onChange={(e) => {
                                        const sanitizedValue = e.target.value.replace(/\D/g, "");
                                        if (sanitizedValue.length <= 11) {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                contact_number: sanitizedValue,
                                            }));
                                        }
                                    }}
                                />


                                <input
                                    className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800"
                                    placeholder="Address"
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                                <input
                                    className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800"
                                    placeholder="Plate Number"
                                    type="text"
                                    name="plate_number"
                                    value={formData.plate_number}
                                    onChange={handleChange}
                                />
                                <input
                                    className="block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
                            shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800"
                                    placeholder="Driver Image"
                                    type="file"
                                    name="driver_image"
                                    onChange={handleChange}
                                />
                            </div>
                            <input
                                className="mt-2 block w-full h-full px-3 py-2 border-2 border-red-700 rounded-md 
               shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 
               sm:text-sm placeholder:text-gray-600 dark:bg-white dark:text-gray-800 
               dark:[&::-webkit-calendar-picker-indicator]:invert 
               ark:[&::-webkit-calendar-picker-indicator]:filter-red"
                                placeholder="License Expiration"
                                type="date"
                                name="license_expiration"
                                value={formData.license_expiration}
                                onChange={handleChange}
                            />

                        </div>
                    )}

                    <Button
                        color="primary"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                        ) : (
                            "REGISTER"
                        )}
                    </Button>

                </form>
            </div>
        </div>
    );
}