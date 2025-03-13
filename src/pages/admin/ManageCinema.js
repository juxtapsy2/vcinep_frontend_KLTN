import React, { useState, useEffect } from "react";
import {
  getAllCinemasClient,
  addCinema,
  deleteCinemaById,
} from "../../api/CinemaAPI";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaTimes,
  FaPlus,
  FaSearch,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ManageCinema() {
  const [cinemas, setCinemas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cinemaToDelete, setCinemaToDelete] = useState(null);

  const handleDeleteClick = (e, cinema) => {
    e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên tr
    setCinemaToDelete(cinema);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCinemaById(cinemaToDelete._id);
      toast.success("Xóa rạp thành công!");
      setShowDeleteModal(false);
      fetchCinemas(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi xóa rạp!");
    }
  };

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCinemas: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCinema, setNewCinema] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    screenCount: "",
    ticketPrices: "",
    pricingPolicy: "",
    coverImage: "",
    status: "active",
  });

  const handleAddNewCinema = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewCinema({
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      screenCount: "",
      ticketPrices: "",
      pricingPolicy: "",
      coverImage: "",
      status: "active",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCinema((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vcinep");

    try {
      setUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhs93uix6/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setNewCinema((prev) => ({
        ...prev,
        coverImage: data.secure_url,
      }));
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Lỗi khi tải ảnh lên!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCinema(newCinema);
      toast.success("Thêm rạp mới thành công!");
      handleCloseAddModal();
      fetchCinemas();
    } catch (error) {
      toast.error(error.message || "Lỗi khi thêm rạp mới!");
    }
  };

  const handleCinemaClickEdit = (slug) => {
    navigate(`/admin/cinemas/detail/${slug}`);
  };

  // const handleAddNewCinema = () => {
  //   navigate("/admin/cinemas/add");
  // };

  const handleCinemaClick = (cinema) => {
    setSelectedCinema(cinema);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCinema(null);
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
          <button
            onClick={handleAddNewCinema}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
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
                <th className="px-6 py-4 text-center">Thao tác</th>
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
                    <button
                      onClick={(e) => handleDeleteClick(e, cinema)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <FaTrash className="inline-block mr-2" />
                      Xóa rạp
                    </button>
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa rạp "{cinemaToDelete?.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {showModal && selectedCinema && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Chi tiết rạp chiếu phim
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <div>
                  <p className="text-gray-600">ID:</p>
                  <p className="font-medium">{selectedCinema._id}</p>
                </div>

                <div>
                  <p className="text-gray-600">Tên rạp:</p>
                  <p className="font-medium">{selectedCinema.name}</p>
                </div>

                <div>
                  <p className="text-gray-600">Địa chỉ:</p>
                  <p className="font-medium">{selectedCinema.address}</p>
                </div>

                <div>
                  <p className="text-gray-600">Số điện thoại:</p>
                  <p className="font-medium">{selectedCinema.phoneNumber}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{selectedCinema.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Thêm rạp mới</h2>
              <button
                onClick={handleCloseAddModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tên rạp</label>
                  <input
                    type="text"
                    name="name"
                    value={newCinema.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={newCinema.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newCinema.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCinema.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Ảnh bìa</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="coverImage"
                    />
                    <label
                      htmlFor="coverImage"
                      className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 flex items-center gap-2"
                    >
                      <FaUpload />
                      {uploading ? "Đang tải lên..." : "Chọn ảnh"}
                    </label>
                    {newCinema.coverImage && (
                      <img
                        src={newCinema.coverImage}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={uploading}
                >
                  Thêm rạp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageCinema;
