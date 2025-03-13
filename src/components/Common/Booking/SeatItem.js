import React from "react";

const SeatItem = ({ seat, handleSeatClick, getSeatClasses, userId }) => {
  return (
    <button
      onClick={() => handleSeatClick(seat)}
      disabled={
        seat.status === "reserved" ||
        (seat.status === "holding" && seat.userId !== userId)
      }
      className={getSeatClasses(seat)}
    >
      {`${seat.row}${seat.col}`}
    </button>
  );
};

export default SeatItem;
