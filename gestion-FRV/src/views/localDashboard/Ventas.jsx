import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function Ventas() {
  const { selectedLocal } = useLocal();
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [clientes, setClientes] = useState([]);
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
    inventarioId: "",
    clienteId: "",
    cantidad: 1,
  });

  // Edit state
  const [editingVenta, setEditingVenta] = useState(null);
  const [editForm, setEditForm] = useState({
    inventarioId: "",
    clienteId: "",
    cantidad: 1,
  });
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas/${deleteConfirm}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        setVentas((prev) => prev.filter((v) => v.id !== deleteConfirm));
        showToast("Venta eliminada exitosamente");
      } else {
        const err = await res.json();
        showToast(err.error || "Error al eliminar venta", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error de red al eliminar", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Start editing
  const startEdit = (v) => {
    setEditingVenta(v);
    setEditForm({
      inventarioId: v.inventarioId || "",
      clienteId: v.clienteId || "",
      cantidad: v.cantidad,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas/${editingVenta.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editForm),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar");
      }
      // Refresh to get nested relations
      const refresh = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas`,
        { credentials: "include" },
      );
      if (refresh.ok) setVentas(await refresh.json());
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
        const [ventRes, invRes, cliRes] = await Promise.all([
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/ventas`,
            { credentials: "include" },
          ),
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/inventario`,
            { credentials: "include" },
          ),
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/clientes`,
            { credentials: "include" },
          ),
        ]);

        if (ventRes.ok) setVentas(await ventRes.json());
        if (invRes.ok) setInventario(await invRes.json());
        if (cliRes.ok) setClientes(await cliRes.json());
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

  const selectedItemInfo = inventario.find(
    (i) => i.id === formData.inventarioId,
  );
  const calculatedTotal = selectedItemInfo
    ? (selectedItemInfo.precio_venta * formData.cantidad).toFixed(2)
    : "0.00";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!selectedItemInfo) throw new Error("Selecciona un producto");

      const payload = {
        ...formData,
        precio_venta: selectedItemInfo.precio_venta,
        total: calculatedTotal,
      };

      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        const refresh = await fetch(
          `http://localhost:3000/api/locales/${selectedLocal.id}/ventas`,
          { credentials: "include" },
        );
        if (refresh.ok) setVentas(await refresh.json());

        setIsModalOpen(false);
        setFormData({ inventarioId: "", clienteId: "", cantidad: 1 });
        showToast("Venta registrada exitosamente");
      } else {
        const err = await res.json();
        showToast(err.error || "Error al registrar venta", "error");
      }
    } catch (err) {
      showToast(err.message || "Error de red", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVentas = ventasWithRef.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.ref.includes(term) ||
      v.cliente?.name?.toLowerCase().includes(term) ||
      v.inventario?.name?.toLowerCase().includes(term)
    );
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

  // Format date helper
  const formatDate = (dateString) => {
    const opts = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, opts);
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between glass-panel rounded-2xl p-5 border border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center border border-primary/20 shadow-inner">
            <span className="material-symbols-outlined text-[24px] text-primary-light drop-shadow-md">
              payments
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Ventas
            </h2>
            <p className="text-sm text-white/50 font-medium">
              Historial de ventas de {selectedLocal.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-orange to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            point_of_sale
          </span>
          <span className="hidden sm:inline">Nueva Venta</span>
        </button>
      </div>

      {/* ── Content / Table Area ── */}
      <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
            Registro de Transacciones
          </h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar ventas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="size-8 border-4 border-white/10 border-t-accent-orange rounded-full animate-spin"></div>
          </div>
        ) : ventas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
                receipt_long
              </span>
            </div>
            <p className="text-white/60 text-lg font-bold mb-1">
              Sin ventas registradas
            </p>
            <p className="text-white/40 text-sm font-medium">
              Las transacciones de ventas aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 h-full">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Ref & Fecha
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:table-cell">
                    Producto
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden sm:table-cell">
                    Cliente
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Cantidad
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Total
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVentas.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    {/* Ref & Date */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px] text-primary-light">
                            receipt
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-wide font-mono">
                            #{v.ref}
                          </div>
                          <div className="text-xs text-white/50">
                            {formatDate(v.fecha)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product name */}
                    <td className="py-3 px-4 hidden md:table-cell align-middle">
                      {v.inventario ? (
                        <div className="font-medium text-white/90 truncate max-w-[160px]">
                          {v.inventario.name}
                        </div>
                      ) : (
                        <span className="text-sm text-white/30 italic">—</span>
                      )}
                    </td>

                    {/* Customer name */}
                    <td className="py-3 px-4 hidden sm:table-cell align-middle">
                      {v.cliente ? (
                        <div className="font-medium text-white/90">
                          {v.cliente.name}
                        </div>
                      ) : (
                        <span className="text-sm text-white/30 italic">
                          Cliente directo
                        </span>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 text-right align-middle">
                      <span className="text-sm font-medium text-white/70 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                        {v.cantidad}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 text-right align-middle">
                      <div className="font-mono font-bold text-white">
                        ${v.total.toFixed(2)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(v)}
                          className="size-9 rounded-xl flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(v.id)}
                          className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 border border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                          title="Eliminar"
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

      {/* ── New Sale Modal ── */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Venta"
        icon="point_of_sale"
        iconColor="text-accent-orange"
        gradient="from-accent-orange/30 to-red-500/20"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Producto *
            </label>
            <div className="relative">
              <select
                required
                value={formData.inventarioId}
                onChange={(e) =>
                  setFormData({ ...formData, inventarioId: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-slate-900">
                  Selecciona un producto
                </option>
                {inventario
                  .filter((i) => i.stock > 0)
                  .map((i) => (
                    <option key={i.id} value={i.id} className="bg-slate-900">
                      {i.name} - ${i.precio_venta.toFixed(2)} ({i.stock} en
                      stock)
                    </option>
                  ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Cliente (Opcional)
            </label>
            <div className="relative">
              <select
                value={formData.clienteId}
                onChange={(e) =>
                  setFormData({ ...formData, clienteId: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Cliente directo
                </option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Cantidad *
            </label>
            <input
              required
              type="number"
              min="1"
              max={selectedItemInfo ? selectedItemInfo.stock : 9999}
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="bg-black/20 rounded-xl p-4 mt-2 border border-white/5 flex items-center justify-between">
            <span className="text-white/60 font-bold text-sm tracking-widest uppercase">
              Monto Total
            </span>
            <span className="text-2xl font-black text-white font-mono">
              ${calculatedTotal}
            </span>
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
              disabled={isSubmitting || !formData.inventarioId}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-orange to-red-500 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Procesando..." : "Completar Venta"}
            </button>
          </div>
        </form>
      </GlassModal>

      {/* ── Edit Sale Modal (custom, not EditForm) ── */}
      <GlassModal
        isOpen={!!editingVenta}
        onClose={() => setEditingVenta(null)}
        title={`Editar Venta #${editingVenta?.ref || ""}`}
        icon="edit"
      >
        {editingVenta && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Producto *
              </label>
              <div className="relative">
                <select
                  required
                  value={editForm.inventarioId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, inventarioId: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900">
                    Selecciona un producto
                  </option>
                  {inventario.map((i) => (
                    <option key={i.id} value={i.id} className="bg-slate-900">
                      {i.name} - ${i.precio_venta.toFixed(2)}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Cliente
              </label>
              <div className="relative">
                <select
                  value={editForm.clienteId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, clienteId: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">
                    Cliente directo
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Cantidad *
              </label>
              <input
                required
                type="number"
                min="1"
                value={editForm.cantidad}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    cantidad: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingVenta(null)}
                className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSavingEdit ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
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
