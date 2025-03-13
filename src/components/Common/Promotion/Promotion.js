import React, { useState, useRef, useEffect } from "react";
import PromotionItem from "../PromotionItem/PromotionItem";

const Promotion = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transition = "transform 0.3s ease-in-out";
      containerRef.current.style.transform = `translateX(-${
        currentIndex * 33.33
      }%)`;
    }
  }, [currentIndex]);

  return (
    <div className="w-11/12 max-w-[1400px] mx-auto px-2 sm:px-4">
      <div className="flex justify-center mt-6">
        <button className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-full shadow-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 ease-out">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-red-800"></span>
          <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-red-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
          <span className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            Khuyến Mãi
          </span>
        </button>
      </div>
      <div className="relative overflow-hidden p-4">
        <div ref={containerRef} className="flex">
          {items.concat(items.slice(0, 2)).map((item, index) => (
            <PromotionItem key={index} item={item} />
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-center">
        <a
          href="/movies"
          className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-full shadow-2xl transition-all duration-300 ease-out bg-red-600 hover:bg-red-700"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 via-red-500 to-orange-400"></span>
          <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-red-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
          <span className="relative flex items-center">
            Xem tất cả khuyến mãi
            <svg
              className="w-5 h-5 ml-2 transition-transform duration-300 ease-out transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};

export default Promotion;
