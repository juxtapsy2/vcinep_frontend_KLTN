import React from "react";

export const NotificationTab = () => {
  return (
    <div className=" bg-white">
      <h3 className="text-2xl font-bold text-black mb-6 border-b-2 border-red-600 pb-2">
        Thông báo
      </h3>
      <div className="divide-y divide-gray-200">
        <div className="py-6 text-center">
          <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Không có thông báo mới</p>
        </div>
      </div>
    </div>
  );
};
