import api from "../config/api.js";

export const addNewRating = async (movie, user, score) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.post(
      "/rating/",
      { movie, user, score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm đánh giá mới:", error);
    throw error;
  }
};

export const checkUserRatedMovie = async (movie, user) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.post(
      "/rating/check",
      { movie, user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra đánh giá của người dùng:", error);
    throw error;
  }
};

export const getMovieRatingById = async (movieId) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.get(`/rating/movies/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy điểm đánh giá của phim:", error);
    throw error;
  }
};
