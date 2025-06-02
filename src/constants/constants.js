import {
  faFilm,
  faCalendarAlt,
  faTachometerAlt,
  faNewspaper,
  faUsers,
  faCoffee,
  faTicketAlt,
  faVideo,
  faMoneyBillWave,
  faUserTie,
  faComment
} from "@fortawesome/free-solid-svg-icons";

export const menuItems = [
  { name: "Trang chủ", path: "/" },
  { name: "Phim", path: "/movie" },
  { name: "Lịch chiếu", path: "/calendar" },
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

export const userRoles = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
  USER: "User",
  GUEST: "",
};

export const rolesForRender = [
  { value: "User", label: "Người dùng" },
  { value: "Employee", label: "Nhân viên" },
  { value: "Manager", label: "Quản lý rạp" },
  { value: "Admin", label: "Quản trị viên"},
];

export const defaultAvatarUrl = "/resources/defaultAvatar.png";

export const adminMenuItems = [
  {
    path: "/admin/dashboard",
    icon: faTachometerAlt,
    label: "Dashboard",
  },
  {
    path: "/admin/blog",
    icon: faNewspaper,
    label: "Blog",
  },
  {
    path: "/admin/users",
    icon: faUsers,
    label: "Người dùng",
  },
  {
    path: "/admin/employees",
    icon: faUserTie,
    label: "Nhân viên",
  },
  {
    path: "/admin/movies",
    icon: faFilm,
    label: "Phim",
  },
  {
    path: "/admin/concession",
    icon: faCoffee,
    label: "Đồ uống",
  },
  {
    path: "/admin/ticket",
    icon: faTicketAlt,
    label: "Vé",
  },
  {
    path: "/admin/pricing",
    icon: faMoneyBillWave,
    label: "Giá vé",
  },
  {
    path: "/admin/showtimes",
    icon: faCalendarAlt,
    label: "Suất chiếu",
  },
  {
    path: "/admin/cinemas",
    icon: faVideo,
    label: "Rạp",
  },
   {
    path: "/admin/comment",
    icon: faComment,
    label: "Bình luận",
  },
];

export const roles = [
  { value: "", label: "Tất cả vai trò" },
  { value: "User", label: "Người dùng (User)" },
  { value: "Manager", label: "Quản lý rạp (Manager)" },
  { value: "Employee", label: "Nhân viên (Employee)" },
  { value: "Admin", label: "Quản trị viên (Admin)" },
];

export const statuses = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Bị khóa" },
];

export const employeeRolesForAdminFilter = [
  { value: "", label: "Tất cả vai trò" },
  { value: "Manager", label: "Quản lý rạp (Manager)" },
  { value: "Employee", label: "Nhân viên (Employee)" },
];

// Configs for distinguish between production and development
export const isDev = process.env.NODE_ENV !== "production";
export const backendURL = isDev ? "http://localhost:8800" : process.env.REACT_APP_BACKEND_URL;