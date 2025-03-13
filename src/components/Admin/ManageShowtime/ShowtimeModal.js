const ShowtimeModal = ({
  isOpen,
  onClose,
  onSubmit,
  newShowtime,
  handleChange,
  handleTimeCheckbox,
  movies,
  availableShowtimes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Thêm suất chiếu
          </h2>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn phim
              </label>
              <select
                name="movieId"
                value={newShowtime.movieId}
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
                Ngày chiếu
              </label>
              <input
                type="date"
                name="showDate"
                value={newShowtime.showDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ chiếu
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableShowtimes.map((time) => (
                  <label
                    key={time}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newShowtime.showTime.includes(time)}
                      onChange={() => handleTimeCheckbox(time)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-gray-700">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá vé
              </label>
              <input
                type="text"
                value={`${newShowtime.price.toLocaleString()}đ`}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
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
export default ShowtimeModal;
