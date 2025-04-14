import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import { useBooking } from "../contexts/BookingContext.js";
import * as ShowTimeAPI from "../api/ShowTimeAPI.js";
import * as TicketAPI from "../api/TicketAPI.js";
import * as SeatStatusAPI from "../api/SeatStatusAPI.js";
import MovieInfo from "../components/Common/Booking/MovieInfo.js";
import SeatSelectionStep from "../components/Common/Booking/SeatSelectionStep.js";
import LoadingEffect from "../components/LoadingEffect.js";
import BookingProgressBar from "../components/Common/BookingProgressBar/BookingProgressBar.jsx";
import ConcessionStep from "../components/Common/Booking/ConcessitonStep.js";
import PaymentStep from "../components/Common/Booking/PaymentStep.js";
import ConfirmationStep from "../components/Common/Booking/ConfirmationStep.js";
import { formatDate, formatShowtimeDate } from "../utils/dateUtils.js";
import {
  extractUniqueRows,
  extractUniqueCols,
  createSeatMatrix,
} from "../utils/formatSeat.js";
import toast, { Toaster } from "react-hot-toast";

import SessionBookedNotification from "../components/Common/Booking/SessionBookedNotification .js";
import BookingExpired from "../components/Common/Booking/BookingExprired.js";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8800");
const Booking = () => {
  const { id } = useParams(); //showtimeId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    bookingData,
    setBookingData,
    handleNext,
    handleBack,
    updateSelectedSeats,
  } = useBooking();

  const [showtimeData, setShowtimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [seatsList, setSeatsList] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasExistingTicket, setHasExistingTicket] = useState(false);
  useEffect(() => {
    if (id) {
      socket.emit("join-room", id);
      socket.on("seat-status-updated", (updatedSeats) => {
        setSeatsList(updatedSeats);
      });
      return () => {
        socket.off("seat-status-updated");
      };
    }
  }, [id]);
  // Kiểm tra quyền truy cập
  useEffect(() => {
    const authTimeout = setTimeout(() => {
      if (!user) navigate("/login");
      setIsCheckingAuth(false);
    }, 500);
    return () => clearTimeout(authTimeout);
  }, [user, navigate]);

  // Kiểm tra vé đã đặt
  useEffect(() => {
    const fetchTicketStatus = async () => {
      if (user && id) {
        try {
          const ticketResponse = await TicketAPI.checkTicketExist(user._id, id);
          if (ticketResponse?.data) setHasExistingTicket(true);
        } catch (error) {
          console.error("Error checking ticket:", error);
        }
      }
    };
    fetchTicketStatus();
  }, [user, id]);

  // Cập nhật trạng thái ghế
  // const handleSeatClick = (seat) => {
  //   if (!seat || seat.status === "reserved") return;
  //   const newStatus = seat.status === "holding" ? "available" : "holding";
  //   updateSelectedSeats(seat);
  //   socket.emit("seat-select", {
  //     seatId: seat.id,
  //     status: newStatus,
  //     userId: user._id,
  //     showtimeId: id,
  //   });
  // };
  // Import toast

  // Hàm handleSeatClick sửa lại như sau
  const handleSeatClick = (seat) => {
    // alert("Bạn đã chọn ghế " + seat.name);
    if (!seat || seat.status === "reserved") return;

    const isCurrentlySelected = bookingData.selectedSeats.find(
      (s) => s.id === seat.id
    );

    // Nếu ghế đang được chọn (chuẩn bị bỏ chọn) thì cho phép bỏ chọn
    if (isCurrentlySelected) {
      const newStatus = "available";
      updateSelectedSeats(seat);
      socket.emit("seat-select", {
        seatId: seat.id,
        status: newStatus,
        userId: user._id,
        showtimeId: id,
      });
      return;
    }

    // Kiểm tra số ghế chỉ khi đang chọn thêm ghế mới
    if (bookingData.selectedSeats.length >= 8) {
      toast.error("Bạn chỉ được đặt tối đa 8 ghế");
      return;
    }

    // Xử lý chọn ghế mới
    const newStatus = "holding";
    updateSelectedSeats(seat);
    socket.emit("seat-select", {
      seatId: seat.id,
      status: newStatus,
      userId: user._id,
      showtimeId: id,
    });
  };

  useEffect(() => {
    socket.on("seat-status-updated", (updatedSeats) => {
      setSeatsList(updatedSeats);
    });
    return () => socket.off("seat-status-updated");
  }, []);

  useEffect(() => {
    const initializeSeats = async () => {
      if (id && user) {
        try {
          // Đợi releaseAllHoldingSeats hoàn thành
          await SeatStatusAPI.releaseAllHoldingSeats(user._id);

          // Sau khi release xong mới emit để lấy danh sách ghế
          socket.emit("get-seats", id);
          socket.on("seats-initialized", (initialSeats) => {
            setSeatsList(initialSeats);
          });
        } catch (error) {
          console.error("Error releasing seats:", error);
        }
      }
    };

    initializeSeats();

    return () => socket.off("seats-initialized");
  }, [id, user]);

  // Lấy thông tin suất chiếu và phim
  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        setLoading(true);
        //Hàm bỏ tất cả các ghê đang chọn
        await SeatStatusAPI.releaseAllHoldingSeats(user._id);
        const showtimeResponse = await ShowTimeAPI.getShowtimeDetail(id);
        setShowtimeData(showtimeResponse);
        const movieDetails = {
          title: showtimeResponse.data.movieInfo?.title || "Không có",
          description:
            showtimeResponse.data.movieInfo?.description || "Không có",
          releaseDate: formatDate(showtimeResponse.data.movieInfo?.startDate),
          cinema: showtimeResponse.data.showInfo?.nameCinema || "Không có",
          theater: showtimeResponse.data.showInfo?.nameTheater || "Không có",
          showtime: `${
            showtimeResponse.data.showInfo?.showtimeTime || "Không có"
          } - ${
            formatShowtimeDate(showtimeResponse.data.showInfo?.showtimeDate) ||
            "Không có"
          }`,
          format: showtimeResponse.data.showInfo?.typeTheater || "Không có",
          rating: showtimeResponse.data.movieInfo?.classification || "Không có",
          backgroundImage: showtimeResponse.data.movieInfo?.coverImage || "#",
          poster: showtimeResponse.data.movieInfo?.coverImage || "#",
          address: showtimeResponse.data.showInfo?.addressCinema || "#",
        };
        setMovie(movieDetails);
        setBookingData({
          ...bookingData,
          userId: user._id,
          movieId: showtimeResponse.data.movieInfo?.id,
          showtimeId: id,
          selectedSeats: [],
          totalPrice: 0,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching showtime data:", error);
        setLoading(false);
      }
    };
    fetchShowtimeDetails();
  }, [id, user, setBookingData]);

  // Xử lý ma trận ghế
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user?._id && id && !bookingData.isNavigatingToPayment) {
        socket.emit("release-all-seats", {
          userId: user._id,
          showtimeId: id,
        });
      }
    };

    const handleTimerExpired = () => {
      if (user?._id && id) {
        socket.emit("release-all-seats", {
          userId: user._id,
          showtimeId: id,
        });
        setBookingData((prev) => ({ ...prev, bookingExpired: true }));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleBeforeUnload);
    const bookingTimer = setTimeout(handleTimerExpired, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
      clearTimeout(bookingTimer);
    };
  }, [user?._id, id, setBookingData, bookingData.isNavigatingToPayment]);
  const rows = extractUniqueRows(seatsList);
  const cols = extractUniqueCols(seatsList);
  const seatMatrix = createSeatMatrix(rows, cols, seatsList);
  const flattenedSeats = seatMatrix.flat().filter((seat) => seat);
  // Render các bước đặt vé
  const renderStepContent = () => {
    switch (bookingData.currentStep) {
      case 2:
        return (
          <SeatSelectionStep
            seatMatrix={flattenedSeats}
            selectedSeats={bookingData.selectedSeats}
            handleSeatClick={handleSeatClick}
          />
        );
      case 3:
        return <ConcessionStep />;
      case 4:
        return <PaymentStep />;
      case 5:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  if (hasExistingTicket) return <SessionBookedNotification />;
  if (loading) return <LoadingEffect />;
  if (bookingData.bookingExpired) return <BookingExpired />;

  return (
    <div className="min-h-screen bg-white">
      <BookingProgressBar currentStep={bookingData.currentStep} />
      <div className="max-w-7xl mx-auto p-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3 mx-auto">{renderStepContent()}</div>
          <div className="w-full md:w-[400px] mx-auto">
            <MovieInfo
              movie={movie}
              selectedSeats={bookingData.selectedSeats}
              totalPrice={bookingData.totalPrice}
              onBack={handleBack}
              onContinue={handleNext}
              bookingData={bookingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
