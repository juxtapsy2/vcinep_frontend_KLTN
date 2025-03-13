import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCinemaById, getShowtimesByCinemaId } from "../api/CinemaAPI";
import {
  FiPhone,
  FiMail,
  FiClock,
  FiMap,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

import { BiMovie, BiTime } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import LoadingEffects from "../components/LoadingEffect.js";
function CinemaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState(null);
  const [showtimes, setShowtimes] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const day = days[date.getDay()];
    return `${day}, ${dateString}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [cinemaResponse, showtimesResponse] = await Promise.all([
          getCinemaById(id),
          getShowtimesByCinemaId(id),
        ]);

        if (cinemaResponse.success) {
          setCinema(cinemaResponse.data);
        }

        if (showtimesResponse.success) {
          setShowtimes(showtimesResponse.data.showtimes);
          const dates = Object.keys(showtimesResponse.data.showtimes);
          if (dates.length > 0) setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const groupShowtimesByMovie = (showtimesForDate) => {
    const grouped = {};
    showtimesForDate.forEach((showtime) => {
      const movieId = showtime.movieId._id;
      if (!grouped[movieId]) {
        grouped[movieId] = {
          movie: showtime.movieId,
          showtimes: [],
        };
      }
      grouped[movieId].showtimes.push(showtime);
    });
    return Object.values(grouped);
  };

  const handleMovieClick = (movieSlug) => {
    navigate(`/movie/${movieSlug}`);
  };

  if (isLoading) {
    return <LoadingEffects />;
  }

  if (!cinema) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-800 font-medium">
          Không tìm thấy rạp chiếu phim
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[40vh]">
        <img
          src={cinema.coverImage}
          alt={cinema.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="absolute bottom-0 w-full p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl text-white font-bold mb-3">
                {cinema.name}
              </h1>
              <div className="flex items-center text-gray-200 gap-2">
                <FiMap className="w-5 h-5" />
                <p className="text-lg">{cinema.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <FiPhone className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                  Số điện thoại
                </h3>
                <p className="text-lg font-medium text-black">
                  {cinema.phoneNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <FiMail className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                  Email
                </h3>
                <p className="text-lg font-medium text-black">{cinema.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <BiMovie className="w-7 h-7 text-red-600" />
              <h2 className="text-xl font-medium text-black">
                Lịch chiếu phim tại {cinema?.name}
              </h2>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <FiCalendar className="w-5 h-5 text-red-600" />
                <span className="text-gray-800">
                  {formatDate(selectedDate)}
                </span>
                <FiChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    isDateDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isDateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  {Object.keys(showtimes).map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setIsDateDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-red-50 transition-colors duration-200
                        ${
                          selectedDate === date
                            ? "bg-red-50 text-red-600"
                            : "text-gray-700"
                        }
                      `}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {selectedDate && showtimes[selectedDate]?.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupShowtimesByMovie(showtimes[selectedDate]).map(
                  ({ movie, showtimes }) => (
                    <div
                      key={movie._id}
                      className="bg-white rounded-xl border hover:border-red-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="p-4">
                        <div
                          className="flex gap-4 mb-4 cursor-pointer"
                          onClick={() => handleMovieClick(movie.slug)}
                        >
                          <img
                            src={movie.coverImage}
                            alt={movie.title}
                            className="w-28 h-40 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold mb-2 text-black line-clamp-2 hover:text-red-600 transition-colors">
                              {movie.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <AiFillStar className="w-5 h-5 text-yellow-400 mr-1" />
                              <span>{movie.rating}/10</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {movie.description}
                            </p>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex flex-wrap gap-2">
                            {showtimes.map((showtime) => (
                              <Link
                                key={showtime._id}
                                to={`/booking/${showtime._id}`}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                              >
                                {showtime.showTime}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Không có suất chiếu nào cho ngày này
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CinemaDetail;
