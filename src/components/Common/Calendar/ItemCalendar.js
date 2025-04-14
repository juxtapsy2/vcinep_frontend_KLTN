import React from "react";

function ItemCalendar({
  index,
  date,
  selectedDate,
  setSelectedDate,
  weatherInfo,
  today,
  getWeatherIcon,
}) {
  return (
    <button
      key={index}
      onClick={() => setSelectedDate(date)}
      className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 min-w-[120px]
      ${today ? "ring-2 ring-red-500" : ""}
      ${
        selectedDate.toDateString() === date.toDateString()
          ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
          : "bg-gray-50 hover:bg-red-50"
      }`}
    >
      <span className="text-xs font-medium">
        {date.toLocaleDateString("vi-VN", { weekday: "long" })}
      </span>
      <span className="text-2xl font-bold my-1">
        {date.getDate()}/{date.getMonth() + 1}
      </span>
      {weatherInfo && (
        <div
          className={`flex flex-col items-center mt-1 p-2 rounded w-full
        ${
          selectedDate.toDateString() === date.toDateString()
            ? "bg-white/10"
            : "bg-white"
        }`}
        >
          {getWeatherIcon(weatherInfo.weather)}
          <span className="text-sm font-bold mt-1">{weatherInfo.temp}°C</span>
          <span className="text-xs text-center mt-1 capitalize">
            {weatherInfo.description}
          </span>
        </div>
      )}
    </button>
  );
}

export default ItemCalendar;
