import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";
import { getVentas, createVenta, updateVenta, deleteVenta, getInventario, getClientes } from "../../services/api/dashboardVentas";

import VentasHeader from "../../components/dashboard/ventas/VentasHeader";
import VentasTable from "../../components/dashboard/ventas/VentasTable";
import NewVentaModal from "../../components/dashboard/ventas/NewVentaModal";
import EditVentaModal from "../../components/dashboard/ventas/EditVentaModal";

export default function Ventas() {
  const { selectedLocal } = useLocal();
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const { canView, checkAccess } = usePermissions("ventas");

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-product create state
  const [formLines, setFormLines] = useState([
    { inventarioId: "", cantidad: 1 },
  ]);
  const [formClienteId, setFormClienteId] = useState("");

  // Edit state (multi-product)
  const [editingVenta, setEditingVenta] = useState(null);
  const [editLines, setEditLines] = useState([
    { inventarioId: "", cantidad: 1 },
  ]);
  const [editClienteId, setEditClienteId] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Generate reference: DDMMYY## ──
  const generateRef = (venta, index) => {
    const d = new Date(venta.fecha);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    const num = String(index + 1).padStart(2, "0");
    return `${dd}${mm}${yy}${num}`;
  };

  // Build a map of refs for all ventas (sorted by date)
  const ventasWithRef = ventas
    .slice()
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map((v, i) => ({ ...v, ref: generateRef(v, i) }));

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteVenta(selectedLocal.id, deleteConfirm);
      setVentas((prev) => prev.filter((v) => v.id !== deleteConfirm));
      showToast("Venta eliminada exitosamente");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error de red al eliminar", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Start editing
  const startEdit = (v) => {
    setEditingVenta(v);
    setEditLines(
      v.items && v.items.length > 0
        ? v.items.map((item) => ({
          inventarioId: item.inventarioId || "",
          cantidad: item.cantidad,
        }))
        : [{ inventarioId: "", cantidad: 1 }],
    );
    setEditClienteId(v.clienteId || "");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const validLines = editLines.filter((l) => l.inventarioId);
      if (validLines.length === 0)
        throw new Error("Agrega al menos un producto");

      const items = validLines.map((line) => {
        const inv = inventario.find((i) => i.id === line.inventarioId);
        const qty = parseInt(line.cantidad) || 1;
        return {
          inventarioId: line.inventarioId,
          nombre: inv ? inv.name : "",
          cantidad: qty,
          precio_venta: inv ? inv.precio_venta : 0,
          subtotal: inv ? inv.precio_venta * qty : 0,
        };
      });
      const total = items.reduce((s, i) => s + i.subtotal, 0);

      await updateVenta(selectedLocal.id, editingVenta.id, {
        clienteId: editClienteId || null,
        total,
        items,
      });
      const data = await getVentas(selectedLocal.id);
      setVentas(data);
      setEditingVenta(null);
      showToast("Venta actualizada exitosamente");
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
        const [ventData, invData, cliData] = await Promise.all([
          getVentas(selectedLocal.id),
          getInventario(selectedLocal.id),
          getClientes(selectedLocal.id),
        ]);

        setVentas(ventData);
        setInventario(invData);
        setClientes(cliData);
      } catch (err) {
        console.error("Failed to fetch ventas", err);
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
      const validLines = formLines.filter((l) => l.inventarioId);
      if (validLines.length === 0)
        throw new Error("Agrega al menos un producto");

      // Build items array for a single Venta (stored as JSON)
      const items = validLines.map((line) => {
        const inv = inventario.find((i) => i.id === line.inventarioId);
        const qty = parseInt(line.cantidad) || 1;
        return {
          inventarioId: line.inventarioId,
          nombre: inv ? inv.name : "",
          cantidad: qty,
          precio_venta: inv ? inv.precio_venta : 0,
          subtotal: inv ? inv.precio_venta * qty : 0,
        };
      });
      const total = items.reduce((s, i) => s + i.subtotal, 0);

      const payload = {
        clienteId: formClienteId || null,
        total,
        items,
      };

      await createVenta(selectedLocal.id, payload);

      // Refresh list
      const data = await getVentas(selectedLocal.id);
      setVentas(data);

      setIsModalOpen(false);
      setFormLines([{ inventarioId: "", cantidad: 1 }]);
      setFormClienteId("");
      showToast("Venta registrada exitosamente");
    } catch (err) {
      showToast(err.message || "Error de red", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVentas = ventasWithRef.filter((v) => {
    const itemNames = (v.items || []).map((it) => it.nombre || "").join(" ");
    return smartMatch(searchTerm, [
      v.ref,
      v.cliente?.name,
      itemNames,
      `$${v.total}`,
    ]);
  });

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
          Selecciona un local desde el overview para gestionar sus ventas.
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
          No tienes permisos para acceder a la vista de Ventas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      <VentasHeader
        selectedLocal={selectedLocal}
        onNewVenta={() => checkAccess("add", () => setIsModalOpen(true), showToast)}
      />

      <VentasTable
        loading={loading}
        ventas={filteredVentas}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(v) => checkAccess("edit", () => startEdit(v), showToast)}
        onDelete={(id) => checkAccess("delete", () => setDeleteConfirm(id), showToast)}
      />

      <NewVentaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        clientes={clientes}
        inventario={inventario}
        formClienteId={formClienteId}
        setFormClienteId={setFormClienteId}
        formLines={formLines}
        setFormLines={setFormLines}
      />

      <EditVentaModal
        editingVenta={editingVenta}
        onClose={() => setEditingVenta(null)}
        onSubmit={handleEditSubmit}
        isSavingEdit={isSavingEdit}
        clientes={clientes}
        inventario={inventario}
        editClienteId={editClienteId}
        setEditClienteId={setEditClienteId}
        editLines={editLines}
        setEditLines={setEditLines}
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
