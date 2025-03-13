import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <motion.h1
            className="text-9xl md:text-[200px] font-bold text-red-600"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            404
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Oops! Trang không tồn tại
            </h2>
            <p className="text-gray-600 text-lg">
              Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold 
                        transition-all duration-300 hover:bg-red-700 hover:shadow-lg 
                        hover:shadow-red-600/50 transform hover:-translate-y-1"
            >
              Về trang chủ
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
