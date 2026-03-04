import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { smartMatch } from "../../utils/smartSearch";

export default function Inventario() {
  const { selectedLocal } = useLocal();
  const [inventario, setInventario] = useState([]);
  const [proveedores, setProveedores] = useState([]);
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

  // ── Stock color helper ──
  const getStockColor = (stock, maxStock = 100) => {
    if (stock === 0)
      return {
        text: "text-red-500",
        bg: "bg-red-500/15",
        border: "border-red-500/30",
      };
    const pct = (stock / maxStock) * 100;
    if (pct <= 30)
      return {
        text: "text-orange-400",
        bg: "bg-orange-400/15",
        border: "border-orange-400/30",
      };
    if (pct <= 70)
      return {
        text: "text-yellow-400",
        bg: "bg-yellow-400/15",
        border: "border-yellow-400/30",
      };
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-400/15",
      border: "border-emerald-400/30",
    };
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/inventario/${deleteConfirm}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        setInventario((prev) => prev.filter((i) => i.id !== deleteConfirm));
        showToast("Producto eliminado exitosamente");
      } else {
        const err = await res.json();
        showToast(err.error || "Error al eliminar producto", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error de red al eliminar", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/inventario/${editingItem.id}`,
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
      const refresh = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/inventario`,
        { credentials: "include" },
      );
      if (refresh.ok) setInventario(await refresh.json());
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
        const [invRes, provRes] = await Promise.all([
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/inventario`,
            { credentials: "include" },
          ),
          fetch(
            `http://localhost:3000/api/locales/${selectedLocal.id}/proveedores`,
            { credentials: "include" },
          ),
        ]);
        if (invRes.ok) {
          const data = await invRes.json();
          setInventario(data);
        }
        if (provRes.ok) {
          const data = await provRes.json();
          setProveedores(data);
        }
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/inventario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        // Refresh inventory correctly to include relation provider info
        const refresh = await fetch(
          `http://localhost:3000/api/locales/${selectedLocal.id}/inventario`,
          { credentials: "include" },
        );
        if (refresh.ok) setInventario(await refresh.json());

        setIsModalOpen(false);
        setFormData({
          name: "",
          precio_compra: "",
          precio_venta: "",
          stock: "",
          proveedorId: "",
        });
        showToast("Producto agregado exitosamente");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to create product", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error creating product", "error");
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

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between glass-panel rounded-2xl p-5 border border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center border border-primary/20 shadow-inner">
            <span className="material-symbols-outlined text-[24px] text-primary-light drop-shadow-md">
              inventory_2
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Inventario
            </h2>
            <p className="text-sm text-white/50 font-medium">
              Product catalog for {selectedLocal.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-white font-bold tracking-wide shadow-[0_2px_8px_rgba(167,139,250,0.4)] hover:shadow-[0_0_24px_rgba(167,139,250,0.55)] transition-all transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {/* ── Content / Table Area ── */}
      <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
            Stock Items
          </h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="size-8 border-4 border-white/10 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        ) : inventario.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner border-blue-400/20 shadow-[0_0_30px_rgba(96,165,250,0.15)]">
              <span className="material-symbols-outlined text-4xl text-blue-400/60 drop-shadow-md">
                category
              </span>
            </div>
            <p className="text-white/60 text-lg font-bold mb-1">
              No products found
            </p>
            <p className="text-white/40 text-sm font-medium">
              Get started by creating a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 h-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Price
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Stock
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:table-cell">
                    Supplier
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventario.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px] text-primary-light">
                            {item.imagen ? "image" : "inventory_2"}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white truncate max-w-[200px]">
                            {item.name}
                          </div>
                          {item.descripcion && (
                            <div className="text-xs text-white/50 truncate max-w-[200px]">
                              {item.descripcion}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm">
                      <div className="text-white">
                        ${item.precio_venta.toFixed(2)}
                      </div>
                      <div className="text-white/40 text-xs text-green-400/70">
                        Margin: $
                        {(item.precio_venta - item.precio_compra).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(() => {
                        const colors = getStockColor(item.stock, item.maxStock);
                        return (
                          <div className="inline-flex flex-col items-end">
                            <span
                              className={`font-bold text-sm ${colors.text} px-2.5 py-0.5 rounded-md ${colors.bg} border ${colors.border}`}
                            >
                              {item.stock}
                            </span>
                            <span className="text-[10px] text-white/30 mt-0.5">
                              / {item.maxStock || 100}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-white/70 text-xs border border-white/10 block w-fit truncate max-w-[150px]">
                        {item.proveedor?.name || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.estado ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
                      >
                        {item.estado ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
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

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Product"
        icon="inventory_2"
        iconColor="text-blue-400"
        gradient="from-blue-400/30 to-blue-500/20"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Product Name *
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Premium Widget"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Purchase Price *
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_compra}
                onChange={(e) =>
                  setFormData({ ...formData, precio_compra: e.target.value })
                }
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Sale Price *
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_venta}
                onChange={(e) =>
                  setFormData({ ...formData, precio_venta: e.target.value })
                }
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Initial Stock *
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Supplier *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.proveedorId}
                  onChange={(e) =>
                    setFormData({ ...formData, proveedorId: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900">
                    Select Supplier
                  </option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(96,165,250,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </GlassModal>

      {/* ── Edit Product Modal ── */}
      <GlassModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Editar: ${editingItem?.name || ""}`}
        icon="edit"
        iconColor="text-sky-400"
        gradient="from-sky-400/30 to-blue-500/20"
      >
        {editingItem && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Nombre del Producto *
              </label>
              <input
                required
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Precio Compra *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.precio_compra}
                  onChange={(e) =>
                    setEditForm({ ...editForm, precio_compra: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Precio Venta *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.precio_venta}
                  onChange={(e) =>
                    setEditForm({ ...editForm, precio_venta: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Margin preview */}
            {editForm.precio_compra && editForm.precio_venta && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">
                  trending_up
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  Margen: $
                  {(
                    parseFloat(editForm.precio_venta) -
                    parseFloat(editForm.precio_compra)
                  ).toFixed(2)}
                </span>
              </div>
            )}

            {/* Stock + MaxStock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Stock Actual *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                  Stock Máximo
                </label>
                <input
                  type="number"
                  min="1"
                  value={editForm.maxStock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, maxStock: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Stock bar preview */}
            {editForm.stock !== "" &&
              editForm.maxStock &&
              (() => {
                const pct = Math.min(
                  100,
                  (parseInt(editForm.stock) / parseInt(editForm.maxStock)) *
                    100,
                );
                const colors = getStockColor(
                  parseInt(editForm.stock),
                  parseInt(editForm.maxStock),
                );
                return (
                  <div className="px-1">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${colors.bg.replace("/15", "")}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={`text-[10px] font-bold ${colors.text}`}>
                        {Math.round(pct)}%
                      </span>
                      <span className="text-[10px] text-white/30">
                        {editForm.stock} / {editForm.maxStock}
                      </span>
                    </div>
                  </div>
                );
              })()}

            {/* Proveedor */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Proveedor *
              </label>
              <div className="relative">
                <select
                  required
                  value={editForm.proveedorId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, proveedorId: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900">
                    Seleccionar proveedor
                  </option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  expand_more
                </span>
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
                  {editForm.estado ? "Producto Activo" : "Producto Inactivo"}
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
                disabled={isSavingEdit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
