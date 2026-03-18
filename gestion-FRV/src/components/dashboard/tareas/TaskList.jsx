import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";

// Helper colorizer for status
const getStatusClasses = (status) => {
  switch (status) {
    case "Realizada":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "En proceso":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "No se pudo completar":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default:
      return "bg-white/5 text-white/50 border-white/10";
  }
};

const STATUS_OPTIONS = [
  {
    value: "Sin realizar",
    label: "Sin Realizar",
    icon: "radio_button_unchecked",
  },
  { value: "En proceso", label: "En Proceso", icon: "sync" },
  { value: "Realizada", label: "Realizada", icon: "check_circle" },
  { value: "No se pudo completar", label: "No completada", icon: "cancel" },
];

function StatusSelector({ status, canEdit, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption =
    STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];

  if (!canEdit) {
    return (
      <span
        className={`flex items-center justify-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border w-fit mx-auto ${getStatusClasses(status)}`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {currentOption.icon}
        </span>
        {currentOption.label}
      </span>
    );
  }

  return (
    <div className="relative flex justify-center w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all focus:outline-none ${getStatusClasses(status)}`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {currentOption.icon}
        </span>
        {currentOption.label}
        <span className="material-symbols-outlined text-[14px] opacity-50 ml-1">
          expand_more
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-44 glass-panel border border-white/10 rounded-xl shadow-2xl z-[999] flex flex-col py-1 bg-[#141414]"
          style={{ position: "absolute" }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors w-full text-left hover:bg-white/10
                ${opt.value === "Realizada" ? "text-emerald-400" : ""}
                ${opt.value === "En proceso" ? "text-blue-400" : ""}
                ${opt.value === "No se pudo completar" ? "text-amber-400" : ""}
                ${opt.value === "Sin realizar" ? "text-white/70" : ""}
              `}
            >
              <span className="material-symbols-outlined text-[16px]">
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

StatusSelector.propTypes = {
  status: PropTypes.string.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function TaskList({
  tareas,
  isLoading,
  onStatusChange,
  onEdit,
  onDelete,
  onEditReason,
  currentUserId,
  isAdmin,
}) {
  const [popoverTarea, setPopoverTarea] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const popoverTimeout = useRef(null);

  const showPopover = (e, tarea) => {
    clearTimeout(popoverTimeout.current);
    const iconRect = e.currentTarget.getBoundingClientRect();
    const tdElement = e.currentTarget.closest("td");
    const tdRect = tdElement ? tdElement.getBoundingClientRect() : iconRect;
    
    // Check if there is more space below or above
    const spaceBelow = window.innerHeight - iconRect.bottom;
    const spaceAbove = iconRect.top;
    const showBelow = spaceBelow >= 200 || spaceBelow > spaceAbove;

    setPopoverPos({
      top: showBelow ? iconRect.bottom + 8 : iconRect.top - 8,
      left: Math.max(160, Math.min(window.innerWidth - 160, tdRect.left + tdRect.width / 2)),
      isBelow: showBelow
    });
    setPopoverTarea(tarea);
  };
  const hidePopover = () => {
    popoverTimeout.current = setTimeout(() => setPopoverTarea(null), 150);
  };

  const sortedTareas = useMemo(() => {
    return [...tareas].sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline),
    );
  }, [tareas]);

  const handleStatusSelect = (tarea, newStatus) => {
    if (newStatus === "No se pudo completar") {
      onEditReason(tarea);
    } else {
      onStatusChange(tarea.id, newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl w-full"></div>
        ))}
      </div>
    );
  }

  if (sortedTareas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40 py-10 text-center">
        <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">
          task
        </span>
        <p>No tienes tareas pendientes.</p>
      </div>
    );
  }

  return (
    <>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
          <th className="py-3 px-4 font-bold">Código</th>
          <th className="py-3 px-4 font-bold">Título</th>
          <th className="py-3 px-4 font-bold">Asignados</th>
          <th className="py-3 px-4 font-bold">Privacidad</th>
          <th className="py-3 px-4 font-bold">Límite</th>
          <th className="py-3 px-4 font-bold text-center">Estado</th>
        </tr>
      </thead>
      <tbody>
        {sortedTareas.map((tarea) => {
          const isAssigned = tarea.assignedUsers.some(
            (u) => u.id === currentUserId,
          );
          const canEdit = isAdmin || isAssigned;

          return (
            <tr
              key={tarea.id}
              className="border-b border-white/5 transition-colors group hover:bg-white/5"
            >
              <td className="py-3 px-4 text-xs font-mono text-white/40">
                {tarea.id.substring(0, 8).toUpperCase()}
              </td>

              <td className="py-3 px-4 min-w-[200px]">
                <h3
                  className="font-bold text-white text-sm"
                  title={tarea.description}
                >
                  {tarea.title}
                </h3>
                {tarea.status === "No se pudo completar" && tarea.reason && (
                  <div className="mt-1 flex items-start gap-1 group/reason">
                    <span 
                      className="material-symbols-outlined text-[14px] text-amber-500 shrink-0 mt-[2px] cursor-help"
                      onMouseEnter={(e) => showPopover(e, tarea)}
                      onMouseLeave={hidePopover}
                    >
                      info
                    </span>
                    <p className="text-[11px] text-amber-400/90 leading-tight line-clamp-2 flex-1 break-words">
                      <strong className="text-amber-500 font-bold mr-1">Fallo:</strong>
                      {tarea.reason}
                    </p>
                    {canEdit && (
                      <button
                        onClick={() => onEditReason(tarea)}
                        className="text-amber-400 opacity-0 group-hover/reason:opacity-100 transition-opacity p-0.5 hover:bg-amber-400/20 rounded flex-shrink-0 shrink-0 ml-1"
                        title="Editar razón"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                      </button>
                    )}
                  </div>
                )}
              </td>

              <td className="py-3 px-4">
                <div className="flex -space-x-2">
                  {tarea.assignedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-white relative group/avatar"
                      title={u.name}
                    >
                      {u.name.substring(0, 2).toUpperCase()}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 rounded text-[10px] whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-10">
                        {u.name}
                      </span>
                    </div>
                  ))}
                  {tarea.assignedUsers.length === 0 && (
                    <span className="text-xs text-white/30">-</span>
                  )}
                </div>
              </td>

              <td className="py-3 px-4 text-xs">
                {tarea.isPublic ? (
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded w-fit">
                    Pública
                  </span>
                ) : (
                  <span className="text-white/30">Privada</span>
                )}
              </td>

              <td className="py-3 px-4 text-xs text-white/70 whitespace-nowrap">
                {format(new Date(tarea.deadline), "dd MMM yyyy, HH:mm", {
                  locale: es,
                })}
              </td>

              <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <StatusSelector
                    status={tarea.status}
                    canEdit={canEdit}
                    onChange={(newVal) => handleStatusSelect(tarea, newVal)}
                  />

                  {isAdmin && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(tarea)}
                        className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-primary/30 hover:border-primary/40 border border-transparent hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-300"
                        title="Editar Tarea"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(tarea.id)}
                        className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 border border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                        title="Eliminar Tarea"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

      {/* ── Fixed-position popover ── */}
      {popoverTarea && popoverTarea.reason && typeof document !== "undefined" && createPortal(
        <div
          className="fixed z-[99999] min-w-[280px] max-w-[360px] animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: `translate(-50%, ${popoverPos.isBelow ? "0" : "-100%"})`,
          }}
          onMouseEnter={() => clearTimeout(popoverTimeout.current)}
          onMouseLeave={hidePopover}
        >
          <div className="bg-[#1a1a1a] backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_12px_rgba(245,158,11,0.2)] p-3 flex flex-col max-h-[300px]">
            <div className="text-[10px] shrink-0 font-bold text-white/40 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-500">info</span>
              Detalles del Fallo
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 overflow-y-auto custom-scrollbar flex-1">
              <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed break-words">
                {popoverTarea.reason}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

TaskList.propTypes = {
  tareas: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditReason: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  isAdmin: PropTypes.bool,
};
