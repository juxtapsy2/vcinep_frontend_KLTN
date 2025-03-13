import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Thêm import này

import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { getAllCinemasClient } from "../api/CinemaAPI";
import LoadingEffect from "../components/LoadingEffect";
function Cinema() {
  const navigate = useNavigate(); // Thêm hook useNavigate

  const [cinemas, setCinemas] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const response = await getAllCinemasClient(currentPage, 8, search);
      setCinemas(response.data.cinemas);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };
  const handleViewDetails = (cinemaId) => {
    navigate(`/cinema/${cinemaId}`);
  };

  return (
    <div className="min-h-screen bg-white px-2 py-4">
      {/* Header Section */}
      <div className="container mx-auto mb-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-red-600 mb-2">
            Hệ thống rạp
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
            Chúng tôi có hơn{" "}
            <span className="font-semibold text-red-600 inline-flex items-center">
              +100
            </span>{" "}
            hệ thống rạp trên toàn quốc
          </p>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by cinema name..."
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-10 pr-4 border border-gray-200 rounded-full focus:outline-none focus:border-red-500 shadow-sm"
            />
            <FiSearch
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Cinema Grid */}
      {loading ? (
        <LoadingEffect />
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cinemas.map((cinema) => (
              <div
                key={cinema._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border"
              >
                <div className="relative h-40">
                  <img
                    src={cinema.coverImage}
                    alt={cinema.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {cinema.name}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <MdLocationOn className="flex-shrink-0 mt-1 text-red-500" />
                      <p className="text-gray-600 line-clamp-2 text-xs">
                        {cinema.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MdPhone className="text-gray-400" />
                      <span className="text-gray-600">
                        {cinema.phoneNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MdEmail className="text-gray-400" />
                      <span className="text-gray-600 truncate">
                        {cinema.email}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleViewDetails(cinema._id)}
                      className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-lg shadow-sm">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 text-sm ${
                      currentPage === index + 1
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } ${
                      index === 0
                        ? "rounded-l-lg"
                        : index === totalPages - 1
                        ? "rounded-r-lg"
                        : ""
                    } border border-gray-200`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cinema;
