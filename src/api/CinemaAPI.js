import api from "../config/api.js";
export const getShowtimesByCinemaId = async (cinemaId) => {
  try {
    // const token = localStorage.getItem("accessToken");
    // if (!token) {
    //   throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    // }
    const response = await api.get(`/cinema/${cinemaId}/showtimes`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy lịch chiếu của rạp ${cinemaId}:`, error);
    throw error;
  }
};
export const getAllCinemasClient = async (page = 1, limit = 10, name = "") => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.post(
      "/cinema/all",
      { page, limit, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả các rạp:", error);
    throw error;
  }
};
export const getCinemaBySlug = async (slug) => {
  try {
    const response = await api.get(`/cinema/getCinemaBySlug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin rạp với slug "${slug}":`, error);
    throw error;
  }
};
export const addCinema = async (cinemaData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }
    const res = await api.post("/cinema", cinemaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm rạp mới:", error);
    throw error;
  }
};
export const getActiveCinemas = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }

    const res = await api.get("/cinema/active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp active:", error);
    throw error;
  }
};
export const getCinemaAll = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }
    const res = await api.get(`/cinema/custom`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gắn token vào headers
      },
    });

    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cụm rạp tùy chỉnh:", error);
    throw error;
  }
};
export const getCinemaById = async (id) => {
  try {
    // Gọi API với id từ tham số
    const response = await api.get(`/cinema/${id}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin cinema với ID "${id}":`, error);
    throw error; // Ném lỗi để xử lý ở cấp cao hơn
  }
};
export const getCinemaSlugById = async (id) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }

    // Gọi API để lấy slug
    const response = await api.get(`/cinema/slug/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gắn token vào headers
      },
    });

    // Trả về slug từ API
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy slug của cinema với ID "${id}":`, error);
    throw error;
  }
};
export const updateCinema = async (id, updateData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }
    const res = await api.patch(`/cinema/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật thông tin cinema với ID "${id}":`, error);
    throw error;
  }
};
export const deleteCinemaById = async (id) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }
    // Gọi API xóa cinema
    const response = await api.delete(`/cinema/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gắn token vào headers để xác thực
      },
    });
    // Trả về dữ liệu từ API
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa cinema với ID "${id}":`, error);
    throw error;
  }
};
