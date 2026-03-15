import React from 'react';

export default function DashboardHeader({
    sidebarOpen,
    setSidebarOpen,
    selectedLocal,
    changeLocal,
    navigate,
    currentViewName,
    handleLogout
}) {
    return (
        <header className="z-30 shrink-0">
            <div className="flex items-center justify-between glass-heavy rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="size-9 rounded-xl glass-button flex items-center justify-center text-white/70 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        <span className="material-symbols-outlined text-[20px] transition-transform">
                            {sidebarOpen ? "keyboard_double_arrow_left" : "menu"}
                        </span>
                    </button>
                    <div className="h-5 w-px bg-white/10" />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm">
                        {selectedLocal ? (
                            <>
                                <button
                                    onClick={() => {
                                        changeLocal(null);
                                        navigate("/dashboard");
                                    }}
                                    className="font-bold text-white/50 hover:text-white transition-colors cursor-pointer truncate max-w-[160px]"
                                >
                                    {selectedLocal.name}
                                </button>
                                <span className="material-symbols-outlined text-[16px] text-white/30">
                                    chevron_right
                                </span>
                                <span className="font-bold text-white/90 tracking-wide uppercase">
                                    {currentViewName}
                                </span>
                            </>
                        ) : (
                            <h1 className="font-bold text-white/90 tracking-wide uppercase">
                                {currentViewName}
                            </h1>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="size-9 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <span className="material-symbols-outlined text-[20px]">
                            notifications
                        </span>
                    </button>
                    <button className="size-9 rounded-xl glass-button flex items-center justify-center text-white/60 hover:text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <span className="material-symbols-outlined text-[20px]">
                            search
                        </span>
                    </button>
                    <div className="h-5 w-px bg-white/10 mx-1" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-white/60 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300 text-sm font-medium group"
                    >
                        <span className="material-symbols-outlined text-[18px] group-hover:text-white transition-colors">
                            logout
                        </span>
                        <span className="hidden sm:inline group-hover:text-white transition-colors">
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
