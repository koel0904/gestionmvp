import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";

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

  const filteredInventario = inventario.filter(
    (i) =>
      i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.proveedor?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-orange to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-0.5"
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
                      <span
                        className={`font-bold text-sm ${item.stock < 10 ? "text-accent-orange" : "text-white"}`}
                      >
                        {item.stock}
                      </span>
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
                      <button className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
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

      <GlassToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
