import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { getBlogBySlug, incrementBlogView } from "../api/BlogAPI";
import { getTopRatedMovies } from "../api/MovieAPI";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const handleNavigateMovie = (slug) => {
    navigate(`/movie/${slug}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog detail
        const blogResponse = await getBlogBySlug(slug);
        setBlog(blogResponse.data);

        // Fetch top movies
        const moviesResponse = await getTopRatedMovies();
        setTopMovies(moviesResponse.data);
        await incrementBlogView(slug); // Increment blog view count
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Blog Content - Left Column (2/3) */}
        <div className="lg:w-2/3">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {format(new Date(blog.createdAt), "dd/MM/yyyy")}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {blog.views} lượt xem
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {blog.likes} lượt thích
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {parse(blog.content)}
            </div>
          </div>
        </div>

        {/* Movies List - Right Column (1/3) */}
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
  );
}

export default BlogDetail;
