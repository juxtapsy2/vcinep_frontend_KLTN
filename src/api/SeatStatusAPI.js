import api from "../config/api.js";
import io from "socket.io-client";
import { backendURL } from "../constants/constants.js";

const socket = io.connect(backendURL);
export const getAllSeatsForShowtime = async (showtimeId) => {
  try {
    const response = await api.get(`/seatStatus/showtime/${showtimeId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin ghế của suất chiếu:", error);
    throw error;
  }
};
// Cập nhật ghế thành holding
export const updateSeatToHolding = async (seatStatusId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.patch(
      "/seatStatus/holding",
      { seatStatusId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật ghế thành holding:", error);
    throw error;
  }
};

// Giải phóng một ghế từ holding về available
export const releaseSeatFromHolding = async (seatStatusId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.patch(
      "/seatStatus/release-holding",
      { seatStatusId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi giải phóng ghế từ holding:", error);
    throw error;
  }
};

// Giải phóng tất cả ghế holding của một user
export const releaseAllHoldingSeats = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.patch(
      "/seatStatus/release-all-holding",
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    socket.emit("release-all-seats", userId);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi giải phóng tất cả ghế holding:", error);
    throw error;
  }
};

// Cập nhật từ holding sang reserved
export const updateHoldingToReserved = async (seatStatusId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.patch(
      "/seatStatus/holding-to-reserved",
      { seatStatusId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật từ holding sang reserved:", error);
    throw error;
  }
};

// Cập nhật từ available sang reserved
export const updateAvailableToReserved = async (seatStatusId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.patch(
      "/seatStatus/available-to-reserved",
      { seatStatusId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật từ available sang reserved:", error);
    throw error;
  }
};
export const updateMultipleSeatsToReserved = async (seatStatusIds, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.patch(
      "/seatStatus/update-multiple-reserved",
      { seatStatusIds, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhiều ghế thành reserved:", error);
    throw error;
  }
};
