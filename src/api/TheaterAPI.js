import api from "../config/api.js";
export const getTheatersByCinemaSlug = async (slug) => {
  try {
    const response = await api.get(`/theater/cinema/${slug}`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách phòng chiếu cho cinema với slug "${slug}":`,
      error
    );
    throw error;
  }
};
export const addTheater = async (theaterData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/theater", theaterData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm theater mới:", error);
    throw error;
  }
};
export const getSeatsByTheaterId = async (theaterId) => {
  try {
    const response = await api.get(`/seat/${theaterId}/seats`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách ghế cho rạp với ID "${theaterId}":`,
      error
    );
    throw error;
  }
};
export const getTheaterByIdCinema = async (theaterId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.get(`/theater/${theaterId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy thông tin phòng chiếu với ID "${theaterId}":`,
      error
    );
    throw error;
  }
};
export const deleteTheater = async (theaterId) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const response = await api.delete(`/theater/${theaterId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa phòng chiếu với ID "${theaterId}":`, error);
    throw error;
  }
};
export const getTheatersByIdCinemaCustom = async (theaterId) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }

    const res = await api.get(`theater/${theaterId}/theaters`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gắn token vào headers
      },
    });

    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error(
      `Lỗi khi lấy thông tin theater với ID "${theaterId}":`,
      error
    );
    throw error;
  }
};
