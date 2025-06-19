import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Html5Qrcode } from "html5-qrcode";
import {
  Search,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Camera,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { getTicketByShowtimeId, checkTicketValid } from "../../api/TicketAPI";
import toast from "react-hot-toast";
import ScannerModal from "../../components/Employee/ScannerModal";
import ItemTicket from "../../components/Employee/ItemTicket";
import { utils, writeFile } from 'xlsx';
function DetailCheckInEmployee() {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showScanner, setShowScanner] = useState(false);

  // QR Scanner states

  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState({ message: "", type: "" });
  // Thêm hàm exportToExcel
const exportToExcel = () => {
  // Thông tin rạp (thông tin mẫu)
  const theaterInfo = [
    ['CINEMA STAR VIETNAM'],
    ['Chi nhánh: CINEMA STAR Quận 1'],
    ['Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM'],
    ['Điện thoại: 1900 1234'],
    ['Email: support@cinemastar.vn'],
    ['Website: www.cinemastar.vn'],
    [], // Dòng trống
    ['DANH SÁCH VÉ XEM PHIM'],
    [], // Dòng trống
  ];

  // Định dạng lại dữ liệu cho Excel
  const excelData = ticketData.map(ticket => ({
    'Mã vé': ticket.code,
    'Tên khách hàng': ticket.userId.username,
    'Email': ticket.userId.email,
    'Ghế': ticket.seats,
    'Bắp nước': ticket.concession,
    'Giá vé': ticket.totalPrice.toLocaleString('vi-VN') + ' đ',
    'Trạng thái': getStatusText(ticket.status, ticket.checkinStatus, ticket.isCancelled),
    'Thời gian đặt': new Date(ticket.createdAt).toLocaleString('vi-VN'),
    'Thời gian check-in': ticket.date_checkin ? new Date(ticket.date_checkin).toLocaleString('vi-VN') : 'Chưa check-in'
  }));

  // Thông tin footer
  const footerInfo = [
    [], // Dòng trống
    [`Thời gian xuất báo cáo: ${new Date().toLocaleString('vi-VN')}`],
    ['Người xuất báo cáo: Admin'],
    [`Tổng số vé: ${ticketData.length}`],
    [`Số vé đã check-in: ${ticketData.filter(ticket => ticket.checkinStatus === 'checked_in').length}`],
    [`Số vé chưa check-in: ${ticketData.filter(ticket => ticket.checkinStatus === 'not_checked_in').length}`],
    [`Số vé đã hủy: ${ticketData.filter(ticket => ticket.isCancelled).length}`]
  ];

  // Tạo workbook mới
  const wb = utils.book_new();
  
  // Chuyển đổi dữ liệu thành worksheet
  const ws = utils.json_to_sheet(excelData, { origin: 'A11' }); // Bắt đầu từ dòng 11
  
  // Thêm tiêu đề
  utils.sheet_add_aoa(ws, theaterInfo, { origin: 'A1' });
  
  // Thêm footer
  utils.sheet_add_aoa(ws, footerInfo, { origin: `A${12 + excelData.length}` });

  // Điều chỉnh độ rộng cột
  const maxWidth = 20;
  ws['!cols'] = Array(Object.keys(excelData[0]).length).fill({ wch: maxWidth });

  // Tạo style cho tiêu đề
  const range = utils.decode_range(ws['!ref']);
  for (let i = 0; i < 6; i++) {
    const cell = ws[utils.encode_cell({ r: i, c: 0 })];
    if (cell) cell.s = { font: { bold: true } };
  }
  // Style cho tiêu đề "DANH SÁCH VÉ XEM PHIM"
  const titleCell = ws[utils.encode_cell({ r: 7, c: 0 })];
  if (titleCell) titleCell.s = { font: { bold: true, size: 16 } };

  // Style cho header của bảng
  for (let i = 0; i <= range.e.c; i++) {
    const cell = ws[utils.encode_cell({ r: 10, c: i })];
    if (cell) cell.s = { font: { bold: true }, fill: { fgColor: { rgb: "FFFF00" } } };
  }

  // Thêm worksheet vào workbook
  utils.book_append_sheet(wb, ws, 'Danh sách vé');

  // Tạo tên file với timestamp
  const fileName = `danh_sach_ve_${new Date().toISOString().slice(0,10)}.xlsx`;

  // Xuất file
  writeFile(wb, fileName);
};

  const fetchTickets = async () => {
    try {
      const response = await getTicketByShowtimeId(id);

      setTicketData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vé:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [id]);
  // QR Scanner cleanup
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error("Failed to stop camera:", err));
      }
    };
  }, []);

  const initializeScanner = async () => {
    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        // Thêm cấu hình để giảm tần suất quét
        disableFlip: false,
        formatsToSupport: ["QR_CODE"],
      };

      html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      setScanStatus({
        message: "Không thể khởi động máy quét: " + err.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (showScanner) {
      initializeScanner();
    }
  }, [showScanner]);

  const onScanSuccess = async (decodedText) => {
    // Kiểm tra nếu đang trong thời gian chờ thì bỏ qua
    if (isScanning) return;

    // Đánh dấu đang trong quá trình xử lý
    setIsScanning(true);

    try {
      // Xử lý check-in
      const response = await checkTicketValid(decodedText);
      if (response.success) {
        toast.success("Check-in thành công!");
        await stopScanner();
        fetchTickets();
      } else {
        // toast.error("Vé không hợp lệ!");
        setScanStatus({ message: "Vé không hợp lệ!", type: "error" });

        // Đặt timeout 5 giây trước khi cho phép quét tiếp
        setTimeout(() => {
          setIsScanning(false);
          setScanStatus({ message: "", type: "" });
        }, 5000);
      }
    } catch (error) {
      toast.error("Vé không hợp lệ!");
      setScanStatus({ message: "Vé không hợp lệ!", type: "error" });

      // Đặt timeout 5 giây trước khi cho phép quét tiếp
      setTimeout(() => {
        setIsScanning(false);
        setScanStatus({ message: "", type: "" });
      }, 5000);
    }
  };

  const onScanFailure = (error) => {
    // Silent failure
  };
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setShowScanner(false);
    setScanStatus({ message: "", type: "" });
  };

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
  const filteredTickets = ticketData.filter(ticket => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const username = ticket.userId?.username?.toLowerCase() || '';
    const email = ticket.userId?.email?.toLowerCase() || '';
    const code = ticket.code?.toLowerCase() || '';
    
    return (
      username.includes(searchLower) || 
      email.includes(searchLower) || 
      code.includes(searchLower)
    );
  });
  return (
    <div className="min-h-screen bg-white p-6">
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
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-[#D33027] text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Quét QR
          </button>

          <button  onClick={exportToExcel}  className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
            Xuất Excel
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
              {filteredTickets.map((ticket) => (
                <ItemTicket
                  ticket={ticket}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  key={ticket._id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* QR Scanner Modal */}
      {showScanner && (
        <ScannerModal scanStatus={scanStatus} stopScanner={stopScanner} />
      )}
    </div>
  );
}
export default DetailCheckInEmployee;
