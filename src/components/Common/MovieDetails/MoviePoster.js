import React from "react";

function MoviePoster({ coverImage, title }) {
  return (
    <div className="lg:w-1/4 w-full max-w-[280px] mx-auto lg:mx-0">
      <div className="relative group">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-auto rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

export default MoviePoster;
