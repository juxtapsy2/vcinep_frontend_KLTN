export const extractUniqueRows = (seatsList) => {
  return Array.from(new Set(seatsList.map((seat) => seat.row))).sort();
};
export const extractUniqueCols = (seatsList) => {
  return Array.from(new Set(seatsList.map((seat) => seat.col))).sort(
    (a, b) => a - b
  );
};

export const createSeatMatrix = (rows, cols, seatsList) => {
  return rows.map((row) => {
    return cols.map((col) => {
      return (
        seatsList.find((seat) => seat.row === row && seat.col === col) || null
      );
    });
  });
};
