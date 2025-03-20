"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [password_confirmation, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid or expired reset link.");
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    }, [token, email, router]);

    const handleResetPassword = async () => {
        console.log("📢 Reset Password Triggered");

        if (!password || !password_confirmation) {
            toast.error("All fields are required.");
            console.error("❌ Missing fields");
            return;
        }
        if (password !== password_confirmation) {
            toast.error("Passwords do not match.");
            console.error("❌ Password mismatch");
            return;
        }

        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/auth/reset-password`;

        console.log("🔹 API URL:", apiUrl);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, password, password_confirmation }),
            });

            console.log("🔹 Fetch Response:", response);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Server Error:", response.status, errorText);
                throw new Error(errorText || `HTTP Error ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Success:", data);

            toast.success("Password reset successful! Redirecting...");
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (error) {
            console.error("❌ Fetch Error:", error);
            toast.error("Something went wrong. Check the console for details.");
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-sm bg-white p-6 border rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <Image
                        src="/logo-without-bg.png"
                        alt="Logo"
                        width={120}
                        height={60}
                        className="mb-2"
                    />
                </div>

                {/* Info Message */}
                <div className="bg-blue-100 text-gray-700 p-3 rounded mb-4 text-center">
                    <p className="font-medium">Reset your Password</p>
                    <p className="text-sm">
                        Enter your new password.
                    </p>
                </div>
                <input
                    className="w-full focus:ring-red-700 border-2 border-red-700 placeholder:text-black rounded-lg bg-transparent p-2 mb-3"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="w-full focus:ring-red-700 placeholder:text-black border-2 border-red-700 rounded-lg bg-transparent p-2 mb-3"
                    placeholder="Confirm Password"
                    type="password"
                    value={password_confirmation}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    onClick={handleResetPassword}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex justify-center"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPassword />
        </Suspense>
    );
}
