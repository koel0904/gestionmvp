import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Card = ({
  title,
  description,
  icon,
  onClick,
  variant = "static",
  className = "",
  children,
}) => {
  const isInteractive = variant === "interactive" || onClick;
  const isGlass = variant === "glass";

  const baseClasses = isGlass ? "card-glass" : "card";
  const interactiveClasses = isInteractive ? "card-interactive" : "";

  return (
    <motion.div
      whileHover={isInteractive ? { y: -4 } : {}}
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Icon */}
      {icon && <div className="mb-4 text-[var(--accent-color)]">{icon}</div>}

      {/* Title */}
      {title && (
        <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      )}

      {/* Custom children */}
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["static", "interactive", "glass"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
