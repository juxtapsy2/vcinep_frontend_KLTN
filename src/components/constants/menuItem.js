export const menuItems = [
  { name: "Trang chủ", path: "/" },
  { name: "Phim", path: "/movie" },
  { name: "Điện ảnh", path: "/blog" },
  { name: "Hệ thống rạp", path: "/cinema" },
  // { name: "Sự kiện", path: "/event" },
  // { name: "Liên hệ", path: "/contact" },
];

export const defaultSeatData = [
  { row: "A", seats: 14 },
  { row: "B", seats: 14 },
  { row: "C", seats: 14 },
  { row: "D", seats: 14 },
  { row: "E", seats: 14 },
  { row: "F", seats: 14 },
  { row: "G", seats: 14 },
  { row: "H", seats: 14 },
  { row: "J", seats: 16 },
  { row: "K", seats: 16 },
  { row: "L", seats: 16 },
];

export const seatClass = {
  STANDARD: "bg-white border-opacity-80 border-gray-300",
  VIP: "bg-white bg-opacity-80 border-red-300 border-opacity-80",
  COUPLE: "bg-white border-neutral-700 border-opacity-80",
  UNAVAILABLE: "bg-neutral-400 border-neutral-400",
  SELECTED: "bg-red-600 border-red-400 text-white",
};

export const bookingProgress = [
  { progress: 1, flow: "Chọn Phim / Rạp / Suất" },
  { progress: 2, flow: "Chọn Ghế" },
  { progress: 3, flow: "Chọn Thức uống" },
  { progress: 4, flow: "Thanh toán" },
  { progress: 5, flow: "Xác nhận" },
];
