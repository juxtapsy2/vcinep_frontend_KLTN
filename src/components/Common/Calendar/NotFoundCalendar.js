import React from "react";

function NotFoundCalendar() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#EB514F]/10 to-[#FF8A65]/10 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#EB514F]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-lg">
        Không có phim nào được chiếu vào ngày này
      </p>
    </div>
  );
}

export default NotFoundCalendar;
