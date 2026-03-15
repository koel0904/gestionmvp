import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarNav({ sidebarOpen, dynamicLinks, location }) {
    return (
        <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 p-3 custom-scrollbar">
            {dynamicLinks.map((link) => {
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
    );
}
