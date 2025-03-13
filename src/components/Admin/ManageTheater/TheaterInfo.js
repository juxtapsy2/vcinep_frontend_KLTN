import React from "react";
import {
  FilmIcon,
  SpeakerWaveIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const TheaterInfo = ({ theaterInfo }) => {
  if (!theaterInfo) return null;

  return (
    <div className="rounded-t-lg px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FilmIcon className="w-6 h-6 mr-3 text-red-500" />
            Thông tin phòng
          </h3>
          <div className="space-y-3">
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Tên phòng:</span>
              <span className="font-medium text-red-600">
                {theaterInfo.name}
              </span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Loại:</span>
              <span className="font-medium text-red-600">
                {theaterInfo.type}
              </span>
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <SpeakerWaveIcon className="w-6 h-6 mr-3 text-red-500" />
            Thông số kỹ thuật
          </h3>
          <div className="space-y-3">
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Màn hình:</span>
              <span className="font-medium text-red-600">
                {theaterInfo.screenSize}
              </span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Âm thanh:</span>
              <span className="font-medium text-red-600">
                {theaterInfo.soundSystem}
              </span>
            </p>
          </div>
        </div>

        {/* <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <UsersIcon className="w-6 h-6 mr-3 text-red-500" />
            Sức chứa
          </h3>
          <div className="space-y-3">
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Tổng ghế:</span>
              <span className="font-medium text-red-600">
                {theaterInfo.capacity}
              </span>
            </p>
            <p className="flex justify-between items-center">
              <span className="text-gray-600">Kích thước:</span>
              <span className="font-medium text-red-600">
                {theaterInfo.rows} x {theaterInfo.columns}
              </span>
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default TheaterInfo;
