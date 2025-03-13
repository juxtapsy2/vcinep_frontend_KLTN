import React, { useState, useEffect } from "react";
import "./QuickBookingBar.css";
import { useNavigate } from "react-router-dom";
import {
  getAllActiveMovies,
  getActiveCinemasByMovieId,
  getShowDatesByMovieAndCinema,
  getShowtimesByMovieCinemaDate,
} from "../../../api/QuickTicketAPI.js";

function QuickBookingBar() {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      loadCinemas(selectedMovie);
      setCinemas([]);
      setDates([]);
      setTimes([]);
      setSelectedCinema("");
      setSelectedDate("");
      setSelectedShowtime("");
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (selectedMovie && selectedCinema) {
      loadDates(selectedMovie, selectedCinema);
      setDates([]);
      setTimes([]);
      setSelectedDate("");
      setSelectedShowtime("");
    }
  }, [selectedCinema]);

  useEffect(() => {
    if (selectedMovie && selectedCinema && selectedDate) {
      loadTimes(selectedMovie, selectedCinema, selectedDate);
      setTimes([]);
      setSelectedShowtime("");
    }
  }, [selectedDate]);

  const loadMovies = async () => {
    try {
      const response = await getAllActiveMovies();
      setMovies(response.data);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const loadCinemas = async (movieId) => {
    try {
      const response = await getActiveCinemasByMovieId(movieId);
      setCinemas(response.data);
    } catch (error) {
      console.error("Error loading cinemas:", error);
    }
  };

  const loadDates = async (movieId, cinemaId) => {
    try {
      const response = await getShowDatesByMovieAndCinema(movieId, cinemaId);
      setDates(response.data);
    } catch (error) {
      console.error("Error loading dates:", error);
    }
  };

  const loadTimes = async (movieId, cinemaId, showDate) => {
    try {
      const response = await getShowtimesByMovieCinemaDate(
        movieId,
        cinemaId,
        showDate
      );
      setTimes(response.data);
    } catch (error) {
      console.error("Error loading times:", error);
    }
  };

  const handleBooking = () => {
    if (selectedShowtime) {
      navigate(`/booking/${selectedShowtime}`);
    }
  };

  return (
    <div className="quick-booking-bar mt-4">
      <div className="booking-container">
        <div className="booking-form">
          <div className="form-group">
            <select
              className="select-input"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
            >
              <option value="">Chọn Phim</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              className="select-input"
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
              disabled={!selectedMovie}
            >
              <option value="">Chọn Rạp</option>
              {cinemas.map((cinema) => (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              className="select-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={!selectedCinema}
            >
              <option value="">Chọn Ngày</option>
              {dates.map((date) => (
                <option key={date.idShowtime} value={date.showDate}>
                  {new Date(date.showDate).toLocaleDateString("vi-VN")}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              className="select-input"
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(e.target.value)}
              disabled={!selectedDate}
            >
              <option value="">Chọn Suất</option>
              {times.map((time) => (
                <option key={time.idShowtime} value={time.idShowtime}>
                  {time.showTime}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group button-group">
            <button
              className="book-button"
              onClick={handleBooking}
              disabled={!selectedShowtime}
            >
              Mua vé nhanh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickBookingBar;
