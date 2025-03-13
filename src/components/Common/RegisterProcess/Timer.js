import React, { useState, useEffect } from "react";

function Timer({ initialTime }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="text-center">
      {timeLeft > 0 ? (
        <div>
          <p className="text-sm text-gray-600">Thời gian còn lại</p>
          <p className="text-xl font-semibold text-red-600">
            {formatTime(timeLeft)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-red-600 font-medium">
          Thời gian nhập OTP đã hết hạn!
        </p>
      )}
    </div>
  );
}

export default Timer;
