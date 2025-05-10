import React from "react";

const CreateUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userData,
  setUserData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Tạo người dùng mới</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Tên người dùng"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Mật khẩu"
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Số điện thoại"
            value={userData.phoneNumber}
            onChange={(e) =>
              setUserData({ ...userData, phoneNumber: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            type="date"
            value={userData.dateOfBirth}
            onChange={(e) =>
              setUserData({ ...userData, dateOfBirth: e.target.value })
            }
          />
          <select
            className="border p-2 rounded"
            value={userData.gender}
            onChange={(e) =>
              setUserData({ ...userData, gender: e.target.value })
            }
          >
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
          <select
            className="border p-2 rounded"
            value={userData.role}
            onChange={(e) =>
              setUserData({ ...userData, role: e.target.value })
            }
          >
            <option value="User">User</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
