import api from "../config/api.js";
//Add By The Vi 14/4/2025

export const getFullShowtimesByDate = async (date) => {
  try {
    const res = await api.post("/showtime/getFullShowtimesByDate", {
      date: date,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy suất chiếu theo ngày:", error);
    throw error;
  }
};

export const getShowtimeByMovie = async (movieData) => {
  try {
    const res = await api.post("/showtime/movie", {
      slug: movieData.slug,
      showDate: movieData.showDate,
      address: movieData.address,
      cinemaId: movieData.cinemaId,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch chiếu phim:", error);
    throw error;
  }
};
export const getMovieShowDates = async (slug) => {
  try {
    const res = await api.post("/showtime/movie/dates", { slug });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy các ngày chiếu phim:", error);
    throw error;
  }
};
export const getShowtimeDetail = async (showtimeId) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.get(`/showtime/detail/${showtimeId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch chiếu:", error);
    throw error;
  }
};
export const addMovie = async (movieData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/movie", movieData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm phim mới:", error);
    throw error;
  }
};
export const getAllShowtimes = async ({
  page = 1,
  limit = 10,
  movieId = null,
  cinemaId = null,
  fromDate = null,
  toDate = null,
} = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const requestBody = {
      page,
      limit,
      ...(movieId && { movieId }),
      ...(cinemaId && { cinemaId }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
    };
    const res = await api.post("/showtime/list", requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách suất chiếu:", error);
    throw error;
  }
};
export const addMultipleShowtimes = async (showtimeData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/showtime/multiple", showtimeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhiều suất chiếu:", error);
    throw error;
  }
};
export const addMultipleShowtimesByTheater = async (showtimeData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/showtime/multiplebytheater", showtimeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhiều suất chiếu cho phòng chiếu:", error);
    throw error;
  }
};
export const addNewShowtime = async (showtimeData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/showtime", showtimeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    // Kiểm tra nếu có thông tin về suất chiếu trùng lịch
    if (error.response?.data?.data?.conflict) {
      const conflictData = error.response.data.data.conflict;
      // eslint-disable-next-line no-throw-literal
      throw {
        message: "Suất chiếu đã tồn tại",
        conflict: conflictData,
        status: error.response.status,
      };
    }
    // Xử lý các lỗi khác
    console.error("Lỗi khi thêm suất chiếu:", error);
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response?.data?.message || "Lỗi khi thêm suất chiếu",
      status: error.response?.status || 500,
    };
  }
};

export const deleteShowtime = async (showtimeId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.delete(`/showtime/${showtimeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa suất chiếu:", error);
    throw error;
  }
};
