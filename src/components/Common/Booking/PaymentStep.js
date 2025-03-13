import React from "react";
import { useBooking } from "../../../contexts/BookingContext.js";
const paymentMethods = [
  {
    id: "momo",
    name: "Ví Điện Tử MoMo",
    icon: "https://res.cloudinary.com/dtjzdiezh/image/upload/v1732063706/MoMo_Logo_jynuee.png",
  },
  // {
  //   id: "paypal",
  //   name: "Paypal",
  //   icon: "https://res.cloudinary.com/dtjzdiezh/image/upload/v1732063728/av07zqidc_rkg7c9.webp",
  // },
];

function PaymentStep() {
  const { bookingData, updateBookingData } = useBooking();
  React.useEffect(() => {
    if (!bookingData.payment) {
      updateBookingData({
        payment: paymentMethods[0].id,
      });
    }
  }, []);
  const handlePaymentMethodChange = (methodId) => {
    updateBookingData({
      payment: methodId,
    });
  };

  return (
    <div className="w-full md:w-2/3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Phương thức thanh toán bằng MoMo
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2
              ${
                bookingData.payment === method.id
                  ? "border-red-600 bg-red-50"
                  : "border-gray-200 hover:border-red-300"
              }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={bookingData.payment === method.id}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
            />
            <div className="flex items-center ml-3 flex-1">
              <div className="w-12 h-12 flex-shrink-0 rounded-md flex items-center justify-center">
                <img
                  src={method.icon}
                  alt={method.name}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <span className="ml-3 text-sm md:text-base text-gray-700">
                {method.name}
              </span>
            </div>
          </label>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        (*) Bằng việc click/chạm vào THANH TOÁN bên phải, bạn đã xác nhận hiểu
        rõ các Quy Định Giao Dịch Trực Tuyến.
      </p>
    </div>
  );
}

export default PaymentStep;
