import React from "react";
import InputField from "./InputField";
import Timer from "./Timer";

function OTPForm({ otp, setOtp, handleSubmit, loading }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Nhập mã OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Vui lòng nhập mã OTP đã được gửi đến email của bạn
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <InputField
            label="OTP (6 chữ số)"
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Đang kiểm tra..." : "Xác nhận OTP"}
            </button>
          </div>
          <Timer initialTime={600} />
        </form>
      </div>
    </div>
  );
}

export default OTPForm;
