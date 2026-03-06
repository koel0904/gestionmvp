import { useState, useEffect, useRef } from "react";
import { useLocal } from "../../context/LocalContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";

const VEHICLE_TYPES = ["sedan", "pick-up", "camion", "van"];

const DEFAULT_IMAGES = {
  sedan:
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=260&fit=crop",
  "pick-up":
    "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=260&fit=crop",
  camion:
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=260&fit=crop",
  van: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=260&fit=crop",
};

const FRECUENCIA_OPTIONS = ["1 mes", "3 meses", "6 meses", "1 año"];

export default function Vehiculos() {
  const { selectedLocal } = useLocal();
  // Auth + Permissions
  const { user } = useAuth();
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

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  // ── Image upload helper ──
  const uploadImage = async (file, setUploadingState, onSuccess) => {
    if (!file) return;
    setUploadingState(true);
    try {
      const fd = new FormData();
      fd.append("imagen", file);
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos/upload`,
        { method: "POST", credentials: "include", body: fd },
      );
      if (!res.ok) throw new Error("Error al subir imagen");
      const data = await res.json();
      onSuccess(`http://localhost:3000${data.imageUrl}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingState(false);
    }
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos/${editingItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar");
      }
      const refresh = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos`,
        { credentials: "include" },
      );
      if (refresh.ok) setVehiculos(await refresh.json());
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos/${deleteConfirm}`,
        { method: "DELETE", credentials: "include" },
      );
      if (res.ok) {
        setVehiculos((prev) => prev.filter((v) => v.id !== deleteConfirm));
        showToast("Vehículo eliminado exitosamente");
      } else {
        const d = await res.json();
        showToast(d.error || "Error al eliminar", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error de red al eliminar", "error");
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
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos`,
            { credentials: "include" },
          ),
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/usuarios`,
            { credentials: "include" },
          ),
        ]);
        if (vehRes.ok) setVehiculos(await vehRes.json());
        if (usrRes.ok) setUsuarios(await usrRes.json());
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        const refresh = await fetch(
          `http://localhost:3000/api/locales/${selectedLocal.id}/vehiculos`,
          { credentials: "include" },
        );
        if (refresh.ok) setVehiculos(await refresh.json());
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
      } else {
        const err = await res.json();
        showToast(err.error || "Error al crear vehículo", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
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

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ── Reusable image section ──
  const ImageSection = ({
    imagen,
    tipo,
    onImageChange,
    fileRef,
    isUploading,
    focusColor = "primary",
  }) => {
    const previewSrc = imagen || DEFAULT_IMAGES[tipo] || DEFAULT_IMAGES.sedan;
    const borderFocus =
      focusColor === "sky"
        ? "focus:border-sky-400/50"
        : "focus:border-primary/50";

    return (
      <div className="space-y-3">
        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
          Imagen del Vehículo
        </label>

        {/* Preview */}
        <div className="w-full h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10">
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Upload + Remove row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50 ${isUploading ? "animate-pulse" : ""}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isUploading ? "hourglass_top" : "upload_file"}
            </span>
            {isUploading ? "Subiendo..." : "Subir Archivo"}
          </button>
          {imagen && (
            <button
              type="button"
              onClick={() => onImageChange("")}
              className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Quitar
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadImage(
                file,
                focusColor === "sky" ? setEditUploading : setUploading,
                onImageChange,
              );
            }
            e.target.value = "";
          }}
        />

        {/* URL input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[16px]">
            link
          </span>
          <input
            type="url"
            value={imagen}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="O pegar URL de imagen..."
            className={`w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none ${borderFocus} focus:bg-white/10 transition-all`}
          />
        </div>
      </div>
    );
  };

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
      {/* ── Header ── */}
      <div className="flex items-center justify-between glass-panel rounded-2xl p-5 border border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center border border-primary/20 shadow-inner">
            <span className="material-symbols-outlined text-[24px] text-primary-light drop-shadow-md">
              directions_car
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Vehículos
            </h2>
            <p className="text-sm text-white/50 font-medium">
              Gestión de flota para {selectedLocal.name}
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            checkAccess("add", () => setIsModalOpen(true), showToast)
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-white font-bold tracking-wide shadow-[0_2px_8px_rgba(167,139,250,0.4)] hover:shadow-[0_0_24px_rgba(167,139,250,0.55)] transition-all transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Agregar Vehículo</span>
        </button>
      </div>

      {/* ── Content / Table Area ── */}
      <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
            Registro de Vehículos
          </h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="size-8 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
          </div>
        ) : vehiculos.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
                no_crash
              </span>
            </div>
            <p className="text-white/60 text-lg font-bold mb-1">
              Sin vehículos registrados
            </p>
            <p className="text-white/40 text-sm font-medium">
              Comienza agregando un vehículo a la flota.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Código de Vehículo
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden lg:table-cell">
                    Último Mant.
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden lg:table-cell">
                    Próximo Mant.
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:table-cell">
                    Encargado/s
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-center">
                    Estado
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    {/* Vehicle info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                          <img
                            src={
                              v.imagen ||
                              DEFAULT_IMAGES[v.tipo] ||
                              DEFAULT_IMAGES.sedan
                            }
                            alt={`${v.marca} ${v.modelo}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {v.marca} {v.modelo}
                          </div>
                          <div className="text-xs text-white/40">{v.year}</div>
                        </div>
                      </div>
                    </td>

                    {/* Código de Vehículo */}
                    <td className="py-4 px-4 align-middle">
                      {v.carName ? (
                        <span className="px-2.5 py-1 rounded-md bg-white/5 text-white/70 text-xs border border-white/10 block w-fit truncate max-w-[150px]">
                          {v.carName}
                        </span>
                      ) : (
                        <span className="text-sm text-white/30 italic">—</span>
                      )}
                    </td>

                    {/* Tipo */}
                    <td className="py-4 px-4 align-middle">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-white/5 text-white/70 border border-white/10">
                        {v.tipo}
                      </span>
                    </td>

                    {/* Ultimo mantenimiento */}
                    <td className="py-4 px-4 align-middle hidden lg:table-cell">
                      <div>
                        <div className="text-sm text-white/70">
                          {formatDate(v.ultimoMantenimientoFecha)}
                        </div>
                        {v.ultimoMantenimientoKm && (
                          <div className="text-xs text-white/40">
                            {v.ultimoMantenimientoKm.toLocaleString()} km
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Proximo mantenimiento */}
                    <td className="py-4 px-4 align-middle hidden lg:table-cell">
                      <div>
                        <div className="text-sm text-white/70">
                          {formatDate(v.proximoMantenimientoFecha)}
                        </div>
                        {v.proximoMantenimientoKm && (
                          <div className="text-xs text-white/40">
                            {v.proximoMantenimientoKm.toLocaleString()} km
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Encargados */}
                    <td className="py-4 px-4 align-middle hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {v.encargados?.length > 0 ? (
                          v.encargados.map((e) => (
                            <span
                              key={e.id}
                              className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-blue-600/25 text-white border border-blue-500/30"
                            >
                              {e.name.split(" ")[0]}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-white/30 italic">
                            Sin encargado
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-4 text-center align-middle">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest ${
                          v.estado
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {v.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            checkAccess("edit", () => startEdit(v), showToast)
                          }
                          className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                          title="Edit Vehicle"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            checkAccess(
                              "delete",
                              () => setDeleteConfirm(v.id),
                              showToast,
                            )
                          }
                          className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 border border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                          title="Eliminar Vehículo"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create Vehicle Modal ── */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Vehículo"
        icon="directions_car"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Código de vehículo */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Código de Vehículo
            </label>
            <input
              type="text"
              value={formData.carName}
              onChange={(e) =>
                setFormData({ ...formData, carName: e.target.value })
              }
              placeholder="Ej: CAM-001, Repartidor-Norte"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>

          {/* Marca, Modelo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Marca *
              </label>
              <input
                required
                type="text"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                placeholder="Toyota"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Modelo *
              </label>
              <input
                required
                type="text"
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
                placeholder="Hilux"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Año, Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Año *
              </label>
              <input
                required
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image section */}
          <div className="border-t border-white/10 pt-4 mt-2">
            <ImageSection
              imagen={formData.imagen}
              tipo={formData.tipo}
              onImageChange={(url) => setFormData({ ...formData, imagen: url })}
              fileRef={createFileRef}
              isUploading={uploading}
              focusColor="primary"
            />
          </div>

          {/* Maintenance section */}
          <div className="border-t border-white/10 pt-4 mt-2">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Mantenimiento
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Último - Fecha
                </label>
                <input
                  type="date"
                  value={formData.ultimoMantenimientoFecha}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ultimoMantenimientoFecha: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Último - Km
                </label>
                <input
                  type="number"
                  value={formData.ultimoMantenimientoKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ultimoMantenimientoKm: e.target.value,
                    })
                  }
                  placeholder="50000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Próximo - Fecha
                </label>
                <input
                  type="date"
                  value={formData.proximoMantenimientoFecha}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proximoMantenimientoFecha: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Próximo - Km
                </label>
                <input
                  type="number"
                  value={formData.proximoMantenimientoKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proximoMantenimientoKm: e.target.value,
                    })
                  }
                  placeholder="60000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Frecuencia (Km)
                </label>
                <input
                  type="number"
                  value={formData.frecuenciaKm}
                  onChange={(e) =>
                    setFormData({ ...formData, frecuenciaKm: e.target.value })
                  }
                  placeholder="10000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Frecuencia (Tiempo)
                </label>
                <select
                  value={formData.frecuenciaTiempo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frecuenciaTiempo: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">
                    Sin definir
                  </option>
                  {FRECUENCIA_OPTIONS.map((f) => (
                    <option key={f} value={f} className="bg-slate-900">
                      Cada {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Encargados */}
          <div className="border-t border-white/10 pt-4 mt-2">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Encargado/s
            </p>
            <div className="flex flex-wrap gap-2">
              {usuarios.map((u) => {
                const sel = formData.encargadoIds.includes(u.id);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => {
                      const ids = formData.encargadoIds;
                      setFormData({
                        ...formData,
                        encargadoIds: sel
                          ? ids.filter((i) => i !== u.id)
                          : [...ids, u.id],
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sel
                        ? "bg-primary/30 text-primary-light border border-primary/40"
                        : "bg-white/5 text-white/50 border border-white/10 hover:text-white/80"
                    }`}
                  >
                    {u.name}
                  </button>
                );
              })}
              {usuarios.length === 0 && (
                <p className="text-xs text-white/30 italic">
                  No hay usuarios en este local
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Creando..." : "Agregar Vehículo"}
            </button>
          </div>
        </form>
      </GlassModal>

      {/* ── Edit Vehicle Modal ── */}
      <GlassModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Editar: ${editingItem?.marca || ""} ${editingItem?.modelo || ""}`}
        icon="edit"
        iconColor="text-sky-400"
        gradient="from-sky-400/30 to-blue-500/20"
      >
        {editingItem && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Image section */}
            <ImageSection
              imagen={editForm.imagen}
              tipo={editForm.tipo}
              onImageChange={(url) => setEditForm({ ...editForm, imagen: url })}
              fileRef={editFileRef}
              isUploading={editUploading}
              focusColor="sky"
            />

            {/* Código de vehículo */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Código de Vehículo
              </label>
              <input
                type="text"
                value={editForm.carName}
                onChange={(e) =>
                  setEditForm({ ...editForm, carName: e.target.value })
                }
                placeholder="Ej: CAM-001, Repartidor-Norte"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Marca, Modelo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Marca *
                </label>
                <input
                  required
                  type="text"
                  value={editForm.marca}
                  onChange={(e) =>
                    setEditForm({ ...editForm, marca: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Modelo *
                </label>
                <input
                  required
                  type="text"
                  value={editForm.modelo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, modelo: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Año, Tipo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Año *
                </label>
                <input
                  required
                  type="number"
                  value={editForm.year}
                  onChange={(e) =>
                    setEditForm({ ...editForm, year: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Tipo *
                </label>
                <div className="relative">
                  <select
                    value={editForm.tipo}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tipo: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Maintenance */}
            <div className="border-t border-white/10 pt-4 mt-2">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                Mantenimiento
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                    Último - Fecha
                  </label>
                  <input
                    type="date"
                    value={editForm.ultimoMantenimientoFecha}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        ultimoMantenimientoFecha: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                    Último - Km
                  </label>
                  <input
                    type="number"
                    value={editForm.ultimoMantenimientoKm}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        ultimoMantenimientoKm: e.target.value,
                      })
                    }
                    placeholder="50000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                    Próximo - Fecha
                  </label>
                  <input
                    type="date"
                    value={editForm.proximoMantenimientoFecha}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        proximoMantenimientoFecha: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                    Próximo - Km
                  </label>
                  <input
                    type="number"
                    value={editForm.proximoMantenimientoKm}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        proximoMantenimientoKm: e.target.value,
                      })
                    }
                    placeholder="60000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                    Frecuencia (Km)
                  </label>
                  <input
                    type="number"
                    value={editForm.frecuenciaKm}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        frecuenciaKm: e.target.value,
                      })
                    }
                    placeholder="10000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                    Frecuencia (Tiempo)
                  </label>
                  <select
                    value={editForm.frecuenciaTiempo}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        frecuenciaTiempo: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">
                      Sin definir
                    </option>
                    {FRECUENCIA_OPTIONS.map((f) => (
                      <option key={f} value={f} className="bg-slate-900">
                        Cada {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Encargados */}
            <div className="border-t border-white/10 pt-4 mt-2">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                Encargado/s
              </p>
              <div className="flex flex-wrap gap-2">
                {usuarios.map((u) => {
                  const sel = editForm.encargadoIds.includes(u.id);
                  return (
                    <button
                      type="button"
                      key={u.id}
                      onClick={() => {
                        const ids = editForm.encargadoIds;
                        setEditForm({
                          ...editForm,
                          encargadoIds: sel
                            ? ids.filter((i) => i !== u.id)
                            : [...ids, u.id],
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sel
                          ? "bg-primary/30 text-primary-light border border-primary/40"
                          : "bg-white/5 text-white/50 border border-white/10 hover:text-white/80"
                      }`}
                    >
                      {u.name}
                    </button>
                  );
                })}
                {usuarios.length === 0 && (
                  <p className="text-xs text-white/30 italic">
                    No hay usuarios en este local
                  </p>
                )}
              </div>
            </div>

            {/* Estado toggle */}
            <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[20px] ${editForm.estado ? "text-emerald-400" : "text-red-400"}`}
                >
                  {editForm.estado ? "check_circle" : "cancel"}
                </span>
                <span className="text-sm font-medium text-white/80">
                  {editForm.estado ? "Vehículo Activo" : "Vehículo Inactivo"}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditForm({ ...editForm, estado: !editForm.estado })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  editForm.estado ? "bg-emerald-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    editForm.estado ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSavingEdit || editUploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSavingEdit ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Delete confirmation */}
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
    </div>
  );
}
