import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionBookedNotification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
        50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      .animate-pulse-custom {
        animation: pulse 3s ease-in-out infinite;
      }

      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }

      .gradient-bg {
        background: linear-gradient(135deg, #fff 0%, #fee2e2 100%);
      }
      
      .ticket-pattern {
        background-image: radial-gradient(#000 1px, transparent 1px);
        background-size: 20px 20px;
        opacity: 0.1;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center gradient-bg">
      {/* Background Patterns */}
      <div className="absolute inset-0 ticket-pattern"></div>

      {/* Floating Circles */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"
          style={{ animationDelay: "-2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-black rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "-4s" }}
        ></div>
      </div>

      <div className="relative max-w-md w-full mx-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-100 p-8 animate-pulse-custom animate-glow">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-black text-red-600 mb-6 text-center mt-4 tracking-tight">
            Suất Chiếu Đã Được Đặt
          </h2>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent my-4"></div>

          <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
            Bạn đã đặt vé cho suất chiếu này rồi.
            <br />
            <span className="text-sm text-gray-500">
              Vui lòng kiểm tra lại vé của bạn để đảm bảo thông tin.
            </span>
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/account#transaction")}
              className="group relative px-8 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 hover:shadow-red-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                Xem Vé Của Tôi
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionBookedNotification;
