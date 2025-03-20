import React from 'react';

function Footer() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-screen-lg px-4 sm:px-6 text-gray-800 dark:text-gray-200 mx-auto 
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
        <div className="flex justify-center p-3">
          <img src="/logo-without-bg.png" alt="Company Logo" className="lg:w-2/3 lg:h-2/3 w-32 mt-0" />
        </div>

        {/* Large Screens Layout */}
        <div className="p-5 hidden lg:block">
          <div className="text-sm uppercase text-black dark:text-white font-bold">Site Links</div>
          <a className="my-3 block hover:text-red-500" href="/">Home</a>
          <a className="my-3 block hover:text-red-500" href="/user/trucking-services">Services</a>
        </div>

        <div className="p-5 hidden lg:block">
          <div className="text-sm uppercase text-black dark:text-white font-bold">Quick Links</div>
          <a className="my-3 block hover:text-red-500" href="/user/order-tracking">Order Tracking</a>
          <a className="my-3 block hover:text-red-500" href="/user/contact-us">Contact Us</a>
        </div>

        {/* Small to Medium Screens Layout */}
        <div className="grid grid-cols-2 gap-4 text-center sm:text-left lg:hidden">
          <div className="p-1">
            <div className="text-sm uppercase text-black dark:text-white font-bold">Site Links</div>
            <a className="my-3 block hover:text-red-500" href="/">Home</a>
            <a className="my-3 block hover:text-red-500" href="/user/trucking-services">Services</a>
          </div>

          <div className="p-1">
            <div className="text-sm uppercase text-black dark:text-white font-bold">Quick Links</div>
            <a className="my-3 block hover:text-red-500" href="/user/order-tracking">Order Tracking</a>
            <a className="my-3 block hover:text-red-500" href="/user/contact-us">Contact Us</a>
          </div>
        </div>


        <div className="ml-10 mt-4 p-1">
          <div className="text-sm uppercase text-black dark:text-white font-bold">Contact Us</div>
          <a className="my-3 block" href="https://www.google.com/maps?q=Lot+17+G+Blk+3,+New+Cavite+Industrial+City,+Maria+St+State+Land,+Manggahan,+General+Trias,+4107+Cavite" target="_blank" rel="noopener noreferrer">
            Lot 17 G Blk 3, New Cavite Industrial City, Maria St State Land, Manggahan, General Trias, 4107 Cavite
          </a>
          <a className="my-3 block text-blue-500" href="mailto:s5logisticsInc.Cavite@gmail.com">
            s5logisticsInc.Cavite@gmail.com
          </a>

        </div>
      </div>


      <div className="bg-gray-100 dark:bg-gray-800 pt-2">
        <div className="flex pb-5 px-3 m-auto pt-5 border-t text-gray-800 dark:text-gray-200 text-sm flex-col max-w-screen-lg items-center">
          <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
            <a href="/#" className="w-6 mx-1">
              <svg className="fill-current cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 hover:dark:text-white" width="100%" height="100%" viewBox="0 0 24 24">
                <path d="M24,12c0,6.627 -5.373,12 -12,12c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c6.627,0 12,5.373 12,12Zm-6.465,-3.192c-0.379,0.168 -0.786,0.281 -1.213,0.333c0.436,-0.262 0.771,-0.676 0.929,-1.169c-0.408,0.242 -0.86,0.418 -1.341,0.513c-0.385,-0.411 -0.934,-0.667 -1.541,-0.667c-1.167,0 -2.112,0.945 -2.112,2.111c0,0.166 0.018,0.327 0.054,0.482c-1.754,-0.088 -3.31,-0.929 -4.352,-2.206c-0.181,0.311 -0.286,0.674 -0.286,1.061c0,0.733 0.373,1.379 0.94,1.757c-0.346,-0.01 -0.672,-0.106 -0.956,-0.264c-0.001,0.009 -0.001,0.018 -0.001,0.027c0,1.023 0.728,1.877 1.694,2.07c-0.177,0.049 -0.364,0.075 -0.556,0.075c-0.137,0 -0.269,-0.014 -0.397,-0.038c0.268,0.838 1.048,1.449 1.972,1.466c-0.723,0.566 -1.633,0.904 -2.622,0.904c-0.171,0 -0.339,-0.01 -0.504,-0.03c0.934,0.599 2.044,0.949 3.237,0.949c3.883,0 6.007,-3.217 6.007,-6.008c0,-0.091 -0.002,-0.183 -0.006,-0.273c0.413,-0.298 0.771,-0.67 1.054,-1.093Z"></path>
              </svg>
            </a>
            <a href="/#" className="w-6 mx-1">
              <svg className="fill-current cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 hover:dark:text-white" width="100%" height="100%" viewBox="0 0 24 24">
                <path d="M24,12c0,6.627 -5.373,12 -12,12c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c6.627,0 12,5.373 12,12Zm-11.278,0l1.294,0l0.172,-1.617l-1.466,0l0.002,-0.808c0,-0.422 0.04,-0.648 0.646,-0.648l0.809,0l0,-1.616l-1.295,0c-1.555,0 -2.103,0.784 -2.103,2.102l0,0.97l-0.969,0l0,1.617l0.969,0l0,4.689l1.941,0l0,-4.689Z"></path>
              </svg>
            </a>
            <a href="/#" className="w-6 mx-1">
              <svg className="fill-current cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 hover:dark:text-white" width="100%" height="100%" viewBox="0 0 24 24">
                <path d="M7.3,0.9c1.5,-0.6 3.1,-0.9 4.7,-0.9c1.6,0 3.2,0.3 4.7,0.9c1.5,0.6 2.8,1.5 3.8,2.6c1,1.1 1.9,2.3 2.6,3.8c0.7,1.5 0.9,3 0.9,4.7c0,1.7 -0.3,3.2 -0.9,4.7c-0.6,1.5 -1.5,2.8 -2.6,3.8c-1.1,1 -2.3,1.9 -3.8,2.6c-1.5,0.7 -3.1,0.9 -4.7..."></path>
              </svg>
            </a>
            <a href="/#" className="w-6 mx-1">
              <svg className="fill-current cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 hover:dark:text-white" width="100%" height="100%" viewBox="0 0 24 24">
                <path d="M19.05,8.362c0,-0.062 0,-0.125 -0.063,-0.187l0,-0.063c-0.187,-0.562 -0.687,-0.937 -1.312,-0.937l0.125,0c0,0 -2.438,-0.375 -5.75,-0.375c-3.25,0 -5.75,0.375 -5.75,0.375l0.125,0c-0.625,0 -1.125,0.375 -1.313,0.937l0,0.063c0,0.062 0,0.125 -0.062,0.187c-0.063,0.625 -0.25,1.938 -0.25,3.438c0,1.5 0.187,2.812 0.25,3.437c0,0.063 0,0.125 0.062,0.188l0,-0.063c0.188,0.563 0.688,0.938 1.313,0.938c0,0 2.438,0.375 5.75,0.375c3.25,0 5.75,-0.375 5.75,-0.375l-0.125,0c0.625,0 1.125,-0.375 1.312,-0.937l0,-0.062c0,-0.062 0,-0.125 0.062,-0.187c0.062,-0.625 0.25,-1.938 0.25,-3.437C18.8,10.3 19.05,8.988 19.05,8.362z"></path>
              </svg>
            </a>
          </div>
          <span>
            2025 &copy; <a href="https://www.facebook.com/people/Infinitech-Advertising-Corp/100080647808810/?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
              Infinitech Advertising Corporation
            </a>. All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
