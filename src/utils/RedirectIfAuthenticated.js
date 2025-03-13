import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
