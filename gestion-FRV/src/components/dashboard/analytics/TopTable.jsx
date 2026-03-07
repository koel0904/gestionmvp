import PropTypes from "prop-types";

/**
 * TopTable — ranked list table (top products, top customers, etc.)
 *
 * Props:
 *  - title    string
 *  - icon     string   Material Symbols icon
 *  - color    "purple" | "orange"
 *  - columns  Array<string>   Column headers (max 3)
 *  - rows     Array<Array<string|ReactNode>>  Row cells (matching columns length)
 */
export default function TopTable({ title, icon, color = "purple", columns = [], rows = [] }) {
    const accentClass = color === "orange" ? "text-accent-orange" : "text-primary-light";
    const viaClass =
        color === "orange"
            ? "bg-gradient-to-r from-transparent via-accent-orange/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-primary-light/40 to-transparent";

    return (
        <div className="glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4">
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-[1px] ${viaClass}`} />

            {/* Header */}
            <h3 className={`text-xs font-black uppercase tracking-[0.15em] flex items-center gap-1.5 ${accentClass}`}>
                <span className="material-symbols-outlined text-[15px]">{icon}</span>
                {title}
            </h3>

            {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className={`material-symbols-outlined text-4xl ${accentClass} opacity-30 mb-2`}>
                        {icon}
                    </span>
                    <p className="text-white/40 text-sm font-semibold">No data yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] text-white/25 uppercase tracking-widest font-semibold pb-2 pr-2 w-6">
                                    #
                                </th>
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className="text-[10px] text-white/25 uppercase tracking-widest font-semibold pb-2 pr-2"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {rows.map((row, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-white/[0.03] transition-colors duration-150 group"
                                >
                                    <td className="py-2.5 pr-2 text-xs font-bold text-white/20 w-6">
                                        {i + 1}
                                    </td>
                                    {row.map((cell, j) => (
                                        <td key={j} className="py-2.5 pr-2 text-sm text-white/70 font-medium">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

TopTable.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.oneOf(["purple", "orange"]),
    columns: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.array,
};
