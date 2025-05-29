import React from "react";
import { FaTimes } from "react-icons/fa";

const InfoModal = ({
  show,
  onClose,
  title = "Chi tiết",
  image,
  status,
  fields = [],
}) => {
  return (
    show && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-lg p-6 min-w-fit max-w-2xl min-h-fit mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 px-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {image && (
                <div className="flex items-center gap-4">
                  <img
                    src={image.url}
                    alt={image.title || "thumbnail"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{image.title}</h3>
                  </div>
                </div>
              )}

              {fields
                .slice(0, Math.ceil(fields.length / 2))
                .map(({ label, value }, idx) => (
                  <div key={idx}>
                    <p className="text-gray-500 text-sm">{label}:</p>
                    <p className="text-gray-800 font-medium">{value}</p>
                  </div>
                ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 relative mt-16">
              {fields
                .slice(Math.ceil(fields.length / 2))
                .map(({ label, value }, idx) => (
                  <div key={idx}>
                    <p className="text-gray-500 text-sm">{label}:</p>
                    <p className="text-gray-800 font-medium">{value}</p>
                  </div>
                ))}
                {/* Status Badge */}
              {status && (
                <div className="bottom-0">
                  <span
                    className={`px-4 py-1 mt-6 rounded-full text-sm font-medium shadow-md ${
                      status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default InfoModal;