import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import EditForm from "../../components/EditForm";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";
import { getClientes, createCliente, deleteCliente } from "../../services/api/dashboardClients";

import ClientesHeader from "../../components/dashboard/clientes/ClientesHeader";
import ClientesTable from "../../components/dashboard/clientes/ClientesTable";
import NewClienteModal from "../../components/dashboard/clientes/NewClienteModal";

export default function Clientes() {
  const { selectedLocal } = useLocal();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Permissions
  const { canView, checkAccess } = usePermissions("clientes");

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingCliente, setEditingCliente] = useState(null);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteCliente(selectedLocal.id, deleteConfirm);
      setClientes((prev) => prev.filter((c) => c.id !== deleteConfirm));
      showToast("Cliente eliminado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error de red al eliminar", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleEditSuccess = (updatedData) => {
    setClientes((prev) =>
      prev.map((c) =>
        c.id === updatedData.cliente.id ? updatedData.cliente : c,
      ),
    );
    setEditingCliente(null);
    showToast("Cliente actualizado exitosamente");
  };

  useEffect(() => {
    if (!selectedLocal) return;

    async function fetchData() {
      try {
        const data = await getClientes(selectedLocal.id);
        setClientes(data);
      } catch (err) {
        console.error("Failed to fetch clientes", err);
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
      const result = await createCliente(selectedLocal.id, formData);
      setClientes((prev) =>
        [...prev, result.cliente].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setIsModalOpen(false);
      setFormData({ name: "", email: "", phone: "" });
      showToast("Cliente agregado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Network error creating client", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClientes = clientes.filter((c) =>
    smartMatch(searchTerm, [c.name, c.email, c.phone, c.direccion]),
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
          Please select a local from the overview to manage its customers.
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
          No tienes permisos para acceder a la vista de Clientes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <ClientesHeader
        selectedLocal={selectedLocal}
        onNewCliente={() => checkAccess("add", () => setIsModalOpen(true), showToast)}
      />

      <ClientesTable
        loading={loading}
        clientes={filteredClientes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(c) => checkAccess("edit", () => setEditingCliente(c), showToast)}
        onDelete={(id) => checkAccess("delete", () => setDeleteConfirm(id), showToast)}
      />

      <NewClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
      />

      <GlassModal
        isOpen={!!editingCliente}
        onClose={() => setEditingCliente(null)}
      >
        {editingCliente && (
          <div className="-mx-6 -my-6">
            <EditForm
              title={`Edit ${editingCliente.name}`}
              data={{
                name: editingCliente.name,
                email: editingCliente.email || "",
                phone: editingCliente.phone || "",
              }}
              apiUrl={`/locales/${selectedLocal.id}/clientes/${editingCliente.id}`}
              method="PUT"
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingCliente(null)}
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
