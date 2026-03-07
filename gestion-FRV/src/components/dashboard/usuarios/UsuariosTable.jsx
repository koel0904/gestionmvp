export default function UsuariosTable({
    loading,
    usuarios,
    searchTerm,
    setSearchTerm,
    onEdit,
    onDelete,
    editingId,
    editData,
    setEditData,
    saveEdit,
    cancelEdit,
    isSaving,
    locales,
}) {
    return (
        <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
                    Directorio de Equipo
                </h3>
                <div className="relative w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar equipo..."
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
            ) : usuarios.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
                        <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
                            admin_panel_settings
                        </span>
                    </div>
                    <p className="text-white/60 text-lg font-bold mb-1">
                        Sin miembros del equipo
                    </p>
                    <p className="text-white/40 text-sm font-medium">
                        Invita usuarios para gestionar este local.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto flex-1 h-full">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden sm:table-cell">
                                    Contacto
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden lg:table-cell">
                                    Local
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:table-cell">
                                    Posición
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-center">
                                    Rol
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-center">
                                    Estado
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => {
                                const isEditing = editingId === u.id;
                                return (
                                    <tr
                                        key={u.id}
                                        className={`border-b border-white/5 transition-colors group ${isEditing ? "bg-white/[0.04]" : "hover:bg-white/5"
                                            }`}
                                    >
                                        {/* User column */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-[20px] text-primary-light">
                                                        person
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    {isEditing ? (
                                                        <div className="space-y-1">
                                                            <input
                                                                type="text"
                                                                value={editData.name}
                                                                onChange={(e) =>
                                                                    setEditData({
                                                                        ...editData,
                                                                        name: e.target.value,
                                                                    })
                                                                }
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
                                                                placeholder="Nombre"
                                                            />
                                                            <input
                                                                type="email"
                                                                value={editData.email}
                                                                onChange={(e) =>
                                                                    setEditData({
                                                                        ...editData,
                                                                        email: e.target.value,
                                                                    })
                                                                }
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none focus:border-primary/50 transition-all"
                                                                placeholder="Email"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="font-bold text-white truncate">
                                                                {u.name}
                                                            </div>
                                                            {u.email && (
                                                                <div className="text-xs text-white/50 truncate">
                                                                    {u.email}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact column */}
                                        <td className="py-3 px-4 hidden sm:table-cell align-middle">
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editData.phone}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white/70 focus:outline-none focus:border-primary/50 transition-all"
                                                    placeholder="Teléfono"
                                                />
                                            ) : u.phone ? (
                                                <div className="text-sm text-white/70 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        phone
                                                    </span>{" "}
                                                    {u.phone}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-white/30 italic">
                                                    Sin teléfono
                                                </span>
                                            )}
                                        </td>

                                        {/* Local column */}
                                        <td className="py-3 px-4 hidden lg:table-cell align-middle">
                                            {isEditing ? (
                                                <div className="relative">
                                                    <select
                                                        value={editData.localId || ""}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                localId: e.target.value,
                                                            })
                                                        }
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="" className="bg-slate-900">
                                                            Sin local
                                                        </option>
                                                        {locales.map((l) => (
                                                            <option
                                                                key={l.id}
                                                                value={l.id}
                                                                className="bg-slate-900"
                                                            >
                                                                {l.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-md bg-white/5 text-white/70 text-xs border border-white/10 block w-fit truncate max-w-[150px]">
                                                    {u.local?.name || "Sin local"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Position column */}
                                        <td className="py-3 px-4 hidden md:table-cell align-middle">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData.position}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            position: e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none focus:border-primary/50 transition-all"
                                                    placeholder="ej: Chef, Cajero..."
                                                />
                                            ) : u.position ? (
                                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 truncate max-w-[120px]">
                                                    {u.position}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-white/30 italic">
                                                    Sin posición
                                                </span>
                                            )}
                                        </td>

                                        {/* Role column */}
                                        <td className="py-3 px-4 text-center align-middle">
                                            {isEditing ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditData({ ...editData, role: "user" })
                                                        }
                                                        className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${editData.role === "user"
                                                                ? "bg-white/10 text-white border border-white/20"
                                                                : "text-white/40 border border-transparent hover:text-white/60"
                                                            }`}
                                                    >
                                                        User
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditData({ ...editData, role: "admin" })
                                                        }
                                                        className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${editData.role === "admin"
                                                                ? "bg-primary/20 text-primary-light border border-primary/30"
                                                                : "text-white/40 border border-transparent hover:text-white/60"
                                                            }`}
                                                    >
                                                        Admin
                                                    </button>
                                                </div>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold tracking-widest uppercase ${u.role === "admin"
                                                            ? "bg-primary/20 text-primary-light border border-primary/30"
                                                            : "bg-white/5 text-white/60 border border-white/10"
                                                        }`}
                                                >
                                                    {u.role === "admin" ? "Admin" : "User"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status column */}
                                        <td className="py-3 px-4 text-center align-middle">
                                            {isEditing ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditData({
                                                            ...editData,
                                                            active: !editData.active,
                                                        })
                                                    }
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${editData.active ? "bg-emerald-500" : "bg-white/20"
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${editData.active
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                            }`}
                                                    />
                                                </button>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest ${u.active !== false
                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                        }`}
                                                >
                                                    {u.active !== false ? "Activo" : "Inactivo"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions column */}
                                        <td className="py-3 px-4 text-right align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={saveEdit}
                                                            disabled={isSaving}
                                                            className="size-9 rounded-xl flex items-center justify-center text-green-400 hover:bg-green-600 hover:text-white border border-transparent hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-50"
                                                            title="Guardar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                {isSaving ? "hourglass_empty" : "check"}
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-transparent transition-all duration-300 cursor-pointer"
                                                            title="Cancelar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                close
                                                            </span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => onEdit(u)}
                                                            className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-primary/30 hover:border-primary/40 border border-transparent hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-300"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                edit
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(u.id)}
                                                            className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 border border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                delete
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
