import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import SeatItem from "./SeatItem";
import Screen from "./Screen";
import SeatLegend from "./SeatLegend";

const SeatSelectionStep = ({ seatMatrix, handleSeatClick, selectedSeats }) => {
  const { user } = useAuth();

  const ROW_COUNT = 24;
  const MAX_COL = Math.max(...seatMatrix.map((seat) => seat.col), 20);
  const allRows = Array.from({ length: ROW_COUNT }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const findSeat = (row, col) =>
    seatMatrix.find((seat) => seat.row === row && seat.col === col);

  const getSeatClasses = (seat) => {
    const baseClasses =
      "w-8 h-8 rounded text-xs font-medium transition-all duration-200 border";

    if (seat.status === "reserved") {
      return `${baseClasses} bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed`;
    }
    if (seat.status === "holding") {
      if (seat.userId === user?._id) {
        return `${baseClasses} bg-red-600 border-red-700 text-white shadow-red-200`;
      }
      return `${baseClasses} bg-blue-100 border-blue-400 text-blue-700 cursor-not-allowed`;
    }
    if (selectedSeats.some((s) => s.id === seat.id)) {
      return `${baseClasses} bg-red-600 border-red-700 text-white shadow-red-200`;
    }
    if (seat.type === "vip") {
      return `${baseClasses} bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100`;
    }
    return `${baseClasses} bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50`;
  };

  const renderRow = (row) => (
    <div key={row} className="flex gap-2">
      {Array.from({ length: MAX_COL }, (_, col) => {
        const seat = findSeat(row, col + 1);
        if (!seat) return <div key={`${row}${col}`} className="w-8 h-8" />;
        return (
          <SeatItem
            key={seat.id}
            seat={seat}
            handleSeatClick={handleSeatClick}
            getSeatClasses={getSeatClasses}
            userId={user?._id}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full">
      <Screen />
      <div className="relative w-full">
        <div className="absolute left-0 top-0 flex flex-col gap-2">
          {allRows.map((row) => (
            <div
              key={row}
              className="h-8 flex items-center font-semibold text-gray-600"
            >
              {row}
            </div>
          ))}
        </div>
        <div className="ml-12">
          <div className="grid gap-2">{allRows.map(renderRow)}</div>
        </div>
      </div>
      <SeatLegend />
    </div>
  );
};

export default SeatSelectionStep;
