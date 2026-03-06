import { useState, useEffect, useRef } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";
import usePermissions from "../../hooks/usePermissions";

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

  // Items popover state (fixed positioning to escape overflow)
  const [popoverVenta, setPopoverVenta] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const popoverTimeout = useRef(null);

  const showPopover = (e, venta) => {
    clearTimeout(popoverTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({
      top: rect.top - 8,
      left: rect.left,
    });
    setPopoverVenta(venta);
  };
  const hidePopover = () => {
    popoverTimeout.current = setTimeout(() => setPopoverVenta(null), 150);
  };
  const keepPopover = () => {
    clearTimeout(popoverTimeout.current);
  };

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

      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas/${editingVenta.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            clienteId: editClienteId || null,
            total,
            items,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar");
      }
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

  // ── Computed totals for Create modal ──
  const getLineSubtotal = (line) => {
    const item = inventario.find((i) => i.id === line.inventarioId);
    return item ? item.precio_venta * (parseInt(line.cantidad) || 0) : 0;
  };
  const grandTotal = formLines
    .reduce((sum, line) => sum + getLineSubtotal(line), 0)
    .toFixed(2);

  // ── Helpers to manage product lines ──
  const updateLine = (index, field, value) => {
    setFormLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  };
  const addLine = () => {
    setFormLines((prev) => [...prev, { inventarioId: "", cantidad: 1 }]);
  };
  const removeLine = (index) => {
    setFormLines((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Computed total for Edit modal ──
  const getEditLineSubtotal = (line) => {
    const item = inventario.find((i) => i.id === line.inventarioId);
    return item ? item.precio_venta * (parseInt(line.cantidad) || 0) : 0;
  };
  const editGrandTotal = editLines
    .reduce((sum, line) => sum + getEditLineSubtotal(line), 0)
    .toFixed(2);

  // ── Helpers to manage edit product lines ──
  const updateEditLine = (index, field, value) => {
    setEditLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  };
  const addEditLine = () => {
    setEditLines((prev) => [...prev, { inventarioId: "", cantidad: 1 }]);
  };
  const removeEditLine = (index) => {
    setEditLines((prev) => prev.filter((_, i) => i !== index));
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

      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al registrar venta");
      }

      // Refresh list
      const refresh = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/ventas`,
        { credentials: "include" },
      );
      if (refresh.ok) setVentas(await refresh.json());

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
    <>
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
            onClick={() =>
              checkAccess("add", () => setIsModalOpen(true), showToast)
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-white font-bold tracking-wide shadow-[0_2px_8px_rgba(167,139,250,0.4)] hover:shadow-[0_0_24px_rgba(167,139,250,0.55)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              point_of_sale
            </span>
            <span className="hidden sm:inline">Nueva Venta</span>
          </button>
        </div>

        {/* ── Content / Table Area ── */}
        <div className="flex-1 glass-heavy rounded-2xl p-6 relative flex flex-col min-h-[400px]">
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
                      Productos
                    </th>
                    <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden sm:table-cell">
                      Cliente
                    </th>
                    <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                      Artículos
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

                      {/* Products (hover trigger for fixed popover) */}
                      <td className="py-3 px-4 hidden md:table-cell align-middle">
                        {v.items && v.items.length > 0 ? (
                          <div
                            className="cursor-default"
                            onMouseEnter={(e) => showPopover(e, v)}
                            onMouseLeave={hidePopover}
                          >
                            <div className="space-y-0.5">
                              {v.items.length === 1 ? (
                                <div className="font-medium text-white/90 truncate max-w-[200px]">
                                  {v.items[0].nombre || "—"}
                                </div>
                              ) : (
                                <>
                                  <div className="font-medium text-white/90 text-sm flex items-center gap-1.5">
                                    {v.items.length} artículos
                                    <span
                                      className={`material-symbols-outlined text-[14px] transition-colors ${popoverVenta?.id === v.id ? "text-primary-light" : "text-white/30"}`}
                                    >
                                      info
                                    </span>
                                  </div>
                                  <div className="text-xs text-white/40 truncate max-w-[200px]">
                                    {v.items
                                      .map((it) => it.nombre)
                                      .filter(Boolean)
                                      .join(", ")}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-white/30 italic">
                            —
                          </span>
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

                      {/* Quantity (total items) */}
                      <td className="py-3 px-4 text-right align-middle">
                        <span className="text-sm font-medium text-white/70 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                          {v.items
                            ? v.items.reduce(
                                (sum, it) => sum + (it.cantidad || 0),
                                0,
                              )
                            : 0}
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
                            onClick={() =>
                              checkAccess("edit", () => startEdit(v), showToast)
                            }
                            className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                            title="Editar"
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
            {/* ── Cliente selector ── */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Cliente (Opcional)
              </label>
              <div className="relative">
                <select
                  value={formClienteId}
                  onChange={(e) => setFormClienteId(e.target.value)}
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

            {/* ── Product lines header ── */}
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
                Productos *
              </label>
              <button
                type="button"
                onClick={addLine}
                className="flex items-center gap-1 text-xs font-bold text-accent-orange hover:text-accent-orange/80 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  add_circle
                </span>
                Agregar Producto
              </button>
            </div>

            {/* ── Product lines ── */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {formLines.map((line, idx) => {
                const lineItem = inventario.find(
                  (i) => i.id === line.inventarioId,
                );
                const lineSubtotal = getLineSubtotal(line);
                return (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {/* Product select */}
                      <div className="relative flex-1">
                        <select
                          required
                          value={line.inventarioId}
                          onChange={(e) =>
                            updateLine(idx, "inventarioId", e.target.value)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="bg-slate-900">
                            Selecciona producto
                          </option>
                          {inventario
                            .filter((i) => i.stock > 0)
                            .map((i) => (
                              <option
                                key={i.id}
                                value={i.id}
                                className="bg-slate-900"
                              >
                                {i.name} - ${i.precio_venta.toFixed(2)} (
                                {i.stock} stock)
                              </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[16px]">
                          expand_more
                        </span>
                      </div>

                      {/* Quantity */}
                      <input
                        required
                        type="number"
                        min="1"
                        max={lineItem ? lineItem.stock : 9999}
                        value={line.cantidad}
                        onChange={(e) =>
                          updateLine(idx, "cantidad", e.target.value)
                        }
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all"
                        placeholder="Cant."
                      />

                      {/* Remove button */}
                      {formLines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="size-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                          title="Eliminar línea"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            close
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Line subtotal */}
                    {lineItem && (
                      <div className="flex items-center justify-between px-1 text-xs">
                        <span className="text-white/40">
                          {lineItem.name} × {parseInt(line.cantidad) || 0}
                        </span>
                        <span className="font-mono font-bold text-white/70">
                          ${lineSubtotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Grand Total ── */}
            <div className="bg-black/20 rounded-xl p-4 mt-2 border border-white/5 flex items-center justify-between">
              <span className="text-white/60 font-bold text-sm tracking-widest uppercase">
                Monto Total
              </span>
              <span className="text-2xl font-black text-white font-mono">
                ${grandTotal}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormLines([{ inventarioId: "", cantidad: 1 }]);
                  setFormClienteId("");
                }}
                className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting || formLines.every((l) => !l.inventarioId)
                }
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-orange to-red-500 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Procesando..." : "Completar Venta"}
              </button>
            </div>
          </form>
        </GlassModal>

        {/* ── Edit Sale Modal (multi-product) ── */}
        <GlassModal
          isOpen={!!editingVenta}
          onClose={() => setEditingVenta(null)}
          title={`Editar Venta #${editingVenta?.ref || ""}`}
          icon="edit"
        >
          {editingVenta && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* ── Cliente selector ── */}
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Cliente
                </label>
                <div className="relative">
                  <select
                    value={editClienteId}
                    onChange={(e) => setEditClienteId(e.target.value)}
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

              {/* ── Product lines header ── */}
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
                  Productos *
                </label>
                <button
                  type="button"
                  onClick={addEditLine}
                  className="flex items-center gap-1 text-xs font-bold text-primary-light hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add_circle
                  </span>
                  Agregar Producto
                </button>
              </div>

              {/* ── Product lines ── */}
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {editLines.map((line, idx) => {
                  const lineItem = inventario.find(
                    (i) => i.id === line.inventarioId,
                  );
                  const lineSubtotal = getEditLineSubtotal(line);
                  return (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <select
                            required
                            value={line.inventarioId}
                            onChange={(e) =>
                              updateEditLine(
                                idx,
                                "inventarioId",
                                e.target.value,
                              )
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-slate-900">
                              Selecciona producto
                            </option>
                            {inventario.map((i) => (
                              <option
                                key={i.id}
                                value={i.id}
                                className="bg-slate-900"
                              >
                                {i.name} - ${i.precio_venta.toFixed(2)}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[16px]">
                            expand_more
                          </span>
                        </div>

                        <input
                          required
                          type="number"
                          min="1"
                          value={line.cantidad}
                          onChange={(e) =>
                            updateEditLine(
                              idx,
                              "cantidad",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                          placeholder="Cant."
                        />

                        {editLines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEditLine(idx)}
                            className="size-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                            title="Eliminar línea"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              close
                            </span>
                          </button>
                        )}
                      </div>

                      {lineItem && (
                        <div className="flex items-center justify-between px-1 text-xs">
                          <span className="text-white/40">
                            {lineItem.name} × {parseInt(line.cantidad) || 0}
                          </span>
                          <span className="font-mono font-bold text-white/70">
                            ${lineSubtotal.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Grand Total ── */}
              <div className="bg-black/20 rounded-xl p-4 mt-2 border border-white/5 flex items-center justify-between">
                <span className="text-white/60 font-bold text-sm tracking-widest uppercase">
                  Monto Total
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  ${editGrandTotal}
                </span>
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
                  disabled={
                    isSavingEdit || editLines.every((l) => !l.inventarioId)
                  }
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

      {/* ── Fixed-position items popover (outside overflow containers) ── */}
      {popoverVenta && popoverVenta.items && (
        <div
          className="fixed z-[9999] min-w-[280px] max-w-[360px] animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: "translateY(-100%)",
          }}
          onMouseEnter={keepPopover}
          onMouseLeave={hidePopover}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_12px_rgba(124,58,237,0.1)] p-3">
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2 px-1">
              Detalle de artículos
            </div>
            <div className="space-y-1.5">
              {popoverVenta.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 px-2 py-1.5 rounded-lg bg-black/[0.03] border border-black/5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-black/80 truncate">
                      {item.nombre || "—"}
                    </div>
                    <div className="text-[11px] text-black/40">
                      {item.cantidad} × ${(item.precio_venta || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-bold text-black/70 shrink-0">
                    ${(item.subtotal || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 px-2">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">
                Total
              </span>
              <span className="text-sm font-mono font-black text-black/90">
                ${popoverVenta.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
