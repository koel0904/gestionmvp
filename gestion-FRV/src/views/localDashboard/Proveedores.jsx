import { useState, useEffect } from "react";
import { useLocal } from "../../context/LocalContext";
import { Link } from "react-router-dom";
import GlassModal from "../../components/GlassModal";
import GlassToast from "../../components/GlassToast";
import EditForm from "../../components/EditForm";

export default function Proveedores() {
  const { selectedLocal } = useLocal();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleEditSuccess = (updatedData) => {
    setProveedores((prev) =>
      prev.map((p) =>
        p.id === updatedData.proveedor.id ? updatedData.proveedor : p
      )
    );
    setEditingProveedor(null);
    showToast("Proveedor actualizado exitosamente");
  };

  useEffect(() => {
    if (!selectedLocal) return;

    async function fetchData() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/locales/${selectedLocal.id}/proveedores`,
          {
            credentials: "include",
          },
        );
        if (res.ok) {
          const data = await res.json();
          setProveedores(data);
        }
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
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/proveedores`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setProveedores((prev) =>
          [...prev, data.proveedor].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "" });
        showToast("Proveedor agregado exitosamente");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to create supplier", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error creating supplier", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm),
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

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between glass-panel rounded-2xl p-5 border border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/20 glass-subtle flex items-center justify-center border border-primary/20 shadow-inner">
            <span className="material-symbols-outlined text-[24px] text-primary-light drop-shadow-md">
              local_shipping
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Proveedores
            </h2>
            <p className="text-sm text-white/50 font-medium">
              Manage suppliers for {selectedLocal.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-orange to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">New Supplier</span>
        </button>
      </div>

      {/* ── Content / Table Area ── */}
      <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
            Supplier Directory
          </h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="size-8 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : proveedores.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
                inbox
              </span>
            </div>
            <p className="text-white/60 text-lg font-bold mb-1">
              No suppliers found
            </p>
            <p className="text-white/40 text-sm font-medium">
              Get started by creating a new supplier.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden sm:table-cell">
                    Contact Info
                  </th>
                  <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px] text-primary-light">
                            domain
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-white max-w-[200px] truncate">
                            {p.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell align-middle">
                      <div className="flex flex-col gap-1">
                        {p.email && (
                          <div className="text-sm text-white/70 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              mail
                            </span>{" "}
                            <span className="truncate max-w-[200px]">
                              {p.email}
                            </span>
                          </div>
                        )}
                        {p.phone && (
                          <div className="text-sm text-white/70 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              phone
                            </span>{" "}
                            {p.phone}
                          </div>
                        )}
                        {!p.email && !p.phone && (
                          <span className="text-sm text-white/30 italic">
                            No contact info
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right align-middle">
                      <button
                        onClick={() => setEditingProveedor(p)}
                        className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Edit Supplier"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
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
        title="New Supplier"
        icon="local_shipping"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Supplier Name *
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. ACME Corp"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="sales@acme.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="555-0123"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Create Supplier"}
            </button>
          </div>
        </form>
      </GlassModal>

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
    </div>
  );
}
