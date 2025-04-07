// src/utils/RouteGuard.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingEffect from "../components/LoadingEffect";

export const RouteGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Thêm xử lý loading state
  if (loading) {
    return <LoadingEffect />; // hoặc component loading của bạn
  }

  // Với Guest routes
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Nếu cần đăng nhập nhưng chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền truy cập
  const hasPermission = allowedRoles.some((role) => {
    switch (role) {
      case "Admin":
        return user.role === "Admin";
      case "Manager":
        return ["Manager", "Admin"].includes(user.role);
      case "User":
        return ["User", "Manager", "Admin", "Employee"].includes(user.role);
      case "Employee":
        return ["User", "Manager", "Admin", "Employee"].includes(user.role);
      default:
        return false;
    }
  });

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};
