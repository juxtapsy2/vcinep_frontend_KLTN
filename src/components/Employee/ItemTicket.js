import React from "react";

function truncateText(text, maxLength = 10) {
  if (!text) return "N/A";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

function ItemTicket({ ticket, getStatusColor, getStatusText }) {
  return (
    <tr key={ticket._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-medium text-[#D33027]">{ticket.code}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span 
            className="font-medium"
            title={ticket.userId?.username || "N/A"}
          >
            {truncateText(ticket.userId?.username)}
          </span>
          <span 
            className="text-sm text-gray-500"
            title={ticket.userId?.email || "N/A"}
          >
            {truncateText(ticket.userId?.email)}
          </span>
        </div>
      </td>

      <td 
        className="px-6 py-4 whitespace-nowrap"
        title={ticket.seats || "N/A"}
      >
        {truncateText(ticket.seats)}
      </td>
      <td 
        className="px-6 py-4 whitespace-nowrap"
        title={ticket.concession || "N/A"}
      >
        {truncateText(ticket.concession)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {ticket.totalPrice?.toLocaleString("vi-VN")}đ
      </td>
     <td className="px-6 py-4">
        <div className="flex flex-col items-center gap-1">
          <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium w-full max-w-[120px] ${getStatusColor(
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
          {ticket.checkinStatus === "checked_in" && ticket.date_checkin && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(ticket.date_checkin).toLocaleString("vi-VN")}
            </span>
          )}
        </div>
    </td>
    </tr>
  );
}

export default ItemTicket;