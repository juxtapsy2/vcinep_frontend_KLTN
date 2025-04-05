import React, { useState, useEffect, useRef } from "react";
import { Camera, X } from "lucide-react";

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        setError(null);
        scanQRCode();
      }
    } catch (err) {
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      console.error(err);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const scanQRCode = () => {
    if (!scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Check if video is ready
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Here you would typically use a QR code scanning library
      // For demonstration, we'll simulate finding a QR code after 3 seconds
      setTimeout(() => {
        const mockTicketData = {
          id: "TIX" + Math.random().toString(36).substr(2, 9),
          movie: "Avengers: Endgame",
          date: "2025-04-05",
          time: "19:30",
          seat: "G15",
          theater: "CGV Vincom Center",
        };
        setResult(mockTicketData);
        stopScanning();
      }, 3000);
    }

    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const resetScan = () => {
    setResult(null);
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold text-center">
            Quét Mã QR Vé Xem Phim
          </h1>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />

            {!scanning && !result && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {scanning && (
              <div className="absolute inset-0 border-2 border-blue-500 animate-pulse">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-scan" />
              </div>
            )}
          </div>

          {result ? (
            <div className="mt-4 p-4 border rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Thông tin vé:</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Mã vé:</span> {result.id}
                </p>
                <p>
                  <span className="font-medium">Phim:</span> {result.movie}
                </p>
                <p>
                  <span className="font-medium">Ngày:</span> {result.date}
                </p>
                <p>
                  <span className="font-medium">Giờ:</span> {result.time}
                </p>
                <p>
                  <span className="font-medium">Ghế:</span> {result.seat}
                </p>
                <p>
                  <span className="font-medium">Rạp:</span> {result.theater}
                </p>
              </div>
              <button
                onClick={resetScan}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quét Mã Mới
              </button>
            </div>
          ) : (
            <button
              onClick={scanning ? stopScanning : startScanning}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {scanning ? "Dừng Quét" : "Bắt Đầu Quét"}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          from {
            transform: translateY(0%);
          }
          to {
            transform: translateY(100vh);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
