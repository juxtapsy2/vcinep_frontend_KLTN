import React from "react";

const BookingProgressBar = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, label: "Chọn phim / Rạp / Suất" },
    { id: 2, label: "Chọn ghế" },
    { id: 3, label: "Chọn thức ăn" },
    { id: 4, label: "Thanh toán" },
    // { id: 5, label: "Xác nhận" },
  ];

  return (
    <div className="w-full py-3 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Progress Bar */}
        <div className="hidden md:flex items-center justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Progress Line */}
              {index !== 0 && (
                <div
                  className={`absolute h-[2px] ${
                    index <= currentStep - 1 ? "bg-red-600" : "bg-gray-200"
                  }`}
                  style={{
                    left: `${(100 / (steps.length - 1)) * (index - 1)}%`,
                    right: `${
                      (100 / (steps.length - 1)) * (steps.length - index - 1)
                    }%`,
                    top: "25%",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Step Circle and Label */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id <= currentStep
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step.id === currentStep
                      ? "text-red-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden flex items-center justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Progress Line */}
              {index !== 0 && (
                <div
                  className={`absolute h-[2px] ${
                    index <= currentStep - 1 ? "bg-red-600" : "bg-gray-200"
                  }`}
                  style={{
                    left: `${(100 / (steps.length - 1)) * (index - 1)}%`,
                    right: `${
                      (100 / (steps.length - 1)) * (steps.length - index - 1)
                    }%`,
                    top: "25%",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Step Circle Only */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.id <= currentStep
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingProgressBar;
