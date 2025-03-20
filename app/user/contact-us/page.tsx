'use client'

import React, { useState, useEffect } from 'react';
import Loader from '@components/loading';
import HeroSection from '@/components/user/contact-us/hero';
import ContactUs from '@/components/user/contact-us/ContactUs';

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
          <HeroSection/>
          <ContactUs/>
        </>
      )}
    </div>
  );
}

export default Page;
