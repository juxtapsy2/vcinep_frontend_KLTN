import React, { useState, useEffect } from "react";
import * as MovieAPI from "../api/MovieAPI.js";
import LoadingEffect from "./../components/LoadingEffect.js";
import MovieItem from "../components/Common/MovieItem/MovieItem.js";
import { MdLocalMovies } from "react-icons/md";
import { RiMovieLine } from "react-icons/ri";
function Movie() {
  const [activeTab, setActiveTab] = useState("nowShowing");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (type) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (type === "nowShowing") {
        response = await MovieAPI.getNowShowingMovies();
      } else {
        response = await MovieAPI.getComingSoonMovies();
      }

      if (response.success) {
        setMovies(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(activeTab);
  }, [activeTab]);

  const tabs = [
    {
      id: "nowShowing",
      label: "PHIM ĐANG CHIẾU",
      icon: <MdLocalMovies className="text-xl sm:text-2xl" />,
    },
    {
      id: "upcoming",
      label: "PHIM SẮP CHIẾU",
      icon: <RiMovieLine className="text-xl sm:text-2xl" />,
    },
  ];
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-3 sm:px-3 py-5 sm:py-7">
      <div className="max-w-7xl mx-auto mb-6 sm:mb-10">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-8 relative">
          <div className="absolute bottom-0 w-full h-[1px] bg-gray-200"></div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 sm:px-8 py-3 sm:py-5 text-sm sm:text-base md:text-lg font-medium transition-all duration-300 flex items-center gap-2
    ${
      activeTab === tab.id
        ? "before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-red-500 before:via-red-600 before:to-red-500"
        : "hover:text-red-500"
    }
    after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-200
    hover:after:bg-gradient-to-r hover:after:from-red-500/50 hover:after:via-red-600/50 hover:after:to-red-500/50 after:transition-all after:duration-300
    tracking-wide`}
            >
              <span
                className={
                  activeTab === tab.id ? "text-red-600" : "text-gray-600"
                }
              >
                {tab.icon}
              </span>
              <span
                className={`
              ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-red-500 hover:via-red-600 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
              }
            `}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingEffect />
      ) : (
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {movies.length === 0 ? (
            <div className="text-center text-gray-600 py-8 sm:py-12">
              Không có phim nào trong danh mục này
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {movies.map((movie) => (
                <div key={movie._id} className="w-full">
                  <MovieItem movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Movie;
