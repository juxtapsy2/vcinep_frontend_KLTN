import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../../pages/NotFound.js";
import * as MovieAPI from "../../../api/MovieAPI.js";
import MovieShowtimes from "../MovieShowtimes/MovieShowtimes.js";
import LoadingEffect from "../../LoadingEffect.js";
import MoviePoster from "./MoviePoster";
import MovieInfo from "./MovieInfo";
import MovieTrailer from "./MovieTrailer";
import MovieComments from "./MovieComment.js";

function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerHeight, setTrailerHeight] = useState(0);
  const { slug } = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        const response = await MovieAPI.getMovieBySlug(slug);
        if (response.success) {
          setMovie(response.data);
        } else {
          console.log("Không thể lấy thông tin phim!");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [slug]);

  useEffect(() => {
    if (!isLoading) {
      setTrailerHeight("400px");
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingEffect />;
  }

  if (!movie) {
    return <NotFound />;
  }

  return (
    <>
      <div className="relative bg-white text-black min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${movie.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-pink-100 opacity-60"></div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <MoviePoster coverImage={movie.coverImage} title={movie.title} />
            <MovieInfo movie={movie} />
          </div>
          <MovieTrailer trailer={movie.trailer} />
        </div>
      </div>
      {/* <div className="bg-white text-black">
        <div className="container mx-auto px-4 py-8">
          <MovieShowtimes movieSlug={movie.slug} name={movie.title} />
        </div>
      </div> */}
      <div className="bg-white text-black">
        <div className="container mx-auto px-4 py-8">
          <MovieShowtimes movieSlug={movie.slug} name={movie.title} />
          <div className="mt-8">
            <MovieComments movieId={movie._id} />
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieDetails;
