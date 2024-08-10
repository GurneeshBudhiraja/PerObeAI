import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  const user = null;
  return user ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes;
