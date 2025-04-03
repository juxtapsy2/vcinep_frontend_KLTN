import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

function Test() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setResult(data?.text || "");
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            QR Code Scanner
          </h2>

          <button
            onClick={() => setIsScanning(!isScanning)}
            className="w-full mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {isScanning ? "Dừng quét" : "Bắt đầu quét"}
          </button>

          {isScanning && (
            <div className="relative w-full aspect-square mb-4">
              <QrReader
                constraints={{
                  facingMode: "environment",
                }}
                onResult={handleScan}
                onError={handleError}
                className="w-full h-full"
              />
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Kết quả:</h3>
              <div className="p-3 bg-gray-100 rounded-lg break-all">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
