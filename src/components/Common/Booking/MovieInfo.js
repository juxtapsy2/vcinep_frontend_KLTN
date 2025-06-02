import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createMoMoPayment } from "../../../api/PaymentAPI.js";
import { useBooking } from "../../../contexts/BookingContext.js";
import io from "socket.io-client";
import ConfirmPayment from "./ConfirmPayment.js";
import { backendURL } from "../../../constants/constants.js";

const socket = io.connect(backendURL);
const MovieInfo = ({
  movie,
  selectedSeats,
  totalPrice,
  onBack,
  onContinue,
  bookingData,
}) => {
  const { setPaymentNavigation } = useBooking();

  const { setBookingExpired } = useBooking();
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setBookingExpired();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setBookingExpired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const groupedSeats = selectedSeats.reduce((acc, seat) => {
    const key = seat.type;
    if (!acc[key]) {
      acc[key] = {
        seats: [],
        count: 0,
        totalPrice: 0,
      };
    }
    acc[key].seats.push(`${seat.row}${seat.col}`);
    acc[key].count++;
    acc[key].totalPrice += seat.price;
    return acc;
  }, {});
  const groupedConcessions = bookingData.concessions.reduce((acc, item) => {
    if (item.count > 0) {
      acc[item.title] = {
        count: item.count,
        totalPrice: item.price * item.count,
      };
    }
    return acc;
  }, {});

  const hasSeats = selectedSeats.length > 0;
  const hasConcessions = Object.keys(groupedConcessions).length > 0;
  const redirectMoMo = async () => {
    setIsConfirmModalOpen(false);

    try {
      const paymentData = {
        orderInfo: `Payment for ${movie?.title}`,
        amount: totalPrice,
        userId: bookingData.userId,
        showtimeId: bookingData.showtimeId,
        movieId: bookingData.movieId,
        selectedSeats: selectedSeats.map((seat) => ({
          seatId: seat.id,
          seatNumber: `${seat.row}${seat.col}`,
          type: seat.type,
          price: seat.price,
        })),
        concessions: bookingData.concessions.map((item) => ({
          itemId: item.id,
          name: item.title,
          quantity: item.count,
          price: item.price,
        })),
        payment: "momo",
      };
      // alert("Payment Data: " + JSON.stringify(paymentData, null, 2));

      const response = await createMoMoPayment(paymentData);
      // Chuyển hướng đến trang thanh toán MoMo
      if (response.data?.payUrl) {
        window.location.href = response.data?.payUrl;
      }
    } catch (error) {
      toast.error("Lỗi khi tạo thanh toán: " + error.message);
    }
  };
  const handlePayment = async () => {
    console.log("BookingPaymaney");
    console.log(bookingData);
    // socket.emit("update-seats-to-holding", {
    //   selectedSeats: selectedSeats.map((seat) => seat.id), // Chỉ cần id ghế
    //   userId: bookingData.userId, // ID người dùng
    // });
    setIsConfirmModalOpen(true);
    setPaymentNavigation(true); // Đánh dấu đang chuyển đến trang thanh toán
  };
  const onConfirmBooking = () => {
    handlePayment();
  };
  const handleNextStep = () => {
    if (bookingData.currentStep === 2 && selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế trước khi tiếp tục!");
      return;
    }
    onContinue();
  };
  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden pb-4">
        <Toaster />

        <div className="relative h-27">
          <div className="absolute inset-0">
            <img
              src={movie?.backgroundImage}
              alt="Movie Background"
              className="w-full h-full object-cover filter blur-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="relative h-full p-4 flex items-end">
            <img
              src={movie?.poster}
              alt={movie?.title}
              className="w-24 h-36 rounded-lg shadow-lg"
            />
            <div className="ml-4 text-white">
              <h1 className=" font-bold" style={{ fontsize: "20px" }}>
                {movie?.title?.length > 25
                  ? movie.title.substring(0, 25) + "..."
                  : movie?.title}
              </h1>
              <p className="text-sm mt-1 italic opacity-80">
                {movie?.description?.length > 150
                  ? movie.description.substring(0, 150) + "..."
                  : movie?.description}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="bg-red-600 px-2 py-0.5 rounded text-sm">
                  {movie?.format}
                </span>
                <span className="bg-gray-900 px-2 py-0.5 rounded text-sm">
                  {movie?.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 space-y-2 pt-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-700">
                  {movie?.cinema} - {movie?.theater}
                </p>
                <p className="text-gray-700 mt-1" style={{ fontSize: "14px" }}>
                  {movie?.address}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-700">
                Suất chiếu:{" "}
                <span className="font-medium">{movie?.showtime}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 mt-2 space-y-2">
          <div className="space-y-2">
            {hasSeats && (
              <div className="border-t pt-2">
                {Object.entries(groupedSeats).map(([type, data]) => (
                  <div key={type} className="mb-2">
                    <div className="flex justify-between">
                      <p className="text-gray-700">
                        {data.count} x {type}
                      </p>
                      <p className="font-medium">
                        {formatCurrency(data.totalPrice)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ghế: {data.seats.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {hasConcessions && (
              <div className="border-t pt-2">
                {Object.entries(groupedConcessions).map(([title, data]) => (
                  <div key={title} className="mb-2 flex justify-between">
                    <p className="text-gray-700">
                      {data.count} x {title}
                    </p>
                    <p className="font-medium">
                      {formatCurrency(data.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Tổng tiền:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 bg-white rounded-lg border">
            <div className="flex justify-center items-center space-x-3">
              <svg
                className="w-5 h-5 text-red-500 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-bold text-red-600 text-xl">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <div className="flex gap-3 ">
            <button
              onClick={onBack}
              className="flex-1 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-gray-700"
            >
              Quay lại
            </button>
            <button
              onClick={
                bookingData.currentStep === 4
                  ? onConfirmBooking
                  : handleNextStep
              }
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {bookingData?.payment ? "Thanh toán" : "Tiếp tục"}
            </button>
          </div>
        </div>
      </div>
      <ConfirmPayment
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        onConfirmBooking={onConfirmBooking}
        movie={movie}
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        groupedSeats={groupedSeats}
        groupedConcessions={groupedConcessions}
        formatCurrency={formatCurrency}
        bookingData={bookingData}
        redirectMoMo={redirectMoMo}
      />
    </>
  );
};

export default MovieInfo;
