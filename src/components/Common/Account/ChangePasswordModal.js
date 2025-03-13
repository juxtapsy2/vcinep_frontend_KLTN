import React, { useState } from "react";

import * as AuthAPI from "../../../api/AuthAPI.js";
import { ModalHeader } from "./ModalHeader.js";
import { ModalBody } from "./ModalBody.js";
import { ModalFooter } from "./ModalFooter.js";
import LoadingEffective from "../../LoadingEffect.js";
import toast, { Toaster } from "react-hot-toast";
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    try {
      setLoading(true);
      const response = await AuthAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (response.success) {
        toast.success("Đổi mật khẩu thành công!");
        onClose();
      } else {
        toast.error(response.message);
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && <LoadingEffective />} <Toaster />
      <div className="fixed inset-0 z-[9999]">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all">
              <ModalHeader onClose={onClose} />
              <form onSubmit={handleSubmit} className="p-6">
                <ModalBody passwords={passwords} handleChange={handleChange} />
                <ModalFooter loading={loading} onClose={onClose} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
