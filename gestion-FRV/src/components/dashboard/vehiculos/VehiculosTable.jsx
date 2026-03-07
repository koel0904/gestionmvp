import { DEFAULT_IMAGES } from "../../../utils/vehicleUtils";

export default function VehiculosTable({
    loading,
    vehiculos,
    searchTerm,
    setSearchTerm,
    onEdit,
    onDelete,
}) {
    const formatDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="flex-1 glass-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
                    Registro de Vehículos
                </h3>
                <div className="relative w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar vehículo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="size-8 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
                </div>
            ) : vehiculos.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
                        <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
                            no_crash
                        </span>
                    </div>
                    <p className="text-white/60 text-lg font-bold mb-1">
                        Sin vehículos registrados
                    </p>
                    <p className="text-white/40 text-sm font-medium">
                        Comienza agregando un vehículo a la flota.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto flex-1 h-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                                    Vehículo
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                                    Código de Vehículo
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden lg:table-cell">
                                    Último Mant.
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden lg:table-cell">
                                    Próximo Mant.
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:table-cell">
                                    Encargado/s
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
                            {vehiculos.map((v) => (
                                <tr
                                    key={v.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                >
                                    {/* Vehicle info */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                                <img
                                                    src={
                                                        v.imagen ||
                                                        DEFAULT_IMAGES[v.tipo] ||
                                                        DEFAULT_IMAGES.sedan
                                                    }
                                                    alt={`${v.marca} ${v.modelo}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">
                                                    {v.marca} {v.modelo}
                                                </div>
                                                <div className="text-xs text-white/40">{v.year}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Código de Vehículo */}
                                    <td className="py-4 px-4 align-middle">
                                        {v.carName ? (
                                            <span className="px-2.5 py-1 rounded-md bg-white/5 text-white/70 text-xs border border-white/10 block w-fit truncate max-w-[150px]">
                                                {v.carName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-white/30 italic">—</span>
                                        )}
                                    </td>

                                    {/* Tipo */}
                                    <td className="py-4 px-4 align-middle">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-white/5 text-white/70 border border-white/10">
                                            {v.tipo}
                                        </span>
                                    </td>

                                    {/* Ultimo mantenimiento */}
                                    <td className="py-4 px-4 align-middle hidden lg:table-cell">
                                        <div>
                                            <div className="text-sm text-white/70">
                                                {formatDate(v.ultimoMantenimientoFecha)}
                                            </div>
                                            {v.ultimoMantenimientoKm && (
                                                <div className="text-xs text-white/40">
                                                    {v.ultimoMantenimientoKm.toLocaleString()} km
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Proximo mantenimiento */}
                                    <td className="py-4 px-4 align-middle hidden lg:table-cell">
                                        <div>
                                            <div className="text-sm text-white/70">
                                                {formatDate(v.proximoMantenimientoFecha)}
                                            </div>
                                            {v.proximoMantenimientoKm && (
                                                <div className="text-xs text-white/40">
                                                    {v.proximoMantenimientoKm.toLocaleString()} km
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Encargados */}
                                    <td className="py-4 px-4 align-middle hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {v.encargados?.length > 0 ? (
                                                v.encargados.map((e) => (
                                                    <span
                                                        key={e.id}
                                                        className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-blue-600/25 text-white border border-blue-500/30"
                                                    >
                                                        {e.name.split(" ")[0]}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-white/30 italic">
                                                    Sin encargado
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Estado */}
                                    <td className="py-4 px-4 text-center align-middle">
                                        <span
                                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest ${v.estado
                                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                }`}
                                        >
                                            {v.estado ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td className="py-4 px-4 text-right align-middle">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(v)}
                                                className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                                                title="Edit Vehicle"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(v.id)}
                                                className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-red-600 hover:border-red-400 border border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.8),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                                                title="Eliminar Vehículo"
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
