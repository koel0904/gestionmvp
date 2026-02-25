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
  </Route>
);

export default DashboardRoutes;
