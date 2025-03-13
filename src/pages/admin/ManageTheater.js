import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../components/Admin/ManageTheater/Modal";
import RowModal from "../../components/Admin/ManageTheater/RowModal";

import {
  getSeatsByTheaterId,
  getTheaterByIdCinema,
} from "../../api/TheaterAPI";
import TheaterInfo from "../../components/Admin/ManageTheater/TheaterInfo";
import { updateSeatType, deleteSeat } from "../../api/SeatAPI";
import SeatStatusBadge from "../../components/Admin/ManageTheater/SeatStatusBadge";
import LoadingEffect from "../../components/LoadingEffect";
import RowActionButton from "../../components/Admin/ManageTheater/RowActionButton ";
import toast, { Toaster } from "react-hot-toast";
function ManageTheater() {
  const { id: theaterId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theaterInfo, setTheaterInfo] = useState(null);
  const [maxRow, setMaxRow] = useState("");
  const [maxColumn, setMaxColumn] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const fetchSeats = async () => {
    try {
      const data = await getSeatsByTheaterId(theaterId);
      if (data.success) {
        setSeats(data.data);
        const calculatedMaxRow = data.data.reduce(
          (max, seat) => (seat.row > max ? seat.row : max),
          ""
        );
        const calculatedMaxColumn = data.data.reduce(
          (max, seat) => (seat.column > max ? seat.column : max),
          0
        );
        setMaxRow(calculatedMaxRow);
        setMaxColumn(calculatedMaxColumn);
      } else {
        setError(data.message || "Không thể tải danh sách ghế.");
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách ghế.");
    } finally {
      setLoading(false);
    }
  };
  const fetchTheaterInfo = async () => {
    try {
      const response = await getTheaterByIdCinema(theaterId);
      setTheaterInfo(response.data);
    } catch (error) {
      console.error("Error fetching theater info:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchSeats(), fetchTheaterInfo()]).finally(() =>
      setLoading(false)
    );
  }, [theaterId]);
  const handleRowAction = async (action, row) => {
    try {
      const seatsInRow = seats.filter((seat) => seat.row === row);
      for (const seat of seatsInRow) {
        switch (action) {
          case "vip":
            await updateSeatType(seat._id, "vip");
            break;
          case "standard":
            await updateSeatType(seat._id, "standard");
            break;
          case "delete":
            await deleteSeat(seat._id);
            break;
          default:
            break;
        }
      }
      await fetchSeats();
      setIsRowModalOpen(false);
      setSelectedRow(null);
      toast.success("Cập nhật ghế thành công !");
    } catch (error) {
      console.error("Lỗi khi thực hiện hành động cho hàng:", error);
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchSeats();
  }, [theaterId]);
  const handleSeatAction = async (action) => {
    try {
      if (!currentSeat) return;
      switch (action) {
        case "vip":
          await updateSeatType(currentSeat._id, "vip");
          break;
        case "standard":
          await updateSeatType(currentSeat._id, "standard");
          break;
        case "delete":
          await deleteSeat(currentSeat._id);
          break;
        default:
          return;
      }
      await fetchSeats();
      setIsModalOpen(false);
      setCurrentSeat(null);
      toast.success("Cập nhật ghế thành công !");
    } catch (error) {
      toast.error(error);
    }
  };
  const seatLookup = {};
  seats.forEach((seat) => {
    seatLookup[`${seat.row}${seat.column}`] = seat;
  });
  const rows = Array.from({ length: maxRow.charCodeAt(0) - 64 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const columns = Array.from({ length: maxColumn }, (_, i) => i + 1);
  if (loading) {
    return <LoadingEffect />;
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex  justify-center">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        seat={currentSeat}
        handleSeatAction={handleSeatAction}
      />
      <RowModal
        isOpen={isRowModalOpen}
        onClose={() => setIsRowModalOpen(false)}
        row={selectedRow}
        handleRowAction={handleRowAction}
      />
      <div className="bg-white  w-ful max-w-5xl mx-auto">
        {theaterInfo && <TheaterInfo theaterInfo={theaterInfo} />}
        <div className="p-4 md:p-6 flex justify-center">
          <div className="min-w-fit">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `auto repeat(${maxColumn}, minmax(2rem, 1fr)) 2rem`,
                gap: "0.5rem",
              }}
            >
              <div className="w-6 h-6"></div>
              {columns.map((col) => (
                <div
                  key={`col-${col}`}
                  className="text-center font-bold text-gray-700 text-sm"
                >
                  {col}
                </div>
              ))}
              <div className="text-center font-bold text-gray-700"></div>

              {rows.map((row) => (
                <React.Fragment key={`row-${row}`}>
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-gray-700 text-sm">
                    {row}
                  </div>
                  {columns.map((col) => {
                    const seatKey = `${row}${col}`;
                    const seat = seatLookup[seatKey];
                    const isSelected = selectedSeat === seatKey;
                    return (
                      <div
                        key={seatKey}
                        className={`h-8 w-8 rounded-md flex items-center justify-center text-xs
                          transition-all duration-200 cursor-pointer border
                          ${
                            seat
                              ? seat.type === "vip"
                                ? `${
                                    isSelected
                                      ? "bg-yellow-500 scale-105 shadow-md"
                                      : "bg-yellow-400 hover:bg-yellow-300"
                                  } text-black border-yellow-600`
                                : `${
                                    isSelected
                                      ? "bg-gradient-to-r from-red-500 to-red-700 scale-105 shadow-md"
                                      : "bg-white hover:bg-red-50"
                                  } ${
                                    isSelected ? "text-white" : "text-gray-700"
                                  } border-gray-300 hover:border-red-400`
                              : "bg-gray-200 hover:bg-gray-300 border-gray-300"
                          }
                          ${isSelected ? "z-10" : ""}
                        `}
                        onClick={() => {
                          if (seat) {
                            setSelectedSeat(seatKey);
                            setCurrentSeat(seat);
                            setIsModalOpen(true);
                          }
                        }}
                      >
                        {seat?.seatNumber || ""}
                      </div>
                    );
                  })}
                  <RowActionButton
                    row={row}
                    setIsRowModalOpen={setIsRowModalOpen}
                    setSelectedRow={setSelectedRow}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <SeatStatusBadge />
        </div>
      </div>
    </div>
  );
}
export default ManageTheater;
