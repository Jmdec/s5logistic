import React, { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        toast.success('Message sent successfully!');
      } else {
        const errorMessages = result.errors
          ? Object.values(result.errors).join(', ')
          : result.message || 'Error sending message';
        toast.error(errorMessages);
      }
    } catch (error) {
      console.error('Error sending message', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section className="text-gray-600 dark:text-gray-300 body-font">
        <div className="container px-5 py-24 mx-auto lg:flex">
          <div className="w-full lg:w-3/4 xl:w-2/3 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative" style={{ height: '500px' }}>
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              frameBorder="0"
              title="map"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966.5747900433742!2d120.91387431574803!3d14.294042799409779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d55ba597481b%3A0x6ec2877a54188971!2sAsia%20Structural%20Developer%20Corp.!5e0!3m2!1sen!2sph!4v1737360788769!5m2!1sen!2sph"
              style={{ border: '0' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="bg-white dark:bg-gray-800 absolute bottom-10 right-1 lg:w-1/2 w-full h-52 px-6 py-6 rounded shadow-md z-10">
              <div className="">
                <h2 className="title-font font-semibold text-gray-900 dark:text-gray-100 tracking-widest text-xs">ADDRESS</h2>
                <p className="mt-1 break-words text-xs lg:text-medium">Lot 17 G Blk 3, New Cavite Industrial City, Maria St State Land, Manggahan, General Trias, 4107 Cavite</p>
              </div>
              <h2 className="title-font font-semibold text-gray-900 dark:text-gray-100 tracking-widest text-xs mt-3">EMAIL</h2>
              <a
                className="text-red-500 leading-relaxed break-words text-xs lg:text-medium"
                href="mailto:s5logisticsinc.cavite@gmail.com"
              >
                s5logisticsinc.cavite@gmail.com
              </a>
              <h2 className="title-font font-semibold text-gray-900 dark:text-gray-100 tracking-widest text-xs mt-3">PHONE</h2>
              <a
                className="leading-relaxed break-words text-xs lg:text-medium"
                href="tel:+11234567890"
              >
                123-456-7890
              </a>
            </div>

          </div>


          <div className="lg:w-1/3 md:w-1/2 bg-white dark:bg-gray-800 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 dark:text-gray-100 text-lg mb-1 font-medium title-font">Contact Us</h2>
            <p className="leading-relaxed mb-5 text-gray-600 dark:text-gray-400">
              Let us know how we can improve or if you need any assistance.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600 dark:text-gray-400">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 dark:text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600 dark:text-gray-400">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 dark:text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="subject" className="leading-7 text-sm text-gray-600 dark:text-gray-400">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 dark:text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600 dark:text-gray-400">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 dark:text-gray-300 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className="text-white bg-red-500 dark:bg-red-700 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 dark:hover:bg-red-600 rounded text-lg flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span>Submitting</span>
                    <svg
                      className="w-5 h-5 text-white ml-2 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default ContactUs;
