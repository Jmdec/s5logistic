import React from "react";

function Offer() {
  return (
    <div className="bg-gray-800 py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white text-gray-800 p-8 rounded-lg text-center shadow-lg dark:bg-gray-900 dark:text-white">
          <div className="bg-red-600 rounded-full p-4 sm:p-6 mb-4 inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-white mx-auto"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <h3 className="font-semibold text-xl sm:text-2xl">Apply Online</h3>
          <p className="mt-2 text-sm sm:text-lg">
            Easily apply for our services online from anywhere in the Philippines. Enjoy a streamlined process that saves you time and effort.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-8 rounded-lg text-center shadow-lg dark:bg-gray-900 dark:text-white">
          <div className="bg-red-600 rounded-full p-4 sm:p-6 mb-4 inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-white mx-auto"
            >
              <path d="M10 14l2 2l4-4m0 0l4 4m-4-4l-4-4m4 4H4" />
            </svg>
          </div>
          <h3 className="font-semibold text-xl sm:text-2xl">Submit Documents</h3>
          <p className="mt-2 text-sm sm:text-lg">
            Upload your documents securely with just a few clicks. Our platform ensures your data is protected at all times.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-8 rounded-lg text-center shadow-lg dark:bg-gray-900 dark:text-white">
          <div className="bg-red-600 rounded-full p-4 sm:p-6 mb-4 inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-white mx-auto"
            >
              <path d="M20 12h2M4 12h2M9 4h6M9 20h6M4 4h16M4 20h16" />
            </svg>
          </div>
          <h3 className="font-semibold text-xl sm:text-2xl">Receive Goods</h3>
          <p className="mt-2 text-sm sm:text-lg">
            Receive your goods swiftly and securely. Our reliable delivery network ensures your order arrives on time, every time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Offer;
