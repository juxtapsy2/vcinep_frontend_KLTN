import React, { useState, useCallback, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

function MovieItem({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();
  const handleNavigateToDetails = () => {
    navigate(`/movie/${movie.slug}`);
  };
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(movie.trailer);

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowTrailer(false);
    }
  }, []);

  useEffect(() => {
    if (showTrailer) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTrailer, handleClickOutside]);

  const truncateTitle = (title, maxLength = 32) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg w-full aspect-[2/3]">
      <div className="absolute inset-0">
        <img
          src={movie.coverImage}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />

        <div className="absolute top-2 right-2 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-lg blur-[1px]"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-red-400 shadow-lg">
              {movie.classification}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="bg-white bg-opacity-30 text-white w-10 h-10 md:w-14 md:h-14 rounded-full hover:bg-opacity-50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group mb-2 md:mb-3"
            onClick={() => setShowTrailer(true)}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-red-500 transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>

          <button
            onClick={handleNavigateToDetails}
            className="bg-red-600 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-wide hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              ></path>
            </svg>
            Mua vé
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 flex flex-col justify-end">
          <h3 className="font-bold text-sm md:text-base mb-0.5 md:mb-1 text-white drop-shadow-lg line-clamp-2">
            {truncateTitle(movie.title)}
          </h3>
          <div className="flex items-center mb-0.5 md:mb-1">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-white font-semibold text-xs md:text-sm">
                {movie.rating}
              </span>
            </div>
          </div>
          <div className="flex items-center text-[10px] md:text-xs text-gray-300 mb-0.5 md:mb-1">
            <svg
              className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              ></path>
            </svg>
            <span className="truncate">{movie.genre.join(", ")}</span>
          </div>
          <div className="flex items-center text-[10px] md:text-xs text-gray-300">
            <svg
              className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{movie.duration} phút</span>
          </div>
        </div>
      </div>

      {showTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="w-full max-w-4xl h-[80vh] max-h-[600px]"
          >
            <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieItem;
