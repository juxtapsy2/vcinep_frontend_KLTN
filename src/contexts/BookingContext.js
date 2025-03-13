// BookingContext.js
import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

const initialBookingState = {
  movieId: null,
  showtimeId: null,
  selectedSeats: [],
  concessions: [],
  payment: null,
  totalPrice: 0,
  currentStep: 2, // Add currentStep to initial state
  bookingExpired: false, // Thêm trạng thái hết hạn
  isNavigatingToPayment: false, // Thêm trạng thái mới
};

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState(initialBookingState);
  const setBookingExpired = () => {
    setBookingData((prevData) => ({
      ...initialBookingState,
      bookingExpired: true,
    }));
  };
  const setPaymentNavigation = (isNavigating) => {
    setBookingData((prevData) => ({
      ...prevData,
      isNavigatingToPayment: isNavigating,
    }));
  };

  const updateSelectedSeats = (seat) => {
    setBookingData((prevData) => {
      console.log("Input seat:", seat);

      let newSelectedSeats;
      const existingSeat = prevData.selectedSeats.find((s) => s.id === seat.id);

      if (existingSeat) {
        newSelectedSeats = prevData.selectedSeats.filter(
          (s) => s.id !== seat.id
        );
      } else {
        newSelectedSeats = [...prevData.selectedSeats, seat];
      }

      const seatsTotal = newSelectedSeats.reduce((sum, s) => {
        const seatPrice = Number(s.price) || 0;
        return sum + seatPrice;
      }, 0);

      const concessionsTotal = prevData.concessions.reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemCount = Number(item.count) || 0;
        return sum + itemPrice * itemCount;
      }, 0);

      const newTotalPrice = seatsTotal + concessionsTotal;

      return {
        ...prevData,
        selectedSeats: newSelectedSeats,
        totalPrice: newTotalPrice,
      };
    });
  };

  const updateConcessions = (concessionItem) => {
    setBookingData((prevData) => {
      const existingIndex = prevData.concessions.findIndex(
        (item) => item.id === concessionItem.id
      );

      let newConcessions;
      if (concessionItem.count === 0) {
        newConcessions = prevData.concessions.filter(
          (item) => item.id !== concessionItem.id
        );
      } else if (existingIndex !== -1) {
        newConcessions = prevData.concessions.map((item, index) =>
          index === existingIndex ? concessionItem : item
        );
      } else {
        newConcessions = [...prevData.concessions, concessionItem];
      }

      const concessionsTotal = newConcessions.reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemCount = Number(item.count) || 0;
        return sum + itemPrice * itemCount;
      }, 0);

      const seatsTotal = prevData.selectedSeats.reduce((sum, seat) => {
        const seatPrice = Number(seat.price) || 0;
        return sum + seatPrice;
      }, 0);

      const newTotalPrice = concessionsTotal + seatsTotal;

      return {
        ...prevData,
        concessions: newConcessions,
        totalPrice: newTotalPrice,
      };
    });
  };

  const setCurrentStep = (step) => {
    setBookingData((prevData) => ({
      ...prevData,
      currentStep: step,
    }));
  };

  const handleNext = () => {
    setBookingData((prevData) => ({
      ...prevData,
      currentStep: Math.min(prevData.currentStep + 1, 5),
    }));
  };

  const handleBack = () => {
    setBookingData((prevData) => ({
      ...prevData,
      currentStep: Math.max(prevData.currentStep - 1, 2),
    }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingState);
  };

  const updateBookingData = (newData) => {
    setBookingData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        updateSelectedSeats,
        updateConcessions,
        resetBooking,
        updateBookingData,
        setCurrentStep,
        handleNext,
        handleBack,
        setBookingExpired, // Thêm function mới
        setPaymentNavigation, // Thêm function mới
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
