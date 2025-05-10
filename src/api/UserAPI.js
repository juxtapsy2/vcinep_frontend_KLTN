import api from "../config/api.js";

export const getUserById = async (userId, token) => {
  try {
    const res = await api.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
};
export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.patch(
      "/user/avatar",
      {
        userId: userId,
        avatar: avatarUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật avatar:", error);
    throw error;
  }
};
export const getAllUsers = async (
  page = 1,
  limit = 10,
  username = "",
  role = "",
  status = ""
) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.post(
      "/user/list",
      { page, limit, username, role, status }, // Gửi thêm role và status
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    return res.data; // Trả về kết quả từ API
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    throw error; // Ném lỗi ra ngoài để xử lý
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.put(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa user:", error);
    throw error;
  }
};
export const reactivateUser = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.patch(
      `/user/${userId}/reactivate`, // Endpoint API kích hoạt tài khoản
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực
        },
      }
    );

    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi kích hoạt lại tài khoản:", error);
    throw error; // Ném lỗi để xử lý bên ngoài (nếu cần)
  }
};
export const updateUserInfo = async (updates) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.patch(
      `/user/info`, // Endpoint API cập nhật thông tin cá nhân
      updates, // Dữ liệu cần cập nhật
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực
        },
      }
    );

    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
    throw error; // Ném lỗi để xử lý bên ngoài (nếu cần)
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post("/user/new", userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
}

export const updateUserRole = async (id, newRole) => {
  try {
    const response = await api.put(`/role/${id}`, { role: newRole });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, message: "Network error" };
  }
}