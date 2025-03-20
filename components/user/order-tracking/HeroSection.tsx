import React from 'react';
import Image from 'next/image';

function HeroSection() {
    return (
        <section className="relative w-full h-[50vh]">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/hero.png"
                    alt="Hero Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>

            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="absolute inset-0 flex items-center justify-center text-white">
                <h1 className="text-5xl md:text-7xl font-bold">Order Tracking</h1>
            </div>
        </section>
    );
}

export default HeroSection;
