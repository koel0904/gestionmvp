import { Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Inicio from "../Home";

const DashboardRoutes = (
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="inicio" element={<Inicio />} />
    {/* más subrutas aquí */}
  </Route>
);

export default DashboardRoutes;
