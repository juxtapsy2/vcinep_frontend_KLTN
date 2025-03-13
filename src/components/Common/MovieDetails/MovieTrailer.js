import React from "react";
import { FaPlay } from "react-icons/fa";

function MovieTrailer({ trailer }) {
  return (
    <div className="mt-3">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaPlay className="text-red-500" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-500">
          Trailer
        </span>
      </h2>
      <div className="w-full rounded-lg overflow-hidden shadow-lg">
        <div className="relative w-full">
          <div className="aspect-video lg:aspect-[18/7]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.split("v=")[1]}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieTrailer;
