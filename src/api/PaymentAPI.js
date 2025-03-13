import api from "../config/api.js";

export const createMoMoPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.post("/payment/momo", paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán MoMo:", error);
    throw error;
  }
};
