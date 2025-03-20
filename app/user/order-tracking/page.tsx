'use client'

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/user/order-tracking/HeroSection';
import Tracking from '@/components/user/order-tracking/Tracking';
import Loader from '@/components/loading';

function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Hero */}
          <HeroSection />

          {/* Order Tracking */}
          <Tracking />
        </>
      )}
    </div>
  );
}

export default Page;
