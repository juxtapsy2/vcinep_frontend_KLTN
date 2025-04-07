import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.js";
import { Transition } from "@headlessui/react";
import Logo from "../../image/LogoVCineP.png";
import Ticket from "../../image/Ticket.png";
import Avatar from "../../image/user_default.png";
import { MdOutlineNotifications } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseLargeFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
// import { RiUserSettingsLine } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

import { menuItems } from "../../constants/constants.js";
import React, { useState } from "react";
import "./Header.css";
import { renderMenuItem, renderMobileMenuItem } from "./HeaderNavItem.js";
import toast, { Toaster } from "react-hot-toast";

function Header() {
  const { user, logout } = useAuth();
  const accessToken = localStorage.getItem("accessToken");

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

  const isAuthenticated =
    user && user.username && user.username !== "" && accessToken;
  const [isOpen, setIsOpen] = useState(false);

  // Function to determine management page based on role
  const getManagementLink = (role) => {
    switch (role) {
      case "Admin":
        return "/admin";
      case "Manager":
        return "/manage";
      case "Employee":
        return "/employee";
      default:
        return "/";
    }
  };

  const canAccessManagement = ["Admin", "Manager", "Employee"].includes(
    user?.role
  );

  return (
    <header className="header">
      <Toaster />
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-left">
              <div className="logo-container">
                <a href="/">
                  <img className="logo" src={Logo} alt="VCineP" />
                </a>
              </div>
              <div className="ticket-container">
                <a href="">
                  <img className="ticket" src={Ticket} alt="Mua vé" />
                </a>
              </div>
              <div className="menu-items">{menuItems.map(renderMenuItem)}</div>
            </div>
            <div className="nav-right">
              <div className="nav-icons">
                <MdOutlineNotifications className="icon notification-icon" />
                {isAuthenticated ? (
                  <>
                    <a className="user-name" href="/">
                      {user.username}
                    </a>
                    <div className="avatar-container">
                      <Link to="/account">
                        <img
                          className="avatar"
                          src={
                            user.avatar && user.avatar.trim() !== ""
                              ? user.avatar
                              : Avatar
                          }
                          alt="Avatar"
                        />
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="/account" className="dropdown-item">
                            <span className="dropdown-icon">
                              <FaUserCircle />
                            </span>
                            <span className="dropdown-text">Tài khoản</span>
                          </Link>
                        </li>
                        {canAccessManagement && (
                          <li>
                            <Link
                              to={getManagementLink(user.role)}
                              className="dropdown-item"
                            >
                              <span className="dropdown-icon">
                                <IoMdSettings />
                              </span>
                              <span className="dropdown-text">Quản lý</span>
                            </Link>
                          </li>
                        )}
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            <span className="dropdown-icon">
                              <RiCloseLargeFill />
                            </span>
                            <span className="dropdown-text">Đăng xuất</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <a href="/login" className="login-button">
                    Đăng nhập
                  </a>
                )}
              </div>
            </div>
            <div className="mobile-menu-button">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="menu-toggle"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <GiHamburgerMenu className="hamburger-icon" />
                ) : (
                  <RiCloseLargeFill className="close-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition-enter"
          enterFrom="transition-enter-from"
          enterTo="transition-enter-to"
          leave="transition-leave"
          leaveFrom="transition-leave-from"
          leaveTo="transition-leave-to"
        >
          {(ref) => (
            <div className="mobile-menu" id="mobile-menu">
              <div ref={ref} className="mobile-menu-items">
                {menuItems.map(renderMobileMenuItem)}
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </header>
  );
}

export default Header;
