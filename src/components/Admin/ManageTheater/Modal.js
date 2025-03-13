import React from "react";
import { AiOutlineClose, AiOutlineStar, AiOutlineDelete } from "react-icons/ai";
import { MdEventSeat } from "react-icons/md";

const Modal = ({ isOpen, onClose, seat, handleSeatAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 transform transition-all shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <MdEventSeat className="text-blue-500" /> Quản lý ghế{" "}
            {seat?.seatNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => handleSeatAction("vip")}
            className="w-full py-2 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            <AiOutlineStar className="w-5 h-5" />
            VIP
          </button>
          <button
            onClick={() => handleSeatAction("standard")}
            className="w-full py-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <MdEventSeat className="w-5 h-5" />
            STANDARD
          </button>
          <button
            onClick={() => handleSeatAction("delete")}
            className="w-full py-2 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <AiOutlineDelete className="w-5 h-5" />
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
