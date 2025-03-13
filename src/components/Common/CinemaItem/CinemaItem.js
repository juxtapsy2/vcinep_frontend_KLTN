import React from "react";
import {
  FaInfoCircle,
  FaShareAlt,
  FaMapMarkerAlt,
  FaFilm,
} from "react-icons/fa";

function CinemaItem({ cinema }) {
  return (
    <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-800 rounded-lg  overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        <img
          src={cinema.image}
          alt={cinema.name}
          className="w-full h-48 object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
          <h3
            className="text-white text-xl font-bold text-shadow-lg mb-2 truncate"
            title={cinema.name}
          >
            {cinema.name}
          </h3>
          <div className="flex items-center space-x-2 overflow-hidden">
            <FaMapMarkerAlt className="text-white flex-shrink-0" />
            <span
              className="text-white text-sm truncate"
              title={cinema.location}
            >
              {cinema.location}
            </span>
          </div>
        </div>
        {cinema.imax && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            IMAX
          </div>
        )}
      </div>
      <div className="p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <FaFilm className="text-white flex-shrink-0" />
            <span className="text-white text-sm">
              {cinema.screenCount} Screens
            </span>
          </div>
          <span
            className="text-white text-sm truncate ml-2"
            title={cinema.type}
          >
            {cinema.type}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <button className="bg-white text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition duration-300 flex items-center space-x-2 font-semibold">
            <FaInfoCircle className="flex-shrink-0" />
            <span className="truncate">Chi tiết</span>
          </button>
          <button className="bg-red-800 text-white p-2 rounded-full hover:bg-red-900 transition duration-300 ml-2">
            <FaShareAlt />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CinemaItem;
