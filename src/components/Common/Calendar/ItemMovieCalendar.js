import React from "react";
import { Clock, Calendar, Tag, Subtitles, Film, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ItemMovieCalendar({ item, onClick }) {
  const navigate = useNavigate();

  const handleBooking = (showtimeId, event) => {
    // Ngăn chặn sự kiện click lan truyền
    event.stopPropagation();
    // Mở tab mới với URL booking
    window.open(`/booking/${showtimeId}`, "_blank");
  };

  const handleMovie = (idMovie, event) => {
    // Mở tab mới với URL movie
    window.open(`/movie/${idMovie}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => handleMovie(item.movie.slug, e)}
      className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 cursor-pointer w-full flex"
    >
      <div className="flex w-full">
        {/* Poster phim */}
        <div className="w-1/3 relative group">
          <img
            src={item.movie.coverImage}
            alt={item.movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="flex items-center text-white gap-1">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              <span className="text-sm font-medium">
                {item.movie.rating}/10
              </span>
            </div>
          </div>
        </div>

        {/* Nội dung phim */}
        <div className="w-2/3 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#EB3E3E]" />
              <span className="font-semibold text-[#EB3E3E] uppercase text-xs tracking-wider">
                {item.movie.genre[0]}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{item.movie.duration} phút</span>
            </div>
          </div>

          {/* Tiêu đề */}
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight flex items-center gap-2">
              {item.movie.title}
              {item.movie.subtitles && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <Subtitles className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">Phụ đề</span>
                </div>
              )}
            </h3>
          </div>

          {/* Thông tin phụ */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Film className="w-4 h-4" />
              <span className="text-sm">
                Phân loại: {item.movie.classification}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Khởi chiếu:{" "}
                {new Date(item.movie.startDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          {/* Lịch chiếu */}
          <div>
            <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EB3E3E]" />
              Lịch chiếu
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.showtimes.map((showtime) => (
                <motion.button
                  onClick={(e) => handleBooking(showtime._id, e)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={showtime._id}
                  className="bg-white border-2 border-[#EB3E3E] text-[#EB3E3E] hover:bg-[#EB3E3E] hover:text-white px-2 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  {showtime.showTime}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ItemMovieCalendar;
