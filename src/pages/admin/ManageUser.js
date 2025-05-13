import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser, reactivateUser, createUser, updateUserRole } from "../../api/UserAPI"; // Thêm reactivateUser
import {
  FaSearch,
  FaEdit,
  FaUserSlash,
  FaUserCheck,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { User } from "lucide-react";
import CreateUserModal from "../../components/Admin/CreateUser/CreateUserModal";
import CinemaSelectDropdown from "../../components/Admin/CinemaSlugsDropdown/CinemaSlugsDropdown";
import { getCinemaById } from "../../api/CinemaAPI";
function ManageUser() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState({ userId: "", role: "", idCinema: "" });
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [cinemaManaging, setCinemaManaging] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    gender: "Male",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "User",
    idCinema: "",
  });
  const defaultAvatarUrl = "/resources/defaultAvatar.png";
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  const roles = [
    { value: "", label: "Tất cả vai trò" },
    { value: "User", label: "Người dùng (User)" },
    { value: "Manager", label: "Quản lý rạp (Manager)" },
    { value: "Admin", label: "Quản trị viên (Admin)" },
  ];

  const statuses = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Bị khóa" },
  ];

  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 10; // Số user mỗi trang

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers(
        pagination.currentPage,
        ITEMS_PER_PAGE,
        search,
        selectedRole,
        selectedStatus
      );
      if (response.success) {
        setUsers(response.data.users);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalUsers: response.data.totalUsers,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, search, selectedRole, selectedStatus]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleToggleUserStatus = async (user) => {
    try {
      if (user.status === "active") {
        await deleteUser(user._id);
        console.log(`Người dùng ${user.username} đã bị hủy kích hoạt.`);
        toast.success(`Người dùng ${user.username} đã bị hủy kích hoạt.`);
      } else {
        await reactivateUser(user._id);
        console.log(`Người dùng ${user.username} đã được kích hoạt.`);
        toast.success(`Người dùng ${user.username} đã được kích hoạt.`);
      }
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
      toast.error("Lỗi khi thay đổi trạng thái người dùng");
    }
  };
  
  const openCreateUserModal = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreateUser = async () => {
    try {
      const response = await createUser(newUserData);
      if (response.success) {
        toast.success("Người dùng mới đã được tạo!");
        setShowCreateModal(false);
        setNewUserData({
          username: "",
          gender: "Male",
          dateOfBirth: "",
          phoneNumber: "",
          email: "",
          password: "",
          role: "User",
          idCinema: "",
        });
        fetchUsers();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Lỗi khi tạo người dùng");
    }
  };
  
  const handleUpdateUserRole = async (id, newRole, idCinema = "") => {
    try {
      const response = await updateUserRole(id, newRole, idCinema);
  
      if (response.success) {
        toast.success("Cập nhật vai trò thành công");
        setEditingUser({ userId: "", role: "", idCinema: "" });
        fetchUsers();
      } else {
        toast.error("Cập nhật thất bại: " + response.message);
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật vai trò");
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };
  // For Managers
  const loadCinemaManaging = async (cinemaId) => {
    if (!cinemaId || cinemaManaging[cinemaId]) return;
    try {
      const response = await getCinemaById(cinemaId);
      if (response.success) {
        setCinemaManaging((prev) => ({
          ...prev,
          [cinemaId]: response.data.name,
        }));
      }
    } catch (err) {
      console.error("Failed to load cinema slug", err);
    }
  };  

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 outline-none"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white rounded-lg shadow-sm p-2 outline-none border-none"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white rounded-lg shadow-sm p-2 outline-none border-none"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          {selectedRole && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {roles.find((r) => r.value === selectedRole)?.label}
              <button
                onClick={() => setSelectedRole("")}
                className="hover:text-blue-600"
              >
                <FaTimes />
              </button>
            </div>
          )}
          {selectedStatus && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {statuses.find((s) => s.value === selectedStatus)?.label}
              <button
                onClick={() => setSelectedStatus("")}
                className="hover:text-green-600"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Button create new user */}
      <div className="flex flex-row justify-between my-4">
        <div />
        <button 
        onClick={openCreateUserModal}
        className="flex flex-row py-2 px-4 bg-green-600 text-white rounded-lg">
          <User className="w-5 h-5 mr-2" />
          Thêm người dùng
      </button>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-4 text-center w-12">#</th>
                <th className="px-6 py-4 text-left">Thông tin người dùng</th>
                <th className="px-6 py-4 text-left hidden md:table-cell">
                  Email
                </th>
                <th className="px-6 py-4 text-left">Vai trò</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-center text-gray-500">
                    {(pagination.currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar || defaultAvatarUrl}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-none shadow-md"
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 hidden md:table-cell text-gray-600 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={editingUser.userId === user._id ? editingUser.role : user.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setEditingUser({
                          userId: user._id,
                          role: newRole,
                          idCinema: newRole === "Manager" ? user.idCinema || "" : "",
                        });
                      }}
                      className="bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-sm text-center"
                    >
                      <option value="User">Người dùng</option>
                      <option value="Employee">Nhân viên</option>
                      <option value="Manager">Quản lý rạp</option>
                      <option value="Admin">Quản trị viên</option>
                    </select>
                    {user.role === "Manager" && user.idCinema && (
                      <div className="text-xs text-blue-800 mt-2 bg-none font-semibold text-center">
                        {cinemaManaging[user.idCinema] || "Đang tải..."}
                        {loadCinemaManaging(user.idCinema).data?.name}
                      </div>
                    )}

                    {editingUser.userId === user._id && editingUser.role === "Manager" && (
                      <div className="mt-2">
                        <CinemaSelectDropdown
                          selectedCinemaId={editingUser.idCinema}
                          onChange={(id) =>
                            setEditingUser((prev) => ({ ...prev, idCinema: id }))
                          }
                        />
                      </div>
                    )}

                    {/* Show Save button only when role is being edited */}
                    {editingUser.userId === user._id && (
                      <button
                        onClick={() =>
                          handleUpdateUserRole(user._id, editingUser.role, editingUser.idCinema)
                        }
                        className="mt-2 ml-2 text-xs text-white bg-blue-800 hover:bg-blue-600 px-3 py-1 rounded"
                      >
                        Lưu
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4" >
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện lan truyền
                          handleToggleUserStatus(user);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === "active"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                        title={
                          user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"
                        }
                      >
                        {user.status === "active" ? (
                          <FaUserSlash className="w-4 h-4" />
                        ) : (
                          <FaUserCheck className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <CreateUserModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleSubmitCreateUser}
              userData={newUserData}
              setUserData={setNewUserData}
            />
          </div>
          )
        }

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi tiết người dùng
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
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedUser.avatar || defaultAvatarUrl}
                      alt={selectedUser.username}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedUser.username}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedUser.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {selectedUser.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600">ID:</p>
                    <p className="font-medium">{selectedUser._id}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Số điện thoại:</p>
                    <p className="font-medium">{selectedUser.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div>
                    <p className="text-gray-600">Giới tính:</p>
                    <p className="font-medium">{selectedUser.gender}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Ngày sinh:</p>
                    <p className="font-medium">
                      {formatDate(selectedUser.dateOfBirth)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Vai trò:</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Ngày đăng ký:</p>
                    <p className="font-medium">
                      {formatDate(selectedUser.registrationDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Cập nhật lần cuối:</p>
                    <p className="font-medium">
                      {formatDate(selectedUser.updatedAt)}
                    </p>
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
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
          <div className="text-sm text-gray-600">
            Hiển thị {users.length} trong tổng số {pagination.totalUsers} người
            dùng
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

export default ManageUser;
