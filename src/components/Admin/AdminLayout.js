import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faFilm,
  faCalendarAlt,
  faCogs,
  faBars,
  faSignOutAlt,
  faTachometerAlt,
  faNewspaper,
  faUsers,
  faClock,
  faCoffee,
  faTicketAlt,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../image/LogoVCineP.png";
import { useAuth } from "../../contexts/AuthContext.js";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumb from "./Breadcumb.js";

function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // State to store the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    sessionStorage.clear();
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    window.location.href = "/login";
  };

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: faTachometerAlt, // Biểu tượng Dashboard
      label: "Dashboard",
    },
    {
      path: "/admin/blog",
      icon: faNewspaper, // Biểu tượng Blog
      label: "Blog",
    },
    {
      path: "/admin/users",
      icon: faUsers, // Biểu tượng Người dùng
      label: "Người dùng",
    },
    {
      path: "/admin/movies",
      icon: faFilm, // Biểu tượng Phim
      label: "Phim",
    },
    {
      path: "/admin/concession",
      icon: faCoffee, // Biểu tượng Đồ uống (cà phê)
      label: "Đồ uống",
    },
    {
      path: "/admin/ticket",
      icon: faTicketAlt, // Biểu tượng Vé
      label: "Vé",
    },
    {
      path: "/admin/showtimes",
      icon: faCalendarAlt, // Biểu tượng Suất chiếu (biểu tượng lịch)
      label: "Suất chiếu",
    },
    {
      path: "/admin/cinemas",
      icon: faVideo, // Biểu tượng Rạp
      label: "Rạp",
    },
    // {
    //   path: "/admin/settings",
    //   icon: faCogs, // Biểu tượng Cài đặt
    //   label: "Cài đặt",
    // },
  ];

  // Format the current time
  const formattedTime = currentTime.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      <Toaster />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-md border-r transition-all duration-500`}
        >
          <div className="flex items-center justify-center h-16">
            <a
              href="/"
              className="w-auto h-12 transform transition-transform duration-300"
            >
              <img src={logo} alt="Logo" className="h-full object-contain" />
            </a>
          </div>

          <nav style={{ marginTop: "11px" }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-800 hover:bg-red-100 transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white"
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-5 h-5 transition-transform duration-300 ${
                    location.pathname === item.path
                      ? "transform scale-110 text-white"
                      : "text-gray-600"
                  }`}
                />
                {isSidebarOpen && (
                  <span className="mx-3 transition-all duration-300 hover:font-bold">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-red-100 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
              </button>
              <span className="ml-4 text-lg font-semibold text-gray-800">
                Xin chào Admin, {user?.username}
              </span>
            </div>
            <div className="flex items-center">
              {/* Display current time */}
              <span className="mr-4 text-lg font-semibold text-gray-800">
                {formattedTime}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                <span className="mr-2 font-semibold">Logout</span>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </header>
          <main className="p-6 bg-white min-h-[calc(100vh-4rem)]">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} VCineP. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminLayout;
