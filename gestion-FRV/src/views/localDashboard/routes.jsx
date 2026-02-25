import { Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../components/DashboardLayout";
import Dashboard from "./Dashboard";
import Inicio from "../Home";
import Proveedores from "./Proveedores";
import Ventas from "./Ventas";
import Clientes from "./Clientes";
import Inventario from "./Inventario";
import Usuarios from "./Usuarios";
import Settings from "./Settings";
import Analitics from "./Analitics";

const DashboardRoutes = (
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="inicio" element={<Inicio />} />
    <Route path="proveedores" element={<Proveedores />} />
    <Route path="ventas" element={<Ventas />} />
    <Route path="clientes" element={<Clientes />} />
    <Route path="inventario" element={<Inventario />} />
    <Route path="usuarios" element={<Usuarios />} />
    <Route path="settings" element={<Settings />} />
    <Route path="analitics" element={<Analitics />} />
    {/* más subrutas aquí */}
  </Route>
);

export default DashboardRoutes;
