import api from "../config/api.js";
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
export const checkOTP = async (data) => {
  const res = await api.post("/auth/checkOTP", data);
  return res.data;
};
export const resetPassword = async (data) => {
  const res = await api.post("/auth/forget", data);
  return res.data;
};
export const changePassword = async (data) => {
  try {
    // Lấy userId từ token trong localStorage
    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    const userId = decodedToken.userId;
    // Tạo object data gửi lên server
    const requestData = {
      userId: userId,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    const res = await api.post("/auth/change-password", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Có lỗi xảy ra khi đổi mật khẩu",
      }
    );
  }
};
// export const checkOTP = async (data) => {
//   const token = localStorage.getItem("accessToken");
//   const res = await api.post("/auth/checkOTP", data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.data;
// };
