import React from 'react';

export default function SidebarLogo({ sidebarOpen }) {
    return (
        <div className="flex items-center h-[88px] px-5 border-b border-white/[0.04] shrink-0 box-border overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent-orange/20 text-white shadow-lg shadow-black/20 shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-[20px] text-transparent bg-clip-text bg-gradient-to-br from-accent-orange-light to-white drop-shadow-md">
                    business_center
                </span>
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center ${sidebarOpen
                        ? "max-w-[150px] opacity-100 ml-3"
                        : "max-w-0 opacity-0 ml-0"
                    }`}
            >
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent-orange to-primary-light bg-clip-text text-transparent">
                    BizManage
                </span>
            </div>
        </div>
    );
}
