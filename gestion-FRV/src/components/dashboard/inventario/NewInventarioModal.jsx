import GlassModal from "../../../components/GlassModal";

export default function NewInventarioModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    formData,
    setFormData,
    proveedores,
}) {
    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="New Product"
            icon="inventory_2"
            iconColor="text-blue-400"
            gradient="from-blue-400/30 to-blue-500/20"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                        Product Name *
                    </label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            Supplier (Optional)
                        </label>
                        <div className="relative">
                            <select
                                value={formData.proveedorId}
                                onChange={(e) =>
                                    setFormData({ ...formData, proveedorId: e.target.value })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-slate-900">
                                    No specific supplier
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
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(96,165,250,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? "Saving..." : "Add Product"}
                    </button>
                </div>
            </form>
        </GlassModal>
    );
}
