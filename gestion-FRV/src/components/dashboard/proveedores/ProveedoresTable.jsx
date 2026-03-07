export default function ProveedoresTable({
    loading,
    proveedores,
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
                            {proveedores.map((p) => (
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
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(p)}
                                                className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                                                title="Edit Supplier"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(p.id)}
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
