import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocal } from "../../context/LocalContext";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";

export default function Dashboard() {
  const { user } = useAuth();
  const { selectedLocal, changeLocal, userLocales, setUserLocales, loading } =
    useLocal();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedLocal) {
    return (
      <LocalsGrid locales={userLocales} onSelect={changeLocal} user={user} />
    );
  }

  return (
    <LocalDetailView
      local={selectedLocal}
      onBack={() => changeLocal(null)}
      user={user}
      onLocalUpdated={(updatedLocal) => {
        // update the selected local + userLocales list
        changeLocal({ ...selectedLocal, ...updatedLocal });
        setUserLocales((prev) =>
          prev.map((l) =>
            l.id === updatedLocal.id ? { ...l, ...updatedLocal } : l,
          ),
        );
      }}
    />
  );
}

function LocalsGrid({ locales, onSelect, user }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const { setUserLocales } = useLocal();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const isOwner = user?.role === "owner";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateLocal = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setToast({
        visible: true,
        message: "El nombre del local es obligatorio",
        type: "error",
      });
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("http://localhost:3000/api/locales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error creando el local");
      }

      // Add the new local to the list with owner role
      setUserLocales((prev) => [...prev, { ...data.local, role: "owner" }]);
      setFormData({ name: "", address: "", phone: "", email: "" });
      setShowCreateForm(false);
      setToast({
        visible: true,
        message: "¡Local creado con éxito!",
        type: "success",
      });
    } catch (err) {
      setToast({ visible: true, message: err.message, type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Welcome Banner ── */}
      <div className="glass-ultra rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
            Workspaces Overview
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-accent-orange to-primary-light bg-clip-text text-transparent drop-shadow-sm">
              {user?.name || "User"}
            </span>
          </h1>
          <p className="text-white/70 text-sm font-medium">
            Select a location to manage its operations.
          </p>
        </div>
      </div>

      {/* ── Locales Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {locales.map((local) => (
          <button
            key={local.id}
            onClick={() => onSelect(local)}
            className="glass-panel text-left rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-purple pointer-events-none rounded-2xl" />

            <div className="relative z-10">
              <div className="size-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                <span className="material-symbols-outlined text-[24px] text-transparent bg-clip-text bg-gradient-to-br from-accent-orange-light to-white drop-shadow-md group-hover:from-accent-orange group-hover:to-primary transition-all duration-300">
                  storefront
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-light transition-colors">
                {local.name}
              </h3>
              <p className="text-sm font-medium text-white/50 mb-6">
                {local.address}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="glass-badge-purple px-2.5 py-1 rounded-lg text-xs font-semibold text-white capitalize">
                    {local.role}
                  </span>
                  {local.active === false && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30">
                      Inactivo
                    </span>
                  )}
                </div>
                <span className="material-symbols-outlined text-white/30 group-hover:text-primary-light transition-all group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* Create New Local Button (Owner only) */}
        {isOwner && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="glass-panel border-dashed border-2 border-white/10 rounded-2xl p-6 hover:bg-white/[0.02] hover:border-primary/30 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px] cursor-pointer"
          >
            <div className="size-12 rounded-xl glass-subtle flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
              <span className="material-symbols-outlined text-[24px] text-white/50 group-hover:text-primary-light transition-colors">
                add
              </span>
            </div>
            <h3 className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">
              Registrar Nuevo Local
            </h3>
            <p className="text-xs text-white/40 mt-1">Solo owners</p>
          </button>
        )}
      </div>

      {/* ── Create Local Modal ── */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateForm(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg glass-heavy rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-light/60 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent-orange/20 flex items-center justify-center border border-white/20">
                  <span className="material-symbols-outlined text-[20px] text-primary-light">
                    add_business
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Nuevo Local</h2>
                  <p className="text-xs text-white/50 font-medium">
                    Registra una nueva ubicación
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="size-9 rounded-xl glass-button flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateLocal} className="p-6 space-y-4">
              {/* Name (required) */}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                  Nombre del local <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Sucursal Centro"
                  required
                  className="w-full px-4 py-3 rounded-xl glass-subtle border border-white/10 focus:border-primary/50 focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] bg-transparent text-white text-sm font-medium placeholder:text-white/30 transition-all"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ej: Av. Principal #123"
                  className="w-full px-4 py-3 rounded-xl glass-subtle border border-white/10 focus:border-primary/50 focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] bg-transparent text-white text-sm font-medium placeholder:text-white/30 transition-all"
                />
              </div>

              {/* Phone & Email row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej: 555-1234"
                    className="w-full px-4 py-3 rounded-xl glass-subtle border border-white/10 focus:border-primary/50 focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] bg-transparent text-white text-sm font-medium placeholder:text-white/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: local@email.com"
                    className="w-full px-4 py-3 rounded-xl glass-subtle border border-white/10 focus:border-primary/50 focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] bg-transparent text-white text-sm font-medium placeholder:text-white/30 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-5 py-2.5 rounded-xl glass-button text-white/60 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        add
                      </span>
                      Crear Local
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      <GlassToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

function LocalDetailView({ local, onBack, user, onLocalUpdated }) {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });

  const isOwner = user?.role === "owner";

  // Edit local state
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const openEdit = () => {
    setEditData({
      name: local.name || "",
      address: local.address || "",
      phone: local.phone || "",
      email: local.email || "",
      active: local.active !== undefined ? local.active : true,
    });
    setEditOpen(true);
  };

  const handleSaveLocal = async (e) => {
    e.preventDefault();
    if (!editData.name?.trim()) {
      showToast("El nombre del local es obligatorio", "error");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/locales/${local.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar el local");
      }
      onLocalUpdated(data.local);
      setEditOpen(false);
      showToast("Local actualizado exitosamente");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/locales/${local.id}/stats`,
          {
            credentials: "include",
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();
  }, [local.id]);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${Number(stats.revenue || 0).toFixed(2)}`,
      change: `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange || 0}%`,
      trend: stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "neutral",
      icon: "payments",
      gradient: "from-primary/30 to-primary/10",
      iconColor: "text-primary-light drop-shadow-sm",
      glowClass: "glow-orange",
      borderColor: "border-primary/30",
    },
    {
      title: "Orders",
      value: (stats.orders || 0).toString(),
      change: `${stats.ordersChange > 0 ? "+" : ""}${stats.ordersChange || 0}%`,
      trend: stats.ordersChange > 0 ? "up" : stats.ordersChange < 0 ? "down" : "neutral",
      icon: "shopping_bag",
      gradient: "from-white/20 to-white/5",
      iconColor: "text-white drop-shadow-md",
      glowClass: "glow-mixed",
      borderColor: "border-white/20",
    },
    {
      title: "Customers",
      value: (stats.customers || 0).toString(),
      change: null,
      trend: "neutral",
      icon: "group",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary-light drop-shadow-sm",
      glowClass: "glow-orange",
      borderColor: "border-primary/20",
    },
    {
      title: "Products",
      value: (stats.products || 0).toString(),
      change: stats.lowStockCount > 0 ? `${stats.lowStockCount} low stock` : null,
      trend: stats.lowStockCount > 0 ? "down" : "neutral",
      icon: "inventory_2",
      gradient: "from-blue-400/20 to-blue-300/5",
      iconColor: "text-blue-400 drop-shadow-md",
      glowClass: "glow-mixed",
      borderColor: "border-blue-400/20",
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={onBack}
          className="size-10 rounded-xl glass-button flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer hover:-translate-x-1"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {local.name} Dashboard
          </h2>
          <p className="text-xs text-white/50 font-medium">{local.address}</p>
        </div>
        {isOwner && (
          <button
            onClick={openEdit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-white/70 hover:text-white font-bold tracking-wide hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span className="hidden sm:inline text-sm">Editar Local</span>
          </button>
        )}
      </div>

      {/* Inactive banner */}
      {local.active === false && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 mb-1">
          <span className="material-symbols-outlined text-red-400 text-[20px]">
            lock
          </span>
          <p className="text-sm text-red-300 font-medium">
            Este local está <strong>inactivo</strong>. No se permiten cambios
            hasta que un owner lo reactive.
          </p>
        </div>
      )}

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`glass-panel ${card.borderColor} rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden cursor-default`}
          >
            {/* Hover glow */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${card.glowClass} pointer-events-none rounded-2xl`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`size-11 rounded-xl bg-gradient-to-br ${card.gradient} glass-subtle flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${card.iconColor}`}
                  >
                    {card.icon}
                  </span>
                </div>
                {card.change && (
                  <span
                    className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md border-white/20 bg-white/5 ${
                      card.trend === "up"
                        ? "text-emerald-400"
                        : card.trend === "down"
                          ? "text-red-400"
                          : "text-white/50"
                    }`}
                  >
                    {card.trend === "up" && (
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    )}
                    {card.trend === "down" && (
                      <span className="material-symbols-outlined text-[12px]">trending_down</span>
                    )}
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-black tracking-tight text-white mb-1">
                {card.value}
              </p>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions & Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="glass-heavy rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-light/40 to-transparent" />
          <h3 className="text-xs font-black text-primary-light uppercase tracking-[0.15em] mb-4 flex items-center gap-2 drop-shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-primary-light">
              bolt
            </span>
            Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              {
                icon: "add_circle",
                label: "New Order",
                desc: "Create a sales order",
                gradient: "from-white/20 to-white/5",
                iconColor: "text-white drop-shadow-md",
                borderColor: "border-white/20",
              },
              {
                icon: "person_add",
                label: "Add Customer",
                desc: "Register a client",
                gradient: "from-primary/30 to-primary/10",
                iconColor: "text-primary-light drop-shadow-sm",
                borderColor: "border-primary/30",
              },
              {
                icon: "inventory",
                label: "Add Product",
                desc: "Add to inventory",
                gradient: "from-white/20 to-white/5",
                iconColor: "text-white drop-shadow-md",
                borderColor: "border-white/20",
              },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full glass-button rounded-xl px-4 py-3 text-left group cursor-pointer flex items-center gap-3 hover:bg-white/[0.08]"
              >
                <div
                  className={`size-9 rounded-lg bg-gradient-to-br ${action.gradient} glass-subtle flex items-center justify-center shrink-0 border ${action.borderColor}`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${action.iconColor}`}
                  >
                    {action.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white group-hover:text-white transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-white/50 font-medium">
                    {action.desc}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-white/30 group-hover:text-primary-light group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-heavy rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2 drop-shadow-md">
            <span className="material-symbols-outlined text-[16px] text-blue-400">
              dashboard
            </span>
            Resumen Rápido
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Pending Tasks */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="size-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-amber-400">task_alt</span>
              </div>
              <div>
                <p className="text-xl font-black text-white">{stats.pendingTasks || 0}</p>
                <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Tareas pendientes</p>
              </div>
            </div>
            {/* Low Stock */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="size-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-red-400">warning</span>
              </div>
              <div>
                <p className="text-xl font-black text-white">{stats.lowStockCount || 0}</p>
                <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Stock bajo</p>
              </div>
            </div>
            {/* This Month Revenue */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="size-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-emerald-400">trending_up</span>
              </div>
              <div>
                <p className="text-xl font-black text-white">
                  {stats.revenueChange !== undefined
                    ? `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange}%`
                    : "—"}
                </p>
                <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Vs. mes anterior</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Local Modal ── */}
      <GlassModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Editar ${local.name}`}
        icon="edit"
      >
        <form onSubmit={handleSaveLocal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Nombre del Local *
            </label>
            <input
              required
              type="text"
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Ej: Sucursal Centro"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Dirección
            </label>
            <input
              type="text"
              value={editData.address || ""}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
              placeholder="Ej: Av. Principal #123"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                placeholder="555-1234"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                value={editData.email || ""}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                placeholder="local@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
          {/* Active toggle */}
          <div className="flex items-center justify-between px-1 py-3 border-t border-white/10 mt-2">
            <div>
              <p className="text-sm font-bold text-white">Estado del Local</p>
              <p className="text-xs text-white/50">
                {editData.active
                  ? "El local está activo y operativo"
                  : "El local está inactivo — no se permiten cambios"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditData({ ...editData, active: !editData.active })
              }
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                editData.active ? "bg-emerald-500" : "bg-white/20"
              }`}
            >
              <span
                className={`inline-block size-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  editData.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </GlassModal>

      <GlassToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
