import React from "react";
import CinemaItem from "../CinemaItem/CinemaItem.js";
function CinemaList({ cinemas }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">
        Hệ Thống Rạp
      </h2>

      <div className="relative mb-8 max-w-md mx-auto">
        <select className="block appearance-none w-full bg-white border border-red-300 text-red-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-red-500 shadow-md">
          <option value="">Chọn vị trí</option>
          <option value="hanoi">Hà Nội</option>
          <option value="hochiminh">Hồ Chí Minh</option>
          <option value="danang">Đà Nẵng</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-red-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cinemas.map((cinema) => (
          <CinemaItem key={cinema.id} cinema={cinema} />
        ))}
      </div>
    </div>
  );
}
export default CinemaList;
