import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPayment = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md transform transition-all duration-500 scale-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div className="absolute -inset-1 bg-green-50 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-red-600">
              Thanh Toán Thành Công!
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 text-lg">
                Cảm ơn bạn đã đặt vé tại Cinema
              </p>
              <p className="text-sm text-gray-500">
                Vé của bạn đã được gửi qua email
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full max-w-xs px-6 py-3 bg-red-600 text-white rounded-lg font-semibold
                       hover:bg-red-700 transform hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                       shadow-lg hover:shadow-xl"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
