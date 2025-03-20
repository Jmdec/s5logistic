import React from 'react';
import Image from 'next/image';
import FloatingSocMed from './floatingsocmed';
const  HeroSection = ()  => {
    return (
        <section className="relative w-full h-screen">
                <div className="relative hidden lg:flex">
        <FloatingSocMed />
      </div>
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/heropage.png"
                    alt="Hero Image"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            {/* Content */}
            <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-full lg:items-center lg:px-8">
                <div className="max-w-xl text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
                        We Provide Best
                        <strong className="block font-extrabold text-rose-500">
                            Dispatch & Parcel Services
                        </strong>
                    </h1>

                    <p className="mt-4 max-w-lg text-white sm:text-xl">
                        Our top-tier dispatch and parcel services ensure that your packages are delivered quickly and securely. We pride ourselves on reliability, efficiency, and customer satisfaction, providing a seamless experience for both businesses and individuals.
                    </p>


                    <div className="mt-8 flex flex-wrap gap-4 text-center sm:text-left">
                        <a
                            href="/user/order-tracking"
                            className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                        >
                            Track your order
                        </a>

                        <a
                            href="/user/contact-us"
                            className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
                        >
                            Contact us
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default HeroSection;
