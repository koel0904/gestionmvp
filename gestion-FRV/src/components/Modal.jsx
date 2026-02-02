import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") onClose();
  };

  // Add/remove escape listener
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleEscape);
    if (!isOpen) window.removeEventListener("keydown", handleEscape);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg pointer-events-auto"
            >
              <div className="glass rounded-2xl p-8 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-[var(--text-secondary)]" />
                </button>

                {/* Title */}
                {title && (
                  <h3 className="text-2xl font-bold mb-4 pr-8">{title}</h3>
                )}

                {/* Content */}
                <div className="text-[var(--text-secondary)]">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Modal;
