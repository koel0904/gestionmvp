import PropTypes from "prop-types";

/**
 * FieldRow — labeled form field wrapper.
 *
 * Props:
 *  - label    string   Text label shown above the field
 *  - icon     string   Material Symbols icon name (shown in label)
 *  - children ReactNode  The input / select element
 */
export default function FieldRow({ label, icon, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary-light">
                    {icon}
                </span>
                {label}
            </label>
            {children}
        </div>
    );
}

FieldRow.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
