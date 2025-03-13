// utils/seatArrangementUtils.js

/**
 * Chuyển đổi ký tự hàng sang số để so sánh
 * @param {string} row - Ký tự hàng
 * @returns {number} Giá trị số của hàng
 */
const rowToNumber = (row) => {
  return row.charCodeAt(0) - "A".charCodeAt(0);
};

/**
 * Sắp xếp và chuẩn hóa ma trận ghế
 * @param {Array} seatMatrix - Ma trận ghế ban đầu
 * @param {Array} rows - Danh sách các hàng
 * @returns {Array} Ma trận ghế đã được sắp xếp
 */
export const normalizeAndSortSeats = (seatMatrix, rows) => {
  // Loại bỏ các ghế null và phẳng hóa mảng
  const flattenedSeats = seatMatrix.flatMap((row) =>
    row.filter((seat) => seat !== null)
  );

  // Sắp xếp ghế theo hàng và cột
  const sortedSeats = flattenedSeats.sort((a, b) => {
    // So sánh hàng trước
    const rowComparison = rowToNumber(a.row) - rowToNumber(b.row);
    if (rowComparison !== 0) return rowComparison;

    // Nếu cùng hàng thì so sánh cột
    return a.col - b.col;
  });

  // Điều chỉnh vị trí hàng và cột
  const adjustedSeats = adjustSeatLayout(sortedSeats);

  return adjustedSeats;
};

/**
 * Điều chỉnh bố cục ghế theo tiêu chuẩn rạp chiếu phim
 * @param {Array} seats - Danh sách ghế đã sắp xếp
 * @returns {Array} Danh sách ghế đã được điều chỉnh
 */
const adjustSeatLayout = (seats) => {
  // Nhóm ghế theo hàng
  const groupedByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Sắp xếp các hàng
  const sortedRows = Object.keys(groupedByRow).sort(
    (a, b) => rowToNumber(a) - rowToNumber(b)
  );

  // Điều chỉnh khoảng cách giữa các hàng và cột
  const adjustedSeats = [];

  sortedRows.forEach((row, rowIndex) => {
    const rowSeats = groupedByRow[row];

    // Điều chỉnh vị trí hàng (A, D, G,...)
    const newRow = String.fromCharCode("A".charCodeAt(0) + rowIndex * 3);

    // Điều chỉnh vị trí cột
    const adjustedRowSeats = rowSeats.map((seat) => ({
      ...seat,
      row: newRow,
      col: calculateAdjustedColumn(seat.col),
    }));

    adjustedSeats.push(...adjustedRowSeats);
  });

  return adjustedSeats;
};

/**
 * Tính toán lại vị trí cột
 * @param {number} originalCol - Vị trí cột gốc
 * @returns {number} Vị trí cột điều chỉnh
 */
const calculateAdjustedColumn = (originalCol) => {
  // Chia nhóm cột, mỗi nhóm 4 cột
  return Math.ceil((originalCol - 1) / 4) * 4 + 1;
};
