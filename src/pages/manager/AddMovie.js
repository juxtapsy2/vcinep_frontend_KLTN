import React, { useState, useRef } from "react";
import { addMovie } from "../../api/MovieAPI.js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LoadingEffect from "../../components/LoadingEffect.js";
const AddMovie = () => {
  const initialFormData = {
    title: "",
    description: "",
    genre: [],
    classification: "P",
    duration: "",
    format: "2D",
    director: "",
    actors: "",
    language: "",
    startDate: "",
    endDate: "",
    trailer: "",
    coverImage: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const fileInputRef = useRef(null);

  const genreOptions = [
    { id: "horror", label: "Kinh dị" },
    { id: "action", label: "Hành động" },
    { id: "romance", label: "Tình cảm" },
    { id: "comedy", label: "Hài" },
    { id: "animation", label: "Hoạt hình" },
    { id: "scifi", label: "Khoa học viễn tưởng" },
    { id: "drama", label: "Chính kịch" },
    { id: "adventure", label: "Phiêu lưu" },
  ];

  const classificationOptions = [
    { value: "P", label: "P - Phổ biến" },
    { value: "T18", label: "T18 - Cấm khán giả dưới 18 tuổi" },
    { value: "T16", label: "T16 - Cấm khán giả dưới 16 tuổi" },
    { value: "T13", label: "T13 - Cấm khán giả dưới 13 tuổi" },
    { value: "K", label: "K - Khuyến cáo có người lớn đi kèm" },
    { value: "C", label: "C - Cấm phổ biến" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tên phim";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả phim";
    }

    if (formData.genre.length === 0) {
      newErrors.genre = "Vui lòng chọn ít nhất một thể loại";
    }

    if (!formData.duration) {
      newErrors.duration = "Vui lòng nhập thời lượng phim";
    } else if (formData.duration < 1) {
      newErrors.duration = "Thời lượng phim phải lớn hơn 0";
    }

    if (!formData.director.trim()) {
      newErrors.director = "Vui lòng nhập tên đạo diễn";
    }

    if (!formData.actors.trim()) {
      newErrors.actors = "Vui lòng nhập tên diễn viên";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày khởi chiếu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày khởi chiếu";
    }

    if (!formData.language.trim()) {
      newErrors.language = "Vui lòng nhập ngôn ngữ";
    }

    if (!formData.coverImage) {
      newErrors.coverImage = "Vui lòng tải lên poster phim";
    }

    if (formData.trailer && !formData.trailer.includes("youtube.com")) {
      newErrors.trailer = "URL trailer phải là từ YouTube";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageUpload = async (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return null;
    }

    const formDataImage = new FormData();
    formDataImage.append("file", file);
    formDataImage.append("upload_preset", "vcinep");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhs93uix6/image/upload",
        formDataImage,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // You can use this to show upload progress
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, coverImage: imageUrl }));
      }
    }
  };

  const handleGenreChange = (genreId) => {
    setFormData((prev) => {
      const newGenres = prev.genre.includes(genreId)
        ? prev.genre.filter((g) => g !== genreId)
        : [...prev.genre, genreId];
      return { ...prev, genre: newGenres };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouchedFields(
      Object.keys(formData).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      )
    );

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập");
      return;
    }

    setLoading(true);
    try {
      const movieData = {
        ...formData,
        actors: formData.actors.split(",").map((actor) => actor.trim()),
        duration: parseInt(formData.duration),
      };
      await addMovie(movieData);
      toast.success("Thêm phim thành công!");
      setFormData(initialFormData);
      setPreview("");
      setTouchedFields({});
      alert("Thêm phim thành công !");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm phim!");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadingEffect />;
  }
  return (
    <div className="min-h-screen  ">
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white rounded-xl ">
        <form onSubmit={handleSubmit} className=" space-y-8">
          {/* Poster Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-xs aspect-[2/3] relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                    <p className="mt-2 text-sm text-gray-500">
                      Tải lên poster phim
                    </p>
                  </div>
                </div>
              )}
              <div
                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center"
                onClick={() => fileInputRef.current.click()}
              >
                <button
                  type="button"
                  className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                >
                  Thay đổi ảnh
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            {touchedFields.coverImage && errors.coverImage && (
              <p className="text-red-500 text-sm">{errors.coverImage}</p>
            )}
          </div>

          {/* Main Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên phim *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  onBlur={() => handleBlur("title")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.title && errors.title
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập tên phim..."
                />
                {touchedFields.title && errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thể loại *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {genreOptions.map((genre) => (
                    <label
                      key={genre.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.genre.includes(genre.id)}
                        onChange={() => handleGenreChange(genre.id)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        {genre.label}
                      </span>
                    </label>
                  ))}
                </div>
                {touchedFields.genre && errors.genre && (
                  <p className="mt-1 text-sm text-red-500">{errors.genre}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  onBlur={() => handleBlur("description")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.description && errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  rows="4"
                  placeholder="Nhập mô tả phim..."
                />
                {touchedFields.description && errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phân loại *
                  </label>
                  <select
                    value={formData.classification}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        classification: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {classificationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời lượng (phút) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    onBlur={() => handleBlur("duration")}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      touchedFields.duration && errors.duration
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    min="1"
                  />
                  {touchedFields.duration && errors.duration && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đạo diễn *
                </label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) =>
                    setFormData({ ...formData, director: e.target.value })
                  }
                  onBlur={() => handleBlur("director")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.director && errors.director
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập tên đạo diễn..."
                />
                {touchedFields.director && errors.director && (
                  <p className="mt-1 text-sm text-red-500">{errors.director}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diễn viên *{" "}
                  <span className="text-gray-500 text-xs">
                    (phân cách bằng dấu phẩy)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.actors}
                  onChange={(e) =>
                    setFormData({ ...formData, actors: e.target.value })
                  }
                  onBlur={() => handleBlur("actors")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.actors && errors.actors
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="VD: Tom Cruise, Brad Pitt..."
                />
                {touchedFields.actors && errors.actors && (
                  <p className="mt-1 text-sm text-red-500">{errors.actors}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày khởi chiếu *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  onBlur={() => handleBlur("startDate")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.startDate && errors.startDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touchedFields.startDate && errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  onBlur={() => handleBlur("endDate")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.endDate && errors.endDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touchedFields.endDate && errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ *
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  onBlur={() => handleBlur("language")}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    touchedFields.language && errors.language
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="VD: Phụ đề Việt"
                />
                {touchedFields.language && errors.language && (
                  <p className="mt-1 text-sm text-red-500">{errors.language}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trailer URL (YouTube)
              </label>
              <input
                type="url"
                value={formData.trailer}
                onChange={(e) =>
                  setFormData({ ...formData, trailer: e.target.value })
                }
                onBlur={() => handleBlur("trailer")}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  touchedFields.trailer && errors.trailer
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {touchedFields.trailer && errors.trailer && (
                <p className="mt-1 text-sm text-red-500">{errors.trailer}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`
                px-8 py-3 rounded-lg text-white font-semibold text-lg
                transition duration-200 transform hover:scale-105
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 shadow-lg"
                }
                flex items-center space-x-2
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-film"></i>
                  <span>Thêm phim</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
