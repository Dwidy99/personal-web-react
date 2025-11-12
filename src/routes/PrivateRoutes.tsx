import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRoutesProps {
  children: ReactNode;
}

export default function PrivateRoutes({ children }: PrivateRoutesProps) {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
