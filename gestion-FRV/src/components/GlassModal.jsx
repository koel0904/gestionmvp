import { useEffect } from "react";

export default function GlassModal({
  isOpen,
  onClose,
  title,
  icon = "info",
  iconColor = "text-primary-light",
  gradient = "from-primary/30 to-primary-dark/20",
  children,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-light/50 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 glass-subtle">
          <div className="flex items-center gap-4">
            <div
              className={`size-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-white/20 shadow-inner shrink-0`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${iconColor} drop-shadow-md`}
              >
                {icon}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="size-8 rounded-full glass-button flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
