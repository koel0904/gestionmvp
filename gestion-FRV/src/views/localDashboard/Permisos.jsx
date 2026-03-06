import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { useAuth } from "../../context/AuthContext";
import GlassToast from "../../components/GlassToast";
import { Link, Navigate } from "react-router-dom";
import { smartMatch } from "../../utils/smartSearch";

const PERMISSION_VIEWS = [
  { id: "proveedores", name: "Proveedores" },
  { id: "ventas", name: "Ventas" },
  { id: "clientes", name: "Clientes" },
  { id: "inventario", name: "Inventario" },
  { id: "vehiculos", name: "Vehículos" },
  { id: "usuarios", name: "Usuarios" },
];

export default function Permisos() {
  const { selectedLocal } = useLocal();
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Filters and Accordion State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [expandedUserId, setExpandedUserId] = useState(null);

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
        const res = await fetch(
          `http://localhost:3000/api/locales/${selectedLocal.id}/usuarios`,
          { credentials: "include" },
        );
        if (res.ok) {
          const data = await res.json();
          // Filter out owners, only users need permissions managed
          setUsuarios(data.filter((u) => u.role !== "owner"));
        }
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/usuarios/${userId}/permissions`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ permissions: newPermissions }),
        },
      );
      if (res.ok) {
        showToast("Permisos guardados con éxito", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Error al guardar permisos", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setSavingId(null);
    }
  };

  const filteredUsers = usuarios
    .filter((u) => {
      // 1. Search
      const matchesSearch = smartMatch(searchTerm, [
        u.name,
        u.email,
        u.role,
        u.position,
      ]);
      if (!matchesSearch) return false;

      // 2. Status Select
      if (filterStatus === "active" && !u.active) return false;
      if (filterStatus === "inactive" && u.active) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "role":
          return (
            (a.role === "admin" ? -1 : 1) - (b.role === "admin" ? -1 : 1) ||
            a.name.localeCompare(b.name)
          );
        default:
          return 0;
      }
    });

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
      {/* Header */}
      <div className="flex items-center justify-between glass-panel rounded-2xl p-5 border border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-fuchsia-600/20 glass-subtle flex items-center justify-center border border-purple-500/30 shadow-inner">
            <span className="material-symbols-outlined text-[24px] text-fuchsia-400 drop-shadow-md">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Permisos de Acceso
            </h2>
            <p className="text-sm text-white/50 font-medium">
              Gestión de roles y restricciones para {selectedLocal.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 shrink-0">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap hidden xl:flex">
            <span className="material-symbols-outlined text-purple-400 text-[18px]">
              shield_person
            </span>
            Matriz de Permisos
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-auto min-w-[140px]">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">
                  Todos
                </option>
                <option value="active" className="bg-slate-900">
                  Activos
                </option>
                <option value="inactive" className="bg-slate-900">
                  Inactivos
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-[18px]">
                filter_list
              </span>
            </div>

            {/* Sort Logic */}
            <div className="relative w-full sm:w-auto min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="recent" className="bg-slate-900">
                  Más recientes
                </option>
                <option value="name_asc" className="bg-slate-900">
                  Nombre (A-Z)
                </option>
                <option value="name_desc" className="bg-slate-900">
                  Nombre (Z-A)
                </option>
                <option value="role" className="bg-slate-900">
                  Por Rol
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-[18px]">
                sort
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="size-8 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
                group_off
              </span>
            </div>
            <p className="text-white/60 text-lg font-bold mb-1">
              Sin usuarios registrados
            </p>
            <p className="text-white/40 text-sm font-medium">
              Agrega usuarios en la vista de Usuarios primero.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner border-white/5">
              <span className="material-symbols-outlined text-4xl text-white/20">
                search_off
              </span>
            </div>
            <p className="text-white/50 font-medium">
              No se encontraron usuarios que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto pr-2 space-y-4 flex-1 pb-4">
            {filteredUsers.map((u) => {
              const isExpanded = expandedUserId === u.id;

              return (
                <div
                  key={u.id}
                  className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${isExpanded ? "ring-1 ring-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : "hover:bg-white/[0.07]"}`}
                >
                  {/* User Row Header */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 cursor-pointer group"
                    onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-600/20 border border-purple-500/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-300 uppercase">
                          {u.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white truncate max-w-[200px]">
                            {u.name}
                          </h4>
                          {u.role === "admin" && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-primary/20 text-primary-light border border-primary/30">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40">{u.email}</p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${u.active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
                      >
                        {u.active ? "Activo" : "Inactivo"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(u.id, u.permissions);
                        }}
                        disabled={savingId === u.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 hover:text-white transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                      >
                        {savingId === u.id ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">
                              progress_activity
                            </span>
                            Guardando
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">
                              save
                            </span>
                            Guardar
                          </>
                        )}
                      </button>

                      <div
                        className="ml-2 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors cursor-pointer text-white/50"
                        onClick={() =>
                          setExpandedUserId(isExpanded ? null : u.id)
                        }
                      >
                        <span
                          className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                        >
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Grid / Accordion Body */}
                  <div
                    className={`transition-all duration-300 ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
                  >
                    <div className="p-4 overflow-x-auto bg-black/10 border-t border-white/5">
                      <table className="w-full min-w-[500px] text-left">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="pb-3 text-xs font-bold text-white/50 uppercase tracking-widest">
                              Módulo
                            </th>
                            <th className="pb-3 text-center text-xs font-bold text-white/50 uppercase tracking-widest w-24">
                              Ver
                            </th>
                            <th className="pb-3 text-center text-xs font-bold text-white/50 uppercase tracking-widest w-24">
                              Agregar
                            </th>
                            <th className="pb-3 text-center text-xs font-bold text-white/50 uppercase tracking-widest w-24">
                              Editar
                            </th>
                            <th className="pb-3 text-center text-xs font-bold text-white/50 uppercase tracking-widest w-24">
                              Eliminar
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {PERMISSION_VIEWS.map((view) => {
                            const vp = (u.permissions &&
                              u.permissions[view.id]) || {
                              view: false,
                              add: false,
                              edit: false,
                              delete: false,
                            };

                            return (
                              <tr
                                key={view.id}
                                className="hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="py-3 text-sm font-medium text-white/80">
                                  {view.name}
                                </td>
                                {["view", "add", "edit", "delete"].map(
                                  (action) => (
                                    <td
                                      key={action}
                                      className="py-3 text-center"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleToggle(u.id, view.id, action)
                                        }
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${vp[action] ? "bg-purple-500" : "bg-white/10 hover:bg-white/20"}`}
                                      >
                                        <span
                                          className={`inline-block size-3.5 transform rounded-full bg-white transition-transform shadow-sm ${vp[action] ? "translate-x-5" : "translate-x-1"}`}
                                        />
                                      </button>
                                    </td>
                                  ),
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <GlassToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
