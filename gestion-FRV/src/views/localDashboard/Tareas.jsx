import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocal } from "../../context/LocalContext";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

import CalendarBoard from "../../components/dashboard/tareas/CalendarBoard";
import TaskList from "../../components/dashboard/tareas/TaskList";
import NuevaTareaModal from "../../components/dashboard/tareas/NuevaTareaModal";

export default function Tareas() {
  const { user } = useAuth();
  const { selectedLocal } = useLocal();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = user?.type === "owner" || user?.permissions?.admin;

  const fetchTareas = async () => {
    if (!selectedLocal) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/locales/${selectedLocal.id}/tareas`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch tareas");
      const data = await res.json();
      setTareas(data.tareas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [selectedLocal]);

  // Handle Create Task
  const handleCreateTask = async (taskData) => {
    try {
      const res = await fetch(`http://localhost:3000/api/locales/${selectedLocal.id}/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error al crear tarea");
      }
      
      setModalOpen(false);
      fetchTareas();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  // Handle Update Task Status
  const handleUpdateStatus = async (tareaId, newStatus, reason = null) => {
    try {
      const res = await fetch(`http://localhost:3000/api/locales/${selectedLocal.id}/tareas/${tareaId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus, reason }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error al actualizar estado");
      }
      
      // Update local state without re-fetching everything
      setTareas((prev) =>
        prev.map((t) => (t.id === tareaId ? { ...t, status: newStatus, reason } : t))
      );
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };


  return (
    <div className="w-full flex flex-col gap-6 font-display text-white max-w-7xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tareas</h1>
          <p className="text-sm text-white/50 mt-1">Gestiona los eventos y tareas pendientes del equipo.</p>
        </div>
        {isAdmin && (
           <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass-button text-white text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva Tarea
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 w-full">
          
        {/* Top: Task List Data Table */}
        <div className="glass-panel p-5 rounded-3xl w-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 drop-shadow-md">Lista de Tareas Pendientes</h2>
            <div className="overflow-x-auto w-full">
              <TaskList 
                tareas={tareas} 
                isLoading={loading} 
                onStatusChange={handleUpdateStatus} 
                currentUserId={user?.id}
                isAdmin={isAdmin}
              />
            </div>
        </div>

        {/* Bottom: Calendar */}
        <div className="w-full">
          <CalendarBoard tareas={tareas} isLoading={loading} />
        </div>

      </div>

      {modalOpen && (
        <NuevaTareaModal 
           onClose={() => setModalOpen(false)} 
           onSubmit={handleCreateTask}
           localId={selectedLocal.id} 
        />
      )}
    </div>
  );
}
