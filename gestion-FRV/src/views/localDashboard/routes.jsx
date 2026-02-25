import { Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Inicio from "../Home";
import Settings from "./Settings";
import Analitics from "./Analitics";

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
    <Route path="settings" element={<Settings />} />
    <Route path="analitics" element={<Analitics />} />
    {/* más subrutas aquí */}
  </Route>
);

export default DashboardRoutes;
