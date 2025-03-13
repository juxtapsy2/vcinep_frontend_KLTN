import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { getAllBlogs } from "../api/BlogAPI";
import { getTopRatedMovies } from "../api/MovieAPI"; // Import the API function
import { useNavigate } from "react-router-dom";

import LoadingEffect from "../components/LoadingEffect";
function Blog() {
  const [newsItems, setNewsItems] = useState([]);
  const [topMovies, setTopMovies] = useState([]); // New state for movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const handleNavigateMovie = (slug) => {
    navigate(`/movie/${slug}`);
  };
  const handleNavigateBlog = (slug) => {
    navigate(`/blog/${slug}`);
  };
  const fetchBlogs = async (page) => {
    setLoading(true);
    try {
      const response = await getAllBlogs(page, 10);
      setNewsItems(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách blogs.");
      setLoading(false);
    }
  };

  // New function to fetch top rated movies
  const fetchTopMovies = async () => {
    try {
      const response = await getTopRatedMovies();
      setTopMovies(response.data);
    } catch (err) {
      console.error("Error fetching top rated movies:", err);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
    fetchTopMovies(); // Fetch movies when component mounts
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <LoadingEffect />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white px-3 sm:px-3 py-5 sm:py-7">
      <div className="container mx-auto ">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3 space-y-3">
            <div className="border-b-2 border-red-600  mb-2">
              <span className="border-l-4 border-solid border-red-600 mr-2"></span>
              <h1 className="mb-4 text-xl inline-block uppercase font-medium text-black ">
                Blog điện ảnh
              </h1>
            </div>

            {newsItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleNavigateBlog(item?.slug)}
                className="flex flex-col md:flex-row  bg-white overflow-hidden  duration-300"
              >
                <div className="md:w-1/3 h-[150px] mr-1">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md "
                  />
                </div>
                {/* Content Container */}
                <div className="md:w-2/3 px-2">
                  <h2 className="text-xl font-medium mb-1 hover:text-red-600 cursor-pointer">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">
                    {parse(
                      item.content.length > 150
                        ? item.content.slice(0, 150) + "..."
                        : item.content
                    )}
                  </p>
                  {/* Engagement Metrics */}
                  <div className="flex items-center gap-4">
                    {/* Thích (Like Icon) */}
                    <div className="flex items-center gap-2">
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Thích"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                      <span className="text-gray-500 text-sm">
                        {item.likes}
                      </span>
                    </div>

                    {/* Lượt Xem (View Icon) */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`/blog/${item.slug}`} // Link chi tiết bài viết
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Xem bài viết"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </a>
                      <span className="text-gray-500 text-sm">
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button
                className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 mx-1 ${
                    currentPage === index + 1
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  } rounded`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </button>
            </div>
          </div>
          {/* Sidebar - Movies Column (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-red-500 w-3 h-3 sm:w-4 sm:h-4"></div>
                <h3 className="font-medium text-lg sm:text-xl">Phim nổi bật</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-4">
                  {topMovies.map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => handleNavigateMovie(movie?.slug)}
                      className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                      {/* Movie Thumbnail */}
                      <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={movie.coverImage}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Movie Info */}{" "}
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-base font-medium text-black hover:text-red-600 cursor-pointer line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-600 line-clamp-3">
                            {movie.description.slice(0, 150)}
                            {movie.description.length > 150 && "..."}
                          </p>
                          <div className="flex items-center mt-2">
                            <svg
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-xs text-gray-700">
                              {movie.rating}/10
                            </span>
                          </div>
                        </div>
                        {/* Button Mua Vé */}
                        <button
                          className="mt-2 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md shadow hover:bg-red-700 transition w-[100px]"
                          onClick={() => handleNavigateMovie(movie?.slug)}
                        >
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 21h6m-6 0a3 3 0 01-3-3V8.65a2 2 0 011.21-1.85l6-3a2 2 0 011.58 0l6 3A2 2 0 0121 8.65V18a3 3 0 01-3 3m-9 0h6"
                            />
                          </svg> */}
                          Mua Vé
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
