const SingleTheaterModal = ({
  isOpen,
  onClose,
  onSubmit,
  singleTheaterShowtime,
  handleChange,
  handleTimeCheckbox,
  movies,
  allCinemas,
  theaters,
  availableShowtimes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Thêm suất chiếu cho một rạp
          </h2>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn phim
              </label>
              <select
                name="movieId"
                value={singleTheaterShowtime.movieId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Chọn phim</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn rạp
              </label>
              <select
                name="cinemaId"
                value={singleTheaterShowtime.cinemaId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Chọn rạp</option>
                {allCinemas.map((cinema) => (
                  <option key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn phòng
              </label>
              <select
                name="theaterId"
                value={singleTheaterShowtime.theaterId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Chọn phòng</option>
                {theaters.map((theater) => (
                  <option key={theater._id} value={theater._id}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày chiếu
              </label>
              <input
                type="date"
                name="showDate"
                value={singleTheaterShowtime.showDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ chiếu
            </label>
            <div className="grid grid-cols-4 gap-3">
              {availableShowtimes.map((time) => (
                <label
                  key={time}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={singleTheaterShowtime.showTime.includes(time)}
                    onChange={() => handleTimeCheckbox(time)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">{time}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleTheaterModal;
