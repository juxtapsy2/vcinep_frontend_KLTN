import React, { useState, useEffect } from "react";
import "./Slide.css";

const slides = [
  {
    url: "https://res.cloudinary.com/dhs93uix6/image/upload/v1727751540/Slide3_tambin.jpg",
    title: "Movie 1",
  },
  {
    url: "https://res.cloudinary.com/dhs93uix6/image/upload/v1727751520/Slide2_qdaapj.jpg",
    title: "Movie 2",
  },
  {
    url: "https://res.cloudinary.com/dhs93uix6/image/upload/v1727751515/Slide1_q7mizl.jpg",
    title: "Movie 3",
  },
  {
    url: "https://res.cloudinary.com/dhs93uix6/image/upload/v1727752569/Slide4_e5bjfi.jpg",
    title: "Movie 4",
  },
];

function Slide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const prevSlide = () => {
    setDirection("prev");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setDirection("next");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (slideIndex) => {
    setDirection(slideIndex > currentIndex ? "next" : "prev");
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${
            index === currentIndex ? `active ${direction}` : ""
          }`}
        >
          <img src={slide.url} alt={`Slide ${index + 1}`} />
        </div>
      ))}
      <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button>
      <div className="indicators">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`indicator ${
              currentIndex === slideIndex ? "active" : ""
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slide;
