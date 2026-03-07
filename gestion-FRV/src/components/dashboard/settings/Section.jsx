import PropTypes from "prop-types";

/**
 * Section — glass card wrapper with an optional title heading.
 *
 * Props:
 *  - title    string   Optional section heading
 *  - children ReactNode
 */
export default function Section({ title, children }) {
    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5">
            {title && (
                <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest border-b border-white/[0.06] pb-3">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

Section.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
};
