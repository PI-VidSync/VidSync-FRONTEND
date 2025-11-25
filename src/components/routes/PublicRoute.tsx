import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const PublicRoute = () => {
  const auth = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
