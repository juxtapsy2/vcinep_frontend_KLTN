import React, { useState, useEffect } from "react";
import {
  getAllMoviesAdmin,
  getNowShowingMoviesAdmin,
  getComingSoonMoviesAdmin,
  getEndedMoviesAdmin,
  deleteMovie,
} from "../../api/MovieAPI.js";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ManagerMovies() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const handleAddMovie = () => {
    navigate("add");
  };
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleDeleteClick = (movieId) => {
    setSelectedMovieId(movieId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMovie(selectedMovieId);
      setShowDeleteDialog(false);
      fetchMovies(); // Refresh danh sách phim sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      // Có thể thêm thông báo lỗi ở đây
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedMovieId(null);
  };
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
  });
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 10; // Add this line (you can adjust the number as needed)

  const filterOptions = [
    { value: "all", label: "Tất cả phim" },
    { value: "now-showing", label: "Đang chiếu" },
    { value: "coming-soon", label: "Sắp chiếu" },
    { value: "ended", label: "Đã chiếu" },
  ];
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let response;
      switch (selectedFilter) {
        case "now-showing":
          response = await getNowShowingMoviesAdmin(
            pagination.currentPage,
            ITEMS_PER_PAGE,
            search
          );
          break;
        case "coming-soon":
          response = await getComingSoonMoviesAdmin(
            pagination.currentPage,
            ITEMS_PER_PAGE,
            search
          );
          break;
        case "ended":
          response = await getEndedMoviesAdmin(
            pagination.currentPage,
            ITEMS_PER_PAGE,
            search
          );
          break;
        default:
          response = await getAllMoviesAdmin(
            pagination.currentPage,
            ITEMS_PER_PAGE,
            search
          );
      }

      if (response.success) {
        setMovies(response.data.movies);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalMovies: response.data.totalMovies,
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedFilter, pagination.currentPage, search]);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when search changes
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const displayedMovies = movies;
  return (
    <div className="min-h-screen bg-white">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border rounded bg-white"
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded w-64"
          />
        </div>
        {/* <button
          onClick={handleAddMovie}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Thêm Phim Mới
        </button> */}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-3 text-center w-12">STT</th>
              <th className="px-4 py-3 text-left">Poster</th>
              <th className="px-4 py-3 text-left">Thông tin phim</th>
              <th className="px-4 py-3 text-left">Thể loại</th>
              <th className="px-4 py-3 text-left">Thời lượng</th>
              <th className="px-4 py-3 text-left">Đánh giá</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {displayedMovies.map((movie, index) => (
              <tr key={movie._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-center">
                  {(pagination.currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-4 py-3">
                  <img
                    src={movie.coverImage}
                    alt={movie.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{movie.title}</div>
                  <div className="text-sm text-gray-500">
                    Đạo diễn: {movie.director}
                    <br />
                    Ngôn ngữ: {movie.language}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {movie.duration} phút
                  <br />
                  <span className="text-sm text-gray-500">{movie.format}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-yellow-500">{movie.rating}/10</div>
                  <div className="text-sm text-gray-500">
                    {movie.views.toLocaleString()} lượt xem
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      new Date(movie.startDate) > new Date()
                        ? "bg-blue-100 text-blue-600"
                        : new Date(movie.endDate) < new Date()
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {new Date(movie.startDate) > new Date()
                      ? "Sắp chiếu"
                      : new Date(movie.endDate) < new Date()
                      ? "Đã ngừng chiếu"
                      : "Đang chiếu"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() =>
                        window.open(`/movie/${movie.slug}`, "_blank")
                      }
                      className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    {/* <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(movie._id)}
                      className="p-1.5 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4 py-6 px-4">
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Go to first page</span>«
          </button>

          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Go to previous page</span>‹
          </button>

          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-700">Trang</span>
            <span className="px-3 py-1 rounded-md bg-red-600 text-white">
              {pagination.currentPage}
            </span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-600">{pagination.totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Go to next page</span>›
          </button>

          <button
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Go to last page</span>»
          </button>
        </div>
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium mb-4">Xác nhận xóa phim</h3>
            <p className="mb-6">Bạn có chắc chắn muốn xóa phim này không?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Không
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Có
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
