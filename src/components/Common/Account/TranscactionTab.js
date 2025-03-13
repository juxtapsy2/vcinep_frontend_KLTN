import React, { useEffect, useState } from "react";
import * as TicketAPI from "../../../api/TicketAPI.js";
import ItemTransaction from "./ItemTransaction.js";
import LoadingEffect from "../../LoadingEffect.js";
export const TransactionTab = ({ user }) => {
  const userId = user?._id;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await TicketAPI.getTicketsByUserId(userId);
      setTickets(response.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userId]);
  if (!userId)
    return (
      <div className="text-center text-gray-600 p-4">
        Đang xác thực người dùng...
      </div>
    );
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingEffect /> {/* Hiển thị hiệu ứng Loading */}
      </div>
    );

  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;
  return (
    <div className="w-full bg-white ">
      {tickets.length === 0 ? (
        <div className="text-center text-gray-600 p-4">
          Chưa có giao dịch nào.
        </div>
      ) : (
        <div className="space-y-3 w-full">
          {tickets.map((ticket) => (
            <ItemTransaction
              key={ticket._id}
              ticket={ticket}
              refetchTickets={fetchTickets}
            />
          ))}
        </div>
      )}
    </div>
  );
};
