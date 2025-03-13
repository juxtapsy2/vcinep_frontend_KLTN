import api from "../config/api.js";
export const getAllActiveMovies = async () => {
  try {
    const response = await api.get("quickticket/movie");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim active:", error);
    throw error;
  }
};
export const getActiveCinemasByMovieId = async (movieId) => {
  try {
    const response = await api.get(`quickticket/cinema/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách rạp active cho phim với ID "${movieId}":`,
      error
    );
    throw error;
  }
};
export const getShowDatesByMovieAndCinema = async (movieId, cinemaId) => {
  try {
    const response = await api.post("quickticket/showtime/dates", {
      movieId,
      cinemaId,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách ngày chiếu cho phim ID "${movieId}" và rạp ID "${cinemaId}":`,
      error
    );
    throw error;
  }
};
export const getShowtimesByMovieCinemaDate = async (
  movieId,
  cinemaId,
  showDate
) => {
  try {
    const response = await api.post("quickticket/showtime/times", {
      movieId,
      cinemaId,
      showDate,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách giờ chiếu cho phim ID "${movieId}", rạp ID "${cinemaId}", và ngày "${showDate}":`,
      error
    );
    throw error;
  }
};
