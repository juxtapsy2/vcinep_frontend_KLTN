import React from "react";

const PromotionItem = ({ item }) => {
  return (
    <div className="flex-none w-full sm:w-1/3 p-2">
      <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] h-[280px]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-red-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <h4 className="font-bold text-xl mb-2 text-red-600 truncate">
            {item.title}
          </h4>
          <p className="text-sm mb-3 text-gray-600">{item.promotionPeriod}</p>
          <div className="flex items-center justify-between">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Hot Deal
            </span>
            <button className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-300">
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionItem;
