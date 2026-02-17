import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const sidebarLinks = [
  { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
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
    <div className="min-h-screen bg-background-dark font-display text-white flex relative overflow-hidden">
      {/* ── Ambient Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[900px] h-[900px] -top-[250px] -left-[150px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22)_0%,transparent_55%)] blur-[100px]" />
        <div className="absolute w-[700px] h-[700px] bottom-[-200px] right-[-100px] rounded-full bg-[radial-gradient(circle,rgba(244,140,37,0.18)_0%,transparent_55%)] blur-[100px]" />
        <div className="absolute w-[500px] h-[500px] top-[40%] left-[50%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(192,80,200,0.1)_0%,transparent_60%)] blur-[80px]" />
      </div>

      {/* ══════════════════════════════════════ */}
      {/* SIDEBAR                              */}
      {/* ══════════════════════════════════════ */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-[272px]" : "w-[80px]"
        }`}
      >
        <div className="flex flex-col h-full m-3 mr-0 rounded-2xl overflow-hidden glass-heavy relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent-violet via-primary to-accent-violet opacity-60" />

          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-accent-violet to-primary text-white shadow-lg shadow-accent-violet/30 shrink-0 glow-purple">
              <span className="material-symbols-outlined text-[20px]">
                business_center
              </span>
            </div>
            {sidebarOpen && (
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent truncate">
                BizManage
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "glass-button-primary text-white glow-purple"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-violet/10 to-primary/5 pointer-events-none" />
                  )}
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 relative z-10 ${
                      isActive
                        ? "text-accent-purple-light"
                        : "text-white/50 group-hover:text-accent-violet/70"
                    }`}
                  >
                    {link.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="text-sm font-semibold truncate relative z-10">
                      {link.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="glass-subtle rounded-xl p-3 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-accent-violet/40 to-primary/30 border border-accent-violet/20 flex items-center justify-center text-white/90 shrink-0 glow-purple">
                <span className="material-symbols-outlined text-[18px]">
                  person
                </span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-accent-purple-light truncate font-medium">
                    {user?.role || "user"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════ */}
      {/* MAIN CONTENT AREA                     */}
      {/* ══════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          sidebarOpen ? "ml-[272px]" : "ml-[80px]"
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 px-5 pt-3">
          <div className="flex items-center justify-between glass-heavy rounded-2xl px-5 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="size-9 rounded-xl glass-button flex items-center justify-center text-white/70 hover:text-accent-purple-light cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {sidebarOpen ? "menu_open" : "menu"}
                </span>
              </button>
              <div className="h-5 w-px bg-accent-violet/20" />
              <h1 className="text-sm font-bold text-white/80 tracking-wide uppercase">
                {sidebarLinks.find((l) => l.path === location.pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="size-9 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-primary cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </button>
              <button className="size-9 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-accent-purple-light cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </button>
              <div className="h-5 w-px bg-accent-violet/20 mx-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-white/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-sm font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-5 pb-5 pt-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
