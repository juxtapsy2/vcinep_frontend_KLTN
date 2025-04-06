import api from "../config/api.js";

export const suggestionMovieGemini = async (promptUser) => {
  try {
    const res = await api.post(
      "/gemini/suggestion",
      { promptUser: promptUser },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra tính hợp lệ của vé:", error);
    throw error;
  }
};
