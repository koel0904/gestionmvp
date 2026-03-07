import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getLocales,
} from "../../services/api/dashboardUsuarios";

import UsuariosHeader from "../../components/dashboard/usuarios/UsuariosHeader";
import UsuariosTable from "../../components/dashboard/usuarios/UsuariosTable";
import NewUsuarioModal from "../../components/dashboard/usuarios/NewUsuarioModal";

export default function Usuarios() {
  const { selectedLocal } = useLocal();
  const [usuarios, setUsuarios] = useState([]);
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  const { canView, checkAccess, isOwner } = usePermissions("usuarios");

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    position: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  // Start editing a user
  const startEdit = (u) => {
    setEditingId(u.id);
    setEditData({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      position: u.position || "",
      active: u.active !== undefined ? u.active : true,
      localId: u.local
        ? locales.find((l) => l.name === u.local.name)?.id || ""
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      const data = await updateUsuario(selectedLocal.id, editingId, editData);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...data.usuario } : u)),
      );
      setEditingId(null);
      setEditData({});
      showToast("Usuario actualizado exitosamente");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteUsuario(selectedLocal.id, deleteConfirm);
      setUsuarios((prev) => prev.filter((u) => u.id !== deleteConfirm));
      showToast("Usuario eliminado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al eliminar usuario", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    if (!selectedLocal) return;
    async function fetchData() {
      try {
        const data = await getUsuarios(selectedLocal.id);
        setUsuarios(data);
      } catch (err) {
        console.error("Failed to fetch usuarios", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedLocal]);

  // Fetch owner's locales for the local selector
  useEffect(() => {
    if (!isOwner) return;
    async function fetchLocalesList() {
      try {
        const data = await getLocales();
        setLocales(data.locales || []);
      } catch (err) {
        console.error("Failed to fetch locales", err);
      }
    }
    fetchLocalesList();
  }, [isOwner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await createUsuario(selectedLocal.id, formData);
      setUsuarios((prev) =>
        [...prev, data.usuario].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
        position: "",
      });
      setConfirmPassword("");
      showToast("Usuario invitado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al invitar usuario", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsuarios = usuarios.filter((u) =>
    smartMatch(searchTerm, [
      u.name,
      u.email,
      u.phone,
      u.role,
      u.position,
      u.local?.name,
      u.active ? "activo" : "inactivo",
    ]),
  );

  if (!selectedLocal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-2xl glass-panel border-white/20 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-4xl text-white/50">
            store
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Selecciona un local
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          Selecciona un local desde el overview para gestionar sus usuarios.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 rounded-xl glass-button text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
        >
          Ir al Overview
        </Link>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-2xl glass-panel border-white/20 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-4xl text-white/50">
            lock
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Acceso Denegado
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          No tienes permisos para acceder a esta vista.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <UsuariosHeader
        selectedLocal={selectedLocal}
        onNewUsuario={() =>
          checkAccess("add", () => setIsModalOpen(true), showToast)
        }
      />

      <UsuariosTable
        loading={loading}
        usuarios={filteredUsuarios}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(u) => checkAccess("edit", () => startEdit(u), showToast)}
        onDelete={(id) =>
          checkAccess("delete", () => setDeleteConfirm(id), showToast)
        }
        editingId={editingId}
        editData={editData}
        setEditData={setEditData}
        saveEdit={() => checkAccess("edit", saveEdit, showToast)}
        cancelEdit={cancelEdit}
        isSaving={isSaving}
        locales={locales}
      />

      <NewUsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      <GlassToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
