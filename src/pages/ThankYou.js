import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addNewTicket, sendTicketEmailRequest } from "../api/TicketAPI.js";
import toast, { Toaster } from "react-hot-toast";
import { useBooking } from "../contexts/BookingContext"; // Thêm import này

import LoadingEffect from "../components/LoadingEffect.js";
import SuccessPayment from "../components/Common/Payment/SuccessPayment.js";
import FailedPayment from "../components/Common/Payment/FailedPayment.js";
import { formatSeats, formatConcessions } from "../utils/ticketFormatter.js";
import io from "socket.io-client";
import { backendURL } from "../constants/constants.js";

const socket = io.connect(backendURL);

const animationStyles = `
  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(10px, 10px) rotate(180deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }

  .animate-float-slow {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-float-medium {
    animation: float 10s ease-in-out infinite;
  }
  
  .animate-float-fast {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-custom {
    animation: pulse 6s ease-in-out infinite;
  }
`;

function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { resetBooking } = useBooking(); // Thêm dòng này
  // Thêm useEffect mới để reset booking
  useEffect(() => {
    resetBooking();
  }, []);
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const processPayment = async () => {
        const searchParams = new URLSearchParams(location.search);
        const resultCode = searchParams.get("resultCode");
        const extraData = searchParams.get("extraData");

        if (resultCode === "0") {
          try {
            const decodedData = JSON.parse(atob(extraData));
            console.log("Decoded data:", decodedData);

            // Join the room for this showtime
            socket.emit("join-room", decodedData.showtimeId);

            // Update seat status to reserved
            const selectedSeatIds = decodedData.selectedSeats.map(
              (seat) => seat.seatId
            );

            // Update each seat status through socket
            selectedSeatIds.forEach((seatId) => {
              socket.emit("seat-select", {
                seatId: seatId,
                status: "reserved",
                userId: decodedData.userId,
                showtimeId: decodedData.showtimeId,
              });
            });

            const ticketData = {
              showtimeId: decodedData.showtimeId,
              seats: formatSeats(decodedData.selectedSeats),
              concession: formatConcessions(decodedData.concessions),
              totalPrice: decodedData.amount,
              userId: decodedData.userId,
              code: Math.floor(100000 + Math.random() * 900000).toString(),
            };

            const result = await addNewTicket(ticketData);
            await sendTicketEmailRequest(ticketData);

            console.log("Ticket created successfully:", result);
            toast.success("Payment successful! Your ticket has been created.");
            setPaymentStatus(true);
            setIsLoading(false);
          } catch (error) {
            console.error("Error processing payment:", error);
            toast.error(
              error.response?.data?.message || "Error creating ticket."
            );
            setPaymentStatus(false);
            setIsLoading(false);
          }
        } else {
          console.log("Payment failed");
          toast.error("Payment failed. Please try again later.");
          setPaymentStatus(false);
          setIsLoading(false);
        }
      };
      processPayment();
    }
  }, [location.search, navigate]);

  // Listen for seat status updates
  useEffect(() => {
    socket.on("seat-status-updated", (updatedSeats) => {
      console.log("Seats updated:", updatedSeats);
    });

    return () => {
      socket.off("seat-status-updated");
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-red-50 to-white">
      <Toaster />
      <div className="absolute inset-0 animate-background">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-100/40 to-white/40 blur-3xl mix-blend-soft-light animate-bubble"></div>
          <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-white/60 to-red-50/60 blur-3xl mix-blend-soft-light animate-bubble-delay-1"></div>
          <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-red-100/50 to-white/50 blur-3xl mix-blend-soft-light animate-bubble-delay-2"></div>
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-red-50/40 to-white/40 blur-2xl mix-blend-soft-light animate-bubble"></div>
        </div>
      </div>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="p-0 rounded-xl bg-white/80 backdrop-blur-sm">
          {isLoading && <LoadingEffect />}
          {!isLoading && paymentStatus === true && <SuccessPayment />}
          {!isLoading && paymentStatus === false && <FailedPayment />}
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
