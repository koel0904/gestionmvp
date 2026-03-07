import React from "react";

export default function PermisosHeader({ selectedLocal }) {
    return (
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
                        Gestión de roles y restricciones para {selectedLocal?.name}
                    </p>
                </div>
            </div>
        </div>
    );
}
