import React from "react";
import CinemaSelectDropdown from "../CinemaSelectDropdown/CinemaSelectDropdown";
import RoleSelectDropdown from "../RoleSelectDropdown/RoleSelectDropdown";

const CreateUserModal = ({ isOpen, onClose, userData, setUserData, onSubmit }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Tạo người dùng mới</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tên người dùng"
            value={userData.username}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={userData.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={userData.phoneNumber || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <input
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò
            </label>
            <RoleSelectDropdown
              value={userData.role || ""}
              onChange={(value) => {
                setUserData((prev) => ({
                  ...prev,
                  role: value,
                  idCinema: value === "Manager" ? prev.idCinema : undefined,
                }));
              }}
            />
          </div>

          {userData.role === "Manager" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rạp quản lý
              </label>
              <CinemaSelectDropdown
                selectedCinemaId={userData.idCinema || ""}
                onChange={(value) =>
                  setUserData((prev) => ({ ...prev, idCinema: value }))
                }
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Huỷ</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Tạo</button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;