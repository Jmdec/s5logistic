import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaViber, FaWhatsapp, FaPlus } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

function FloatingSocMed() {
  const [isOpenSmall, setIsOpenSmall] = useState(false);

  const icons = [
    { href: "https://facebook.com", icon: <FaFacebookF size={28} />, bg: "bg-blue-600" },
    { href: "mailto:s5logisticsinc.cavite@gmail.com", icon: <IoMdMail size={28} />, bg: "bg-red-500" },
    { href: "viber://chat?number=%2B1234567890", icon: <FaViber size={28} />, bg: "bg-purple-600" },
    { href: "https://whatsapp.com", icon: <FaWhatsapp size={28} />, bg: "bg-green-500" }
  ];

  return (
    <>
      {/* Floating Social Media for Small Screens (Top Center) */}
      <div className="sm:hidden fixed top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 z-50">
        <button
  onClick={() => setIsOpenSmall(!isOpenSmall)}
  className="fixed top-12  left-36  -translate-x-1/2 z-50 bg-gray-900 p-5 rounded-full text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
>
  <FaPlus size={12} className={`transition-transform ${isOpenSmall ? "rotate-45" : ""}`} />
</button>

        <div className="relative flex flex-col items-center">
          {icons.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{
                opacity: isOpenSmall ? 1 : 0,
                y: isOpenSmall ? (index + 1) * 65 : 0,
                scale: isOpenSmall ? 1 : 0.5
              }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`${item.bg} p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110 absolute top-12  left-28 `}
              style={{ pointerEvents: isOpenSmall ? "auto" : "none" }}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Social Media Icons for Large Screens (Fixed Right Center) */}
      <div className="hidden sm:flex fixed right-6 top-1/2 transform -translate-y-1/2 flex-col items-center space-y-3 z-50">
        {icons.map((item, index) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item.bg} p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </>
  );
}

export default FloatingSocMed;
