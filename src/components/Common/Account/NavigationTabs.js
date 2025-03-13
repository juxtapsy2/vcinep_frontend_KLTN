import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  {
    path: "#profile",
    label: "Thông tin",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    path: "#transaction",
    label: "Giao dịch",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  // {
  //   path: "#notification",
  //   label: "Thông báo",
  //   icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  // },
  {
    path: "#policy",
    label: "Chính sách",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

export const NavigationTabs = ({ isActive }) => (
  <div className="bg-white rounded-lg shadow mb-4">
    <nav className="flex flex-wrap">
      {tabs.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={`/account${path}`}
          className={`flex items-center px-3 py-4 text-base font-medium border-b-2 flex-1 justify-center transition-colors ${
            isActive(path)
              ? "border-red-600 text-red-600 bg-red-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={icon}
            />
          </svg>
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);
