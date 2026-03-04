import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocal } from "../context/LocalContext";

const sidebarLinks = [
  { name: "Overview", icon: "space_dashboard", path: "/dashboard" },
  {
    name: "Proveedores",
    icon: "local_shipping",
    path: "/dashboard/proveedores",
  },
  { name: "Ventas", icon: "payments", path: "/dashboard/ventas" },
  { name: "Clientes", icon: "groups", path: "/dashboard/clientes" },
  { name: "Inventario", icon: "inventory_2", path: "/dashboard/inventario" },
  { name: "Usuarios", icon: "manage_accounts", path: "/dashboard/usuarios" },
  { name: "Analitics", icon: "analytics", path: "/dashboard/analitics" },
  { name: "Settings", icon: "settings", path: "/dashboard/settings" },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { user, logout } = useAuth();
  const { selectedLocal, changeLocal, userLocales } = useLocal();
  const location = useLocation();
  const navigate = useNavigate();
  const selectorRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setSelectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current view name for breadcrumb
  const currentView =
    sidebarLinks.find((l) => l.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="h-screen font-display text-white flex p-4 gap-4 relative overflow-hidden">
      {/* ══════════════════════════════════════ */}
      {/* SIDEBAR                              */}
      {/* ══════════════════════════════════════ */}
      <aside
        className={`relative z-40 flex flex-col shrink-0 transition-all duration-300 ease-in-out h-full ${
          sidebarOpen ? "w-[260px]" : "w-[80px]"
        }`}
      >
        <div className="flex flex-col h-full rounded-2xl overflow-hidden glass-heavy shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
          {/* Logo */}
          <div className="flex items-center h-[88px] px-5 border-b border-white/[0.04] shrink-0 box-border overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent-orange/20 text-white shadow-lg shadow-black/20 shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-[20px] text-transparent bg-clip-text bg-gradient-to-br from-accent-orange-light to-white drop-shadow-md">
                business_center
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center ${
                sidebarOpen
                  ? "max-w-[150px] opacity-100 ml-3"
                  : "max-w-0 opacity-0 ml-0"
              }`}
            >
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent-orange to-primary-light bg-clip-text text-transparent">
                BizManage
              </span>
            </div>
          </div>

          {/* ── Local Selector ── */}
          <div
            className="px-3 py-3 border-b border-white/[0.04] shrink-0"
            ref={selectorRef}
          >
            <div className="relative">
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                title={
                  !sidebarOpen
                    ? selectedLocal?.name || "Seleccionar local"
                    : undefined
                }
                className={`w-full flex items-center rounded-xl glass-subtle border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group ${
                  sidebarOpen ? "px-3 py-2.5 gap-3" : "p-2.5 justify-center"
                }`}
              >
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary/25 to-accent-orange/15 flex items-center justify-center shrink-0 border border-white/15">
                  <span className="material-symbols-outlined text-[16px] text-primary-light drop-shadow-sm">
                    storefront
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out flex-1 min-w-0 ${
                    sidebarOpen
                      ? "max-w-[160px] opacity-100"
                      : "max-w-0 opacity-0"
                  }`}
                >
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {selectedLocal?.name || "Sin local"}
                  </p>
                  <p className="text-[10px] text-white/40 font-semibold truncate">
                    {selectedLocal ? "Local activo" : "Selecciona uno"}
                  </p>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    sidebarOpen
                      ? "max-w-[20px] opacity-100"
                      : "max-w-0 opacity-0"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[16px] text-white/40 group-hover:text-white transition-all duration-300 ${selectorOpen ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {/* Dropdown */}
              {selectorOpen && (
                <div
                  className={`absolute top-full mt-2 z-50 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                    sidebarOpen ? "left-0 right-0" : "left-0 w-[220px]"
                  }`}
                  style={{
                    background: "var(--bg-primary)",
                    backdropFilter: "blur(60px) saturate(180%)",
                  }}
                >
                  <div className="p-1.5 max-h-[240px] overflow-y-auto">
                    {/* Go to Overview option */}
                    <button
                      onClick={() => {
                        changeLocal(null);
                        setSelectorOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-white/[0.06] transition-colors cursor-pointer group"
                    >
                      <div className="size-7 rounded-md glass-subtle flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[14px] text-white/50">
                          space_dashboard
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white/60 group-hover:text-white truncate">
                          Todos los locales
                        </p>
                      </div>
                    </button>

                    {userLocales.length > 0 && (
                      <div className="h-px bg-white/[0.06] mx-2 my-1" />
                    )}

                    {userLocales.map((local) => {
                      const isSelected = selectedLocal?.id === local.id;
                      return (
                        <button
                          key={local.id}
                          onClick={() => {
                            changeLocal(local);
                            setSelectorOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer group ${
                            isSelected
                              ? "bg-white/[0.08] border border-primary/20"
                              : "hover:bg-white/[0.06] border border-transparent"
                          }`}
                        >
                          <div
                            className={`size-7 rounded-md flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-gradient-to-br from-primary/30 to-primary-dark/20 border border-primary/30"
                                : "glass-subtle"
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[14px] ${isSelected ? "text-primary-light" : "text-white/50"}`}
                            >
                              storefront
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-bold truncate ${isSelected ? "text-primary-light" : "text-white/80 group-hover:text-white"}`}
                            >
                              {local.name}
                            </p>
                            <p className="text-[10px] text-white/40 truncate capitalize">
                              {local.role}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[14px] text-primary-light">
                              check
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={!sidebarOpen ? link.name : undefined}
                  className={`flex items-center p-2 rounded-xl transition-all duration-300 group relative overflow-hidden box-border ${
                    isActive
                      ? "bg-white/[0.06] text-white shadow-lg border border-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                  )}
                  <div
                    className={`w-10 h-10 flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-110 ${!sidebarOpen && "mx-auto"}`}
                  >
                    <span
                      className={`material-symbols-outlined transition-all duration-300 ${
                        isActive
                          ? "text-transparent bg-clip-text bg-gradient-to-br from-primary-light to-primary-dark drop-shadow-[0_0_8px_rgba(124,58,237,0.4)] scale-110"
                          : "text-[22px] text-white/40 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-light group-hover:to-primary-dark group-hover:drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                      }`}
                    >
                      {link.icon}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center relative z-10 ${
                      sidebarOpen
                        ? "max-w-[160px] opacity-100 ml-2"
                        : "max-w-0 opacity-0 ml-0"
                    }`}
                  >
                    <span className="text-sm font-semibold">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-white/[0.04] p-2 shrink-0 overflow-hidden box-border flex justify-center items-center h-[80px]">
            <div
              className={`glass-subtle rounded-xl flex items-center h-16 box-border transition-all duration-300 overflow-hidden ${
                sidebarOpen ? "w-full" : "w-16 justify-center"
              }`}
            >
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/40 to-accent-orange/30 border border-white/20 flex items-center justify-center text-white/90 shadow-inner group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300">
                  <span className="material-symbols-outlined text-[20px] text-white drop-shadow-md transition-transform group-hover:scale-110 group-hover:text-accent-orange-light">
                    person
                  </span>
                </div>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out flex flex-col justify-center overflow-hidden ${
                  sidebarOpen
                    ? "max-w-[180px] opacity-100"
                    : "max-w-0 opacity-0"
                }`}
              >
                <div className="w-[180px] pl-1 pr-3 text-left">
                  <p className="text-sm font-bold text-white whitespace-normal leading-[1.15] break-words">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-primary-light mt-0.5 font-semibold truncate uppercase tracking-wider opacity-80">
                    {user?.role || "user"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════ */}
      {/* MAIN CONTENT AREA                     */}
      {/* ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 gap-4 h-full">
        {/* Top Header */}
        <header className="z-30 shrink-0">
          <div className="flex items-center justify-between glass-heavy rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="size-9 rounded-xl glass-button flex items-center justify-center text-white/70 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform">
                  {sidebarOpen ? "keyboard_double_arrow_left" : "menu"}
                </span>
              </button>
              <div className="h-5 w-px bg-white/10" />

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                {selectedLocal ? (
                  <>
                    <button
                      onClick={() => {
                        changeLocal(null);
                        navigate("/dashboard");
                      }}
                      className="font-bold text-white/50 hover:text-white transition-colors cursor-pointer truncate max-w-[160px]"
                    >
                      {selectedLocal.name}
                    </button>
                    <span className="material-symbols-outlined text-[16px] text-white/30">
                      chevron_right
                    </span>
                    <span className="font-bold text-white/90 tracking-wide uppercase">
                      {currentView}
                    </span>
                  </>
                ) : (
                  <h1 className="font-bold text-white/90 tracking-wide uppercase">
                    {currentView}
                  </h1>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="size-9 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </button>
              <button className="size-9 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </button>
              <div className="h-5 w-px bg-white/10 mx-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-white/60 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300 text-sm font-medium group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:text-white transition-colors">
                  logout
                </span>
                <span className="hidden sm:inline group-hover:text-white transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden rounded-2xl">
          <div className="p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
