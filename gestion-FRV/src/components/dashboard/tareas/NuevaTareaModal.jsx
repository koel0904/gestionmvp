import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function NuevaTareaModal({ onClose, onSubmit, localId, initialDate, initialTitle = "", initialDescription = "" }) {
  const getDefaultDate = () => {
    if (initialDate) {
      const d = new Date(initialDate);
      d.setHours(12, 0, 0, 0); // Default to noon
      const tzOffset = d.getTimezoneOffset() * 60000;
      return new Date(d - tzOffset).toISOString().slice(0, 16);
    }
    return "";
  };

  const [form, setForm] = useState({
    title: initialTitle,
    description: initialDescription,
    deadline: getDefaultDate(),
    isPublic: false,
    assignedUserIds: [], // List of user IDs
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/locales/${localId}/usuarios`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const extractedUsers = Array.isArray(data) ? data : (data.usuarios || []);
          setUsers(extractedUsers);
        } else {
          const errorData = await res.json();
          alert(`Error cargando usuarios: ${errorData.error || res.status}`);
        }
      } catch (e) {
        console.error("Error fetching users for assignment", e);
        alert("Error de red cargando usuarios: " + e.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [localId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleUserAssignment = (userId) => {
    setForm((prev) => {
      const assigned = prev.assignedUserIds;
      if (assigned.includes(userId)) {
        return { ...prev, assignedUserIds: assigned.filter((id) => id !== userId) };
      } else {
        return { ...prev, assignedUserIds: [...assigned, userId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline || form.assignedUserIds.length === 0) {
      alert("Por favor rellena el título, la fecha límite y selecciona al menos un usuario.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A0A0A]/80"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">task_alt</span>
            Crear Nueva Tarea
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">Título de Tarea</label>
            <input 
              required
              type="text" 
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej. Limpieza de inventario mensual"
              className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">Descripción (opcional)</label>
            <textarea 
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detalles adicionales para los asignados..."
              rows={3}
              className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">Fecha y Hora Límite (Deadline)</label>
            <input 
              required
              type="datetime-local" 
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full glass-input rounded-xl px-4 py-3 text-white outline-none text-sm [&::-webkit-calendar-picker-indicator]:filter-invert"
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer group mt-2">
              <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${form.isPublic ? 'bg-purple-500' : 'bg-white/10'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${form.isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <input 
                type="checkbox" 
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Tarea Pública</span>
                <span className="text-xs text-white/40">Visible para todos en el negocio, pero solo modificable por los asignados.</span>
              </div>
            </label>
          </div>

          <div className="mt-2">
            <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">Asignar a Empleados</label>
            {loadingUsers ? (
              <p className="text-sm text-white/40 animate-pulse">Cargando usuarios...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-red-400">No hay usuarios disponibles en el local.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {users.map((u) => (
                  <label key={u.id} className="flex items-center gap-3 p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={form.assignedUserIds.includes(u.id)}
                      onChange={() => toggleUserAssignment(u.id)}
                      className="accent-purple-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-bold text-white truncate">{u.name}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">{u.position || u.role}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
          >
            Crear y Asignar
          </button>

        </form>
      </div>
    </div>
  );
}

NuevaTareaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  localId: PropTypes.string.isRequired,
  initialDate: PropTypes.instanceOf(Date),
  initialTitle: PropTypes.string,
  initialDescription: PropTypes.string,
};
