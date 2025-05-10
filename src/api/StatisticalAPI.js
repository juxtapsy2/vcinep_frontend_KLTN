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

export const getTicketsBetweenDates = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const response = await fetch(`/statistical/ticket/between-dates?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (data.success && data.data && data.data.length) {
      return data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
