import React from "react";

function ItemTicket({ ticket, getStatusColor, getStatusText }) {
  return (
    <tr key={ticket._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-medium text-[#D33027]">{ticket.code}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium">
            {ticket.userId?.username || "N/A"}
          </span>
          <span className="text-sm text-gray-500">{ticket.userId?.email}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">{ticket.seats}</td>
      <td className="px-6 py-4 whitespace-nowrap">{ticket.concession}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {ticket.totalPrice?.toLocaleString("vi-VN")}đ
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
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
          {ticket.checkinStatus === "checked_in" && ticket.date_checkin && (
            <span className="text-xs text-gray-500">
              {new Date(ticket.date_checkin).toLocaleString("vi-VN")}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ItemTicket;
