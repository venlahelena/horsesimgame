// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}