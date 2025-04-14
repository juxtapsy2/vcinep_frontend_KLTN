import React, { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getWeatherIcon = (code) => {
    if (code >= 200 && code < 300)
      return <CloudLightning className="w-4 h-4" />;
    if (code >= 300 && code < 600) return <CloudRain className="w-4 h-4" />;
    if (code >= 600 && code < 700) return <CloudSnow className="w-4 h-4" />;
    if (code === 800) return <Sun className="w-4 h-4" />;
    return <Cloud className="w-4 h-4" />;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError("Unable to retrieve your location");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;

      try {
        const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=vi`
        );
        const data = await response.json();

        const processedData = {};
        data.list.forEach((item) => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!processedData[date]) {
            processedData[date] = {
              temp: Math.round(item.main.temp),
              weather: item.weather[0].id,
              description: item.weather[0].description,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
            };
          }
        });
        setWeatherData(processedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Error fetching weather data");
      }
    };

    fetchWeather();
  }, [location]);

  const getDaysInWeek = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-center gap-4 overflow-x-auto pb-4 p-2 min-w-full">
          {getDaysInWeek().map((date, index) => {
            const weatherInfo = weatherData?.[date.toDateString()];
            const today = isToday(date);

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
                    <span className="text-sm font-bold mt-1">
                      {weatherInfo.temp}°C
                    </span>
                    <span className="text-xs text-center mt-1 capitalize">
                      {weatherInfo.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
