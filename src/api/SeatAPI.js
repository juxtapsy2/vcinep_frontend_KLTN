import api from "../config/api.js";
// Chuyển ghế thành ghế thường
export const updateSeatType = async (seatId, type) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!["standard", "vip"].includes(type)) {
      throw new Error("Loại ghế không hợp lệ");
    }
    const res = await api.patch(
      `/seat/${seatId}/type`,
      { type }, // Truyền loại ghế trong body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật ghế thành ${type}:`, error);
    throw error;
  }
};
// Xóa ghế
export const deleteSeat = async (seatId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await api.delete(`/seat/${seatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa ghế:", error);
    throw error;
  }
};
