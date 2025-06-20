import api from "../config/api.js";



export const getComments = async ({
  content,
  movieId,
  startDate,
  endDate,
  page = 1,
  limit = 10,
  isRootOnly = false
} = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post(
      "/comment/all", 
      {
        content,
        movieId,
        startDate,
        endDate,
        page,
        limit,
        isRootOnly
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
export const addComment = async (parentComment, movie, user, content) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.post(
      "/comment",
      { parentComment, movie, user, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    throw error;
  }
};

export const updateComment = async (id, content, status) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.put(
      `/comment/${id}`,
      { content, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bình luận:", error);
    throw error;
  }
};
export const deleteComment = async (id) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.delete(`/comment/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    throw error;
  }
};
export const getCommentsByMovie = async (movieId) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await api.get(`/comment/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    throw error;
  }
};
