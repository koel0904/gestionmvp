import PropTypes from "prop-types";

/**
 * ToggleCard — clickable card with a pill toggle indicator.
 *
 * Props:
 *  - icon         string   Material Symbols icon name
 *  - title        string
 *  - description  string   Subtitle text
 *  - active       boolean  Whether this option is currently selected
 *  - onToggle     function Called when the card is clicked
 *  - accentClass  string   Tailwind bg-gradient classes for the icon container when active
 */
export default function ToggleCard({
    icon,
    title,
    description,
    active,
    onToggle,
    accentClass = "from-primary/40 to-accent-orange/20",
}) {
    return (
        <button
            onClick={onToggle}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer group ${active
                    ? "bg-white/[0.06] border-white/20 shadow-lg"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10"
                }`}
        >
            {/* Icon container */}
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br border transition-all duration-300 ${active
                        ? `${accentClass} border-white/20`
                        : "from-white/5 to-white/[0.02] border-white/[0.06]"
                    }`}
            >
                <span
                    className={`material-symbols-outlined text-[22px] transition-all duration-300 ${active ? "text-white drop-shadow-md" : "text-white/40 group-hover:text-white/60"
                        }`}
                >
                    {icon}
                </span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-semibold transition-colors duration-200 ${active ? "text-white" : "text-white/60"
                        }`}
                >
                    {title}
                </p>
                <p className="text-[11px] text-white/30 mt-0.5">{description}</p>
            </div>

            {/* Pill toggle */}
            <div
                className={`w-10 h-5 rounded-full flex items-center transition-all duration-300 shrink-0 ${active ? "bg-primary justify-end" : "bg-white/10 justify-start"
                    }`}
            >
                <div className="w-4 h-4 rounded-full bg-white mx-0.5 shadow-sm" />
            </div>
        </button>
    );
}

ToggleCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    accentClass: PropTypes.string,
};
