"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon, CurrencyDollarIcon, BuildingLibraryIcon, WrenchScrewdriverIcon, ClockIcon, BookOpenIcon, UserIcon, ChevronDownIcon, UserGroupIcon, CogIcon, CalculatorIcon, TruckIcon, UserPlusIcon, WrenchIcon, ChatBubbleLeftIcon, CalendarIcon, DocumentIcon, XMarkIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { destroyCookie } from "nookies";
import { usePathname, useRouter } from "next/navigation";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [isBranchControlOpen, setIsBranchControlOpen] = useState(false);
    const [isManagementOpen, setIsManagementOpen] = useState(false);
    const [isAccountingOpen, setIsAccountingOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const toggleBranchControl = () => {
        setIsBranchControlOpen(!isBranchControlOpen);
        setIsManagementOpen(false);
        setIsAccountingOpen(false);
    };

    const toggleManagement = () => {
        setIsManagementOpen(!isManagementOpen);
        setIsBranchControlOpen(false);
        setIsAccountingOpen(false);
    };

    const toggleAccounting = () => {
        setIsAccountingOpen(!isAccountingOpen);
        setIsBranchControlOpen(false);
        setIsManagementOpen(false);
    };

    const handleLogout = async () => {
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("name");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("user_id");

            destroyCookie(null, "token", { path: "/" });
            destroyCookie(null, "role", { path: "/" });

            console.log("User logged out successfully.");

            setTimeout(() => {
                router.replace("/auth/login");
            }, 500);
        }
    };


    const getActiveClass = (path: string) => {
        return pathname === path ? "bg-red-500 text-white" : "text-black";
    };


    return (

        <div>
            <div
                className="w-64 min-h-screen h-screen bg-gradient-to-b from-white to-red-500 
             flex flex-col overflow-y-auto fixed top-0 left-0 z-40 shadow-lg 
             transition-transform transform 
             lg:relative lg:z-auto lg:h-auto"
            >
                <div className="flex items-center justify-center mt-5">
                    <Image
                        src="/logo-without-bg.png"
                        alt="Admin Panel Logo"
                        width={100}
                        height={100}
                        className="mr-2"
                    />
                    {isOpen && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-black"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 p-4 text-start text-sm items-center">
                    <ul className="space-y-4">
                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin")}`}>
                            <HomeIcon className="h-5 w-5 text-black" />
                            <Link href="/admin" className="text-black">
                                Dashboard
                            </Link>
                        </li>

                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/driver-salary")}`}>
                            <CurrencyDollarIcon className="h-5 w-5 text-black" />
                            <Link href="/admin/driver-salary" className="text-black">
                                Driver Salary
                            </Link>
                        </li>

                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/booking-form")}`}>

                            <BookOpenIcon className="h-5 w-5 text-black" />
                            <Link href="/admin/booking-form" className="text-black">
                                Booking Form
                            </Link>
                        </li>

                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/booking-history")}`}>

                            <ClockIcon className="h-5 w-5 text-black" />
                            <Link href="/admin/booking-history" className="text-black">
                                Booking History
                            </Link>
                        </li>

                        <li className="p-2 flex flex-col items-start space-x-2 ">
                            <button
                                onClick={toggleBranchControl}
                                className="flex items-center text-black w-full focus:outline-none"
                            >
                                <BuildingLibraryIcon className="h-5 w-5 text-black" />

                                <span className="ml-2">Branch Control</span>
                                <ChevronDownIcon
                                    className={`h-5 w-5 text-black ml-2 transform transition-transform ${isBranchControlOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isBranchControlOpen && (
                                <div className="relative w-full mt-2  text-black">
                                    <ul>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/employee/details")}`}>
                                            <UserIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/employee/details" className="block text-black">
                                                Branch Employee
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/new-role/register")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/new-role/register" className="block text-black">
                                                Add New Role
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li className="p-2 flex flex-col items-start space-x-2 ">
                            <button
                                onClick={toggleManagement}
                                className="flex items-center text-black w-full focus:outline-none"
                            >
                                <WrenchScrewdriverIcon className="h-5 w-5 text-black" />

                                <span className="ml-2">Management</span>
                                <ChevronDownIcon
                                    className={`h-5 w-5 text-black ml-2 transform transition-transform ${isManagementOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isManagementOpen && (
                                <div className="relative w-full mt-3  text-black">
                                    <ul className="space-y-1">
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/subcontractor")}`}>
                                            <UserPlusIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/subcontractor" className="block text-black">
                                                Add Subcontractor
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/manage-driver")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/manage-driver" className="block text-black">
                                                Manage Driver
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/vehicle/active")}`}>
                                            <TruckIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/vehicle/active" className="block text-black">
                                                Add Vehicle
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/booking-per-driver")}`}>
                                            <TruckIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/booking-per-driver" className="block text-black">
                                                Bookings Per Driver
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/booking-per-plate-number")}`}>
                                            <TruckIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/booking-per-plate-number" className="block text-black">
                                                Bookings Per Plate No.
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/preventive-maintenance")}`}>
                                            <WrenchIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/preventive-maintenance" className="block text-black">
                                                Preventive Maintenance
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/customer-feedback")}`}>
                                            <ChatBubbleLeftIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/customer-feedback" className="block text-black">
                                                Customer Feedback
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-300 ${getActiveClass("/admin/calendar")}`}>
                                            <CalendarIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/calendar" className="block text-black">
                                                Calendar
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/request-budget")}`}>
                                            <DocumentIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/request-budget" className="block text-black">
                                                Request Budget
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/incident-reports")}`}>
                            <DocumentIcon className="h-5 w-5 text-black" />
                            <Link href="/admin/incident-reports" className="text-black">
                                Incident Reports
                            </Link>
                        </li>

                        <li className="p-2 flex flex-col items-start space-x-2 ">
                            <button
                                onClick={toggleAccounting}
                                className="flex items-center text-black w-full focus:outline-none"
                            >
                                <CalculatorIcon className="h-5 w-5 text-black" />

                                <span className="ml-2">Accounting</span>
                                <ChevronDownIcon
                                    className={`h-5 w-5 text-black ml-2 transform transition-transform ${isAccountingOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isAccountingOpen && (
                                <div className="relative w-full mt-2  text-black">
                                    <ul className="space-y-1">
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/inhouse/pertrip")}`}>
                                            <UserIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/inhouse/pertrip" className="block text-black">
                                                Rate Per Mile
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/inhouse/permonth")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/inhouse/permonth" className="block text-black">
                                                Rate Per Month
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/inhouse/peryear")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/inhouse/peryear" className="block text-black">
                                                Rate Per Year
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/consign")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/consign" className="block text-black">
                                                Consign
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/s5accounts")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/s5accounts" className="block text-black">
                                                S5 Accounts
                                            </Link>
                                        </li>
                                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/admin/financial-report")}`}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/admin/financial-report" className="block text-black">
                                                Financial Reports
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li className="p-2 flex items-center space-x-2 hover:bg-red-500">
                            <CogIcon className="h-5 w-5 text-black" />
                            <Link className="text-black" href="" onClick={handleLogout}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
