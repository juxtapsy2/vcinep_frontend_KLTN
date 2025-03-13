import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaVenusMars,
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function RegisterForm({ formData, setFormData, handleSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Validation checks
  const hasMinLength = formData.password?.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dhs93uix6/image/upload/v1727913957/wp12544579-cinema-theatre-wallpapers_scacb2.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm"></div>
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl transform  relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaVenusMars className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="gender"
                name="gender"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBirthdayCake className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border ${
                  passwordFocus
                    ? isPasswordValid
                      ? "border-green-500 ring-1 ring-green-500"
                      : "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password requirements indicator */}
            {passwordFocus && (
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  {hasMinLength ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  <span
                    className={hasMinLength ? "text-green-500" : "text-red-500"}
                  >
                    Tối thiểu 8 ký tự
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {hasLetter ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  <span
                    className={hasLetter ? "text-green-500" : "text-red-500"}
                  >
                    Chứa ít nhất 1 chữ cái
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {hasNumber ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  <span
                    className={hasNumber ? "text-green-500" : "text-red-500"}
                  >
                    Chứa ít nhất 1 số
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              {loading ? (
                <FaSpinner className="animate-spin h-5 w-5 mr-3" />
              ) : null}
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <span>Đã có tài khoản? </span>
          <Link
            to="/login"
            className="font-medium text-red-600 hover:text-red-500 transition-colors duration-300"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
