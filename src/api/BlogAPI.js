import api from "../config/api.js";
// Thêm blog mới
export const addBlog = async (blogData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post("/blog", blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm blog mới:", error);
    throw error;
  }
};
// Lấy chi tiết blog bằng slug
export const getBlogBySlug = async (slug) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.get(`/blog/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin blog với slug "${slug}":`, error);
    throw error;
  }
};
// Cập nhật blog bằng slug
export const updateBlogBySlug = async (slug, blogData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.patch(`/blog/${slug}`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật blog với slug "${slug}":`, error);
    throw error;
  }
};
// Xóa blog bằng slug
export const deleteBlogBySlug = async (slug) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.delete(`/blog/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi xóa blog với slug "${slug}":`, error);
    throw error;
  }
};
// Lấy danh sách tất cả blogs với phân trang và tìm kiếm tiêu đề
export const getAllBlogs = async (page = 1, limit = 10, title = "") => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post(
      "/blog/all",
      { page, limit, title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách blogs:", error);
    throw error;
  }
};
