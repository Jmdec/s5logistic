"use client"
import React, { useState, useEffect } from 'react'
import { Card } from '@heroui/card';
import {
    ExclamationTriangleIcon,
    TruckIcon,
    BookOpenIcon,
    WrenchIcon,
    UserGroupIcon,
} from '@heroicons/react/24/solid';
import { FaClipboardCheck } from "react-icons/fa6";
import { RiTruckFill } from "react-icons/ri";
import { FaBookOpen } from 'react-icons/fa';

interface DashboardData {
    totalBookings: number;
    outboundTruck: number;
    inboundTruck: number;
    todayBookings: number;
    formattedDate: string;
    deliverySuccessfulCount: number;
    totalAvailableTrucks: number;
    totalCouriers: number;
    couriers: { name: string; license_expiration: string }[];
    locationsWithAddresses: { id: number; address: string; creator: string }[];
    MaintenanceTruck: number;
}


const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [drivers, setDriversData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loading, setLoading] = useState(true);


    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/getdrivers`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                console.log(data);

                const currentDate = new Date();
                const dateIn7Days = new Date(currentDate);
                dateIn7Days.setDate(currentDate.getDate() + 7);

                const filteredDrivers = data.data.filter((driver: any) => {
                    if (!driver.license_expiration) return false;

                    const expirationDate = new Date(driver.license_expiration);

                    return expirationDate < currentDate || expirationDate <= dateIn7Days;
                });

                setDriversData(filteredDrivers);
                setLoading(false);
                console.log("Filtered Drivers:", filteredDrivers);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/counts`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setDashboardData(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDriver();
        fetchData();
    }, []);


    useEffect(() => {
        const autoClose = setTimeout(() => {
            setIsModalOpen(false);
        }, 5000);

        return () => clearTimeout(autoClose);
    }, []);
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });


    return (
        <div>
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gradient-to-tr from-[#6BB9F0] to-[#0A4D91] p-4 rounded-lg w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/4 max-h-full overflow-y-auto shadow-lg relative">

                        <div className="text-center mb-4">
                            <h1 className="text-xl font-semibold text-yellow-400 flex items-center justify-center space-x-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                                <span className="text-xl text-white">Driver's License Expiration Warning!</span>
                            </h1>
                        </div>

                        {loading ? (
                            <div className="text-center text-white">
                                <p>Loading drivers...</p>
                                <div className="animate-spin w-8 h-8 border-4 border-t-4 border-yellow-400 rounded-full mx-auto my-4"></div> {/* Spinner */}
                            </div>
                        ) : (
                            <div className="text-white space-y-4">
                                {drivers.length > 0 ? (
                                    drivers.map((driver: any, index: number) => {
                                        const expirationDate = new Date(driver.license_expiration);
                                        const currentDate = new Date();
                                        const dateIn7Days = new Date(currentDate);
                                        dateIn7Days.setDate(currentDate.getDate() + 7);

                                        let expirationLabel = "";
                                        let expirationClass = "text-gray-200";
                                        if (expirationDate < currentDate) {
                                            expirationLabel = "(Expired)";
                                            expirationClass = "text-red-500 font-bold";
                                        } else if (expirationDate <= dateIn7Days) {
                                            expirationLabel = "(Expiring Soon)";
                                            expirationClass = "text-yellow-400 font-bold";
                                        }

                                        return (
                                            <div key={index} className="flex items-center space-x-2 p-3 bg-gradient-to-br from-blue-500 to-blue-800 rounded-lg shadow-md hover:scale-105 transform transition duration-300 ease-in-out">
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-sm">
                                                    <img src="/License.jpg" alt="Driver Logo" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex flex-col space-y-1">
                                                    <h2 className="text-sm font-semibold text-white">{driver.name}</h2>
                                                    <p className="text-xs"><strong>Email:</strong> {driver.email}</p>
                                                    <p className={`text-xs`}><strong>License Expiration:</strong> {driver.license_expiration} <strong className={`text-xs ${expirationClass}`}>{expirationLabel}</strong></p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-200 text-center">No drivers with expired licenses.</p>
                                )}
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <button onClick={closeModal} className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {dashboardData ? (
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <FaBookOpen  className="h-8 w-8 text-red-500 mb-2" />
                            <div className="">

                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.totalBookings}
                                </h1>
                                <h3 className="text-lg font-semibold">Total Booking</h3>
                                <p className="text-sm text-center text-gray-500">Manage Bookings</p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <BookOpenIcon className="h-8 w-8 text-red-500 mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.todayBookings}
                                </h1>
                                <h3 className="text-lg font-semibold">Bookings Today</h3>
                                <p className="text-xs text-gray-500">Date:
                                    <span className='ml-1'>{formattedDate}</span>
                                </p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <FaClipboardCheck className="h-8 w-8 text-red-500  mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.deliverySuccessfulCount}
                                </h1>
                                <h3 className="text-lg font-semibold">Successful Delivery</h3>
                                <p className="text-sm text-gray-500">System configurations</p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <TruckIcon className="h-8 w-8 text-red-500  mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.totalAvailableTrucks}
                                </h1>

                                <h3 className="text-lg font-semibold">Total Available Truck</h3>
                                <p className="text-sm text-center text-gray-500">Manage ongoing projects</p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <UserGroupIcon className="h-8 w-8 text-red-500  mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.totalCouriers}
                                </h1>

                                <h3 className="text-lg font-semibold text-center">Total Drivers</h3>
                                <p className="text-sm text-center text-gray-500">Manage billing and payments</p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                        <RiTruckFill className="h-8 w-8 text-red-500 mb-1 transform scale-x-[-1]" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.outboundTruck}
                                </h1>

                                <h3 className="text-lg font-semibold">Outbound Truck</h3>
                                <p className="text-sm text-gray-500">Manage user groups</p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <RiTruckFill className="h-8 w-8 text-red-500 mb-1" />

                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.inboundTruck}
                                </h1>

                                <h3 className="text-lg font-semibold text-center">Inbound Truck</h3>
                                <p className="text-sm text-gray-500">Manage files and documents</p>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg dark:text-gray-800">
                            <WrenchIcon className="h-8 w-8 text-red-500 mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center">
                                    {dashboardData.MaintenanceTruck}
                                </h1>

                                <h3 className="text-lg font-semibold">For Maintenance Truck</h3>
                                <p className="text-sm text-center text-gray-500">View and manage events</p>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div>No data available</div>
            )}

        </div>
    )
}

export default Dashboard
