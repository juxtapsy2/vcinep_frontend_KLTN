import React from "react";

const LoadingEffect = () => {
  return (
    <>
      <style>
        {`
          @keyframes spin-and-scale {
            0% {
              transform: rotate(0deg) scale(1);
              border-width: 3px;
            }
            50% {
              transform: rotate(180deg) scale(1.2);
              border-width: 1px;
            }
            100% {
              transform: rotate(360deg) scale(1);
              border-width: 3px;
            }
          }

          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .custom-spinner {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: #ff0000;
            border-right-color: #ff0000;
            animation: spin-and-scale 1s ease-in-out infinite;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
          }
        `}
      </style>
      <div className="loading-overlay">
        <div className="custom-spinner"></div>
      </div>
    </>
  );
};

export default LoadingEffect;
