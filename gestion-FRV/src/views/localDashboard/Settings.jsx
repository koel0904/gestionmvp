import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileTab from "../../components/dashboard/settings/ProfileTab";
import AppearanceTab from "../../components/dashboard/settings/AppearanceTab";
import LanguageTab from "../../components/dashboard/settings/LanguageTab";
import Permisos from "./Permisos";

const TABS = [
    { id: "profile", label: "Profile", icon: "manage_accounts" },
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "language", label: "Language", icon: "translate" },
];

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const isOwner = user?.role === "owner" || user?.type === "owner";
    const availableTabs = isOwner
        ? [...TABS, { id: "permisos", label: "Permisos", icon: "admin_panel_settings" }]
        : TABS;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 min-h-[800px]">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
                <p className="text-sm text-white/40 mt-1">
                    Manage your account, appearance and preferences.
                </p>
            </div>

            {/* Tab bar */}
            <div className="glass-panel rounded-2xl p-1.5 flex gap-1 overflow-x-auto">
                {availableTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === tab.id
                            ? "bg-white/[0.08] text-white shadow-lg border border-white/10"
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                            }`}
                    >
                        <span
                            className={`material-symbols-outlined text-[18px] transition-all duration-300 ${activeTab === tab.id
                                ? "text-transparent bg-clip-text bg-gradient-to-br from-accent-orange to-primary"
                                : ""
                                }`}
                        >
                            {tab.icon}
                        </span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="w-full">
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "appearance" && <AppearanceTab />}
                {activeTab === "language" && <LanguageTab />}
                {activeTab === "permisos" && <Permisos isSettingsTab={true} />}
            </div>
        </div>
    );
}
