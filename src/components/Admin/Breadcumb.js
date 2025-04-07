import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHome } from "@fortawesome/free-solid-svg-icons";
import { managerRoutes } from "../../routes/routes";

const Breadcrumb = ({ customPaths }) => {
  const location = useLocation();

  // Hàm kiểm tra MongoDB ObjectId
  const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  };

  const pathSegments = useMemo(() => {
    const pathnames = location.pathname
      .replace(/\/$/, "")
      .split("/")
      .filter((x) => x);

    const pathMap = {
      admin: "Quản trị viên",
      dashboard: "Dashboard",
      blog: "Blog",
      users: "Người dùng",
      movies: "Phim",
      concession: "Đồ uống",
      ticket: "Vé",
      showtimes: "Suất chiếu",
      cinemas: "Rạp",
      settings: "Cài đặt",
      employee: "Nhân viên",
      manage: "Quản lý",
      ticketcounter: "Đặt vé tại quầy",
      checkin: "Checkin",
      theater: "Rạp",
      pricing: "Giá vé",
      ...customPaths,
    };

    return pathnames.map((path, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;
      // Kiểm tra nếu path là MongoDB ID thì hiển thị "Chi tiết"
      const displayName = isValidObjectId(path)
        ? "Chi tiết"
        : pathMap[path] || path;

      return {
        name: displayName,
        path: routeTo,
        isLast,
      };
    });
  }, [location.pathname, customPaths]);

  return (
    <nav className="bg-white p-4 rounded-lg shadow-sm mb-3">
      <ol className="flex flex-wrap items-center gap-2">
        <li className="flex items-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-red-600 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
          </Link>
        </li>

        {pathSegments.map((segment, index) => (
          <li key={segment.path} className="flex items-center">
            <FontAwesomeIcon
              icon={faChevronRight}
              className="w-3 h-3 mx-2 text-gray-400"
            />
            {segment.isLast ? (
              <span className="font-medium text-red-600">{segment.name}</span>
            ) : (
              <Link
                to={segment.path}
                className="text-gray-600 hover:text-red-600 transition-colors duration-300"
              >
                {segment.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
