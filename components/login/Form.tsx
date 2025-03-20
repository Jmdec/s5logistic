"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import Image from "next/image";
import { Button } from "@heroui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setCookie } from 'nookies'
import Link from "next/link";

export const role = [
    { key: "accounting", label: "Accounting" },
    { key: "courier", label: "Courier" },
    { key: "admin", label: "Admin" },
    { key: "coordinator", label: "Coordinator" },
];

export default function App() { 
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
    
        const payload = {
            email: formData.email,
            password: formData.password,
        };
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message || "Unknown error"}`);
                setLoading(false);
                return;
            }
    
            const data = await response.json();
            const { token, user } = data;
    
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user_id', user.id);
            sessionStorage.setItem('name', user.name);
            sessionStorage.setItem('role', user.role);
            setCookie(null, 'token', token, { path: '/'});
            setCookie(null, 'role', user.role, { path: '/'});
    
            if (!user.is_verified) {
                toast.error("You need to verify your email before logging in.");
                setLoading(false);
                return;
            }
    
            if (user.status === 'terminated' && user.role === 'courier') {
                toast.error('Because you didn\'t update your license, you temporarily can\'t use your account.');
                setLoading(false);
                return;
            }
    
            toast.success("Account logged in successfully");
    
            switch (user.role) {
                case "admin":
                    router.replace('/admin');
                    break;
                case "courier":
                    router.replace('/courier');
                    break;
                case "accounting":
                    router.replace('/accounting');
                    break;
                case "coordinator":
                    router.replace('/coordinator');
                    break;
                default:
                    router.push('/home');
                    break;
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Error submitting data.");
            setLoading(false);
            return;
        }
        setLoading(false);
    };
    


    return (
        <div className="flex flex-col items-center justify-center mt-2">
            <div className="flex flex-col border shadow-lg rounded-lg 
            justify-center mt-32 items-center p-9 w-full max-w-md bg-white">
                <Image
                    src="/logo-without-bg.png"
                    alt="GDR Logo"
                    width={100}
                    height={75}
                    className="mb-6"
                />
                <h1 className="text-xl font-bold mb-6 dark:text-gray-800">Log in to your account</h1>
                <form
                    className="w-full space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <input
                            className="w-full focus:ring-red-700 p-2 border-2 
                            border-red-700 rounded-lg bg-transparent dark:text-gray-800"
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            className="w-full focus:ring-red-700 p-2 border-2 
                            border-red-700 rounded-lg bg-transparent"
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        color="primary"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                        ) : (
                            "Log in"
                        )}
                    </Button>
                </form>
                <div className="flex justify-center mt-2">
                    <Link href={'/auth/forget-password'}
                    className="text-blue-600 hover:text-blue-800"
                    >Forget Password?</Link>
                </div>
            </div>
        </div>
    )
}