import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedLocal, setSelectedLocal] = useState(null);

  // Sample locales data. In a full implementation this would come from the user's relations.
  const userLocales = [
    {
      id: 1,
      name: "Local 1",
      address: "Main Headquarters",
      role: user?.role || "admin",
    },
  ];

  if (!selectedLocal) {
    return (
      <LocalsGrid
        locales={userLocales}
        onSelect={setSelectedLocal}
        user={user}
      />
    );
  }

  return (
    <LocalDetailView
      local={selectedLocal}
      onBack={() => setSelectedLocal(null)}
      user={user}
    />
  );
}

function LocalsGrid({ locales, onSelect, user }) {
  return (
    <div className="space-y-5">
      {/* ── Welcome Banner ── */}
      <div className="glass-ultra rounded-2xl p-8 relative overflow-hidden">
        {/* Top accent line removed for cleaner glass effect */}

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
                <span className="glass-badge-purple px-2.5 py-1 rounded-lg text-xs font-semibold text-white capitalize">
                  {local.role}
                </span>
                <span className="material-symbols-outlined text-white/30 group-hover:text-primary-light transition-all group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* Create New Local Placeholder */}
        <button className="glass-panel border-dashed border-2 border-white/10 rounded-2xl p-6 hover:bg-white/[0.02] transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px] cursor-pointer">
          <div className="size-12 rounded-xl glass-subtle flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[24px] text-white/50 group-hover:text-white">
              add
            </span>
          </div>
          <h3 className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">
            Register New Location
          </h3>
        </button>
      </div>
    </div>
  );
}

function LocalDetailView({ local, onBack }) {
  const statCards = [
    {
      title: "Total Revenue",
      value: "$0.00",
      change: "+0%",
      icon: "payments",
      gradient: "from-primary/30 to-primary/10",
      iconColor: "text-primary-light drop-shadow-sm",
      glowClass: "glow-orange" /* mapped to opaque green */,
      borderColor: "border-primary/30",
    },
    {
      title: "Orders",
      value: "0",
      change: "+0%",
      icon: "shopping_bag",
      gradient: "from-white/20 to-white/5",
      iconColor: "text-white drop-shadow-md",
      glowClass: "glow-mixed",
      borderColor: "border-white/20",
    },
    {
      title: "Customers",
      value: "0",
      change: "+0%",
      icon: "group",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary-light drop-shadow-sm",
      glowClass: "glow-orange",
      borderColor: "border-primary/20",
    },
    {
      title: "Products",
      value: "0",
      change: "+0%",
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
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {local.name} Dashboard
          </h2>
          <p className="text-xs text-white/50 font-medium">{local.address}</p>
        </div>
      </div>

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
                <span className="glass-badge-orange text-[10px] font-bold text-white px-2 py-0.5 rounded-md border-white/20 bg-white/5">
                  {card.change}
                </span>
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
              history
            </span>
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="size-20 rounded-2xl glass-panel border-blue-400/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(96,165,250,0.15)]">
              <span className="material-symbols-outlined text-4xl text-blue-400/60 drop-shadow-md">
                history
              </span>
            </div>
            <p className="text-white/60 text-sm font-bold mb-1">
              No activity yet for {local.name}
            </p>
            <p className="text-white/40 text-xs font-medium max-w-[200px]">
              Your recent actions and events will appear here
            </p>
          </div>
        </div>
      </div>

      {/* ── Business Info Bar ── */}
      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center border border-white/20 shadow-inner">
            <span className="material-symbols-outlined text-[20px] text-white drop-shadow-md">
              domain
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Current Environment</p>
            <p className="text-xs text-white/50 font-medium">
              {local.name} Workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="glass-badge-purple px-3 py-1.5 rounded-lg text-xs font-semibold text-white capitalize">
            {local.role}
          </span>
          <span className="glass-badge-purple px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
