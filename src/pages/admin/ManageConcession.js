import React, { useState, useEffect } from "react";
import {
  getAllConcessions,
  addConcession,
  deleteConcession,
} from "../../api/ConcessionsAPI";
import toast, { Toaster } from "react-hot-toast";

const ManageConcession = () => {
  const [concessions, setConcessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("S");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteConcession(deleteId);
      setConcessions(concessions.filter((item) => item._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      toast.success("Xóa đồ uống thành công !");
    } catch (error) {
      toast.error(error);

      console.error("Lỗi khi xóa đồ uống:", error);
    }
  };
  useEffect(() => {
    const fetchConcessions = async () => {
      try {
        const response = await getAllConcessions();
        setConcessions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch concession items.");
        setLoading(false);
      }
    };

    fetchConcessions();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

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
      setImage(data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      setUploading(false);
    }
  };

  const handleAddConcession = async () => {
    try {
      if (!image) {
        alert("Vui lòng tải lên ảnh đồ uống!");
        return;
      }
      const response = await addConcession(
        name,
        description,
        price,
        size,
        image
      );
      setConcessions([...concessions, response.data]);
      setShowModal(false);
      resetForm();
      toast.success("Thêm đồ uống thành công !");
    } catch (error) {
      toast.error(error);
      console.error("Lỗi khi thêm đồ uống:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSize("S");
    setImage(null);
  };

  const handleEdit = (id) => {
    console.log("Editing concession with ID:", id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Xác nhận xóa
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn có muốn xóa đồ uống này không?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Add New Concession
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add New Concession
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                  </select>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => uploadImage(e.target.files[0])}
                      className="w-full"
                      accept="image/*"
                    />
                  </div>

                  {uploading && (
                    <div className="text-blue-600 text-sm">
                      Uploading image...
                    </div>
                  )}

                  {image && (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAddConcession}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Add Concession
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {concessions.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {item.size}
                </div>
              </div>

              <div className="p-3">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">
                    {item.name}
                  </h2>
                  <p className="text-lg font-bold text-red-500">
                    {item.price.toLocaleString()}đ
                  </p>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageConcession;
