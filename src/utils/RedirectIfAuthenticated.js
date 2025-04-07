import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import LoadingEffect from "../components/LoadingEffect.js";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingEffect />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
