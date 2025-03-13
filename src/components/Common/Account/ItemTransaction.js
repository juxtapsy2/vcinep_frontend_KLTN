import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cancelTicket } from "../../../api/TicketAPI";
import toast, { Toaster } from "react-hot-toast";
import LoadingEffect from "../../LoadingEffect";
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};
const ItemTransaction = ({ ticket, refetchTickets }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (ticket.isCancelled) {
      toast.error("Vé đã hủy không thể xem chi tiết vé");
      return;
    }
    navigate(`/account/transaction/ticket/${ticket.ticketId}`);
  };

  const handleCancel = async (e) => {
    e.stopPropagation();

    // Tạo đối tượng Date với định dạng YYYY-MM-DD và HH:mm
    const [showYear, showMonth, showDay] = ticket.showDate.split("-");
    const [showHour, showMinute] = ticket.showTime.split(":");

    const showDateTime = new Date(
      showYear,
      showMonth - 1, // Tháng bắt đầu từ 0
      showDay,
      showHour,
      showMinute
    );
    const currentDate = new Date();

    // Kiểm tra nếu ngày chiếu đã qua
    if (showDateTime < currentDate) {
      toast.error("Vé này đã xem rồi không thể hủy");
      return;
    }

    // Tính số ngày còn lại đến ngày chiếu (làm tròn xuống)
    const timeDiff = showDateTime.getTime() - currentDate.getTime();
    const daysUntilShow = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Chỉ lấy phần nguyên

    // Kiểm tra nếu còn ít hơn 2 ngày
    if (daysUntilShow < 2) {
      toast.error("Bạn chỉ được hủy vé 2 ngày trước ngày chiếu");
      return;
    }

    // Hiển thị dialog xác nhận
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn hủy vé này không?"
    );

    if (isConfirmed) {
      setIsLoading(true); // Bắt đầu hiệu ứng Loading
      try {
        const response = await cancelTicket(ticket?.ticketId);

        if (response.success) {
          toast.success("Hủy vé thành công");
          await refetchTickets(); // Tải lại dữ liệu
        } else {
          toast.error(response.message || "Có lỗi xảy ra khi hủy vé");
        }
      } catch (error) {
        console.error("Lỗi khi hủy vé:", error);
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi hủy vé"
        );
      } finally {
        setIsLoading(false); // Kết thúc hiệu ứng Loading
      }
    }
  };
  const textStyle = ticket.isCancelled ? " decoration-red-500" : "";

  return (
    <div
      key={ticket.ticketId}
      className={`w-full flex bg-white rounded-lg border overflow-hidden
      transform transition-all duration-300 
      ${
        ticket.isCancelled
          ? "border-red-300 bg-red-50/30"
          : "border-gray-100 hover:shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:border-red-100"
      }
      group cursor-pointer relative`}
      onClick={handleClick}
    >
      <div className="w-24 h-32 relative flex-shrink-0 overflow-hidden">
        <img
          src={ticket.coverImageMovie}
          alt={ticket.movieTitle}
          className={`w-full h-full object-cover transform transition-transform duration-500 
          ${ticket.isCancelled ? "grayscale" : "group-hover:scale-110"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs animate-pulse group-hover:animate-none">
          2D
        </div>
      </div>

      <div className="flex-1 p-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 to-red-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative">
          <div className="flex justify-between items-start">
            <h4
              className={`text-sm font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors duration-300 ${textStyle}`}
            >
              Mã vé: {ticket.codeTicket} - {ticket.movieTitle}
            </h4>

            {ticket.isCancelled && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Đã hủy
              </span>
            )}
          </div>

          <p
            className={`text-xs text-gray-500 flex items-center gap-1 ${textStyle}`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {new Date(ticket.showDate).toLocaleDateString("vi-VN")} -{" "}
            {ticket.showTime}
          </p>
        </div>

        <div className="mt-2 space-y-1 text-xs relative">
          <p className={`text-gray-600 flex items-center gap-1 ${textStyle}`}>
            <svg
              className="w-3 h-3 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
              />
            </svg>
            <span className="font-medium">Ghế:</span>
            <span className="group-hover:text-red-600 transition-colors duration-300">
              {ticket.seatTicket}
            </span>
          </p>

          <p className={`text-gray-600 flex items-center gap-1 ${textStyle}`}>
            <svg
              className="w-3 h-3 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Đồ uống:</span>
            <span className="group-hover:text-red-600 transition-colors duration-300">
              {ticket.concessionTicket || "Không có"}
            </span>
          </p>

          <p className={`text-gray-600 flex items-center gap-1 ${textStyle}`}>
            <svg
              className="w-3 h-3 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Ngày thanh toán:</span>
            <span className="group-hover:text-red-600 transition-colors duration-300">
              {formatDateTime(ticket.paymentDate)}
            </span>
          </p>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <span
            className={`text-sm font-bold ${
              ticket.isCancelled ? "text-gray-500" : "text-red-600"
            } 
          bg-red-50 px-2 py-1 rounded-full  
          transition-all duration-300 ${textStyle}`}
          >
            {ticket.totalPrice.toLocaleString()}đ
          </span>

          {!ticket.isCancelled && (
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-full
              hover:bg-red-600 active:bg-red-700 
              transform transition-all duration-300
              hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]
              flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Hủy vé
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemTransaction;
