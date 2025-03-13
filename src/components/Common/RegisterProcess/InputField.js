import React from "react";

function InputField({ label, id, type, value, onChange, required, maxLength }) {
  return (
    <div className="rounded-md shadow-sm -space-y-px">
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
          pattern="\d*"
          placeholder="Nhập mã OTP"
        />
      </div>
    </div>
  );
}

export default InputField;
