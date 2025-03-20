'use client'

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/user/Layout/HeroSection';
import { InfiniteSlider } from '@/components/user/home/partnerslider';
import FeedbackForm from '@/components/user/home/feedbackform';
import AboutUs from '@/components/user/home/aboutus';
import Offer from '@/components/user/home/offer';
import Service from '@/components/user/home/service';
import Loader from '@/components/loading';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* HeroSection */}
          <HeroSection />

          {/* Partner Slider */}
          <InfiniteSlider />

          {/* Feedback Form */}
          <FeedbackForm />

          {/* About Us */}
          <AboutUs />

          {/* Offer */}
          <Offer />

          {/* Service */}
          <Service />
        </>
      )}
    </div>
  );
}
