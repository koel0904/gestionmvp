import GlassModal from "../../../components/GlassModal";
import { getStockColor } from "../../../utils/inventoryUtils";

export default function EditInventarioModal({
    editingItem,
    onClose,
    onSubmit,
    isSavingEdit,
    editForm,
    setEditForm,
    proveedores,
}) {
    return (
        <GlassModal
            isOpen={!!editingItem}
            onClose={onClose}
            title={`Editar: ${editingItem?.name || ""}`}
            icon="edit"
            iconColor="text-sky-400"
            gradient="from-sky-400/30 to-blue-500/20"
        >
            {editingItem && (
                <form onSubmit={onSubmit} className="space-y-4">
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
                                (parseInt(editForm.stock) / parseInt(editForm.maxStock)) * 100,
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${editForm.estado ? "bg-emerald-500" : "bg-white/20"
                                }`}
                        >
                            <span
                                className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${editForm.estado ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
}
