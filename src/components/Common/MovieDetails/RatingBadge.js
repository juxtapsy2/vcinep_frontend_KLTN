import React, { useState } from "react";
import RatingModal from "./RatingModal";
import { useAuth } from "../.../../../../contexts/AuthContext";
import * as RatingAPI from "../../../api/RatingAPI";
import toast from "react-hot-toast";

function RatingBadge({ rating, movieId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);
  const { user } = useAuth();

  const handleRatingSubmit = async (score) => {
    try {
      await RatingAPI.addNewRating(movieId, user._id, score);
      const ratingNew = await RatingAPI.getMovieRatingById(movieId);
      setCurrentRating(ratingNew.data.movie.rating);
      setIsModalOpen(false);
      toast.success("Cảm ơn bạn đã đánh giá phim này!");
    } catch (error) {
      toast.error("Lỗi khi đánh giá phim!");
      console.error(error);
    }
  };

  const handleClickBadge = async () => {
    try {
      if (user._id) {
        const response = await RatingAPI.checkUserRatedMovie(movieId, user._id);
        if (response.success) {
          toast.error("Bạn đã đánh giá phim này rồi!");
        } else {
          setIsModalOpen(true);
        }
      } else {
        toast.error("Vui lòng đăng nhập để đánh giá !");
      }
    } catch (error) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={handleClickBadge}>
        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-black font-bold px-4 py-1.5 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-700 transform group-hover:rotate-180 transition-transform duration-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-lg">{currentRating}</span>
          <span className="text-sm font-normal text-yellow-800">/10</span>
        </div>
      </div>
      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        currentRating={0}
      />
    </>
  );
}

export default RatingBadge;
