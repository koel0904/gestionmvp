import React from "react";

export default function ClientesHeader({ selectedLocal, onNewCliente }) {
    return (
        <div className="flex items-center justify-between glass-panel rounded-2xl p-5 border border-white/10 shrink-0">
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center border border-primary/20 shadow-inner">
                    <span className="material-symbols-outlined text-[24px] text-primary-light drop-shadow-md">
                        groups
                    </span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        Clientes
                    </h2>
                    <p className="text-sm text-white/50 font-medium">
                        Customer directory for {selectedLocal.name}
                    </p>
                </div>
            </div>
            <button
                onClick={onNewCliente}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-white font-bold tracking-wide shadow-[0_2px_8px_rgba(167,139,250,0.4)] hover:shadow-[0_0_24px_rgba(167,139,250,0.55)] transition-all transform hover:-translate-y-0.5"
            >
                <span className="material-symbols-outlined text-[18px]">
                    person_add
                </span>
                <span className="hidden sm:inline">Add Customer</span>
            </button>
        </div>
    );
}
