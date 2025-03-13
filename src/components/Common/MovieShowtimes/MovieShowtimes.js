import React, { useState, useEffect } from "react";
import {
  getShowtimeByMovie,
  getMovieShowDates,
} from "../../../api/ShowTimeAPI.js";
import { useNavigate } from "react-router-dom";
import LoadingEffect from "../../LoadingEffect.js";

const MovieShowtimes = ({ movieSlug, name }) => {
  const [state, setState] = useState({
    showtimeData: [],
    loading: true,
    error: null,
    selectedDate: 0,
    selectedLocation: "Toàn quốc",
    selectedTheater: "Tất cả rạp",
    availableDates: [],
    allShowtimeData: [],
  });

  const navigate = useNavigate();

  const getProvince = (address) => {
    return address.split(",").pop().trim();
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isFutureOrToday = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date >= today;
  };

  const locations = [
    "Toàn quốc",
    ...new Set(
      state.allShowtimeData.map((item) => getProvince(item.cinema.address))
    ),
  ];

  const theaters = [
    "Tất cả rạp",
    ...new Set(
      state.allShowtimeData
        .filter(
          (item) =>
            state.selectedLocation === "Toàn quốc" ||
            getProvince(item.cinema.address) === state.selectedLocation
        )
        .map((item) => item.cinema.name)
    ),
  ];

  const handleDateSelection = (index) => {
    setState((prev) => ({
      ...prev,
      selectedDate: index,
      selectedLocation: "Toàn quốc",
      selectedTheater: "Tất cả rạp",
    }));
  };

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await getMovieShowDates(movieSlug);
        if (!response.data.length) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        // Lọc chỉ lấy các ngày từ hiện tại trở đi
        const filteredDates = response.data.filter(isFutureOrToday);

        if (!filteredDates.length) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const dates = filteredDates.map((dateString) => ({
          weekday: isToday(dateString)
            ? "Hôm nay"
            : new Date(dateString).toLocaleDateString("vi-VN", {
                weekday: "long",
              }),
          day: new Date(dateString).getDate(),
          fullDate: dateString,
          isToday: isToday(dateString),
        }));

        const todayIndex = dates.findIndex((date) => date.isToday);

        setState((prev) => ({
          ...prev,
          availableDates: dates,
          selectedDate: todayIndex !== -1 ? todayIndex : 0,
        }));
      } catch (err) {
        setState((prev) => ({ ...prev, error: err.message }));
      }
    };

    fetchDates();
  }, [movieSlug]);

  useEffect(() => {
    if (state.allShowtimeData.length) {
      const filteredData = state.allShowtimeData.filter(
        (item) =>
          state.selectedLocation === "Toàn quốc" ||
          getProvince(item.cinema.address) === state.selectedLocation
      );
      setState((prev) => ({ ...prev, showtimeData: filteredData }));
    }
  }, [state.selectedLocation, state.allShowtimeData]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        if (!state.availableDates.length) return;

        const movieData = {
          slug: movieSlug,
          showDate: state.availableDates[state.selectedDate].fullDate,
          address: "",
          cinemaId: "",
        };

        const response = await getShowtimeByMovie(movieData);
        setState((prev) => ({
          ...prev,
          allShowtimeData: response.data,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      }
    };

    fetchShowtimes();
  }, [movieSlug, state.selectedDate, state.availableDates]);

  const filteredTheaterShowtimes = state.showtimeData
    .filter((item) => {
      const matchTheater =
        state.selectedTheater === "Tất cả rạp" ||
        item.cinema.name === state.selectedTheater;
      const hasShowtimes = item.showtimes.some(
        (st) =>
          st.showDate.split("T")[0] ===
          state.availableDates[state.selectedDate]?.fullDate
      );
      return matchTheater && hasShowtimes;
    })
    .map((cinemaData) => ({
      name: cinemaData.cinema.name,
      showtimes: [
        {
          type: cinemaData.showtimes[0]?.theater.type || "2D",
          times: cinemaData.showtimes
            .filter(
              (st) =>
                st.showDate.split("T")[0] ===
                state.availableDates[state.selectedDate]?.fullDate
            )
            .map((st) => ({
              id: st.id,
              time: st.showTime,
            })),
        },
      ],
    }))
    .filter((theater) => theater.showtimes.some((st) => st.times.length));

  const handleTimeClick = (timeId) => {
    navigate(`/booking/${timeId}`);
  };

  if (state.loading) return null;
  if (state.error) return null;

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600 mb-8 flex items-center">
        <span className="inline-block w-1 h-8 mr-4 bg-gradient-to-b from-red-500 to-red-800" />
        Lịch Chiếu - {name}
      </h1>
      {!state.availableDates.length ? (
        <div className="bg-white rounded-lg p-6 mb-8 border border-red-200">
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              Hiện tại phim không có suất chiếu nào !
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 mb-8 border border-red-200">
          <div className="flex justify-center mb-3 overflow-x-auto whitespace-nowrap">
            {state.availableDates.map((date, index) => (
              <button
                key={index}
                className={`inline-block focus:outline-none px-4 py-2 rounded-lg transition-all duration-200 mx-2 
                ${date.isToday ? "border-2 border-red-500 font-bold" : ""}
                ${
                  state.selectedDate === index
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
                onClick={() => handleDateSelection(index)}
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm font-medium">{date.weekday}</p>
                  <p className="text-base font-bold">
                    {date.day}/{new Date(date.fullDate).getMonth() + 1}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-3">
            <select
              className="p-2 border border-red-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:border-red-500 text-red-700 text-base bg-white"
              value={state.selectedLocation}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  selectedLocation: e.target.value,
                  selectedTheater: "Tất cả rạp",
                }))
              }
            >
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select
              className="p-2 border border-red-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:border-red-500 text-red-700 text-base bg-white"
              value={state.selectedTheater}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  selectedTheater: e.target.value,
                }))
              }
            >
              {theaters.map((theater, index) => (
                <option key={index} value={theater}>
                  {theater}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {filteredTheaterShowtimes.length > 0 ? (
              filteredTheaterShowtimes.map((theater, theaterIndex) => (
                <div
                  key={theaterIndex}
                  className="border border-red-200 p-4 rounded-lg"
                >
                  <h3 className="font-bold text-xl mb-4 text-red-700">
                    {theater.name}
                  </h3>
                  {theater.showtimes.map(
                    (showtime, showtimeIndex) =>
                      showtime.times.length > 0 && (
                        <div key={showtimeIndex} className="mb-4">
                          <p className="font-semibold mb-2 text-xl text-red-600">
                            {showtime.type}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {showtime.times.map((timeObj, timeIndex) => (
                              <button
                                key={timeIndex}
                                onClick={() => handleTimeClick(timeObj.id)}
                                className="px-4 py-2 bg-white text-red-600 rounded-lg text-base font-semibold border border-red-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                {timeObj.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  Không có lịch chiếu phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieShowtimes;
