import { getStockColor } from "../../../utils/inventoryUtils";

export default function InventarioTable({
    loading,
    inventario,
    searchTerm,
    setSearchTerm,
    onEdit,
    onDelete,
}) {
    return (
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
                            {inventario.map((item) => (
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
                                                onClick={() => onEdit(item)}
                                                className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
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
    );
}
