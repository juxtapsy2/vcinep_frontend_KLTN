import React, { useState, useRef } from "react";
import Avatar from "../../image/user_default.png";
import * as UserAPI from "../../../api/UserAPI.js";
import { useAuth } from "../../../contexts/AuthContext.js";
import LoadingEffect from "../../LoadingEffect.js";
import toast, { Toaster } from "react-hot-toast";

export const AccountHeader = ({ user }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "vcinep");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhs93uix6/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        const updateResponse = await UserAPI.updateUserAvatar(
          user?._id,
          data.secure_url
        );
        if (updateResponse.success && updateResponse.data) {
          login(updateResponse.data);
          console.log(
            "Avatar uploaded and context updated successfully:",
            data.secure_url
          );
          toast.success("Cập nhật ảnh đại diện thành công !");

          // Reset input file sau khi upload thành công
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    } catch (error) {
      toast.error(error);
      console.error("Lỗi khi upload avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingEffect />}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <Toaster />
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={user?.avatar?.trim() ? user.avatar : Avatar}
                  alt="Avatar"
                />
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors"
              disabled={isLoading}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={isLoading}
                accept="image/*"
              />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900">
              {user?.username}
            </h2>
            <p className="text-base text-gray-600">{user?.email}</p>
            <div className="flex gap-3 mt-3">
              <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                0 Stars
              </span>
              <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                {user?.registrationDate
                  ? new Date(user.registrationDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
