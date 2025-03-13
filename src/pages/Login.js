import React, { useState } from "react";
import * as AuthAPI from "../api/AuthAPI.js";
import * as UserAPI from "../api/UserAPI.js";
import { useAuth } from "../contexts/AuthContext.js";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // 1. Đăng nhập để lấy token
      const authResponse = await AuthAPI.loginUser({ email, password });

      if (authResponse.success && authResponse.data) {
        //  Toast.warning("TK!");

        const token = authResponse.data;
        localStorage.setItem("accessToken", token);

        // 2. Giải mã token để lấy userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // 3. Lấy thông tin user đầy đủ từ API
        const userResponse = await UserAPI.getUserById(userId, token);

        // 4. Kiểm tra response và lấy data user
        if (userResponse.success && userResponse.data) {
          // Lưu thông tin user vào context
          login(userResponse.data);
          setMessage(userResponse.message || "Đăng nhập thành công");
          if (userResponse.data.role === "Admin") {
            navigate("/admin");
          } else if (userResponse.data.role === "Manager") {
            navigate("/manage");
          } else {
            navigate("/");
          }
        } else {
          toast.error(authResponse?.message);
        }
      } else {
        toast.error(authResponse?.message);
      }
    } catch (err) {
      setMessage("Không thể đăng nhập" + err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dhs93uix6/image/upload/v1727913957/wp12544579-cinema-theatre-wallpapers_scacb2.jpg')",
      }}
    >
      <Toaster />

      <div className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm"></div>
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl transform  relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            <Link
              to="/forgot"
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-300"
            >
              Bạn quên mật khẩu?
            </Link>
          </div>
          <div className="text-sm">
            <span>Bạn chưa có tài khoản? </span>
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-300"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
