import React from "react";
const BookingExpired = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="text-red-600 text-6xl mb-4">
          <i className="fas fa-clock"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Đã hết thời gian đặt vé
        </h1>
        <p className="text-gray-600 mb-6">
          Phiên đặt vé của bạn đã hết hạn. Vui lòng thực hiện đặt vé lại.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Đặt vé lại
        </button>
      </div>
    </div>
  );
};

export default BookingExpired;
