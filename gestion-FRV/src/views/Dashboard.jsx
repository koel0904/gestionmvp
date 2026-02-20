import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_70%)] blur-[30px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(244,140,37,0.15)_0%,transparent_70%)] blur-[30px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent-violet via-primary to-accent-violet opacity-50" />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-purple-light mb-2">
            Workspaces Overview
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-accent-violet via-primary to-accent-purple-light bg-clip-text text-transparent">
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
              <div className="size-12 rounded-xl bg-gradient-to-br from-accent-violet/20 to-primary/10 glass-subtle flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px] text-accent-purple-light">
                  storefront
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-purple-light transition-colors">
                {local.name}
              </h3>
              <p className="text-sm font-medium text-white/50 mb-6">
                {local.address}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="glass-badge-purple px-2.5 py-1 rounded-lg text-xs font-bold text-accent-purple-light capitalize">
                  {local.role}
                </span>
                <span className="material-symbols-outlined text-white/30 group-hover:text-primary transition-all group-hover:translate-x-1">
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

function LocalDetailView({ local, onBack, user }) {
  const statCards = [
    {
      title: "Total Revenue",
      value: "$0.00",
      change: "+0%",
      icon: "payments",
      gradient: "from-accent-violet/25 to-accent-purple/10",
      iconColor: "text-accent-purple-light",
      glowClass: "glow-purple",
      borderColor: "border-accent-violet/15",
    },
    {
      title: "Orders",
      value: "0",
      change: "+0%",
      icon: "shopping_bag",
      gradient: "from-primary/25 to-primary-dark/10",
      iconColor: "text-primary-light",
      glowClass: "glow-orange",
      borderColor: "border-primary/15",
    },
    {
      title: "Customers",
      value: "0",
      change: "+0%",
      icon: "group",
      gradient: "from-accent-violet/20 to-primary/10",
      iconColor: "text-accent-purple-light",
      glowClass: "glow-mixed",
      borderColor: "border-accent-violet/12",
    },
    {
      title: "Products",
      value: "0",
      change: "+0%",
      icon: "inventory_2",
      gradient: "from-primary/20 to-accent-violet/10",
      iconColor: "text-primary",
      glowClass: "glow-mixed",
      borderColor: "border-primary/12",
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
                <span className="glass-badge-purple text-xs font-bold text-accent-purple-light px-2.5 py-1 rounded-lg">
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
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent" />
          <h3 className="text-xs font-black text-accent-purple-light uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-accent-violet">
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
                gradient: "from-primary/20 to-primary/5",
                iconColor: "text-primary",
              },
              {
                icon: "person_add",
                label: "Add Customer",
                desc: "Register a client",
                gradient: "from-accent-violet/20 to-accent-violet/5",
                iconColor: "text-accent-purple-light",
              },
              {
                icon: "inventory",
                label: "Add Product",
                desc: "Add to inventory",
                gradient: "from-primary/15 to-accent-violet/10",
                iconColor: "text-primary-light",
              },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full glass-button rounded-xl px-4 py-3 text-left group cursor-pointer flex items-center gap-3"
              >
                <div
                  className={`size-9 rounded-lg bg-gradient-to-br ${action.gradient} glass-subtle flex items-center justify-center shrink-0`}
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
                <span className="material-symbols-outlined text-[16px] text-white/30 group-hover:text-accent-purple-light group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-heavy rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">
              history
            </span>
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="size-20 rounded-2xl glass-panel border-accent-violet/10 flex items-center justify-center mb-5 glow-purple">
              <span className="material-symbols-outlined text-4xl text-accent-violet/50">
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
      <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-gradient-to-br from-accent-violet/20 to-primary/10 glass-subtle flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-accent-purple-light">
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
          <span className="glass-badge-purple px-3 py-1.5 rounded-lg text-xs font-bold text-accent-purple-light capitalize">
            {local.role}
          </span>
          <span className="glass-badge-orange px-3 py-1.5 rounded-lg text-xs font-bold text-primary">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
