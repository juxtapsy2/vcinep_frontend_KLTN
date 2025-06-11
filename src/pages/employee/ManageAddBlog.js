import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addBlog } from "../../api/BlogAPI";

function ManageAddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vcinep");
    try {
      setUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhs93uix6/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };
  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      try {
        const imageUrl = await uploadImage(file);
        setCoverImage(imageUrl);
        toast.success("Cover image uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload cover image");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !editorRef.current.getContent() || !coverImage) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const blogData = {
        title,
        content: editorRef.current.getContent(),
        coverImage,
      };
      await addBlog(blogData);
      toast.success("Blog added successfully!");
      navigate("/employee/blog");
      setTitle("");
      setContent("");
      setCoverImage("");
      editorRef.current.setContent("");
    } catch (error) {
      toast.error("Failed to add blog");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditorImageUpload = async (blobInfo) => {
    if (blobInfo.blob().size > 5 * 1024 * 1024) {
      return Promise.reject("Image size should be less than 5MB");
    }
    try {
      const imageUrl = await uploadImage(blobInfo.blob());
      return imageUrl;
    } catch (error) {
      return Promise.reject("Upload failed");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white  p-3 sm:p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tạo bài viết
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Tiêu đề
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 text-gray-900 text-base"
                placeholder="Enter your blog title"
                required
              />
            </div>

            {/* Cover Image Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Ảnh bìa
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label
                  htmlFor="cover-image"
                  className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {uploading ? "Uploading..." : "Choose Cover Image"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  id="cover-image"
                />
                {coverImage && (
                  <div className="relative group">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="h-32 w-48 object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">
                        Click to change
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Editor Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Nội dung
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  apiKey="heqfttjesdjtwg57b1uou0ueoqa11baz9s2orjtkl9xedzjs"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    images_upload_handler: handleEditorImageUpload,
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading || uploading}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-base font-medium rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Đăng bài
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageAddBlog;
