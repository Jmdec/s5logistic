"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon, CurrencyDollarIcon, BuildingLibraryIcon, WrenchScrewdriverIcon, ClockIcon, BookOpenIcon, UserIcon, ChevronDownIcon, UserGroupIcon, CogIcon, CalculatorIcon, TruckIcon, UserPlusIcon, WrenchIcon, ChatBubbleLeftIcon, CalendarIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { destroyCookie } from "nookies";
import { useRouter, usePathname } from "next/navigation";


type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

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
        className="w-64 h-full bg-gradient-to-b from-white to-red-500 flex flex-col overflow-y-auto fixed top-0 left-0 z-10"
      >

    <div className="flex items-center justify-start mt-5 px-4">
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
        <nav className="flex-1 p-4 text-start items-center">
          <ul className="space-y-4">
            <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/courier")}`}>
              <HomeIcon className="h-5 w-5 text-black" />
              <Link href="/courier" className="text-black">
                Courier Dashboard
              </Link>
            </li>

            <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/courier/manage-order")}`}>
              <CurrencyDollarIcon className="h-5 w-5 text-black" />
              <Link href="/courier/manage-order" className="text-black">
                Manage Order
              </Link>
            </li>

            <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/courier/return-items")}`}>
              <BookOpenIcon className="h-5 w-5 text-black" />
              <Link href="/courier/return-items" className="text-black">
                Return Items
              </Link>
            </li>

            <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/courier/delay-form")}`}>
              <ClockIcon className="h-5 w-5 text-black" />
              <Link href="/courier/delay-form" className="text-black">
                Delay Report
              </Link>
            </li>

            <li className="p-2 flex items-center space-x-2 hover:bg-red-500 hover:p-2">
              <CogIcon className="h-5 w-5 text-black" />
              <Link href="" className="text-black" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black opacity-50 z-30"
        />
      )}
    </div>
  );
};

export default Sidebar;
