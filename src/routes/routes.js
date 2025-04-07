import Home from "../pages/Home";
import Login from "../pages/Login";
import CheckOTP from "../pages/CheckOTP";
import RegisterProcess from "../pages/RegisterProcess";
import Forgot from "../pages/Forget";
import MovieDetails from "../components/Common/MovieDetails/MovieDetails";
import Cinema from "../pages/Cinema";
import Payment from "../pages/Payment";
import Account from "../pages/Account";
import Test from "../pages/Test";
import NotFound from "../pages/NotFound";
import Booking from "../pages/Booking";
import ManageMovies from "../pages/admin/ManageMovies";
import Movie from "../pages/Movie";
import ThankYou from "../pages/ThankYou";
import ManageUser from "../pages/admin/ManageUser";
import ManageShowtime from "../pages/admin/ManageShowtime";
import ManageSetting from "../pages/admin/ManageSetting";
import ManageCinema from "../pages/admin/ManageCinema";
import AddMovie from "../pages/admin/AddMovie";
import Dashboard from "../pages/admin/Dashboard";
import Ticket from "../pages/Ticket";
import ManageTickets from "../pages/admin/ManageTicket";
import ManageDetailCinema from "../pages/admin/MangeDetailCinema";
import ManageTheater from "../pages/admin/ManageTheater";
import MangeConcession from "../pages/admin/ManageConcession";
import ManageBlog from "../pages/admin/ManageBlog";
import ManageAddBlog from "../pages/admin/ManageAddBlog";
import Blog from "../pages/Blog";
import About from "../pages/About";
import DashboardManager from "../pages/manager/DashboardManager";
import ManagerShowtime from "../pages/manager/ManagerShowtime";
import ManagerDetailCinema from "../pages/manager/ManagerDetailCinema";
import ManagerMovies from "../pages/manager/ManagerMovies";
import ManagerTheater from "../pages/manager/ManagerTheater";
import BlogDetail from "../pages/BlogDetail";
import ManageEditBlog from "../pages/admin/ManageEditBlog";
import CinemaDetail from "../pages/CinemaDetail";
import ManagerAddBlog from "../pages/manager/ManagerAddBlog";
import EditMovie from "../pages/admin/EditMovie";
import ManagerTickets from "../pages/manager/ManagerTicket";
import DashboardEmployee from "../pages/employee/DashboardEmployee";
import TicketCounterEmployee from "../pages/employee/TicketCounterEmployee";
import CheckinEmployee from "../pages/employee/CheckinEmployee";
import ManageEmployee from "../pages/manager/ManageEmployee";
import DetailCheckInEmployee from "../pages/employee/DetailCheckInEmployee";
import ManagePricing from "../pages/admin/TicketPricing";
export const publicRoutes = [
  {
    path: "/",
    component: Home,
    roles: [], // Guest route
  },
  {
    path: "/login",
    component: Login,
    roles: [], // Guest route
    authRoute: true,
  },
  {
    path: "/register",
    component: RegisterProcess,
    roles: [], // Guest route
    authRoute: true, // Route chỉ cho người chưa đăng nhập
  },
  {
    path: "/checkOTP",
    roles: [], // Guest route
    component: CheckOTP,
    protected: false,
  },
  {
    path: "/forgot",
    roles: [], // Guest route
    component: Forgot,
    protected: false,
  },
  {
    path: "/movie/:slug",
    roles: [], // Guest route
    component: MovieDetails,
    protected: false,
  },
  {
    path: "/cinema",
    roles: [], // Guest route
    component: Cinema,
    protected: false,
  },
  {
    path: "/cinema/:id",
    roles: [], // Guest route
    component: CinemaDetail,
    protected: false,
  },
  {
    path: "/payment",
    roles: ["User", "Admin", "Manager", "Employee"], // Guest route
    component: Payment,
    protected: true, // Cần đăng nhập
  },
  {
    path: "/booking/:id",
    component: Booking,
    roles: ["User", "Admin", "Manager", "Employee"], // Guest route
    protected: true, // Cần đăng nhập
  },
  {
    path: "/account/*",
    component: Account,
    roles: ["User", "Admin", "Manager", "Employee"], // Guest route
    protected: false, // Cần đăng nhập
  },
  {
    path: "/manage-movies/*",
    component: ManageMovies,
  },
  {
    path: "/movie",
    component: Movie,
    protected: false,
  },
  {
    path: "/blog",
    component: Blog,
    protected: false,
  },
  {
    path: "/blog/:slug",
    component: BlogDetail,
    protected: false,
  },
  {
    path: "/thankyou",
    component: ThankYou,
    roles: ["User", "Admin", "Manager", "Employee"], // Guest route
    protected: true, // Cần đăng nhập
  },
  {
    path: "/account/transaction/ticket/:id",
    component: Ticket,
    roles: ["User", "Admin", "Manager", "Employee"], // Guest route

    protected: true,
  },
  {
    path: "/about",
    component: About,
    protected: false,
  },
  {
    path: "/test",
    component: Test,
    protected: false,
  },
  {
    path: "/404",
    component: NotFound,
  },
  {
    path: "*",
    component: NotFound,
    protected: false,
  },
];
export const adminRoutes = [
  {
    path: "/admin",
    component: Dashboard,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/users",
    component: ManageUser,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/movies",
    component: ManageMovies,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/showtimes",
    component: ManageShowtime,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/settings",
    component: ManageSetting,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/blog/add",
    component: ManageAddBlog,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/blog/edit/:slug",
    component: ManageEditBlog,
    protected: false,
  },
  {
    path: "/admin/cinemas",
    component: ManageCinema,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/blog",
    component: ManageBlog,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/concession",
    component: MangeConcession,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/cinemas/detail/:slug",
    component: ManageDetailCinema,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/theater/:id",
    component: ManageTheater,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/movies/add",
    component: AddMovie,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/movies/edit/:slug",
    component: EditMovie,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/dashboard/",
    component: Dashboard,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/ticket/",
    component: ManageTickets,
    roles: ["Admin"], // Guest route
    protected: true,
  },
  {
    path: "/admin/pricing/",
    component: ManagePricing,
    roles: ["Admin"], // Guest route
    protected: true,
  },
];
export const managerRoutes = [
  {
    path: "/manage",
    component: DashboardManager,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/users",
    component: ManageUser,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/movies",
    component: ManagerMovies,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/showtimes",
    component: ManagerShowtime,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/settings",
    component: ManageSetting,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/blog/add",
    component: ManagerAddBlog,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/cinemas/",
    component: ManagerDetailCinema,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/blog",
    component: ManageBlog,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/concession",
    component: MangeConcession,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/cinemas/detail/:slug",
    component: ManageDetailCinema,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/theater/:id",
    component: ManagerTheater,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/movies/add",
    component: AddMovie,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "/manage/dashboard/",
    component: DashboardManager,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "manage/ticket/",
    component: ManagerTickets,
    roles: ["Manager"], // Guest route
    protected: true,
  },
  {
    path: "manage/employee/",
    component: ManageEmployee,
    roles: ["Manager"], // Guest route
    protected: true,
  },
];
export const employeeRoutes = [
  {
    path: "/employee",
    component: DashboardEmployee,
    roles: ["Employee"],
    protected: true,
  },
  {
    path: "/employee/dashboard",
    component: DashboardEmployee,
    roles: ["Employee"],
    protected: true,
  },
  {
    path: "/employee/ticketcounter",
    component: TicketCounterEmployee,
    roles: ["Employee"],
    protected: true,
  },
  {
    path: "/employee/checkin",
    component: CheckinEmployee,
    roles: ["Employee"],
    protected: true,
  },
  {
    path: "/employee/checkin/:id",
    component: DetailCheckInEmployee,
    roles: ["Employee"],
    protected: true,
  },
];
