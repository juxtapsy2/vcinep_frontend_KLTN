import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaTimes,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { User } from "lucide-react";
import { createUser, deleteUser, getEmployees, reactivateUser, updateUserRole } from "../../api/UserAPI";
import RoleSelectDropdown from "../../components/Admin/RoleSelectDropdown/RoleSelectDropdown";
import CinemaSelectDropdown from "../../components/Admin/CinemaSelectDropdown/CinemaSelectDropdown";
import InfoModal from "../../components/Admin/InfoModal/InfoModal";
import { defaultAvatarUrl, employeeRolesForAdminFilter, statuses } from "../../constants/constants";
import { toast } from "react-hot-toast";
import CreateUserModal from "../../components/Admin/CreateUser/CreateUserModal";
import { useAuth } from "../../contexts/AuthContext";

function ManageEmployee() {
  const { user } = useAuth();
  console.log("User:", user);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingUser, setEditingUser] = useState({ userId: "", role: "", idCinema: "" });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEmployees: 0,
  });
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    gender: "Male",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "Employee",
    idCinema: user?.idCinema || "",
  });
  const ITEMS_PER_PAGE = 10;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(
        pagination.currentPage,
        ITEMS_PER_PAGE,
        search,
        selectedRole,
        selectedStatus
      ) || []; 
      console.log("Employees fetched:", response.data.users);
      if (response.success) {
        setEmployees(response.data.users);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalUsers: response.data.totalUsers,
        });
      }
    } catch (error) {
      toast.error("No users or failed request:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.currentPage, search, selectedRole, selectedStatus]);

  const handleUserClick = (user) => {
    setSelectedEmployee(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const handleUpdateUserRole = async (id, newRole, idCinema = "") => {
    try {
      const response = await updateUserRole(id, newRole, idCinema);
  
      if (response.success) {
        toast.success("Cập nhật vai trò thành công");
        setEditingUser({ userId: "", role: "", idCinema: "" });
        fetchEmployees();
      } else {
        toast.error("Cập nhật thất bại: " + response.message);
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật vai trò");
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
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
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
      toast.error("Lỗi khi thay đổi trạng thái người dùng");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const openCreateUserModal = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreateUser = async () => {
    try {
      if ((newUserData.role === "Manager" || newUserData.role === "Employee") && !newUserData.idCinema) {
        toast.error("Vui lòng chọn rạp.");
        return;
      }
      const response = await createUser(newUserData);
      if (response.success) {
        toast.success("Người dùng đã được tạo!");
        setShowCreateModal(false);
        setNewUserData({
          username: "",
          gender: "Male",
          dateOfBirth: "",
          phoneNumber: "",
          email: "",
          password: "",
          role: "Employee",
          idCinema: "",
        });
        fetchEmployees();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Lỗi khi tạo người dùng");
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
              placeholder="Tìm kiếm nhân viên..."
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
            {employeeRolesForAdminFilter.map((role) => (
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
              {employeeRolesForAdminFilter.find((r) => r.value === selectedRole)?.label}
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
          {/* Button create new employee */}
          <div className="flex flex-row justify-between my-4">
            <div />
            <button 
              onClick={openCreateUserModal}
              className="flex flex-row py-2 px-4 bg-red-600 text-white rounded-lg">
                <User className="w-5 h-5 mr-2" />
                Thêm nhân viên
            </button>
          </div> 

        {/* Employees Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-6 py-4 text-center w-12">#</th>
                  <th className="px-6 py-4 text-left">Thông tin người dùng</th>
                  <th className="px-6 py-4 text-left hidden md:table-cell">Email</th>
                  <th className="px-6 py-4 text-left">Vai trò</th>
                  <th className="px-6 py-4 text-left">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-center text-gray-500">
                      {(pagination.currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td
                      className="px-2 py-4 cursor-pointer max-w-[150px]"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar || defaultAvatarUrl}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover border-none shadow-md"
                        />
                        <div>
                          <div className="font-medium text-gray-800 truncate">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500 truncate md:hidden">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-2 py-4 hidden md:table-cell text-gray-600 text-left cursor-pointer max-w-[180px] truncate"
                      onClick={() => handleUserClick(user)}
                    >
                      {user.email}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-row min-w-[100px] justify-start gap-4 relative z-10">
                        <RoleSelectDropdown
                          value={editingUser.userId === user._id ? editingUser.role : user.role}
                          onChange={(newRole) =>
                            setEditingUser({
                              userId: user._id,
                              role: newRole,
                              idCinema: newRole === "Manager" ? user.idCinema || "" : "",
                            })
                          }
                          disabled
                        />
                        {(user.role === "Manager" || user.role == "Employee") && (
                          <CinemaSelectDropdown
                            selectedCinemaId={user?.idCinema}
                            onChange={(newCinemaId) => handleUpdateUserRole(user?._id, user?.role, newCinemaId)}
                            disabled
                          />
                        )}

                        {/* Show Save button only when role is being edited */}
                        {editingUser.userId === user._id && (
                          <button
                            onClick={() =>
                              handleUpdateUserRole(user._id, editingUser.role, editingUser.idCinema)
                            }
                            className="ml-2 my-auto text-xs text-white font-semibold bg-blue-800 hover:bg-blue-600 px-3 py-1 rounded-full"
                          >
                            Lưu
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleUserStatus(user);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === "active"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          title={user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
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
                disableOptions
              />
            </div>
            )
          }
          {showModal && selectedEmployee && (
            <InfoModal
              show={showModal}
              onClose={handleCloseModal}
              title="Chi tiết người dùng"
              image={{
                url: selectedEmployee.avatar || defaultAvatarUrl,
                title: selectedEmployee.username,
              }}
              status={selectedEmployee.status}
              fields={[
                { label: "ID", value: selectedEmployee._id },
                { label: "Email", value: selectedEmployee.email },
                { label: "Số điện thoại", value: selectedEmployee.phoneNumber },
                { label: "Giới tính", value: selectedEmployee.gender },
                { label: "Ngày sinh", value: formatDate(selectedEmployee.dateOfBirth) },
                { label: "Vai trò", value: selectedEmployee.role },
                { label: "Ngày đăng ký", value: formatDate(selectedEmployee.registrationDate) },
                { label: "Cập nhật lần cuối", value: formatDate(selectedEmployee.updatedAt) },
              ]}
            />
          )}
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
            <div className="text-sm text-gray-600">
              Hiển thị {employees.length} trong tổng số {pagination.totalUsers} người
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
    </div>
  );
}

export default ManageEmployee;
