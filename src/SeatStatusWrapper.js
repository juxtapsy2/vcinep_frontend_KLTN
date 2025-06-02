import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.js";
import * as SeatStatusAPI from "./api/SeatStatusAPI.js";
import io from "socket.io-client";
import { backendURL } from "./constants/constants.js";

const socket = io.connect(backendURL);

const SeatStatusResetWrapper = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const resetSeatStatus = async () => {
      // Kiểm tra nếu không phải trang thank you và user đã đăng nhập
      if (!location.pathname.includes("/thankyou") && user?._id) {
        try {
          // Reset tất cả ghế holding của user
          await SeatStatusAPI.releaseAllHoldingSeats(user._id);

          // Emit event để update realtime cho tất cả clients
          socket.emit("release-all-seats-global", {
            userId: user._id,
          });
        } catch (error) {
          console.error("Error resetting seat status:", error);
        }
      }
    };

    resetSeatStatus();
  }, [location.pathname, user]);

  return children;
};

export default SeatStatusResetWrapper;
