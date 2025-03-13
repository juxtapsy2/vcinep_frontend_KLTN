import React, { useState } from "react";

function RatingModal({ isOpen, onClose, onSubmit, currentRating = 0 }) {
  const [selectedScore, setSelectedScore] = useState(currentRating);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 mx-4 sm:mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-500">
          Đánh giá phim
        </h2>
        <div className="flex justify-center mb-6">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((star) => (
            <button
              key={star}
              onClick={() => setSelectedScore(star)}
              className={`text-3xl mx-1 transition-transform duration-200 ${
                selectedScore >= star ? "text-yellow-400" : "text-gray-300"
              } hover:scale-110`}
            >
              ★
            </button>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={() => selectedScore && onSubmit(selectedScore)}
            disabled={selectedScore === 0}
            className={`px-4 py-2 text-white rounded-lg transition-all ${
              selectedScore > 0
                ? "bg-gradient-to-r from-red-600 to-pink-500 hover:opacity-90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;
