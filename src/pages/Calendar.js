import React, { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from "lucide-react";
import { getFullShowtimesByDate } from "../api/ShowTimeAPI";
import LoadingEffect from "../components/LoadingEffect";
import ItemCalendar from "../components/Common/Calendar/ItemCalendar";
import ItemMovieCalendar from "../components/Common/Calendar/ItemMovieCalendar";
import NotFoundCalendar from "../components/Common/Calendar/NotFoundCalendar";
function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const getWeatherIcon = (code) => {
    if (code >= 200 && code < 300)
      return <CloudLightning className="w-4 h-4" />;
    if (code >= 300 && code < 600) return <CloudRain className="w-4 h-4" />;
    if (code >= 600 && code < 700) return <CloudSnow className="w-4 h-4" />;
    if (code === 800) return <Sun className="w-4 h-4" />;
    return <Cloud className="w-4 h-4" />;
  };

  // Hàm format ngày thành chuỗi "dd-mm-yyyy"
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Gọi API lấy danh sách phim khi selectedDate thay đổi
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);
        const formattedDate = formatDate(selectedDate);
        const response = await getFullShowtimesByDate(formattedDate);
        setMovies(response.data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Error fetching movies data");
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, [selectedDate]);

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

        // Gọi API forecast 7 ngày thay vì 5 ngày
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=vi&cnt=56` // Tăng cnt lên 56 để lấy đủ dữ liệu cho 7 ngày
        );
        const data = await response.json();

        const processedData = {};
        const today = new Date();

        // Tạo object lưu trữ thời tiết cho 7 ngày
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateString = date.toDateString();
          processedData[dateString] = {
            temp: null,
            weather: null,
            description: "",
            humidity: null,
            windSpeed: null,
          };
        }

        // Xử lý dữ liệu từ API
        data.list.forEach((item) => {
          const itemDate = new Date(item.dt * 1000);
          const dateString = itemDate.toDateString();

          // Chỉ xử lý dữ liệu trong khoảng 7 ngày
          if (processedData[dateString] && !processedData[dateString].temp) {
            processedData[dateString] = {
              temp: Math.round(item.main.temp),
              weather: item.weather[0].id,
              description: item.weather[0].description,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
            };
          }
        });

        // Đối với những ngày không có dữ liệu từ API, sử dụng dữ liệu của ngày gần nhất
        const dates = Object.keys(processedData);
        for (let i = 0; i < dates.length; i++) {
          if (!processedData[dates[i]].temp && i > 0) {
            processedData[dates[i]] = { ...processedData[dates[i - 1]] };
          }
        }

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
      <div className="flex items-center gap-2 mb-2 mt-2 justify-center">
        <div className="rounded-full bg-red-500 w-4 h-4"></div>
        <h3 className="font-bold text-xl">Phim đang chiếu</h3>
      </div>
      <div className="bg-white px-4 rounded-lg">
        <div className="flex justify-center gap-3 overflow-x-auto pb-4 p-2 min-w-full">
          {getDaysInWeek().map((date, index) => {
            const weatherInfo = weatherData?.[date.toDateString()];
            const today = isToday(date);

            return (
              <ItemCalendar
                index={index}
                date={date}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                weatherInfo={weatherInfo}
                today={today}
                getWeatherIcon={getWeatherIcon}
              />
            );
          })}
        </div>
      </div>

      {/* Hiển thị danh sách phim */}
      <div className="mt-2 p-4">
        {loadingMovies ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#EB514F]"></div>
            <p className="mt-2 text-gray-600">Đang tải danh sách phim...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {movies.map((item) => (
              <ItemMovieCalendar item={item} key={item._id} /> // Sử dụng component ItemMovieCalendar để hiển thị thông tin phim
            ))}
          </div>
        ) : (
          <NotFoundCalendar />
        )}
      </div>
    </div>
  );
}

export default Calendar;
