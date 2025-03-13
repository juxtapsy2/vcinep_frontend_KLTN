import SocialShare from "./SocialShare";
import React, { useState, useContext } from "react";
import { useAuth } from "../../../contexts/AuthContext"; // Giả sử path này đúng
import * as RatingAPI from "../../../api/RatingAPI";
import toast, { Toaster } from "react-hot-toast";
import DetailRow from "./DetailRow";
import RatingBadge from "./RatingBadge";

import ClassificationBadge from "./ClassificationBadge ";
function MovieInfo({ movie }) {
  const movieDetails = [
    { label: "Đạo diễn", value: movie.director },
    { label: "Diễn viên", value: movie.actors.join(", ") },
    { label: "Thể loại", value: movie.genre.join(", ") },
    {
      label: "Khởi chiếu",
      value: new Date(movie.startDate).toLocaleDateString(),
    },
    { label: "Thời lượng", value: `${movie.duration} phút` },
    { label: "Ngôn ngữ", value: movie.language },
    { label: "Định dạng", value: movie.format },
  ];

  return (
    <div className="flex-1">
      <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-3 uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-pink-500 to-red-500 animate-text">
        {movie.title}
      </h1>

      <p className="mb-4 text-base text-gray-700 leading-relaxed">
        {movie.description}
      </p>

      <div className="mb-2 flex items-center gap-3">
        <RatingBadge rating={movie.rating} movieId={movie._id} />
      </div>

      <div className="space-y-2.5 mb-4">
        {movieDetails.map((detail, index) => (
          <DetailRow key={index} label={detail.label} value={detail.value} />
        ))}
        <ClassificationBadge classification={movie.classification} />
      </div>

      <SocialShare />
    </div>
  );
}

export default MovieInfo;
