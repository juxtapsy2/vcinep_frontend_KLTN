import React, { useEffect, useState } from "react";
import {
  getCinemaTickets,
  getCinemaUsers,
  getCinemaMovieRevenue,
} from "../../api/StatisticalAPI";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BsTicketPerforated } from "react-icons/bs";
import { BiCameraMovie, BiUser } from "react-icons/bi";
import { MdTheaterComedy } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({ title, value, icon, color }) => (
  <div
    className={`bg-white p-4 lg:p-6 rounded-lg shadow-lg border-l-4 ${color} transition-transform hover:scale-105`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xl lg:text-2xl font-bold mt-1">{value || 0}</p>
      </div>
      <div
        className={`text-2xl lg:text-3xl ${color.replace("border-", "text-")}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const EmptyChart = () => (
  <div className="h-full w-full flex items-center justify-center">
    <p className="text-gray-500">Không có dữ liệu</p>
  </div>
);

const ChartContainer = ({ title, children, isEmpty }) => (
  <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg">
    <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="h-[300px] lg:h-[400px]">
      {isEmpty ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function DashboardManager() {
  const { user } = useAuth();
  const cinemaId = user?.idCinema;
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!cinemaId)
          throw new Error("Không tìm thấy ID rạp, vui lòng đăng nhập lại.");

        const [ticketResponse, userResponse, movieResponse] = await Promise.all(
          [
            getCinemaTickets(cinemaId),
            getCinemaUsers(cinemaId),
            getCinemaMovieRevenue(cinemaId),
          ]
        );

        setTickets(ticketResponse?.data || []);
        setUsers(userResponse?.data || []);
        setMovies(movieResponse?.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAllData();
  }, [cinemaId]);

  // Tính toán thống kê với kiểm tra null
  const statistics = {
    totalTickets: tickets?.length || 0,
    totalRevenue:
      tickets?.reduce((sum, ticket) => sum + (ticket?.totalPrice || 0), 0) || 0,
    uniqueMovies: tickets?.length
      ? new Set(tickets.map((ticket) => ticket?.showtimeId)).size
      : 0,
    uniqueUsers: users?.length || 0,
  };

  // Xử lý dữ liệu cho biểu đồ với kiểm tra null
  const dailyData =
    tickets?.reduce((acc, ticket) => {
      if (!ticket) return acc;
      const date = new Date(ticket.createdAt).toLocaleDateString();
      acc[date] = {
        revenue: (acc[date]?.revenue || 0) + (ticket.totalPrice || 0),
        registrations: acc[date]?.registrations || 0,
      };
      return acc;
    }, {}) || {};

  users?.forEach((user) => {
    if (!user?.registrationDate) return;
    const date = new Date(user.registrationDate).toLocaleDateString();
    if (dailyData[date]) {
      dailyData[date].registrations++;
    } else {
      dailyData[date] = { revenue: 0, registrations: 1 };
    }
  });

  const chartData = Object.entries(dailyData).map(([date, data]) => ({
    date,
    revenue: data.revenue || 0,
    registrations: data.registrations || 0,
  }));

  // Xử lý dữ liệu biểu đồ tròn với kiểm tra null
  const genreData =
    movies?.reduce((acc, movie) => {
      if (!movie?.genre) return acc;
      movie.genre.forEach((genre) => {
        if (genre) acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {}) || {};

  const pieChartData = Object.entries(genreData).map(([name, value]) => ({
    name,
    value,
  }));

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Tổng số vé"
          value={statistics.totalTickets}
          icon={<BsTicketPerforated />}
          color="border-blue-500"
        />
        <StatCard
          title="Doanh thu"
          value={`${statistics.totalRevenue.toLocaleString()}đ`}
          icon={<BiCameraMovie />}
          color="border-green-500"
        />
        <StatCard
          title="Số lượng phim"
          value={movies?.length}
          icon={<MdTheaterComedy />}
          color="border-purple-500"
        />
        {/* <StatCard
          title="Người dùng"
          value={statistics.uniqueUsers}
          icon={<BiUser />}
          color="border-yellow-500"
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ChartContainer title="Biểu đồ doanh thu" isEmpty={!chartData.length}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu" fill="#4f46e5" />
          </BarChart>
        </ChartContainer>

        <ChartContainer
          title="Biểu đồ đăng ký tài khoản"
          isEmpty={!chartData.length}
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="registrations"
              name="Số lượng đăng ký"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>

        <ChartContainer title="Doanh thu theo phim" isEmpty={!movies?.length}>
          <BarChart data={movies || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalRevenue" name="Doanh thu" fill="#4f46e5" />
          </BarChart>
        </ChartContainer>

        <ChartContainer
          title="Phân bố thể loại phim"
          isEmpty={!pieChartData.length}
        >
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default DashboardManager;
