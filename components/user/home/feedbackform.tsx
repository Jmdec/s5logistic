'use client';

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';

interface Feedback {
  id: number;
  name: string;
  position: string;
  message: string;
  status: string;
}

function FeedbackForm() {
  const [feedback, setFeedback] = useState({ name: '', position: '', message: '' });
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/feedbacks`);
        const data = await response.json();

        console.log('API Response:', data);

        if (data.feedbacks && Array.isArray(data.feedbacks)) {
          const acceptedFeedbacks = data.feedbacks.filter((item: Feedback) => item.status === 'ACCEPTED');
          setSubmittedFeedbacks(acceptedFeedbacks);
        } else {
          console.error('Unexpected API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/submit-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        toast.success('Feedback submitted successfully!');
        setFeedback({ name: '', position: '', message: '' });
      } else {
        toast.error('Failed to submit feedback.');
      }
    } catch (error) {
      toast.error('Error submitting feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-cover bg-center dark:bg-gray-900" style={{ backgroundImage: 'url(/feedback.png)' }}>
      <div className="flex flex-wrap justify-center space-x-0 md:space-x-8 ">

        {/* Feedback Swiper Carousel */}
        {submittedFeedbacks.length > 0 && (
          <div className="max-w-screen-xl px-2 sm:px-4 py-6 sm:py-8 mx-auto text-center lg:py-16 lg:px-6">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="w-full max-w-screen-sm sm:max-w-screen-md mx-auto"
            >
              {submittedFeedbacks.map((feedback) => (
                <SwiperSlide key={feedback.id}>
                  <figure className="mx-auto max-w-xs sm:max-w-md md:max-w-lg">
                    <blockquote className="px-2 sm:px-4 md:px-6">
                      <p className="text-sm sm:text-base md:text-xl font-medium text-white dark:text-white whitespace-normal break-words">
                        {feedback.message}
                      </p>
                    </blockquote>
                    <figcaption className="flex items-center justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
                      <Image className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full" src="/user.png" alt="profile picture" width={100} height={100} />
                      <div className="flex items-center divide-x divide-gray-500 dark:divide-gray-700">
                        <div className="pr-2 sm:pr-3 font-medium text-white dark:text-white text-sm sm:text-base">{feedback.name}</div>
                        <div className="pl-2 sm:pl-3 text-xs sm:text-sm font-light text-gray-400 dark:text-gray-400">{feedback.position}</div>
                      </div>
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Submit Feedback Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl sm:p-3 md:p-8 sm:max-w-sm md:max-w-lg lg:w-[500px] bg-opacity-80 dark:bg-opacity-90">
          <h2 className="text-2xl sm:text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
            Submit Feedback
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 sm:mb-2">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-xs md:text-sm">
                Name
              </label>
              <input type="text" id="name" name="name" value={feedback.name} onChange={handleChange}
                className="mt-1 sm:mt-0.5 p-2 sm:p-1 md:p-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="mb-3 sm:mb-2">
              <label htmlFor="position" className="block text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-xs md:text-sm">
                Position
              </label>
              <input type="text" id="position" name="position" value={feedback.position} onChange={handleChange}
                className="mt-1 sm:mt-0.5 p-2 sm:p-1 md:p-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="mb-3 sm:mb-2">
              <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-xs md:text-sm">
                Message
              </label>
              <textarea id="message" name="message" value={feedback.message} onChange={handleChange}
                className="mt-1 sm:mt-0.5 p-2 sm:p-1 md:p-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <button type="submit"
              className="text-white bg-blue-500 dark:bg-blue-700 py-1 sm:py-0.5 px-3 sm:px-2 md:py-1.5 md:px-5 rounded text-xs sm:text-xs md:text-sm flex justify-center items-center"
              disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FeedbackForm;
