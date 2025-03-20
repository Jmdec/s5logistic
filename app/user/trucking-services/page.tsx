'use client'

import React, { useState, useEffect } from 'react';
import HeroSection from "@/components/user/services/HeroSection";
import Services from "@/components/user/services/services";
import Loader from '@/components/loading';

export default function ServicesPage() {
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

          {/* Services */}
          <Services />
        </>
      )}
    </div>
  );
}
