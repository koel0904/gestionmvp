import { useState, useMemo, useRef, useEffect } from "react";
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
  { value: "Sin realizar", label: "Sin Realizar", icon: "radio_button_unchecked" },
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

  const currentOption = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];

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
          style={{ position: 'absolute' }}
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
  currentUserId,
  isAdmin,
}) {
  const [editingReason, setEditingReason] = useState(null);
  const [reasonText, setReasonText] = useState("");

  const sortedTareas = useMemo(() => {
    return [...tareas].sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline),
    );
  }, [tareas]);

  const handleStatusSelect = (tareaId, newStatus) => {
    if (newStatus === "No se pudo completar") {
      setEditingReason(tareaId);
      setReasonText(""); // reset
    } else {
      if (editingReason === tareaId) {
        setEditingReason(null);
      }
      onStatusChange(tareaId, newStatus);
    }
  };

  const submitReason = (tareaId) => {
    if (!reasonText.trim()) return;
    onStatusChange(tareaId, "No se pudo completar", reasonText);
    setEditingReason(null);
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
                  <p className="text-[10px] text-amber-400 mt-1 line-clamp-1">
                    Fallo: {tarea.reason}
                  </p>
                )}
                {editingReason === tarea.id && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Razón..."
                      value={reasonText}
                      onChange={(e) => setReasonText(e.target.value)}
                      className="glass-input rounded-lg px-2 py-1 text-xs text-white placeholder-white/20 outline-none w-full border border-amber-500/30"
                      autoFocus
                    />
                    <button
                      onClick={() => submitReason(tarea.id)}
                      className="text-xs text-amber-400 font-bold glass-button rounded-lg px-2 py-1"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingReason(null)}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      x
                    </button>
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
                    onChange={(newVal) => handleStatusSelect(tarea.id, newVal)}
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
  );
}

TaskList.propTypes = {
  tareas: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  isAdmin: PropTypes.bool,
};
