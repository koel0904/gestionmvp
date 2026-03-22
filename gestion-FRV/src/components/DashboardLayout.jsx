import { useState, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocal } from "../context/LocalContext";

// Components
import SidebarLogo from "./dashboard/layout/SidebarLogo";
import LocalSelector from "./dashboard/layout/LocalSelector";
import SidebarNav from "./dashboard/layout/SidebarNav";
import SidebarUser from "./dashboard/layout/SidebarUser";
import DashboardHeader from "./dashboard/layout/DashboardHeader";

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
  { name: "Vehículos", icon: "directions_car", path: "/dashboard/vehiculos" },
  { name: "Foro", icon: "campaign", path: "/dashboard/foro" },
  { name: "Tareas", icon: "task", path: "/dashboard/tareas" },
  { name: "Analitics", icon: "analytics", path: "/dashboard/analitics" },
  { name: "Settings", icon: "settings", path: "/dashboard/settings" },
];

const NAV_ORDER_KEY = "sidebar-nav-order";
const SIDEBAR_OPEN_KEY = "sidebar-is-open";

function readSavedOrder() {
  try {
    const raw = localStorage.getItem(NAV_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readSidebarState() {
  try {
    const raw = localStorage.getItem(SIDEBAR_OPEN_KEY);
    // Request specifically asked to show only icons, setting default to false
    return raw !== null ? JSON.parse(raw) : false;
  } catch {
    return false;
  }
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarState] = useState(() => readSidebarState());
  const [navOrder, setNavOrder] = useState(() => readSavedOrder());

  const setSidebarOpen = (isOpen) => {
    setSidebarState(isOpen);
    localStorage.setItem(SIDEBAR_OPEN_KEY, JSON.stringify(isOpen));
  };
  const { user, logout } = useAuth();
  const { selectedLocal, changeLocal, userLocales } = useLocal();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dynamic sidebar links based on role
  const getSidebarLinks = () => {
    let links = [...sidebarLinks];

    // Filter links based on permissions if not owner
    if (user?.role !== "owner" && user?.type !== "owner") {
      links = links.filter((link) => {
        const viewName = link.name.toLowerCase();
        // Always show Overview, Settings, Analitics, Foro and Tareas (everyone can read)
        if (
          ["overview", "settings", "analitics", "foro", "tareas"].includes(
            viewName,
          )
        )
          return true;

        // Block Vehículos -> vehiculos translation
        const permKey = viewName === "vehículos" ? "vehiculos" : viewName;

        // Check if the user has view permission for this view
        const hasViewPerm = user?.permissions?.[permKey]?.view;
        return hasViewPerm === true;
      });
    }

    return links;
  };

  // Sort by saved order (if any)
  const dynamicLinks = (() => {
    const filtered = getSidebarLinks();
    if (!navOrder) return filtered;
    const orderMap = new Map(navOrder.map((path, i) => [path, i]));
    return [...filtered].sort((a, b) => {
      const ia = orderMap.has(a.path) ? orderMap.get(a.path) : Infinity;
      const ib = orderMap.has(b.path) ? orderMap.get(b.path) : Infinity;
      return ia - ib;
    });
  })();

  const handleReorder = useCallback((reorderedLinks) => {
    const newOrder = reorderedLinks.map((l) => l.path);
    setNavOrder(newOrder);
    localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(newOrder));
  }, []);

  const currentViewName =
    dynamicLinks.find((l) => l.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="h-screen font-display text-white flex p-4 gap-4 relative overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════ */}
      {/* SIDEBAR                              */}
      {/* ══════════════════════════════════════ */}
      <aside
        className={`fixed md:relative top-4 left-4 md:top-0 md:left-0 z-50 md:z-40 flex flex-col shrink-0 transition-all duration-300 ease-in-out h-[calc(100vh-2rem)] md:h-full
          ${sidebarOpen
            ? "translate-x-0 w-[260px]"
            : "-translate-x-[150%] md:translate-x-0 w-[80px]"
          }`}
      >
        <div className="flex flex-col h-full rounded-2xl glass-heavy shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
          <SidebarLogo sidebarOpen={sidebarOpen} />

          <LocalSelector
            sidebarOpen={sidebarOpen}
            selectedLocal={selectedLocal}
            changeLocal={changeLocal}
            userLocales={userLocales}
          />

          <SidebarNav
            sidebarOpen={sidebarOpen}
            dynamicLinks={dynamicLinks}
            location={location}
            onReorder={handleReorder}
          />

          <SidebarUser sidebarOpen={sidebarOpen} user={user} />
        </div>
      </aside>

      {/* ══════════════════════════════════════ */}
      {/* MAIN CONTENT AREA                     */}
      {/* ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 gap-4 h-full">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedLocal={selectedLocal}
          changeLocal={changeLocal}
          navigate={navigate}
          currentViewName={currentViewName}
          handleLogout={handleLogout}
        />

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
