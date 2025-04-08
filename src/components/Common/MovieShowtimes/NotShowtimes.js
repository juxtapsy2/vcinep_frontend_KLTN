import React from "react";
import { AlertCircle } from "lucide-react";

function NotShowtimes() {
  return (
    <div className="bg-white rounded-lg p-8 mb-8 border-2 border-red-600 ">
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-red-600" />

        <div className="text-center">
          <h3 className="text-red-600 font-semibold text-xl mb-2">
            Không có suất chiếu
          </h3>
          <p className="text-gray-600 text-lg">
            Hiện tại phim chưa có lịch chiếu nào.
            <br />
            Vui lòng quay lại sau!
          </p>
        </div>

        <div className="w-32 h-1 bg-red-600/20 rounded-full mt-2" />
      </div>
    </div>
  );
}

export default NotShowtimes;
