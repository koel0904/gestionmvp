import { useEffect } from "react";

export default function GlassToast({
  message,
  type = "success", // 'success' or 'error'
  visible,
  onClose,
}) {
  useEffect(() => {
    if (visible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const isError = type === "error";
  const icon = isError ? "error" : "check_circle";
  const iconColor = isError ? "text-red-400" : "text-green-400";
  const glow = isError
    ? "shadow-[0_0_20px_rgba(239,68,68,0.2)]"
    : "shadow-[0_0_20px_rgba(74,222,128,0.2)]";
  const border = isError ? "border-red-500/30" : "border-green-500/30";

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`glass-panel flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${border} ${glow}`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${iconColor} drop-shadow-md animate-pulse`}
        >
          {icon}
        </span>
        <div className="font-semibold text-white/90 text-sm tracking-wide">
          {message}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-white/40 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
