import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";
import {
  getInventario,
  createInventario,
  updateInventario,
  deleteInventario,
  getProveedores,
} from "../../services/api/dashboardInventario";

import InventarioHeader from "../../components/dashboard/inventario/InventarioHeader";
import InventarioTable from "../../components/dashboard/inventario/InventarioTable";
import NewInventarioModal from "../../components/dashboard/inventario/NewInventarioModal";
import EditInventarioModal from "../../components/dashboard/inventario/EditInventarioModal";

export default function Inventario() {
  const { selectedLocal } = useLocal();
  const [inventario, setInventario] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Permissions
  const { canView, checkAccess } = usePermissions("inventario");

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    proveedorId: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    maxStock: "",
    proveedorId: "",
    estado: true,
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const startEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || "",
      precio_compra: item.precio_compra || "",
      precio_venta: item.precio_venta || "",
      stock: item.stock ?? "",
      maxStock: item.maxStock ?? 100,
      proveedorId: item.proveedorId || "",
      estado: item.estado !== undefined ? item.estado : true,
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteInventario(selectedLocal.id, deleteConfirm);
      setInventario((prev) => prev.filter((i) => i.id !== deleteConfirm));
      showToast("Producto eliminado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error de red al eliminar", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      await updateInventario(selectedLocal.id, editingItem.id, editForm);
      const data = await getInventario(selectedLocal.id);
      setInventario(data);
      setEditingItem(null);
      showToast("Producto actualizado exitosamente");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSavingEdit(false);
    }
  };

  useEffect(() => {
    if (!selectedLocal) return;

    async function fetchData() {
      try {
        const [invData, provData] = await Promise.all([
          getInventario(selectedLocal.id),
          getProveedores(selectedLocal.id),
        ]);
        setInventario(invData);
        setProveedores(provData);
      } catch (err) {
        console.error("Failed to fetch inventario", err);
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
      await createInventario(selectedLocal.id, formData);
      const data = await getInventario(selectedLocal.id);
      setInventario(data);
      setIsModalOpen(false);
      setFormData({
        name: "",
        precio_compra: "",
        precio_venta: "",
        stock: "",
        proveedorId: "",
      });
      showToast("Producto agregado exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Network error creating product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInventario = inventario.filter((i) =>
    smartMatch(searchTerm, [
      i.name,
      i.proveedor?.name,
      `$${i.precio_venta}`,
      `$${i.precio_compra}`,
      String(i.stock),
      i.estado ? "activo" : "inactivo",
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
          Select a Workspace
        </h2>
        <p className="text-white/60 font-medium max-w-sm">
          Please select a local from the overview to manage its inventory.
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
          No tienes permisos para acceder a la vista de Inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <InventarioHeader
        selectedLocal={selectedLocal}
        onNewInventario={() =>
          checkAccess("add", () => setIsModalOpen(true), showToast)
        }
      />

      <InventarioTable
        loading={loading}
        inventario={filteredInventario}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(item) =>
          checkAccess("edit", () => startEdit(item), showToast)
        }
        onDelete={(id) =>
          checkAccess("delete", () => setDeleteConfirm(id), showToast)
        }
      />

      <NewInventarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
        proveedores={proveedores}
      />

      <EditInventarioModal
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleEditSubmit}
        isSavingEdit={isSavingEdit}
        editForm={editForm}
        setEditForm={setEditForm}
        proveedores={proveedores}
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
