import React from "react";

function ClassificationBadge({ classification }) {
  return (
    <div className="flex items-center">
      <span className="font-semibold w-24 flex-shrink-0">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-500">
          Phân loại:
        </span>
      </span>
      <span className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-3 py-0.5 rounded-full text-sm font-medium">
        {classification}
      </span>
    </div>
  );
}

export default ClassificationBadge;
