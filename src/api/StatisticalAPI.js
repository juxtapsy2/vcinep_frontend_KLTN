import api from "../config/api.js";
export const getStatisticalTickets = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }
    const res = await api.get("/statistical/ticket", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê vé:", error);
    throw error;
  }
};
export const getStatisticalUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }
    const res = await api.get("/statistical/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê vé:", error);
    throw error;
  }
};
export const getStatisticalMovie = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }
    const res = await api.get("/statistical/movie-revenue", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê vé:", error);
    throw error;
  }
};
// Hàm lấy thống kê vé theo rạp
export const getCinemaTickets = async (cinemaId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const res = await api.get(`/statistical/${cinemaId}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê vé theo rạp:", error);
    throw error;
  }
};

// Hàm lấy thống kê người dùng theo rạp
export const getCinemaUsers = async (cinemaId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const res = await api.get(`/statistical/${cinemaId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê người dùng theo rạp:", error);
    throw error;
  }
};

// Hàm lấy thống kê doanh thu phim theo rạp
export const getCinemaMovieRevenue = async (cinemaId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const res = await api.get(`/statistical/${cinemaId}/movie-revenue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy dữ liệu thống kê doanh thu phim theo rạp:",
      error
    );
    throw error;
  }
};
