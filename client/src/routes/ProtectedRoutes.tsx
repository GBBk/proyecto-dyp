import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import AdminRoutes from "./AdminRoutes";

export default function ProtectedRouters() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{isAdmin ? <AdminRoutes /> : <Outlet />}</>;
}
