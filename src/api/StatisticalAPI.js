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

    // Fetch all tickets from the backend
    const response = await fetch(`/statistical/ticket`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,  // Include token in the request header
      },
    });

    const data = await response.json();
    console.log("API Response:", data); // Log the response for debugging

    if (data.success && data.data && data.data.length) {
      // Filter tickets based on the selected date range
      const filteredTickets = data.data.filter((ticket) => {
        const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        return ticketDate >= startDate && ticketDate <= endDate;
      });

      // Return the filtered tickets
      return filteredTickets;
    } else {
      return []; // No tickets found
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return []; // Return empty array in case of error
  }
};
