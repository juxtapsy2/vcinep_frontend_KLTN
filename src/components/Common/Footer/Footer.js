import React from "react";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import Logo from "../../image/LogoVCineP.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-waves">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-heading">GIỚI THIỆU</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="hover-effect">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Thoả Thuận Sử Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Quy Chế Hoạt Động
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Chính Sách Bảo Mật
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">GÓC ĐIỆN ẢNH</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="hover-effect">
                  Thể Loại Phim
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Bình Luận Phim
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Blog Điện Ảnh
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Phim Hay Tháng
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Phim IMAX
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">HỖ TRỢ</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="hover-effect">
                  Góp Ý
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Sale & Services
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Rạp / Giá Vé
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  Tuyển Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover-effect">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <div className="social-icons">
              <a href="#" className="social-icon facebook">
                <FaFacebook />
                <span className="tooltip">Facebook</span>
              </a>
              <a href="#" className="social-icon twitter">
                <FaTwitter />
                <span className="tooltip">Twitter</span>
              </a>
              <a href="#" className="social-icon youtube">
                <FaYoutube />
                <span className="tooltip">YouTube</span>
              </a>
            </div>
            <div className="logo-container">
              <img src={Logo} alt="Logo" className="footer-logo pulse" />
            </div>
          </div>
        </div>

        <div className="company-info">
          <h4 className="glow-text">CÔNG TY CỔ PHẦN VCINEP</h4>
          <p>
            3/9 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Tp. Hồ Chí Minh, Việt Nam
          </p>
          <p className="contact-info">
            <span className="highlight">028.39.333.303</span> •
            <span className="highlight">19002224</span> (9:00 - 22:00) •
            <span className="highlight">hotro@vcinep.vn</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
