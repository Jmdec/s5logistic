import React from 'react';
import Image from 'next/image';
import { AiOutlineEye } from 'react-icons/ai';
import { BiBullseye } from 'react-icons/bi';

function AboutUs() {
    return (
        <section className="py-24 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4 overflow-x-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-full">
                    <div className="flex space-x-8">
                        <div className="relative w-full mt-3">
                            <Image
                                src="/truck.png"
                                alt="Truck"
                                width={550}
                                height={500}
                                className="h-full w-full object-cover max-w-full"
                                style={{
                                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 90%)',
                                }}
                            />
                            <div className="absolute bottom-0 left-5 right-0 flex justify-center gap-2 p-4 z-10">
                                <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg">
                                    <h3 className="text-xs sm:text-sm md:text-2xl font-bold text-gray-800 dark:text-gray-100">28K</h3>
                                    <p className="text-xs sm:text-sm md:text-lg text-gray-600 dark:text-gray-400">Satisfied Clients</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg">
                                    <h3 className="text-xs sm:text-sm md:text-2xl font-bold text-gray-800 dark:text-gray-100">500</h3>
                                    <p className="text-xs sm:text-xs md:text-lg text-gray-600 dark:text-gray-400">Delivery Man</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full mt-2">
                            <div className="relative z-10 mb-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">30+</h3>
                                    <p className="text-base sm:text-sm sm:text-justify md:text-lg text-gray-600 dark:text-gray-400">Years Experiences in Courier Service</p>
                                </div>
                            </div>
                            <Image
                                src="/S5Box.png"
                                alt="S5Box"
                                width={400}
                                height={200}
                                className="w-full object-cover max-w-full h-auto"
                                style={{
                                    clipPath: 'polygon(0% 0%, 85% 0%, 100% 10%, 100% 100%, 0% 100%)',
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2 md:space-y-4">
                        <div className="space-y-4 mb-10">
                            <h3 className="text-lg sm:text-6xl font-bold text-gray-800 dark:text-gray-100">
                                30+ Years Experiences in Courier Service
                            </h3>
                            <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 text-justify">
                                S5 LOGISTICS INC. was established through the combined expertise, industry knowledge, and extensive experience of its founders: Mr. Gilbert Corcuera of GPC Express, Mr. Dennis Jamir of DNJ Trucking, and Mr. Roberto Jamir Jr. of TR3 Logistics. Their decades of leadership in logistics, transportation, and distribution have shaped S5 LOGISTICS into a trusted name in the industry.
                            </p>
                            <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 text-justify">
                                Committed to excellence, we specialize in providing fast, secure, and efficient courier services to various destinations across the Philippines. Our team ensures that every shipment reaches its destination on time and in perfect condition. By fostering strong partnerships with our clients, we strive to exceed expectations and deliver a seamless logistics experience tailored to their needs.
                            </p>
                        </div>

                        <ul className="space-y-8">
                            <li className="flex space-x-6">
                                <div className="flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full">
                                    <AiOutlineEye size={60} />
                                </div>
                                <div>
                                    <h6 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Our Vision</h6>
                                    <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 text-justify">
                                        S5 Logistics Inc. envisions itself as the leading choice in the logistics industry, continuously setting new benchmarks for cost-effective and highly efficient logistics solutions.
                                    </p>
                                </div>
                            </li>
                            <li className="flex space-x-6">
                                <div className="flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full">
                                    <BiBullseye size={60} />
                                </div>
                                <div>
                                    <h6 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Our Mission</h6>
                                    <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 text-justify">
                                        S5 Logistics Inc. aims to provide worry-free, personalized, and professional services to our clients. We aim to provide our clients with efficient, reliable, and innovative solutions that will contribute to the success of their business.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;