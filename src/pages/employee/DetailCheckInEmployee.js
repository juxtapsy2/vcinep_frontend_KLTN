import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Search,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Camera,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { QrReader } from "react-qr-reader";
// import "./DetailCheckInEmployee.css"; // Import your CSS file for styling

import { getTicketByShowtimeId } from "../../api/TicketAPI";

function DetailCheckInEmployee() {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`loaded data data`, scanData);
    if (scanData && scanData !== "") {
      console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
      // setPrecScan(scanData);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTicketByShowtimeId(id);
        setTicketData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vé:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getStatusColor = (status, checkinStatus, isCancelled) => {
    if (isCancelled) return "bg-gray-100 text-gray-600";
    if (checkinStatus === "checked_in") return "bg-green-100 text-green-600";
    if (checkinStatus === "not_checked_in")
      return "bg-yellow-100 text-yellow-600";
    return "bg-blue-100 text-blue-600";
  };

  const getStatusText = (status, checkinStatus, isCancelled) => {
    if (isCancelled) return "Đã hủy";
    if (checkinStatus === "checked_in") return "Đã check-in";
    if (checkinStatus === "not_checked_in") return "Chưa check-in";
    return "Hoạt động";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>
          Last Scan:
          {selected}
        </h2>

        <button
          onClick={() => {
            setStartScan(!startScan);
          }}
        >
          {startScan ? "Stop Scan" : "Start Scan"}
        </button>
        {startScan && (
          <>
            <select onChange={(e) => setSelected(e.target.value)}>
              <option value={"environment"}>Back Camera</option>
              <option value={"user"}>Front Camera</option>
            </select>
            <QrReader
              facingMode={selected}
              delay={1000}
              onError={handleError}
              onScan={handleScan}
              className="w-[200px] h-[200px]"
              // chooseDeviceId={()=>selected}
              style={{ width: "300px" }}
            />
          </>
        )}
        {loadingScan && <p>Loading</p>}
        {data !== "" && <p>{data}</p>}
      </div>

      {/* Dashboard Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Tổng số vé</p>
                <h3 className="text-2xl font-bold">{ticketData.length}</h3>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <Ticket className="w-6 h-6 text-[#D33027]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Đã check-in</p>
                <h3 className="text-2xl font-bold">
                  {
                    ticketData.filter(
                      (ticket) => ticket.checkinStatus === "checked_in"
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Chưa check-in</p>
                <h3 className="text-2xl font-bold">
                  {
                    ticketData.filter(
                      (ticket) => ticket.checkinStatus === "not_checked_in"
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Vé đã hủy</p>
                <h3 className="text-2xl font-bold">
                  {ticketData.filter((ticket) => ticket.isCancelled).length}
                </h3>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-[#D33027]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã vé, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D33027]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex gap-3">
          <button
            // onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-[#D33027] text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Quét QR
          </button>

          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
            Xuất Excel
          </button>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors">
            <Filter className="w-5 h-5" />
            Lọc
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin khách hàng
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bắp nước
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ticketData.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-[#D33027]">
                      {ticket.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {ticket.userId?.username || "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {ticket.userId?.email}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.concession}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.totalPrice?.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status,
                        ticket.checkinStatus,
                        ticket.isCancelled
                      )}`}
                    >
                      {getStatusText(
                        ticket.status,
                        ticket.checkinStatus,
                        ticket.isCancelled
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DetailCheckInEmployee;
