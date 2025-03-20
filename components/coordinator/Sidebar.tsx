"use client";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon, CurrencyDollarIcon, BuildingLibraryIcon, WrenchScrewdriverIcon, InformationCircleIcon, ClockIcon, BookOpenIcon, UserIcon, ChevronDownIcon, UserGroupIcon, CogIcon, CalculatorIcon, TruckIcon, UserPlusIcon, WrenchIcon, ChatBubbleLeftIcon, CalendarIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { destroyCookie } from "nookies";
import { useRouter, usePathname } from "next/navigation";


type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();


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
        <>
            {/* Sidebar */}
            <div
                className="w-64 h-full bg-gradient-to-b from-white to-red-500 flex flex-col overflow-y-auto fixed top-0 left-0 z-10"
            >
    <div className="w-64 h-full bg-gradient-to-b from-white to-red-500 flex flex-col overflow-y-auto fixed top-0 left-0 z-10">
<div className="flex flex-col items-center justify-start mt-5 px-4"> {/* Centered column layout */}
  <Image
    src="/logo-without-bg.png"
    alt="Admin Panel Logo"
    width={100}
    height={100}
    className="mb-2" // Margin bottom to separate text
  />
  <span className="text-black font-semibold">COORDINATOR</span>

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
                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/coordinator")}`}>
                            <HomeIcon className="h-5 w-5 text-black" />
                            <Link href="/coordinator" className="text-black">
                                Dashboard
                            </Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/coordinator/booking-form")}`}>
                            <BookOpenIcon className="h-5 w-5 text-black" />
                            <Link href="/coordinator/booking-form" className="text-black">
                                Booking Form
                            </Link>
                        </li>

                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/coordinator/booking-history")}`}>
                            <InformationCircleIcon className="h-5 w-5 text-black" />
                            <Link href="/coordinator/booking-history" className="text-black">
                                Booking History
                            </Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/coordinator/pdo-returned")}`}>
                            <InformationCircleIcon className="h-5 w-5 text-black" />
                            <Link href="/coordinator/pdo-returned" className="text-black">
                                POD Returned
                            </Link>
                        </li>
                        <li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/coordinator/return-items")}`}>
                            <InformationCircleIcon className="h-5 w-5 text-black" />
                            <Link href="/coordinator/return-items" className="text-black">
                                Return Items
                            </Link>
                        </li>
<li className={`p-2 flex items-center space-x-2 hover:bg-red-500 ${getActiveClass("/coordinator/delay-report")}`}>
                            <InformationCircleIcon className="h-5 w-5 text-black" />
                            <Link href="/coordinator/delay-report" className="text-black">
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

        


              
            </div>
        </>
    );
};

export default Sidebar;
