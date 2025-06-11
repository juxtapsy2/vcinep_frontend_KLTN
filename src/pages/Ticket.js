import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../api/TicketAPI.js";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../contexts/AuthContext.js";

function Ticket() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await getTicketById(id);
        console.log(response.data)
        setTicket(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const generateQRData = (ticket) => {
    return ticket.codeTicket;
  };

  const downloadTicket = async () => {
    const ticketElement = document.getElementById("ticket-container");

    try {
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      pdf.save(`Ticket-${ticket.codeTicket}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
const addToCalendar = () => {
  // Tách giờ và phút từ showTime
  const [hours, minutes] = ticket.showTime.split(':').map(Number);
  
  // Tạo ngày giờ chiếu (giữ nguyên local time, không bị ảnh hưởng bởi timezone)
  const showDate = new Date(ticket.showDate);
  showDate.setHours(hours, minutes, 0, 0);
  
  // Thêm 2 tiếng cho thời gian kết thúc
  const endTime = new Date(showDate);
  endTime.setHours(showDate.getHours() + 2);
  
  // Hàm format date cho Google Calendar (UTC time)
  const formatForGoogleCalendar = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
      'T',
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds()),
      'Z' // Thêm 'Z' để chỉ định UTC time
    ].join('');
  };
  
  const startStr = formatForGoogleCalendar(showDate);
  const endStr = formatForGoogleCalendar(endTime);
  
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE` +
    `&text=Xem phim: ${encodeURIComponent(ticket.movieTitle)}` +
    `&dates=${startStr}/${endStr}` +
    `&details=Rạp chiếu: ${encodeURIComponent(ticket.nameCinema)}%0A` +
    `Địa chỉ: ${encodeURIComponent(ticket.addressCinema)}%0A` +
    `Phòng: ${encodeURIComponent(ticket.nameTheater)}%0A` +
    `Ghế: ${encodeURIComponent(ticket.seatTicket)}%0A` +
    `Mã vé: ${ticket.codeTicket}` +
    `&location=${encodeURIComponent(ticket.addressCinema)}`;
  
  window.open(calendarUrl, '_blank');
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-white">
        Không tìm thấy vé
      </div>
    );
  }

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      <div
        id="ticket-container"
        className="max-w-2xl w-full bg-white border-4 border-red-600 rounded-xl overflow-hidden relative"
      >
        {/* Ticket Code Banner */}
        <div className="absolute top-4 right-0 bg-red-600 text-white py-1.5 px-4 shadow-lg transform translate-x-4 z-10">
          <div className="text-xl font-bold">#{ticket.codeTicket}</div>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white relative">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            VÉ XEM PHIM
          </h1>
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 100 10" className="w-full h-4 fill-white">
              <path d="M 0 10 C 30 0, 70 0, 100 10 L 100 0 L 0 0 Z" />
            </svg>
          </div>
        </div>

        <div className="p-3 pt-4">
          <h2 className="text-xl md:text-2xl font-bold text-red-800 text-center mb-6">
            {ticket.movieTitle}
          </h2>

          <div className="flex justify-center mb-3">
            <QRCodeSVG
              value={generateQRData(ticket)}
              size={350} // Tăng kích thước
              level="L" // Giảm độ phức tạp
              includeMargin={true} // Thêm margin để dễ quét hơn
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-600">Rạp chiếu</p>
                <p className="text-base">{ticket.nameCinema}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Phòng chiếu</p>
                <p className="text-base">{ticket.nameTheater}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Địa chỉ</p>
                <p className="text-base">{ticket.addressCinema}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-600">Ngày chiếu</p>
                <p className="text-base">{formatDate(ticket.showDate)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Giờ chiếu</p>
                <p className="text-base">{ticket.showTime}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Ghế</p>
                <p className="text-base font-bold text-red-600">
                  {ticket.seatTicket}
                </p>
              </div>
            </div>
          </div>

          {/* Concession Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-600">Đồ uống: </p>
            <p className="text-base">{ticket.concessionTicket}</p>
          </div>

          {/* Footer Section */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-600">
                  Thông tin khách hàng
                </p>
                <p className="text-base">{ticket.username}</p>
                <p className="text-sm">{ticket.phoneNumber}</p>
                <p className="text-sm">{ticket.emailUser}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-600">Tổng tiền</p>
                <p className="text-xl font-bold text-red-600">
                  {ticket.totalPrice.toLocaleString()}đ
                </p>
                <p className="text-xs text-gray-500">
                  Ngày thanh toán:{" "}
                  {format(new Date(ticket.paymentDate), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-1/2 w-6 h-6 bg-white border-4 border-red-600 rounded-full transform -translate-x-1/2"></div>
        <div className="absolute right-0 top-1/2 w-6 h-6 bg-white border-4 border-red-600 rounded-full transform translate-x-1/2"></div>
      </div>

      {/* Download Button */}
      <div className="flex space-x-4 mt-6">
  <button
    onClick={downloadTicket}
    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
    <span>Tải vé PDF</span>
  </button>

  <button
    onClick={addToCalendar}
    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span>Thêm vào lịch</span>
  </button>
</div>
    </div>
  );
}

export default Ticket;
