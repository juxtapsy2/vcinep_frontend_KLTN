import api from "../config/api.js";

// Lấy cấu hình giá hiện tại (Public)
export const getCurrentPrice = async () => {
  try {
    const res = await api.get("/price/current");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy cấu hình giá hiện tại:", error);
    throw error;
  }
};

// Thêm cấu hình giá mới (Admin only)
export const addNewPrice = async (priceData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/price", priceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm cấu hình giá mới:", error);
    throw error;
  }
};

// Cập nhật giá (Admin only)
export const updatePrice = async (id, priceData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.put(`/price/${id}`, priceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật cấu hình giá với id "${id}":`, error);
    throw error;
  }
};

// Xóa cấu hình giá (Admin only)
export const deletePrice = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.delete(`/price/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa cấu hình giá với id "${id}":`, error);
    throw error;
  }
};

// Lấy lịch sử giá (Admin only)
export const getPriceHistory = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.get("/price/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử cấu hình giá:", error);
    throw error;
  }
};
