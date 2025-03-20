import React from 'react';
import Image from 'next/image';

export const InfiniteSlider = () => {
    return (
        <div className="relative m-auto w-full overflow-hidden">
            <div className="w-full inline-flex flex-nowrap">
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/apcargo.png" alt="ApCargo" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/flash.png" alt="flash" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/growsari.png" alt="growsari" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/jandt.png" alt="j&t" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/suysing.png" alt="suysing" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/vcargo.png" alt="vcargo" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/xde.png" alt="xde" width={150} height={100} />
                    </li>
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/apcargo.png" alt="ApCargo" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/flash.png" alt="flash" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/growsari.png" alt="growsari" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/jandt.png" alt="j&t" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/suysing.png" alt="suysing" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/vcargo.png" alt="vcargo" width={150} height={100} />
                    </li>
                    <li className="transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:bg-white rounded-lg p-2">
                        <Image src="/Partner/xde.png" alt="xde" width={150} height={100} />
                    </li>
                </ul>
            </div>
        </div>
    );
};
