import React from "react";
import { Link } from "react-router-dom";

export const renderMenuItem = (item) => (
  <Link key={item.name} to={item.path} className="menu-item">
    {item.name}
  </Link>
);

export const renderMobileMenuItem = (item) => (
  <Link key={item.name} to={item.path} className="mobile-menu-item">
    {item.name}
  </Link>
);
