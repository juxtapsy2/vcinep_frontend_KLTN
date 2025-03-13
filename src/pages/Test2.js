import React, { useState, useEffect } from "react";
import { getAllCinemasClient, addCinema } from "../../api/CinemaAPI";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaTimes,
  FaPlus,
  FaSearch,
  FaUpload,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ManageCinema() {
  const [cinemas, setCinemas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCinemas: 0,
  });

  const handleCinemaClickEdit = (slug) => {
    navigate(`/admin/cinemas/detail/${slug}`);
  };

  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const response = await getAllCinemasClient(
        pagination.currentPage,
        ITEMS_PER_PAGE,
        search
      );
      if (response.success) {
        setCinemas(response.data.cinemas);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalCinemas: response.data.totalCinemas,
        });
      }
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [pagination.currentPage, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };
  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm rạp..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all outline-none"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors">
            <FaPlus />
            Thêm rạp mới
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-6 py-4 text-center w-12">#</th>
                <th className="px-6 py-4 text-left">Tên rạp</th>
                <th className="px-6 py-4 text-left hidden md:table-cell">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-center">Phòng</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {cinemas.map((cinema, index) => (
                <tr
                  key={cinema._id}
                  className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleCinemaClickEdit(cinema.slug)}
                >
                  <td className="px-6 py-4 text-center text-gray-500">
                    {(pagination.currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={cinema.coverImage || "/default-cinema.png"}
                        alt={cinema.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {cinema.name}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {cinema.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                    {cinema.address}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {cinema.screenCount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        cinema.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cinema.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t">
          <div className="text-sm text-gray-600">
            Hiển thị {cinemas.length} trong tổng số {pagination.totalCinemas}{" "}
            rạp
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleLeft className="w-4 h-4" />
            </button>

            <span className="px-4 py-2 rounded-lg bg-red-600 text-white">
              {pagination.currentPage}
            </span>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaAngleDoubleRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManageCinema;
