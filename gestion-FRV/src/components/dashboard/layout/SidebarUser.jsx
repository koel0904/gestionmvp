import React from 'react';

export default function SidebarUser({ sidebarOpen, user }) {
    return (
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
    );
}
