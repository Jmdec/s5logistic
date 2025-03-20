"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseCircleSharp } from "react-icons/io5";
import {
    BuildingLibraryIcon,
    ChevronDownIcon,
    UserIcon,
    UserGroupIcon,
    CogIcon
} from "@heroicons/react/24/outline";

import { RiDashboardLine } from "react-icons/ri";
import { LuCalendarDays } from "react-icons/lu";
import { PiMoney } from "react-icons/pi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { RiFolderReceivedLine } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { GrHostMaintenance } from "react-icons/gr";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";



const Sidebar = () => {
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
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


    return (
        <>
            <div className={`fixed top-0 left-0 z-50 h-full  ${isOpen ? 'w-64' : 'w-0'} lg:w-64 bg-gradient-to-b from-white to-red-500 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out`}>
                <div className="flex justify-between items-center p-4">
                    <button onClick={toggleSidebar} className="absolute top-4 right-3 lg:hidden">
                        <IoCloseCircleSharp className="h-6 w-6 text-black" />
                    </button>
                    <div className="flex flex-col items-center justify-center mt-5 w-full">
                        <Image src="/logo-without-bg.png" alt="Admin Panel Logo" width={100} height={100} />
                        <p className="font-semibold text-black text-xl">ACCOUNTING</p>
                    </div>

                </div>

                <nav className="flex-1 p-4 text-start">
                    <ul className="space-y-4">
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "dashboard" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("dashboard")}>
                            <RiDashboardLine className="h-5 w-5 text-black" />
                            <Link href="/accounting" className="text-black">Dashboard</Link>
                        </li>

                        <li className=" flex flex-col items-center cursor-pointer">
                            <button onClick={() => setActiveDropdown(!activeDropdown)} className={`flex items-center w-full focus:outline-none p-2  space-x-2 cursor-pointer ${activeDropdown ? "bg-red-400 text-black" : "hover:bg-red-500"}`}>
                                <BuildingLibraryIcon className="h-5 w-5 text-black" />
                                <span className=" text-black">In House Reports</span>
                                <ChevronDownIcon className={`h-5 w-5 text-black ml-1 transform transition-transform ${activeDropdown ? "rotate-180" : ""}`} />
                            </button>
                            {activeDropdown && (
                                <div className="relative left-0 w-full mt-2 text-black">
                                    <ul>
                                        <li className={`flex items-center space-x-2 py-2 cursor-pointer ${activeTab === "pertrip" ? "bg-red-400 text-black" : "hover:bg-red-200"}`} onClick={() => handleTabClick("pertrip")}>
                                            <UserIcon className="h-5 w-5 text-black" />
                                            <Link href="/accounting/inhouse/pertrip" className=" text-black">Rate Per Trip</Link>
                                        </li>
                                        <li className={`flex items-center space-x-2 py-2 cursor-pointer ${activeTab === "permonth" ? "bg-red-400 text-black" : "hover:bg-red-200"}`} onClick={() => handleTabClick("permonth")}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/accounting/inhouse/permonth" className=" text-black">Rate Per Month</Link>
                                        </li>
                                        <li className={`flex items-center space-x-2 py-2 cursor-pointer ${activeTab === "Rate peryear" ? "bg-red-400 text-black" : "hover:bg-red-200"}`} onClick={() => handleTabClick("peryear")}>
                                            <UserGroupIcon className="h-5 w-5 text-black" />
                                            <Link href="/accounting/inhouse/peryear" className=" text-black">Rate Per Year</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "accounts" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("accounts")}>
                            <MdOutlineSupervisorAccount className="h-5 w-5 text-black" />
                            <Link href="/accounting/account" className="text-black">Accounts</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "consign" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("consign")}>
                            <LiaMoneyCheckAltSolid className="h-5 w-5 text-black" />
                            <Link href="/accounting/consign" className="text-black">Consign</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "pms" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("pms")}>
                            <GrHostMaintenance className="h-5 w-5 text-black" />
                            <Link href="/accounting/pms" className="text-black">PMS</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "calendar" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("calendar")}>
                            <LuCalendarDays className="h-5 w-5 text-black" />
                            <Link href="/accounting/calendar" className="text-black">Calendar</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "budget" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("budget")}>
                            <PiMoney className="h-5 w-5 text-black" />
                            <Link href="/accounting/budget" className="text-black">Request Budget</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "s5accounts" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("s5accounts")}>
                            <MdOutlineSwitchAccount className="h-5 w-5 text-black" />
                            <Link href="/accounting/s5accounts" className="text-black">S5 Account</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "receivable" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("receivable")}>
                            <RiFolderReceivedLine className="h-5 w-5 text-black" />
                            <Link href="/accounting/receivable" className="text-black">Receivable</Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 cursor-pointer ${activeTab === "financial-report" ? "bg-red-400 text-black" : "hover:bg-red-500"}`} onClick={() => handleTabClick("financial-report")}>
                            <TbReport className="h-5 w-5 text-black" />
                            <Link href="/accounting/financial-report" className="text-black">Financial Report</Link>
                        </li>
                    </ul>
                    <li className="p-2 flex items-center space-x-2 hover:bg-red-500 mt-8">
                        <CogIcon className="h-5 w-5 text-black" />
                        <Link className="text-black" href="" onClick={handleLogout}>
                            Logout
                        </Link>
                    </li>
                </nav>
            </div>

            <button onClick={toggleSidebar} className="lg:hidden absolute top-4 left-4 p-3 text-black">
                <GiHamburgerMenu className="h-6 w-6" />
            </button>
        </>
    );
};

export default Sidebar;
