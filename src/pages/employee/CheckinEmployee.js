import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllShowtimes } from "../../api/ShowTimeAPI";
import {
  getActiveCinemas,
  getCinemaAll,
  getCinemaById,
} from "../../api/CinemaAPI";
import { useAuth } from "../../contexts/AuthContext.js";
import { getActiveMovies } from "../../api/MovieAPI";
import { format } from "date-fns";
function CheckinEmployee() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    movieId: "",
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [allCinemas, setAllCinemas] = useState(null);
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
        cinemaId: user?.idCinema, // Fixed cinema ID from user context
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

  useEffect(() => {
    const fetchAllCinemas = async () => {
      try {
        const response = await getCinemaById(user?.idCinema);
        setAllCinemas(response.data);
      } catch (error) {
        console.error("Error fetching all cinemas:", error);
      }
    };
    fetchAllCinemas();
  }, []);

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
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
      <div className="overflow-x-auto bg-white rounded-xl ">
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
                <tr key={showtime.idShowTime} className="hover:bg-gray-50">
                  <td className="px-4 py-1 whitespace-nowrap">
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
                        onClick={() => {
                          navigate(`/employee/checkin/${showtime.idShowTime}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
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

export default CheckinEmployee;
