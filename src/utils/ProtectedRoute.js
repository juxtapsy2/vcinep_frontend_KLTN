import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import LoadingEffect from "../components/LoadingEffect.js";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingEffect />; // Hoặc loading component của bạn
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
export default ProtectedRoute;
