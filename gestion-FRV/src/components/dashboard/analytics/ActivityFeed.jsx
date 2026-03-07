import PropTypes from "prop-types";

/**
 * ActivityFeed — scrollable list of recent events.
 *
 * Props:
 *  - events  Array<{ id, icon, iconColor, iconBg, title, desc, time, badge?, badgeColor? }>
 */
export default function ActivityFeed({ events = [] }) {
    return (
        <div className="glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4 h-full">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            {/* Header */}
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.15em] flex items-center gap-1.5 shrink-0">
                <span className="material-symbols-outlined text-[15px]">history</span>
                Recent Activity
            </h3>

            {/* List */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center flex-1">
                        <div className="size-14 rounded-2xl glass-panel flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-3xl text-blue-400/50">history</span>
                        </div>
                        <p className="text-white/50 text-sm font-semibold">No activity yet</p>
                        <p className="text-white/30 text-xs mt-1">Events will show up here</p>
                    </div>
                ) : (
                    events.map((ev) => (
                        <div
                            key={ev.id}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors duration-200"
                        >
                            {/* Icon */}
                            <div
                                className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${ev.iconBg || "bg-white/10"}`}
                            >
                                <span
                                    className={`material-symbols-outlined text-[18px] ${ev.iconColor || "text-white/60"}`}
                                >
                                    {ev.icon}
                                </span>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                                    {ev.badge && (
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${ev.badgeColor || "glass-badge text-white/50"
                                                }`}
                                        >
                                            {ev.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-white/40 mt-0.5 truncate">{ev.desc}</p>
                                <p className="text-[10px] text-white/25 mt-1 font-medium">{ev.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

ActivityFeed.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            icon: PropTypes.string.isRequired,
            iconColor: PropTypes.string,
            iconBg: PropTypes.string,
            title: PropTypes.string.isRequired,
            desc: PropTypes.string,
            time: PropTypes.string,
            badge: PropTypes.string,
            badgeColor: PropTypes.string,
        })
    ),
};
