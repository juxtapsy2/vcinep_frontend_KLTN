import React from "react";
import { motion } from "framer-motion";

export const PolicyTab = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phần chính sách đặt vé */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-red-500/20 transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Chính Sách Đặt Vé
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Có thể hủy vé trước 24 giờ chiếu phim
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Thanh toán an toàn qua MoMo
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
               Tải vé có chứa QR code để Check In
              </li>
            </ul>
          </motion.div>

          {/* Phần quy định chung */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-red-500/20 transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Quy Định Chung
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Không mang đồ ăn, thức uống từ bên ngoài
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Giữ trật tự trong phòng chiếu
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Tắt điện thoại hoặc để chế độ rung
              </li>
            </ul>
          </motion.div>

          {/* Phần hoàn tiền */}
          {/* <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-red-500/20 transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Chính Sách Hoàn Tiền
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Hoàn 100% nếu hủy trước 24h
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Hoàn 50% nếu hủy trước 12h
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Không hoàn tiền nếu hủy trong vòng 12h
              </li>
            </ul>
          </motion.div> */}

          {/* Phần khách hàng thân thiết */}
          {/* <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-red-500/20 transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Khách Hàng Thân Thiết
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Tích điểm với mỗi giao dịch
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Ưu đãi đặc biệt vào sinh nhật
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Đổi điểm lấy vé xem phim miễn phí
              </li>
            </ul>
          </motion.div> */}
        </div>

        {/* Phần liên hệ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-700">
            Mọi thắc mắc xin vui lòng liên hệ:
          </p>
          <p className="text-red-600 font-semibold">Hotline: 1900 2244</p>
          <p className="text-red-600 font-semibold">
            Email: support@cinema.com
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
