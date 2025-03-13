import React from "react";
import { useNavigate } from "react-router-dom";

const FailedPayment = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md transform transition-all duration-500 scale-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <div className="absolute -inset-1 bg-red-50 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-red-600">
              Thanh Toán Thất Bại
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 text-lg">
                Rất tiếc, giao dịch không thành công
              </p>
              <p className="text-sm text-gray-500">
                Vui lòng kiểm tra và thử lại
              </p>
            </div>
          </div>
          {/* <button
            onClick={() => navigate("/payment")}
            className="w-full max-w-xs px-6 py-3 bg-black text-white rounded-lg font-semibold
                       hover:bg-gray-900 transform hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                       shadow-lg hover:shadow-xl"
          >
            Thử Lại
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default FailedPayment;
