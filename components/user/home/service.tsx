import React from "react";
import { FaBox, FaTruck, FaPallet, FaClock, FaMapMarkerAlt, FaWarehouse } from "react-icons/fa";

function Service() {
  return (
    <section id="features" className="container mx-auto px-4 py-8 md:py-12 lg:py-20 space-y-6">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-bold text-3xl text-black  dark:text-white  leading-[1.1] sm:text-3xl md:text-6xl">
          What We Serve
        </h2>
        <p className="max-w-[85%] leading-normal dark:text-white  text-gray-700 sm:text-lg sm:leading-7">
          We provide specialized delivery services for packages, documents, and other items to meet your every need.
        </p>
      </div>

      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <div className="relative overflow-hidden text-justify rounded-lg bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:shadow-red-500 dark:hover:shadow-red-500">
          <div className="mb-4 text-5xl text-gray-700 dark:text-gray-300">
            <FaBox />
          </div>
          <h3 className="font-bold text-xl text-black dark:text-white">Standard Courier</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Our Standard Courier service ensures reliable and timely delivery for all your regular parcels. We focus on efficiency and affordability, making it the perfect choice for your everyday shipping needs.
          </p>
        </div>

        <div className="relative overflow-hidden text-justify rounded-lg bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:shadow-red-500 dark:hover:shadow-red-500">
          <div className="mb-4 text-5xl text-gray-700 dark:text-gray-300">
            <FaTruck />
          </div>
          <h3 className="font-bold text-xl text-black dark:text-white">Express Courier</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Need it fast? Our Express Courier service is designed for urgent deliveries, ensuring your packages arrive at their destination as quickly as possible, with the highest priority and care.
          </p>
        </div>

        <div className="relative overflow-hidden text-justify rounded-lg bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:shadow-red-500 dark:hover:shadow-red-500">
          <div className="mb-4 text-5xl text-gray-700 dark:text-gray-300">
            <FaPallet />
          </div>
          <h3 className="font-bold text-xl text-black dark:text-white">Pallet Courier</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Our Pallet Courier service is ideal for businesses that need to transport large quantities of goods. We provide secure and efficient pallet delivery to ensure your products reach their destination safely.
          </p>
        </div>

        <div className="relative overflow-hidden text-justify rounded-lg bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:shadow-red-500 dark:hover:shadow-red-500">
          <div className="mb-4 text-5xl text-gray-700 dark:text-gray-300">
            <FaClock />
          </div>
          <h3 className="font-bold text-xl text-black dark:text-white">Overnight Courier</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Get your packages delivered overnight with our Overnight Courier service. Perfect for when you need something delivered first thing in the morning, no matter where it needs to go.
          </p>
        </div>

        <div className="relative overflow-hidden text-justify rounded-lg bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:shadow-red-500 dark:hover:shadow-red-500">
          <div className="mb-4 text-5xl text-gray-700 dark:text-gray-300">
            <FaMapMarkerAlt />
          </div>
          <h3 className="font-bold text-xl text-black dark:text-white">Nationwide Courier</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Our Nationwide Courier service ensures fast and reliable delivery across the country. We cater to all regions, providing comprehensive coverage and efficient service to get your packages where they need to be, safely and on time.
          </p>
        </div>

        <div className="relative overflow-hidden text-justify rounded-lg bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:shadow-red-500 dark:hover:shadow-red-500">
          <div className="mb-4 text-5xl text-gray-700 dark:text-gray-300">
            <FaWarehouse />
          </div>
          <h3 className="font-bold text-xl text-black dark:text-white">Warehousing</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            We offer comprehensive warehousing services to store your goods safely. Our secure storage facilities and inventory management solutions ensure your products are kept safe and accounted for.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Service;
