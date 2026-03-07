import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import EditForm from "../../components/EditForm";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";
import {
  getProveedores,
  createProveedor,
  deleteProveedor,
} from "../../services/api/dashboardProveedores";

import ProveedoresHeader from "../../components/dashboard/proveedores/ProveedoresHeader";
import ProveedoresTable from "../../components/dashboard/proveedores/ProveedoresTable";
import NewProveedorModal from "../../components/dashboard/proveedores/NewProveedorModal";

export default function Proveedores() {
  const { selectedLocal } = useLocal();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const { canView, checkAccess } = usePermissions("proveedores");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and Toast state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingProveedor, setEditingProveedor] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteProveedor(selectedLocal.id, deleteConfirm);
      setProveedores((prev) => prev.filter((p) => p.id !== deleteConfirm));
      showToast("Proveedor eliminado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error al eliminar proveedor", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleEditSuccess = (updatedData) => {
    setProveedores((prev) =>
      prev.map((p) =>
        p.id === updatedData.proveedor.id ? updatedData.proveedor : p,
      ),
    );
    setEditingProveedor(null);
    showToast("Proveedor actualizado exitosamente");
  };

  useEffect(() => {
    if (!selectedLocal) return;

    async function fetchData() {
      try {
        const data = await getProveedores(selectedLocal.id);
        setProveedores(data);
      } catch (err) {
        console.error("Failed to fetch proveedores", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedLocal]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await createProveedor(selectedLocal.id, formData);
      setProveedores((prev) =>
        [...prev, data.proveedor].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "" });
      showToast("Proveedor agregado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Network error creating supplier", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProveedores = proveedores.filter((p) =>
    smartMatch(searchTerm, [p.name, p.email, p.phone]),
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
          Select a Workspace
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          Please select a local from the overview to manage its suppliers.
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
          No tienes permisos para acceder a la vista de Proveedores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <ProveedoresHeader
        selectedLocal={selectedLocal}
        onNewProveedor={() =>
          checkAccess("add", () => setIsModalOpen(true), showToast)
        }
      />

      <ProveedoresTable
        loading={loading}
        proveedores={filteredProveedores}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(p) =>
          checkAccess("edit", () => setEditingProveedor(p), showToast)
        }
        onDelete={(id) =>
          checkAccess("delete", () => setDeleteConfirm(id), showToast)
        }
      />

      <NewProveedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
      />

      <GlassModal
        isOpen={!!editingProveedor}
        onClose={() => setEditingProveedor(null)}
      >
        {editingProveedor && (
          <div className="-mx-6 -my-6">
            <EditForm
              title={`Edit ${editingProveedor.name}`}
              data={{
                name: editingProveedor.name,
                email: editingProveedor.email || "",
                phone: editingProveedor.phone || "",
              }}
              apiUrl={`/locales/${selectedLocal.id}/proveedores/${editingProveedor.id}`}
              method="PUT"
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProveedor(null)}
            />
          </div>
        )}
      </GlassModal>

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
