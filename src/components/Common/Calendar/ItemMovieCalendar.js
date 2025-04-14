import React from "react";

function ItemMovieCalendar({ item, onClick }) {
  return (
    <div
      key={item.movie._id}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer  w-full  flex flex-row "
    >
      <div className="flex">
        {/* Poster phim - góc trái */}
        <div className="w-1/3">
          <img
            src={item.movie.coverImage}
            alt={item.movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Nội dung phim - góc phải */}
        <div className="w-2/3 p-3">
          {/* Header với thể loại và thời lượng */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[#EB514F] uppercase text-xs">
              {item.movie.genre[0]} {/* Chỉ hiển thị 1 thể loại chính */}
            </span>
            <span className="text-gray-600 text-xs">
              {item.movie.duration} phút
            </span>
          </div>

          {/* Tiêu đề phim */}
          <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight">
            {item.movie.title}
            {item.movie.subtitles && (
              <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-1 py-0.5 rounded">
                Phụ đề
              </span>
            )}
          </h3>

          {/* Thông tin phụ */}
          <div className="text-xs text-gray-600 mb-2">
            <p>Phân loại: {item.movie.classification}</p>
            <p>
              Khởi chiếu:{" "}
              {new Date(item.movie.startDate).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {/* Lịch chiếu */}
          <div className="mt-2">
            <h4 className="font-medium text-gray-700 text-sm mb-1">
              Lịch chiếu
            </h4>
            <div className="flex flex-wrap gap-1">
              {item.showtimes.map((showtime) => (
                <button
                  key={showtime._id}
                  className="bg-white border border-[#EB514F] text-[#EB514F] hover:bg-[#EB514F] hover:text-white px-2 py-1 rounded text-xs font-medium transition-all duration-200"
                >
                  {showtime.showTime}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemMovieCalendar;
