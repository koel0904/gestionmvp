import { useState, useEffect, useRef } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";
import {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
  getUsuariosLocal,
} from "../../services/api/dashboardVehiculos";

import VehiculosHeader from "../../components/dashboard/vehiculos/VehiculosHeader";
import VehiculosTable from "../../components/dashboard/vehiculos/VehiculosTable";
import NewVehiculoModal from "../../components/dashboard/vehiculos/NewVehiculoModal";
import EditVehiculoModal from "../../components/dashboard/vehiculos/EditVehiculoModal";
import NuevaTareaModal from "../../components/dashboard/tareas/NuevaTareaModal";

export default function Vehiculos() {
  const { selectedLocal } = useLocal();

  // Permissions
  const { canView, checkAccess } = usePermissions("vehiculos");

  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    carName: "",
    marca: "",
    modelo: "",
    year: new Date().getFullYear(),
    tipo: "sedan",
    ultimoMantenimientoFecha: "",
    ultimoMantenimientoKm: "",
    proximoMantenimientoFecha: "",
    proximoMantenimientoKm: "",
    frecuenciaKm: "",
    frecuenciaTiempo: "",
    imagen: "",
    encargadoIds: [],
  });
  const [uploading, setUploading] = useState(false);
  const createFileRef = useRef(null);

  // Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    carName: "",
    marca: "",
    modelo: "",
    year: "",
    tipo: "sedan",
    ultimoMantenimientoFecha: "",
    ultimoMantenimientoKm: "",
    proximoMantenimientoFecha: "",
    proximoMantenimientoKm: "",
    frecuenciaKm: "",
    frecuenciaTiempo: "",
    estado: true,
    imagen: "",
    encargadoIds: [],
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const editFileRef = useRef(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Maintenance Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskInitialData, setTaskInitialData] = useState({
    title: "",
    description: "",
    date: null
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const startEdit = (v) => {
    setEditingItem(v);
    setEditForm({
      carName: v.carName || "",
      marca: v.marca || "",
      modelo: v.modelo || "",
      year: v.year || "",
      tipo: v.tipo || "sedan",
      ultimoMantenimientoFecha: v.ultimoMantenimientoFecha
        ? v.ultimoMantenimientoFecha.split("T")[0]
        : "",
      ultimoMantenimientoKm: v.ultimoMantenimientoKm || "",
      proximoMantenimientoFecha: v.proximoMantenimientoFecha
        ? v.proximoMantenimientoFecha.split("T")[0]
        : "",
      proximoMantenimientoKm: v.proximoMantenimientoKm || "",
      frecuenciaKm: v.frecuenciaKm || "",
      frecuenciaTiempo: v.frecuenciaTiempo || "",
      estado: v.estado !== undefined ? v.estado : true,
      imagen: v.imagen || "",
      encargadoIds: v.encargados?.map((e) => e.id) || [],
    });
  };

  const handleOpenTaskModal = (v) => {
    const title = `Mantenimiento de vehículo (${v.marca} ${v.modelo})`;
    const dateStr = v.proximoMantenimientoFecha ? v.proximoMantenimientoFecha.split("T")[0] : "—";
    const kmStr = v.proximoMantenimientoKm ? `${v.proximoMantenimientoKm.toLocaleString()} kms` : "—";
    
    const description = `Sacar cita de mantenimiento para el vehículo ${v.marca} ${v.modelo}${v.carName ? ` (Código: ${v.carName})` : ""}, en la fecha ${dateStr} para el mantenimiento de los ${kmStr}.`;
    
    setTaskInitialData({
      title,
      description,
      date: v.proximoMantenimientoFecha ? new Date(v.proximoMantenimientoFecha) : null
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
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
      
      setIsTaskModalOpen(false);
      showToast("Tarea de mantenimiento programada exitosamente");
    } catch (e) {
      console.error(e);
      showToast(e.message, "error");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const payload = {
        ...editForm,
        year: parseInt(editForm.year),
        ultimoMantenimientoFecha: editForm.ultimoMantenimientoFecha
          ? new Date(editForm.ultimoMantenimientoFecha).toISOString()
          : null,
        ultimoMantenimientoKm: editForm.ultimoMantenimientoKm
          ? parseInt(editForm.ultimoMantenimientoKm)
          : null,
        proximoMantenimientoFecha: editForm.proximoMantenimientoFecha
          ? new Date(editForm.proximoMantenimientoFecha).toISOString()
          : null,
        proximoMantenimientoKm: editForm.proximoMantenimientoKm
          ? parseInt(editForm.proximoMantenimientoKm)
          : null,
        frecuenciaKm: editForm.frecuenciaKm
          ? parseInt(editForm.frecuenciaKm)
          : null,
      };
      await updateVehiculo(selectedLocal.id, editingItem.id, payload);
      const refresh = await getVehiculos(selectedLocal.id);
      setVehiculos(refresh);
      setEditingItem(null);
      showToast("Vehículo actualizado exitosamente");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteVehiculo(selectedLocal.id, deleteConfirm);
      setVehiculos((prev) => prev.filter((v) => v.id !== deleteConfirm));
      showToast("Vehículo eliminado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al eliminar", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    if (!selectedLocal) return;
    async function fetchData() {
      setLoading(true);
      try {
        const [vehRes, usrRes] = await Promise.all([
          getVehiculos(selectedLocal.id),
          getUsuariosLocal(selectedLocal.id),
        ]);
        setVehiculos(vehRes);
        setUsuarios(usrRes);
      } catch (err) {
        console.error("Failed to fetch vehiculos", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedLocal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        ultimoMantenimientoFecha: formData.ultimoMantenimientoFecha
          ? new Date(formData.ultimoMantenimientoFecha).toISOString()
          : null,
        ultimoMantenimientoKm: formData.ultimoMantenimientoKm
          ? parseInt(formData.ultimoMantenimientoKm)
          : null,
        proximoMantenimientoFecha: formData.proximoMantenimientoFecha
          ? new Date(formData.proximoMantenimientoFecha).toISOString()
          : null,
        proximoMantenimientoKm: formData.proximoMantenimientoKm
          ? parseInt(formData.proximoMantenimientoKm)
          : null,
        frecuenciaKm: formData.frecuenciaKm
          ? parseInt(formData.frecuenciaKm)
          : null,
      };
      await createVehiculo(selectedLocal.id, payload);
      const refresh = await getVehiculos(selectedLocal.id);
      setVehiculos(refresh);
      setIsModalOpen(false);
      setFormData({
        carName: "",
        marca: "",
        modelo: "",
        year: new Date().getFullYear(),
        tipo: "sedan",
        ultimoMantenimientoFecha: "",
        ultimoMantenimientoKm: "",
        proximoMantenimientoFecha: "",
        proximoMantenimientoKm: "",
        frecuenciaKm: "",
        frecuenciaTiempo: "",
        imagen: "",
        encargadoIds: [],
      });
      showToast("Vehículo agregado exitosamente");
    } catch (err) {
      showToast(err.message || "Error de conexión", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = vehiculos.filter((v) => {
    if (!searchTerm) return true;
    const enc = v.encargados?.map((e) => e.name).join(" ") || "";
    return smartMatch(searchTerm, [
      v.carName,
      v.marca,
      v.modelo,
      String(v.year),
      v.tipo,
      enc,
      v.estado ? "activo" : "inactivo",
    ]);
  });

  if (!selectedLocal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-2xl glass-panel border-white/20 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-4xl text-white/50">
            directions_car
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Seleccionar un Local
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          Selecciona un local desde el overview para gestionar sus vehículos.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 rounded-xl glass-button text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
        >
          Go to Overview
        </Link>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-2xl glass-panel border-red-500/20 bg-red-500/10 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-4xl text-red-400">
            lock
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Acceso Denegado
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          No tienes permisos para acceder a la vista de Vehículos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <VehiculosHeader
        selectedLocal={selectedLocal}
        onNewVehiculo={() =>
          checkAccess("add", () => setIsModalOpen(true), showToast)
        }
      />

      <VehiculosTable
        loading={loading}
        vehiculos={filtered}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(v) => checkAccess("edit", () => startEdit(v), showToast)}
        onDelete={(id) =>
          checkAccess("delete", () => setDeleteConfirm(id), showToast)
        }
        onAddMaintenance={(v) => checkAccess("add", () => handleOpenTaskModal(v), showToast)}
      />

      <NewVehiculoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
        usuarios={usuarios}
        uploading={uploading}
        setUploading={setUploading}
        createFileRef={createFileRef}
        selectedLocalId={selectedLocal.id}
        showToast={showToast}
      />

      <EditVehiculoModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleEditSubmit={handleEditSubmit}
        isSavingEdit={isSavingEdit}
        editForm={editForm}
        setEditForm={setEditForm}
        usuarios={usuarios}
        editUploading={editUploading}
        setEditUploading={setEditUploading}
        editFileRef={editFileRef}
        selectedLocalId={selectedLocal.id}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <GlassToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      {isTaskModalOpen && (
        <NuevaTareaModal
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={handleTaskSubmit}
          localId={selectedLocal.id}
          initialDate={taskInitialData.date}
          initialTitle={taskInitialData.title}
          initialDescription={taskInitialData.description}
        />
      )}
    </div>
  );
}
