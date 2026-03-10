import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
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
    case "Fuera de tiempo":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-white/5 text-white/50 border-white/10";
  }
};

export default function TaskList({ tareas, isLoading, onStatusChange, currentUserId, isAdmin }) {
  const [editingReason, setEditingReason] = useState(null);
  const [reasonText, setReasonText] = useState("");

  const sortedTareas = useMemo(() => {
    return [...tareas].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [tareas]);

  const handleStatusSelect = (tareaId, newStatus) => {
    if (newStatus === "No se pudo completar") {
      setEditingReason(tareaId);
      setReasonText(""); // reset
    } else {
      onStatusChange(tareaId, newStatus);
    }
  };

  const submitReason = (tareaId) => {
    if (!reasonText.trim()) return;
    onStatusChange(tareaId, "No se pudo completar", reasonText);
    setEditingReason(null);
  };

  if (isLoading) {
    return <div className="animate-pulse flex flex-col gap-3 p-4">
       {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl w-full"></div>)}
    </div>;
  }

  if (sortedTareas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40 py-10 text-center">
         <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">task</span>
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
        const isAssigned = tarea.assignedUsers.some((u) => u.id === currentUserId);
        const canEdit = isAdmin || isAssigned;

        return (
          <tr key={tarea.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
            <td className="py-3 px-4 text-xs font-mono text-white/40">
               {tarea.id.substring(0, 8).toUpperCase()}
            </td>

            <td className="py-3 px-4 min-w-[200px]">
               <h3 className="font-bold text-white text-sm" title={tarea.description}>{tarea.title}</h3>
               {tarea.status === "No se pudo completar" && tarea.reason && (
                 <p className="text-[10px] text-amber-400 mt-1 line-clamp-1">Fallo: {tarea.reason}</p>
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
                     <button onClick={() => submitReason(tarea.id)} className="text-xs text-amber-400 font-bold glass-button rounded-lg px-2 py-1">OK</button>
                     <button onClick={() => setEditingReason(null)} className="text-xs text-white/40 hover:text-white">x</button>
                  </div>
               )}
            </td>

            <td className="py-3 px-4">
              <div className="flex -space-x-2">
                 {tarea.assignedUsers.map((u) => (
                    <div key={u.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-white relative group/avatar" title={u.name}>
                        {u.name.substring(0, 2).toUpperCase()}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 rounded text-[10px] whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-10">{u.name}</span>
                    </div>
                 ))}
                 {tarea.assignedUsers.length === 0 && <span className="text-xs text-white/30">-</span>}
              </div>
            </td>

            <td className="py-3 px-4 text-xs">
              {tarea.isPublic 
                ? <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded w-fit">Pública</span> 
                : <span className="text-white/30">Privada</span>}
            </td>

            <td className="py-3 px-4 text-xs text-white/70 whitespace-nowrap">
               {format(new Date(tarea.deadline), "dd MMM yyyy, HH:mm", { locale: es })}
            </td>

            <td className="py-3 px-4 text-center">
              {canEdit ? (
                 <select
                    className={`appearance-none outline-none text-[11px] font-bold px-3 py-1.5 rounded-full border cursor-pointer transition-all ${getStatusClasses(tarea.status)}`}
                    value={tarea.status}
                    onChange={(e) => handleStatusSelect(tarea.id, e.target.value)}
                 >
                   <option value="Sin realizar" className="bg-neutral-800 text-white">⭕ Sin Realizar</option>
                   <option value="En proceso" className="bg-neutral-800 text-blue-400">🔄 En Proceso</option>
                   <option value="Realizada" className="bg-neutral-800 text-emerald-400">✅ Realizada</option>
                   <option value="No se pudo completar" className="bg-neutral-800 text-amber-400">⚠️ No completada</option>
                 </select>
              ) : (
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${getStatusClasses(tarea.status)}`}>
                  {tarea.status}
                </span>
              )}
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
  currentUserId: PropTypes.string,
  isAdmin: PropTypes.bool,
};
