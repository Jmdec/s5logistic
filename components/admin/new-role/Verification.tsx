"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const EmailVerification = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const handleVerify = async () => {
        setLoading(true)
        console.log("Verification", verificationCode)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: verificationCode }),
            });

            const data = await response.json();

            if (response.ok) {
                router.replace('/admin/new-role/register');
                toast.success(data.message || "Verification successful!");
            } else {
                console.error("Error Response:", data);
                toast.error(data.message || "Failed to verify. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying code:");
            toast.error("An unexpected error occurred. Please try again.");
        }
        setLoading(false)
    };



    return (

        <div className="flex justify-center items-center  h-screen bg-gray-50">
            <div className="w-full max-w-sm bg-white p-9 border rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <Image
                        src="/logo-without-bg.png"
                        alt="GDR Logo"
                        width={120}
                        height={60}
                        className="mb-2"
                    />
                </div>
                <div className="bg-green-100 text-gray-700 p-3 rounded mb-4 text-center">
                    <p className="font-medium">Registration Successful</p>
                    <p className="text-sm">
                        We've sent a verification code to your email. Please verify to continue.
                    </p>
                </div>
                <div className="mb-4">
                    <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-1">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-2 border-2 border-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-700 dark:bg-white"
                        placeholder="Enter code here"
                    />
                </div>
                <button
                    onClick={handleVerify}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex justify-center"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Verify"
                    )}
                </button>
            </div>
        </div>
    );
};

export default EmailVerification;