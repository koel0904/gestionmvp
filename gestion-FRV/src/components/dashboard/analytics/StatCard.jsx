import PropTypes from "prop-types";

/**
 * StatCard — displays a KPI metric with icon, value, label, and a trend badge.
 *
 * Props:
 *  - title      string   Label beneath the value
 *  - value      string   Primary value to display
 *  - change     string   Trend text, e.g. "+12.5%"
 *  - trend      "up"|"down"|"neutral"
 *  - icon       string   Material Symbols icon name
 *  - gradient   string   Tailwind bg-gradient classes for the icon container
 *  - iconColor  string   Tailwind text color class for the icon
 *  - glowClass  string   CSS class added on hover (e.g. "glow-purple")
 *  - border     string   Tailwind border-color class
 */
export default function StatCard({
    title,
    value,
    change,
    trend = "neutral",
    icon,
    gradient = "from-primary/30 to-primary/10",
    iconColor = "text-primary-light",
    glowClass = "glow-mixed",
    border = "border-white/10",
}) {
    const trendColor =
        trend === "up"
            ? "text-emerald-400"
            : trend === "down"
                ? "text-red-400"
                : "text-white/50";

    const trendIcon =
        trend === "up"
            ? "trending_up"
            : trend === "down"
                ? "trending_down"
                : "remove";

    return (
        <div
            className={`glass-panel ${border} rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden cursor-default`}
        >
            {/* Hover glow overlay */}
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowClass} pointer-events-none rounded-2xl`}
            />

            <div className="relative z-10 flex flex-col gap-3">
                {/* Top row: icon + trend badge */}
                <div className="flex items-start justify-between">
                    <div
                        className={`size-11 rounded-xl bg-gradient-to-br ${gradient} glass-subtle flex items-center justify-center border border-white/10`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${iconColor}`}>
                            {icon}
                        </span>
                    </div>

                    <span
                        className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-lg glass-badge ${trendColor}`}
                    >
                        <span className={`material-symbols-outlined text-[13px] ${trendColor}`}>
                            {trendIcon}
                        </span>
                        {change}
                    </span>
                </div>

                {/* Value + label */}
                <div>
                    <p className="text-2xl font-black tracking-tight text-white">{value}</p>
                    <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mt-0.5">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
}

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    change: PropTypes.string,
    trend: PropTypes.oneOf(["up", "down", "neutral"]),
    icon: PropTypes.string.isRequired,
    gradient: PropTypes.string,
    iconColor: PropTypes.string,
    glowClass: PropTypes.string,
    border: PropTypes.string,
};
