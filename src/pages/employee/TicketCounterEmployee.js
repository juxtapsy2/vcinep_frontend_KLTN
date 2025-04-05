import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function TicketCounterEmployee() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clean up the scanner when component unmounts
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error("Failed to stop camera:", err));
      }
    };
  }, []);

  // This effect initializes the scanner after the element is rendered
  useEffect(() => {
    if (scanning && !html5QrCodeRef.current) {
      const qrReaderElement = document.getElementById("qr-reader");

      if (qrReaderElement) {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        html5QrCodeRef.current = new Html5Qrcode("qr-reader");

        html5QrCodeRef.current
          .start(
            { facingMode: "environment" }, // Use rear camera
            config,
            onScanSuccess,
            onScanFailure
          )
          .catch((err) => {
            console.error("Error starting scanner:", err);
            setError("Không thể khởi động máy quét: " + err.message);
            setScanning(false);
            html5QrCodeRef.current = null;
          });
      }
    }
  }, [scanning]);

  const startScanner = () => {
    setScanning(true);
    setScanResult(null);
    setTicketData(null);
    setError("");
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          setScanning(false);
          html5QrCodeRef.current = null;
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    } else {
      setScanning(false);
    }
  };

  const onScanSuccess = (decodedText) => {
    // Stop scanner after successful scan
    stopScanner();
    setScanResult(decodedText);

    // Here you would typically fetch ticket data using the decoded text
    fetchTicketData(decodedText);
  };

  const onScanFailure = (error) => {
    // Handle scan failure - usually don't need to do anything here
    // console.warn(`Scan error: ${error}`);
  };

  const fetchTicketData = async (ticketCode) => {
    try {
      // Replace this with your actual API call
      // const response = await getTicketByCode(ticketCode);
      // setTicketData(response.data);

      // Simulated ticket data for demonstration
      setTicketData({
        codeTicket: ticketCode,
        movieTitle: "Example Movie",
        showDate: "2025-04-05",
        showTime: "19:30",
        nameCinema: "VCinep Cinema",
        nameTheater: "Theater 3",
        seatTicket: "G12",
        status: "valid", // or "used" or "invalid"
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      setError("Không thể lấy thông tin vé: " + error.message);
    }
  };

  const validateTicket = () => {
    // In a real app, this would make an API call to validate the ticket
    alert(`Xác nhận vé ${scanResult} hợp lệ!`);
    resetScanner();
  };

  const resetScanner = () => {
    setScanResult(null);
    setTicketData(null);
    setError("");
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
              {/* This div must be rendered before we initialize the scanner */}
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

        {scanResult && (
          <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Kết quả quét
            </h2>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Mã vé:</span> {scanResult}
            </p>

            {ticketData && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  {ticketData.movieTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Ngày chiếu:</p>
                    <p className="font-medium">{ticketData.showDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giờ chiếu:</p>
                    <p className="font-medium">{ticketData.showTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rạp:</p>
                    <p className="font-medium">{ticketData.nameCinema}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phòng:</p>
                    <p className="font-medium">{ticketData.nameTheater}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ghế:</p>
                    <p className="font-medium text-red-600">
                      {ticketData.seatTicket}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái:</p>
                    <p
                      className={`font-medium ${
                        ticketData.status === "valid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {ticketData.status === "valid"
                        ? "Hợp lệ"
                        : ticketData.status === "used"
                        ? "Đã được sử dụng"
                        : "Không hợp lệ"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-4 space-x-3">
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
        )}
      </div>
    </div>
  );
}

export default TicketCounterEmployee;
