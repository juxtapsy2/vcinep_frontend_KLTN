import React from "react";

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center">
      <span className="font-semibold w-24 flex-shrink-0">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-500">
          {label}:
        </span>
      </span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export default DetailRow;
