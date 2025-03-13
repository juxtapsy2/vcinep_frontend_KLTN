export const formatSeats = (seats) => {
  const seatCount = seats.reduce((acc, seat) => {
    acc[seat.seatNumber] = (acc[seat.seatNumber] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(seatCount)
    .map(([seatNumber, count]) => {
      return count > 1 ? `${count}x${seatNumber}` : `${seatNumber}`;
    })
    .join(", ");
};

export const formatConcessions = (concessions) => {
  const itemCount = concessions.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = 0;
    }
    acc[item.name] += item.quantity;
    return acc;
  }, {});

  return Object.entries(itemCount)
    .map(([name, quantity]) => `${quantity}x${name}`)
    .join(", ");
};
