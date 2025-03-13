import React, { useState } from "react";
import * as UserAPI from "./../../../api/UserAPI.js";
import toast, { Toaster } from "react-hot-toast";

import ChangePasswordModal from "../Account/ChangePasswordModal.js";

export const ProfileTab = ({ user }) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    userId: user._id,
    username: user?.username || "",
    phoneNumber: user?.phoneNumber || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    gender: user?.gender || "Male",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await UserAPI.updateUserInfo(formData);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setFocusedField(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const FormInput = ({
    label,
    type = "text",
    value,
    onChange,
    readOnly = false,
    icon,
    showChangeText = false,
    field,
  }) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={icon}
              />
            </svg>
          </div>
        )}
        <input
          type={type}
          className={`block w-full rounded-lg border border-gray-200 px-4 py-3 ${
            icon ? "pl-10" : ""
          } text-gray-900 transition-all ${
            focusedField === field && isEditing
              ? "border-red-500 ring-2 ring-red-200"
              : "focus:border-red-500 focus:ring-2 focus:ring-red-200"
          } ${readOnly ? "cursor-not-allowed bg-gray-50" : "bg-white"}`}
          value={value}
          onChange={(e) => onChange?.(field, e.target.value)}
          readOnly={readOnly}
          onFocus={() => {
            if (!readOnly && isEditing) {
              setFocusedField(field); // Focus chỉ set nếu đang chỉnh sửa
            }
          }}
        />

        {showChangeText && (
          <span
            onClick={() => setIsChangePasswordOpen(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-sm font-semibold cursor-pointer hover:text-red-600 hover:underline transition-all"
          >
            Thay đổi
          </span>
        )}
      </div>
    </div>
  );

  const GenderSelection = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Giới tính
      </label>
      <div
        className={`flex items-center space-x-6 p-4 rounded-lg border border-gray-200 ${
          isEditing ? "bg-white" : "bg-gray-50"
        }`}
      >
        {["Male", "Female"].map((gender) => (
          <label
            key={gender}
            className="inline-flex items-center cursor-pointer"
          >
            <input
              type="radio"
              className="form-radio h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500"
              name="gender"
              value={gender}
              checked={formData.gender === gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              disabled={!isEditing}
            />
            <span className="ml-3 text-gray-900">
              {gender === "Male" ? "Nam" : "Nữ"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // Rest of the code remains the same
  const editableInfo = [
    {
      label: "Họ và tên",
      value: formData.username,
      field: "username",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      label: "Ngày sinh",
      value: formData.dateOfBirth,
      type: "date",
      field: "dateOfBirth",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      label: "Số điện thoại",
      value: formData.phoneNumber,
      field: "phoneNumber",
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
  ];

  const readOnlyInfo = [
    {
      label: "Email",
      value: user?.email,
      type: "email",
      readOnly: true,
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      label: "Mật khẩu",
      value: "********",
      type: "password",
      readOnly: true,
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      showChangeText: true,
    },
  ];

  return (
    <div>
      <div className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {editableInfo
              .slice(0, Math.ceil(editableInfo.length / 2))
              .map((info) => (
                <FormInput
                  key={info.label}
                  {...info}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              ))}
            <GenderSelection />
          </div>
          <div className="space-y-6">
            {editableInfo
              .slice(Math.ceil(editableInfo.length / 2))
              .map((info) => (
                <FormInput
                  key={info.label}
                  {...info}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              ))}
            {readOnlyInfo.map((info) => (
              <FormInput
                key={info.label}
                {...info}
                onChange={handleInputChange}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={() => {
              if (isEditing) {
                handleSubmit();
              } else {
                setIsEditing(true);
              }
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {isEditing ? "Cập nhật" : "Cập nhật thông tin"}
          </button>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};
