"use client"
import React, { useState, useEffect } from 'react'
import { Card } from '@heroui/card';
import {
    TruckIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline';
import { FaMoneyBill } from 'react-icons/fa';

interface DashboardData {
    totalBookings: number;
    totalSuccessfulDeliveries: number;
    expiringCourier: number;
    totalEarnings: number;
}


const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let user_id = sessionStorage.getItem('user_id'); 

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/courier-dash?user_id=${user_id}`, {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log(data);  
                setDashboardData(data); 
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {dashboardData ? (
                <div className="max-w-7xl mx-auto p-6 ">
                    {/* Grid for 2 rows and 4 cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 dark:text-gray-800">
                        {/* Row 1: 4 cards */}
                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
                            <TruckIcon className="h-8 w-8 text-red-500 mb-2" />
                            <div className="">

                                <h1 className="font-semibold text-3xl text-center dark:text-gray-800">
                                    {dashboardData.totalBookings}
                                </h1>
                                <h3 className="text-lg font-semibold dark:text-gray-800">Your Total Trips</h3>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
                            <TruckIcon className="h-8 w-8 text-red-500 mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center dark:text-gray-800">
                                    {dashboardData.totalSuccessfulDeliveries}
                                </h1>
                                <h3 className="text-lg font-semibold dark:text-gray-800">Successful Delivery</h3>
                            </div>
                        </Card>

                        <Card className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
                            <FaMoneyBill className="h-8 w-8 text-red-500  mb-1" />
                            <div className="">
                                <h1 className="font-semibold text-3xl text-center dark:text-gray-800">
                                    {dashboardData.totalEarnings}
                                </h1>
                                <h3 className="text-lg font-semibold dark:text-gray-800">Total Earnings</h3>
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
