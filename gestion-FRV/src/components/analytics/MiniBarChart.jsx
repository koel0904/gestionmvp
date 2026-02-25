import PropTypes from "prop-types";

/**
 * MiniBarChart — lightweight SVG bar chart.
 *
 * Props:
 *  - data       Array<{ label: string, value: number }>
 *  - title      string   Card heading
 *  - subtitle   string   Optional subtitle / period
 *  - color      "purple" | "orange"   Accent color for bars
 *  - height     number   SVG drawing height (default 120)
 */
export default function MiniBarChart({
    data = [],
    title,
    subtitle,
    color = "purple",
    height = 120,
}) {
    const max = Math.max(...data.map((d) => d.value), 1);
    const barW = 100 / (data.length * 2 - 1); // percent width per bar
    const gap = barW; // gap equals bar width

    const gradId = `bar-grad-${color}`;
    const gradStart = color === "orange" ? "#f97316" : "#7c3aed";
    const gradEnd = color === "orange" ? "#fdba74" : "#a78bfa";

    return (
        <div className="glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4">
            {/* Top accent line */}
            <div
                className={`absolute top-0 left-0 w-full h-[1px] ${color === "orange"
                        ? "bg-gradient-to-r from-transparent via-accent-orange/50 to-transparent"
                        : "bg-gradient-to-r from-transparent via-primary-light/40 to-transparent"
                    }`}
            />

            {/* Header */}
            <div>
                <h3
                    className={`text-xs font-black uppercase tracking-[0.15em] flex items-center gap-1.5 ${color === "orange" ? "text-accent-orange" : "text-primary-light"
                        }`}
                >
                    <span className={`material-symbols-outlined text-[15px]`}>bar_chart</span>
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[11px] text-white/30 mt-0.5 font-medium">{subtitle}</p>
                )}
            </div>

            {/* SVG chart */}
            <svg
                viewBox={`0 0 100 ${height}`}
                preserveAspectRatio="none"
                className="w-full"
                style={{ height }}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradEnd} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={gradStart} stopOpacity="0.4" />
                    </linearGradient>
                </defs>

                {data.map((d, i) => {
                    const barHeight = (d.value / max) * (height - 16);
                    const x = i * (barW + gap);
                    const y = height - barHeight;
                    return (
                        <g key={d.label}>
                            {/* Background track */}
                            <rect
                                x={`${x}%`}
                                y={0}
                                width={`${barW}%`}
                                height={height}
                                fill="rgba(255,255,255,0.03)"
                                rx={3}
                            />
                            {/* Value bar */}
                            <rect
                                x={`${x}%`}
                                y={y}
                                width={`${barW}%`}
                                height={barHeight}
                                fill={`url(#${gradId})`}
                                rx={3}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-0.5">
                {data.map((d) => (
                    <span key={d.label} className="text-[10px] text-white/30 font-medium">
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

MiniBarChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })
    ).isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    color: PropTypes.oneOf(["purple", "orange"]),
    height: PropTypes.number,
};
