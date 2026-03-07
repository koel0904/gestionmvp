import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { useAuth } from "../../context/AuthContext";
import GlassToast from "../../components/GlassToast";
import { Link, Navigate } from "react-router-dom";
import {
  getUsuarios,
  updatePermissions,
} from "../../services/api/dashboardPermisos";

import PermisosHeader from "../../components/dashboard/permisos/PermisosHeader";
import PermisosList from "../../components/dashboard/permisos/PermisosList";

export default function Permisos() {
  const { selectedLocal } = useLocal();
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  // Only owners can access this view
  if (user?.role !== "owner" && user?.type !== "owner") {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    if (!selectedLocal) return;
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getUsuarios(selectedLocal.id);
        setUsuarios(data.filter((u) => u.role !== "owner"));
      } catch (err) {
        showToast("Error cargando usuarios", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [selectedLocal]);

  // Handle checking a permission box
  const handleToggle = (userId, viewId, action) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const currentPerms = u.permissions || {};
        const viewPerms = currentPerms[viewId] || {
          view: false,
          add: false,
          edit: false,
          delete: false,
        };

        const newViewPerms = { ...viewPerms, [action]: !viewPerms[action] };

        // Auto-grant view if granting add/edit/delete
        if (action !== "view" && newViewPerms[action] === true) {
          newViewPerms.view = true;
        }

        // Auto-revoke add/edit/delete if revoking view
        if (action === "view" && newViewPerms.view === false) {
          newViewPerms.add = false;
          newViewPerms.edit = false;
          newViewPerms.delete = false;
        }

        return {
          ...u,
          permissions: {
            ...currentPerms,
            [viewId]: newViewPerms,
          },
        };
      }),
    );
  };

  const handleSave = async (userId, newPermissions) => {
    setSavingId(userId);
    try {
      await updatePermissions(selectedLocal.id, userId, newPermissions);
      showToast("Permisos guardados con éxito", "success");
    } catch (err) {
      showToast(err.message || "Error de conexión", "error");
    } finally {
      setSavingId(null);
    }
  };

  if (!selectedLocal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-2xl glass-panel border-white/20 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-4xl text-white/50">
            admin_panel_settings
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Seleccionar un Local
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          Abre un local desde el overview para gestionar los permisos de sus
          usuarios.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 rounded-xl glass-button text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
        >
          Ir al Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <PermisosHeader selectedLocal={selectedLocal} />

      <PermisosList
        loading={loading}
        usuarios={usuarios}
        savingId={savingId}
        handleToggle={handleToggle}
        handleSave={handleSave}
      />

      <GlassToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
