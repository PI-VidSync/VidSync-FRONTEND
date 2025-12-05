import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

const ProtectedRoute = () => {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
