import React, { useState, useEffect } from "react";
import {
  getAllShowtimes,
  addMultipleShowtimes,
  addMultipleShowtimesByTheater,
  deleteShowtime,
} from "../../api/ShowTimeAPI";
import SingleTheaterModal from "../../components/Admin/ManageShowtime/SingleTheaterModal";
import ShowtimeModal from "../../components/Admin/ManageShowtime/ShowtimeModal";
import { getActiveMovies } from "../../api/MovieAPI";
import { getActiveCinemas, getCinemaAll } from "../../api/CinemaAPI";
import { getTheatersByIdCinemaCustom } from "../../api/TheaterAPI";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import HeaderActions from "../../components/Admin/ManageShowtime/HeaderActions";

function ManageShowtime() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    movieId: "",
    cinemaId: "",
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);
  // New state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    showDate: "",
    showTime: [],
    status: "active",
    price: 20000,
  });
  // Available showtimes
  const availableShowtimes = ["12:20", "13:20", "14:20", "15:20", "16:20"];
  useEffect(() => {
    fetchMovies();
    fetchCinemas();
  }, []);
  useEffect(() => {
    fetchShowtimes();
  }, [currentPage, filters]);
  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const response = await getAllShowtimes({
        page: currentPage,
        limit: 10,
        movieId: filters.movieId || null,
        cinemaId: filters.cinemaId || null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
      });
      setShowtimes(response.data.showtimes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMovies = async () => {
    try {
      const response = await getActiveMovies();
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  const fetchCinemas = async () => {
    try {
      const response = await getActiveCinemas();
      setCinemas(response.data);
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewShowtime({
      movieId: "",
      showDate: "",
      showTime: [],
      status: "active",
      price: 20000,
    });
  };
  const handleShowtimeChange = (e) => {
    const { name, value } = e.target;
    if (name === "showDate") {
      const date = new Date(value);
      const day = date.getDay();
      // Monday to Thursday (1-4)
      const price = day >= 1 && day <= 4 ? 20000 : 30000;
      setNewShowtime((prev) => ({
        ...prev,
        [name]: value,
        price,
      }));
    } else {
      setNewShowtime((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleTimeCheckbox = (time) => {
    setNewShowtime((prev) => {
      const newShowTime = prev.showTime.includes(time)
        ? prev.showTime.filter((t) => t !== time)
        : [...prev.showTime, time];
      return {
        ...prev,
        showTime: newShowTime,
      };
    });
  };
  const handleDelete = async (showtimeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa suất chiếu này không?")) {
      try {
        await deleteShowtime(showtimeId);
        toast.success("Xóa suất chiếu thành công!");
        fetchShowtimes(); // Refresh data
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa suất chiếu!");
        console.error("Error deleting showtime:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addMultipleShowtimes(newShowtime);
      if (response.success) {
        toast.success("Thêm suất chiếu thành công!", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        handleModalClose();
        fetchShowtimes();
      }
    } catch (error) {
      if (error.response?.data?.data?.conflicts) {
        const conflicts = error.response.data.data.conflicts;
        const conflictMessage = (
          <div>
            <p>Không thể thêm suất chiếu do trùng lịch:</p>
            <ul className="mt-2">
              {conflicts.map((conflict, index) => (
                <li key={index} className="text-sm">
                  - {conflict.cinema} ({conflict.theater}): {conflict.movie}
                  <br />
                  Thời gian: {conflict.time} ngày{" "}
                  {format(new Date(conflict.date), "dd/MM/yyyy")}
                </li>
              ))}
            </ul>
          </div>
        );
        toast.error(<div>{conflictMessage}</div>, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Không thể thêm suất chiếu trong quá khứ !", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      console.error("Error adding showtimes:", error);
    }
  };

  const [isSingleTheaterModalOpen, setIsSingleTheaterModalOpen] =
    useState(false);
  const [allCinemas, setAllCinemas] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [singleTheaterShowtime, setSingleTheaterShowtime] = useState({
    movieId: "",
    theaterId: "",
    cinemaId: "",
    showDate: "",
    showTime: [],
    status: "active",
    price: 20000,
  });
  useEffect(() => {
    const fetchAllCinemas = async () => {
      try {
        const response = await getCinemaAll();
        setAllCinemas(response.data);
      } catch (error) {
        console.error("Error fetching all cinemas:", error);
      }
    };
    fetchAllCinemas();
  }, []);

  // Fetch theaters when cinema is selected
  const fetchTheaters = async (cinemaId) => {
    try {
      const response = await getTheatersByIdCinemaCustom(cinemaId);
      setTheaters(response.data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const handleSingleTheaterModalOpen = () => {
    setIsSingleTheaterModalOpen(true);
  };

  const handleSingleTheaterModalClose = () => {
    setIsSingleTheaterModalOpen(false);
    setSingleTheaterShowtime({
      movieId: "",
      theaterId: "",
      cinemaId: "",
      showDate: "",
      showTime: [],
      status: "active",
      price: 20000,
    });
    setTheaters([]);
  };
  const handleSingleTheaterChange = (e) => {
    const { name, value } = e.target;
    if (name === "cinemaId") {
      fetchTheaters(value);
      setSingleTheaterShowtime((prev) => ({
        ...prev,
        cinemaId: value,
        theaterId: "", // Reset theater when cinema changes
      }));
    } else if (name === "showDate") {
      const date = new Date(value);
      const day = date.getDay();
      const price = day >= 1 && day <= 4 ? 20000 : 30000;
      setSingleTheaterShowtime((prev) => ({
        ...prev,
        [name]: value,
        price,
      }));
    } else {
      setSingleTheaterShowtime((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSingleTheaterTimeCheckbox = (time) => {
    setSingleTheaterShowtime((prev) => ({
      ...prev,
      showTime: prev.showTime.includes(time)
        ? prev.showTime.filter((t) => t !== time)
        : [...prev.showTime, time],
    }));
  };
  const handleSingleTheaterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addMultipleShowtimesByTheater(
        singleTheaterShowtime
      );
      if (response.success) {
        toast.success("Thêm suất chiếu thành công!");
        handleSingleTheaterModalClose();
        fetchShowtimes();
      }
    } catch (error) {
      if (error.response?.data?.data?.conflicts) {
        const conflicts = error.response.data.data.conflicts;
        const conflictMessage = (
          <div>
            <p>Không thể thêm suất chiếu do trùng lịch:</p>
            <ul className="mt-2">
              {conflicts.map((conflict, index) => (
                <li key={index} className="text-sm">
                  - {conflict.cinema} ({conflict.theater}): {conflict.movie}
                  <br />
                  Thời gian: {conflict.time} ngày{" "}
                  {format(new Date(conflict.date), "dd/MM/yyyy")}
                </li>
              ))}
            </ul>
          </div>
        );
        toast.error(<div>{conflictMessage}</div>, {
          position: "top-right",
          duration: 5000,
        });
      } else {
        toast.error("Không thể thêm suất chiếu trong quá khứ !");
      }
    }
  };
  return (
    <div className="container mx-auto bg-white">
      {/* Modals */}
      {isSingleTheaterModalOpen && (
        <div className="fixed inset-0 z-50">
          <SingleTheaterModal
            isOpen={isSingleTheaterModalOpen}
            onClose={handleSingleTheaterModalClose}
            onSubmit={handleSingleTheaterSubmit}
            singleTheaterShowtime={singleTheaterShowtime}
            handleChange={handleSingleTheaterChange}
            handleTimeCheckbox={handleSingleTheaterTimeCheckbox}
            movies={movies}
            allCinemas={allCinemas}
            theaters={theaters}
            availableShowtimes={availableShowtimes}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <ShowtimeModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleSubmit}
            newShowtime={newShowtime}
            handleChange={handleShowtimeChange}
            handleTimeCheckbox={handleTimeCheckbox}
            movies={movies}
            availableShowtimes={availableShowtimes}
          />
        </div>
      )}

      {/* Header Action Buttons */}
      <HeaderActions
        handleModalOpen={handleModalOpen}
        handleSingleTheaterModalOpen={handleSingleTheaterModalOpen}
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
        <div className="relative">
          <select
            name="movieId"
            value={filters.movieId}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Tất cả phim</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            name="cinemaId"
            value={filters.cinemaId}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Tất cả rạp</option>
            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Từ ngày"
        />

        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Đến ngày"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Phim
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Rạp
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Phòng
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Ngày chiếu
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Giờ chiếu
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Số ghế
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Giá vé
              </th>
              <th className="px-3 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <div className="flex justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </td>
              </tr>
            ) : (
              showtimes.map((showtime) => (
                <tr key={showtime._id} className="hover:bg-gray-50">
                  <td className="px-5 py-1 whitespace-nowrap">
                    <div
                      className="truncate max-w-[200px]"
                      title={showtime.nameMovie}
                    >
                      {showtime.nameMovie}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="truncate max-w-[200px]"
                      title={showtime.nameCinema}
                    >
                      {showtime.nameCinema}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {showtime.nameTheater}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(showtime.showDate), "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {showtime.showTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {showtime.availableSeats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {showtime.price.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        onClick={() => handleDelete(showtime?.idShowTime)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`
            w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
            ${
              currentPage === page
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }
          `}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ManageShowtime;
