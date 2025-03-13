import api from "../config/api.js";
export const getNowShowingMovies = async () => {
  try {
    const res = await api.get("/movie/now-showing");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim đang chiếu:", error);
    throw error;
  }
};
export const getComingSoonMovies = async () => {
  try {
    const res = await api.get("/movie/coming-soon");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim sắp chiếu:", error);
    throw error;
  }
};
export const getMovieBySlug = async (slug) => {
  try {
    const response = await api.get(`/movie/getMovieBySlug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin phim với slug "${slug}":`, error);
    throw error;
  }
};
// Lấy danh sách tất cả các phim
export const getAllMoviesAdmin = async (page = 1, limit = 2, title = "") => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.post(
      "/movie/all",
      { page, limit, title },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả các phim:", error);
    throw error;
  }
};
// Lấy danh sách các phim đang chiếu
export const getNowShowingMoviesAdmin = async (
  page = 1,
  limit = 2,
  title = ""
) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.post(
      "/movie/now-showing-admin",
      { page, limit, title },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách các phim đang chiếu:", error);
    throw error;
  }
};
// Lấy danh sách các phim sắp chiếu
export const getComingSoonMoviesAdmin = async (
  page = 1,
  limit = 2,
  title = ""
) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.post(
      "/movie/coming-soon-admin",
      { page, limit, title },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách các phim sắp chiếu:", error);
    throw error;
  }
};
// Lấy danh sách các phim đã chiếu
export const getEndedMoviesAdmin = async (page = 1, limit = 2, title = "") => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.post(
      "/movie/ended",
      { page, limit, title },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách các phim đã chiếu:", error);
    throw error;
  }
};
export const addMovie = async (movieData) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

    const res = await api.post("/movie", movieData, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm phim mới:", error);
    throw error;
  }
};
// Xóa phim bằng cách chuyển trạng thái thành "inactive"
export const deleteMovie = async (movieId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.delete(`/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa phim:", error);
    throw error;
  }
};
export const getTopRatedMovies = async () => {
  try {
    const res = await api.get("/movie/top-rated");
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách top 4 phim có rating cao nhất:",
      error
    );
    throw error;
  }
};
export const getActiveMovies = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }
    const res = await api.get("/movie/active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim active:", error);
    throw error;
  }
};
export const updateMovie = async (slug, movieData) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
    }

    const res = await api.patch(`/movie/${slug}`, movieData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật phim:", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    }

    throw error;
  }
};
