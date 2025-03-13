import React from "react";

function SeatStatusBadge() {
  return (
    <div>
      <div className="mb-2 mt-4 flex gap-4 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-300"></div>
          <span>Ghế thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
          <span>Ghế VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
          <span>Không có ghế</span>
        </div>
      </div>
    </div>
  );
}

export default SeatStatusBadge;
