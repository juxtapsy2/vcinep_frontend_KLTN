import React from "react";
import MovieItem from "../MovieItem/MovieItem";

function MovieList({ title, movies }) {
  console.log("MovieList received:", { title, movies });
  return (
    <div className="w-11/12 max-w-[1400px] mx-auto px-2 sm:px-4">
      <div className="flex items-center justify-between py-4 sm:py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-red-500 w-3 h-3 sm:w-4 sm:h-4"></div>
          <h3 className="font-bold text-lg sm:text-xl">{title}</h3>
        </div>
        <a
          className="text-red-600 font-semibold text-sm sm:text-base hover:text-red-700 transition-colors duration-300"
          href="/movies"
        >
          Xem tất cả
        </a>
      </div>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {movies.map((movie) => (
            <MovieItem key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32 bg-gray-900 rounded-lg">
          <p className="text-white text-lg font-semibold">
            Không tìm thấy phim {movies.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default MovieList;
