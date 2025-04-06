import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function TicketCounterEmployee() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const html5QrCodeRef = useRef(null);

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
      setError("Không thể khởi động máy quét: " + err.message);
      setScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  useEffect(() => {
    if (scanning && !html5QrCodeRef.current) {
      initializeScanner();
    }
  }, [scanning]);

  const startScanner = () => {
    setScanning(true);
    setScanResult(null);
    setTicketData(null);
    setError("");
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
    setScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    await stopScanner();
    setScanResult(decodedText);
    fetchTicketData(decodedText);
  };

  const onScanFailure = (error) => {
    // Silent failure
  };

  const fetchTicketData = async (ticketCode) => {
    try {
      // Simulated API call
      setTicketData({
        codeTicket: ticketCode,
        movieTitle: "Example Movie",
        showDate: "2025-04-05",
        showTime: "19:30",
        nameCinema: "VCinep Cinema",
        nameTheater: "Theater 3",
        seatTicket: "G12",
        status: "valid",
      });
    } catch (error) {
      setError("Không thể lấy thông tin vé: " + error.message);
    }
  };

  const validateTicket = async () => {
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Xác nhận vé ${scanResult} hợp lệ!`);
      resetScanner();
    } catch (error) {
      setError("Không thể xác nhận vé: " + error.message);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setTicketData(null);
    setError("");
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      valid: { text: "Hợp lệ", className: "bg-green-100 text-green-800" },
      used: { text: "Đã sử dụng", className: "bg-red-100 text-red-800" },
      invalid: { text: "Không hợp lệ", className: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status] || statusConfig.invalid;

    return (
      <span
        className={`px-2 py-1 rounded-full text-sm font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-red-700 text-center mb-6">
          Quét Vé Khách Hàng
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          {!scanning && !scanResult ? (
            <button
              onClick={startScanner}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Bắt Đầu Quét
            </button>
          ) : scanning ? (
            <div className="text-center">
              <div id="qr-reader" className="mx-auto w-full max-w-md"></div>
              <button
                onClick={stopScanner}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Dừng Quét
              </button>
            </div>
          ) : null}
        </div>

        {ticketData && (
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-700 mb-3">
              {ticketData.movieTitle}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Mã vé</p>
                <p className="font-medium">{ticketData.codeTicket}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <StatusBadge status={ticketData.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày chiếu</p>
                <p className="font-medium">{ticketData.showDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giờ chiếu</p>
                <p className="font-medium">{ticketData.showTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rạp</p>
                <p className="font-medium">{ticketData.nameCinema}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phòng</p>
                <p className="font-medium">{ticketData.nameTheater}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ghế</p>
                <p className="font-medium text-red-600">
                  {ticketData.seatTicket}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              {ticketData.status === "valid" && (
                <button
                  onClick={validateTicket}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Xác nhận vé
                </button>
              )}
              <button
                onClick={resetScanner}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Quét lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketCounterEmployee;
