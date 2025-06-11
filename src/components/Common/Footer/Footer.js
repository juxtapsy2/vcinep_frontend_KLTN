import React from "react";
import { Facebook, Twitter, Youtube } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
   

      <div className="container mx-auto px-4 py-6">
  
        {/* Company Info */}
        <div className="text-center border-gray-800 ">
          <h4 className="text-xl font-bold text-red-500 mb-4 animate-glow">
            CÔNG TY CỔ PHẦN PHIM VCINEP
          </h4>
          <div className="mb-2">
            <p className="text-gray-400">Tầng 5, Số 157 Đường Nguyễn Đình Chiểu,Phường 6, Quận 3, TP. Hồ Chí Minh</p>
          </div>
          <p className="mb-2">Nguyễn Đại Phúc - Nguyễn Dương Thế Vĩ</p>
          <p className="mb-4">
            <span className="text-red-500">028.39.333.303</span> •{" "}
            <span className="text-red-500">19002224</span> (9:00 - 22:00) •{" "}
            <span className="text-red-500">hotro@vcinep.vn</span>
          </p>
          <p className="text-gray-500">Phiên bản 6.11.2025</p>
           <p className="text-gray-500">© 2025 VCINEP. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;