import React from 'react';
import { FaTruck, FaBolt, FaHardHat, FaMoon, FaMapMarkedAlt, FaWarehouse } from 'react-icons/fa';

function Services() {
  return (
    <section id="new-features" className="py-8 sm:py-10 lg:py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl xl:text-5xl">
            Our Trucking Services
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400 sm:mt-8">
            Offering reliable trucking services across the Philippines for the efficient transport of goods, packages, and more.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-10 text-center sm:mt-16 xl:mt-24">
          <div className="md:p-8 lg:p-14 flex flex-col justify-center items-center transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-blue-200 dark:bg-blue-600 flex justify-center items-center">
              <FaTruck className="text-3xl text-gray-900 dark:text-white" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white">Standard Trucking Service</h3>
            <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
              Our Standard Trucking service ensures reliable delivery of your goods across the Philippines, with a focus on safety and efficiency.
            </p>
          </div>

          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-yellow-200 dark:bg-yellow-600 flex justify-center items-center">
              <FaBolt className="text-3xl text-gray-900 dark:text-white" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white">Express Trucking Service</h3>
            <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
              Need it fast? Our Express Trucking service offers expedited delivery throughout the Philippines, ensuring timely arrival for urgent shipments.
            </p>
          </div>

          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-red-200 dark:bg-red-600 flex justify-center items-center">
              <FaHardHat className="text-3xl text-gray-900 dark:text-white" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white">Heavy Load Trucking</h3>
            <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
              Specializing in transporting heavy and oversized loads, our Heavy Load Trucking service ensures safe and efficient handling across the Philippines.
            </p>
          </div>

          <div className="md:p-8 lg:p-14 md:border-t md:border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-purple-200 dark:bg-purple-600 flex justify-center items-center">
              <FaMoon className="text-3xl text-gray-900 dark:text-white" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white">Overnight Trucking</h3>
            <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
              For those last-minute deliveries, our Overnight Trucking service ensures that your shipments reach their destination by morning.
            </p>
          </div>

          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 dark:border-gray-700 md:border-t flex flex-col justify-center items-center transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-teal-200 dark:bg-teal-600 flex justify-center items-center">
              <FaMapMarkedAlt className="text-3xl text-gray-900 dark:text-white" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white">Regional Trucking</h3>
            <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
              Covering key regions across the Philippines, our Regional Trucking service offers dependable delivery to major cities and towns.
            </p>
          </div>

          <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 dark:border-gray-700 md:border-t flex flex-col justify-center items-center transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-green-200 dark:bg-green-600 flex justify-center items-center">
              <FaWarehouse className="text-3xl text-gray-900 dark:text-white" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white">Logistics and Warehousing</h3>
            <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
              Beyond trucking, we offer comprehensive logistics and warehousing solutions to manage and store your goods efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
