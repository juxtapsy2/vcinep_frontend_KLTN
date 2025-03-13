// components/InputField.js
import React from "react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  className = "",

  subLabel,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {subLabel && <span className="text-gray-500 text-xs">{subLabel}</span>}
      </label>
      <input
        type={type}
        required={true}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
          touched && error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {touched && error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
export default InputField;
