import api from "../config/api.js";

export const getAllConcessions = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.get("/concession", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách concessions:", error);
    throw error;
  }
};
export const addConcession = async (name, description, price, size, image) => {
  try {
    const token = localStorage.getItem("accessToken");

    const newConcessionData = {
      name,
      description,
      price,
      size,
      image,
    };

    const res = await api.post("/concession", newConcessionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm đồ uống:", error);
    throw error;
  }
};
export const deleteConcession = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");

    // Gửi request xóa đến API
    const res = await api.delete(`/concession/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa đồ uống:", error);
    throw error;
  }
};
