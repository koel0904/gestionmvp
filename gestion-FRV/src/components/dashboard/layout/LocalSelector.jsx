import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function LocalSelector({ sidebarOpen, selectedLocal, changeLocal, userLocales }) {
    const [selectorOpen, setSelectorOpen] = useState(false);
    const selectorRef = useRef(null);
    const navigate = useNavigate();

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

    return (
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
                    className={`w-full flex items-center rounded-xl glass-subtle border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group ${sidebarOpen ? "px-3 py-2.5 gap-3" : "p-2.5 justify-center"
                        }`}
                >
                    <div className="size-8 rounded-lg bg-gradient-to-br from-primary/25 to-accent-orange/15 flex items-center justify-center shrink-0 border border-white/15">
                        <span className="material-symbols-outlined text-[16px] text-primary-light drop-shadow-sm">
                            storefront
                        </span>
                    </div>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out flex-1 min-w-0 ${sidebarOpen
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
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen
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
                        className={`absolute top-full mt-2 z-50 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${sidebarOpen ? "left-0 right-0" : "left-0 w-[220px]"
                            }`}
                        style={{
                            background: "var(--bg-primary)",
                            backdropFilter: "blur(60px) saturate(180%)",
                        }}
                    >
                        <div className="p-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
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
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer group ${isSelected
                                                ? "bg-white/[0.08] border border-primary/20"
                                                : "hover:bg-white/[0.06] border border-transparent"
                                            }`}
                                    >
                                        <div
                                            className={`size-7 rounded-md flex items-center justify-center shrink-0 ${isSelected
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
    );
}
