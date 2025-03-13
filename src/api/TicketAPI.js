import api from "../config/api.js";
export const addNewTicket = async (ticketData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }
    const res = await api.post("/ticket", ticketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm vé mới:", error);
    throw error;
  }
};
export const checkTicketExist = async (userId, showtimeId) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }
    // Gửi yêu cầu POST tới API /ticket/check-exist
    const res = await api.post(
      "/ticket/check-exist",
      { userId, showtimeId }, // Body chứa userId và showtimeId
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return res.data; // Trả về dữ liệu phản hồi từ API
  } catch (error) {
    console.error("Lỗi khi kiểm tra vé:", error);
    throw error; // Ném lại lỗi nếu có
  }
};
export const getTicketsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.get(`/ticket/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vé:", error);
    throw error;
  }
};
export const sendTicketEmailRequest = async (ticketData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const res = await api.post("/ticket/sendmail", ticketData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực người dùng
      },
    });

    return res.data; // Trả về dữ liệu phản hồi từ API
  } catch (error) {
    console.error("Lỗi khi gửi email vé:", error);
    throw error; // Ném lại lỗi nếu có
  }
};
export const getTicketById = async (ticketId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.get(`/ticket/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy vé:", error);
    throw error;
  }
};
export const getAllTickets = async (
  page = 1,
  limit = 10,
  filters = {
    code: "",
    movieId: null,
    cinemaId: null,
    showDate: null, // Đổi tên từ startDate thành showDate
  }
) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.post(
      "/ticket/all",
      {
        ...filters, // gửi các tham số lọc trong body
      },
      {
        params: {
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả vé:", error);
    throw error;
  }
};
export const checkTicketCancelled = async (ticketId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const res = await api.get(`/ticket/check-cancelled/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái hủy vé:", error);
    throw error;
  }
};
export const cancelTicket = async (ticketId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
    }

    const res = await api.put(
      `/ticket/cancel/${ticketId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi hủy vé:", error);
    throw error;
  }
};
