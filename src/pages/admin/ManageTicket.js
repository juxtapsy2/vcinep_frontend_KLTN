import React, { useState, useEffect } from "react";
import { getAllTickets } from "../../api/TicketAPI";
import { getActiveMovies } from "../../api/MovieAPI"; // Import API lấy phim và rạp
import { getActiveCinemas } from "../../api/CinemaAPI"; // Import API lấy phim và rạp
import {
  FaSearch,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaTimes,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaQrcode,
  FaCoffee,
  FaCalendar,
  FaFilter,
  FaAngleDown,
} from "react-icons/fa";
import { DatePicker } from "antd";
import toast from "react-hot-toast";
import dayjs from "dayjs";
function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    code: "",
    movieId: "",
    cinemaId: "",
    showDate: null,
  });
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchMovies();
    fetchCinemas();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [pagination.currentPage, filters]);

  const fetchMovies = async () => {
    try {
      const response = await getActiveMovies();
      if (response.success) setMovies(response.data);
    } catch (error) {
      toast.error("Không thể lấy danh sách phim");
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await getActiveCinemas();
      if (response.success) setCinemas(response.data);
    } catch (error) {
      toast.error("Không thể lấy danh sách rạp");
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getAllTickets(
        pagination.currentPage,
        ITEMS_PER_PAGE,
        filters
      );
      if (response.success) {
        setTickets(response.data.tickets);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalTickets: response.data.totalTickets,
        });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải danh sách vé");
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (field, value) => {
    if (field === "showDate" && value) {
      // Tạo ngày với múi giờ local
      const localDate = dayjs(value).format("YYYY-MM-DD");
      setFilters((prev) => ({ ...prev, [field]: localDate }));
    } else {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      code: "",
      movieId: "",
      cinemaId: "",
      showDate: null, // Đặt lại showDate thành null
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl mb-3">
        <div className="space-y-4">
          {/* Header title and clear filter button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white hover:bg-red-500 rounded-lg transition-all duration-300 border border-gray-200 hover:border-red-500 shadow-sm hover:shadow-md group"
            >
              <FaTimes className="text-xs transition-transform duration-300 group-hover:rotate-180" />
              Xóa bộ lọc
            </button>
          </div>

          {/* Filter grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm mã vé..."
                value={filters.code}
                onChange={(e) => handleFilterChange("code", e.target.value)}
                className="block w-full pl-8 pr-2.5 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 
            focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300
            hover:border-red-200 bg-white shadow-sm hover:shadow-md"
              />
            </div>

            {/* Selects and DatePicker with similar compact styling */}
            <div className="relative group">
              <select
                value={filters.movieId}
                onChange={(e) => handleFilterChange("movieId", e.target.value)}
                className="block w-full pl-2.5 pr-8 py-2 border border-gray-200 rounded-lg text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300
            hover:border-red-200 appearance-none bg-white shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="">Tất cả phim</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <FaAngleDown className="h-3 w-3 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Similar compact styling for Cinema Select */}
            <div className="relative group">
              <select
                value={filters.cinemaId}
                onChange={(e) => handleFilterChange("cinemaId", e.target.value)}
                className="block w-full pl-2.5 pr-8 py-2 border border-gray-200 rounded-lg text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300
            hover:border-red-200 appearance-none bg-white shadow-sm hover:shadow-md cursor-pointer"
              >
                <option value="">Tất cả rạp</option>
                {cinemas.map((cinema) => (
                  <option key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <FaAngleDown className="h-3 w-3 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
              </div>
            </div>

            {/* DatePicker with compact styling */}
            <div className="relative group">
              <DatePicker
                value={filters.showDate ? dayjs(filters.showDate) : null}
                onChange={(date) =>
                  handleFilterChange(
                    "showDate",
                    date ? date.format("YYYY-MM-DD") : null
                  )
                }
                format="DD/MM/YYYY"
                placeholder="Chọn ngày chiếu"
                className="block w-full py-2 border border-gray-200 rounded-lg text-sm
            focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300
            hover:border-red-200 bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl  overflow-hidden ">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-3 text-center w-10 font-medium text-sm">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-sm">
                    Thông tin phim
                  </th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell font-medium text-sm">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell font-medium text-sm">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-sm">
                    Thông tin vé
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket.codeTicket}
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200
                ${ticket.isCancelled ? "bg-red-50 hover:bg-red-100" : ""}`}
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <td className="px-3 py-2 text-center text-gray-500 text-sm">
                      {(pagination.currentPage - 1) * ITEMS_PER_PAGE +
                        index +
                        1}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={ticket.coverImageMovie}
                            alt={ticket.movieTitle}
                            className={`w-16 h-24 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-200
                        ${ticket.isCancelled ? "opacity-70" : ""}`}
                          />
                          {ticket.isCancelled && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold transform rotate-12">
                              Đã hủy
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <h3
                            className={`font-medium text-base line-clamp-2 ${
                              ticket.isCancelled
                                ? "text-red-600"
                                : "text-gray-800"
                            }`}
                          >
                            {ticket.movieTitle}
                          </h3>
                          <div className="flex items-center text-xs text-gray-600">
                            <svg
                              className={`w-3.5 h-3.5 mr-1 ${
                                ticket.isCancelled
                                  ? "text-red-400"
                                  : "text-red-500"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {ticket.nameCinema}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.nameTheater}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-medium ${
                            ticket.isCancelled
                              ? "text-red-600"
                              : "text-gray-800"
                          }`}
                        >
                          {formatDate(ticket.showDate)}
                        </span>
                        <span
                          className={`font-medium ${
                            ticket.isCancelled ? "text-red-400" : "text-red-600"
                          }`}
                        >
                          {ticket.showTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`font-medium ${
                          ticket.isCancelled ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {ticket.username}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="font-medium">
                          Mã vé:{" "}
                          <span
                            className={
                              ticket.isCancelled
                                ? "text-red-600 line-through"
                                : "text-red-600"
                            }
                          >
                            {ticket.codeTicket}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          Giá:{" "}
                          <span
                            className={`font-medium ${
                              ticket.isCancelled
                                ? "text-red-600 line-through"
                                : "text-green-600"
                            }`}
                          >
                            {ticket.totalPrice.toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className={`px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                          ticket.isCancelled
                            ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:from-gray-500 hover:to-gray-700"
                            : "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTicketClick(ticket);
                        }}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Hiển thị {tickets.length} trong tổng số {pagination.totalTickets} vé
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleDoubleLeft className="text-gray-600" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleLeft className="text-gray-600" />
            </button>
            <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg font-medium">
              {pagination.currentPage}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleRight className="text-gray-600" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleDoubleRight className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      {/* Modal chi tiết vé Khong anh huong den phan nayf*/}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
            >
              <FaTimes className="text-gray-600" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Section */}
              <div className="bg-red-600 text-white p-6 md:p-8 w-full md:w-2/3">
                <div className="mb-6">
                  <h1 className="text-xl md:text-2xl font-bold mb-2 break-words">
                    {selectedTicket.movieTitle}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm">
                    <FaClock />
                    <span>
                      {formatDate(selectedTicket.showDate)} -{" "}
                      {selectedTicket.showTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm opacity-75">Rạp chiếu</p>
                      <p className="font-semibold truncate">
                        {selectedTicket.nameCinema}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaTicketAlt className="text-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm opacity-75">Vị trí ghế</p>
                      <p className="font-semibold">
                        Ghế {selectedTicket.seatTicket} - Phòng{" "}
                        {selectedTicket.nameTheater}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCoffee className="text-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm opacity-75">Vị trí ghế</p>
                      <p className="font-semibold">
                        Đồ uống {selectedTicket.concessionTicket}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-red-400">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="text-sm opacity-75">Mã vé</p>
                      <p className="text-xl md:text-2xl font-mono font-bold">
                        #{selectedTicket.codeTicket}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm opacity-75">Tổng tiền</p>
                      <p className="text-xl md:text-2xl font-bold">
                        {selectedTicket.totalPrice.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="bg-white p-6 md:p-8 w-full md:w-1/3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Thông tin khách hàng
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-red-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Họ tên</p>
                        <p className="text-gray-800 font-medium truncate">
                          {selectedTicket.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-red-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium truncate">
                          {selectedTicket.emailUser}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-red-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="text-gray-800 font-medium truncate">
                          {selectedTicket.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageTickets;
