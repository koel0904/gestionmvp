import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen font-display text-white flex p-4 gap-4 relative overflow-hidden">
      {/* ── Removed Ambient Background Orbs to allow Liquid Glass effect over pure background ── */}

      {/* ══════════════════════════════════════ */}
      {/* SIDEBAR                              */}
      {/* ══════════════════════════════════════ */}
      <aside
        className={`relative z-40 flex flex-col shrink-0 transition-all duration-300 ease-in-out h-full ${sidebarOpen ? "w-[260px]" : "w-[80px]"
          }`}
      >
        <div className="flex flex-col h-full rounded-2xl overflow-hidden glass-heavy shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
          {/* Top accent line removed for cleaner glass effect */}

          {/* Logo */}
          <div className="flex items-center h-[88px] px-5 border-b border-white/[0.04] shrink-0 box-border overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent-orange/20 text-white shadow-lg shadow-black/20 shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-[20px] text-transparent bg-clip-text bg-gradient-to-br from-accent-orange-light to-white drop-shadow-md">
                business_center
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center ${sidebarOpen
                ? "max-w-[150px] opacity-100 ml-3"
                : "max-w-0 opacity-0 ml-0"
                }`}
            >
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent-orange to-primary-light bg-clip-text text-transparent">
                BizManage
              </span>
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
                  className={`flex items-center p-2 rounded-xl transition-all duration-300 group relative overflow-hidden box-border ${isActive
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
                      className={`material-symbols-outlined transition-all duration-300 ${isActive
                        ? "text-transparent bg-clip-text bg-gradient-to-br from-primary-light to-primary-dark drop-shadow-[0_0_8px_rgba(124,58,237,0.4)] scale-110"
                        : "text-[22px] text-white/40 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-light group-hover:to-primary-dark group-hover:drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                        }`}
                    >
                      {link.icon}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center relative z-10 ${sidebarOpen
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
              className={`glass-subtle rounded-xl flex items-center h-16 box-border transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-full" : "w-16 justify-center"
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
                className={`transition-all duration-300 ease-in-out flex flex-col justify-center overflow-hidden ${sidebarOpen
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
              <h1 className="text-sm font-bold text-white/90 tracking-wide uppercase">
                {sidebarLinks.find((l) => l.path === location.pathname)?.name ||
                  "Dashboard"}
              </h1>
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
