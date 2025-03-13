import React from "react";

const SeatLegend = () => {
  const legends = [
    { label: "Đã đặt", color: "bg-gray-200 border-gray-200" },
    { label: "Ghế thường", color: "bg-white border-gray-300" },
    { label: "Ghế VIP", color: "bg-yellow-50 border-yellow-400" },
    { label: "Đang chọn", color: "bg-red-600 border-red-700" },
    { label: "Đang giữ", color: "bg-blue-100 border-blue-400" },
  ];

  return (
    <div className="flex justify-center gap-6 mt-12">
      {legends.map((legend, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-6 h-6 rounded shadow mr-2 ${legend.color}`} />
          <span className="text-sm font-medium text-gray-600">
            {legend.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;
