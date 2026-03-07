import GlassModal from "../../../components/GlassModal";
import {
    VEHICLE_TYPES,
    FRECUENCIA_OPTIONS,
    ImageSection,
} from "../../../utils/vehicleUtils";
import { uploadVehiculoImage } from "../../../services/api/dashboardVehiculos";

export default function EditVehiculoModal({
    editingItem,
    setEditingItem,
    handleEditSubmit,
    isSavingEdit,
    editForm,
    setEditForm,
    usuarios,
    editUploading,
    setEditUploading,
    editFileRef,
    selectedLocalId,
    showToast,
}) {
    const handleUpload = async (file, setUploadState, onImageChange) => {
        setUploadState(true);
        try {
            const url = await uploadVehiculoImage(selectedLocalId, file);
            onImageChange(url);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setUploadState(false);
        }
    };

    return (
        <GlassModal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            title={`Editar: ${editingItem?.marca || ""} ${editingItem?.modelo || ""}`}
            icon="edit"
            iconColor="text-sky-400"
            gradient="from-sky-400/30 to-blue-500/20"
        >
            {editingItem && (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    {/* Image section */}
                    <ImageSection
                        imagen={editForm.imagen}
                        tipo={editForm.tipo}
                        onImageChange={(url) => setEditForm({ ...editForm, imagen: url })}
                        fileRef={editFileRef}
                        isUploading={editUploading}
                        focusColor="sky"
                        uploadImage={handleUpload}
                        setUploadingState={setEditUploading}
                    />

                    {/* Código de vehículo */}
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Código de Vehículo
                        </label>
                        <input
                            type="text"
                            value={editForm.carName}
                            onChange={(e) =>
                                setEditForm({ ...editForm, carName: e.target.value })
                            }
                            placeholder="Ej: CAM-001, Repartidor-Norte"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                        />
                    </div>

                    {/* Marca, Modelo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Marca *
                            </label>
                            <input
                                required
                                type="text"
                                value={editForm.marca}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, marca: e.target.value })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Modelo *
                            </label>
                            <input
                                required
                                type="text"
                                value={editForm.modelo}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, modelo: e.target.value })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Año, Tipo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Año *
                            </label>
                            <input
                                required
                                type="number"
                                value={editForm.year}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, year: e.target.value })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Tipo *
                            </label>
                            <div className="relative">
                                <select
                                    value={editForm.tipo}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, tipo: e.target.value })
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                >
                                    {VEHICLE_TYPES.map((t) => (
                                        <option key={t} value={t} className="bg-slate-900">
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance */}
                    <div className="border-t border-white/10 pt-4 mt-2">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                            Mantenimiento
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Último - Fecha
                                </label>
                                <input
                                    type="date"
                                    value={editForm.ultimoMantenimientoFecha}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            ultimoMantenimientoFecha: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Último - Km
                                </label>
                                <input
                                    type="number"
                                    value={editForm.ultimoMantenimientoKm}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            ultimoMantenimientoKm: e.target.value,
                                        })
                                    }
                                    placeholder="50000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Próximo - Fecha
                                </label>
                                <input
                                    type="date"
                                    value={editForm.proximoMantenimientoFecha}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            proximoMantenimientoFecha: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Próximo - Km
                                </label>
                                <input
                                    type="number"
                                    value={editForm.proximoMantenimientoKm}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            proximoMantenimientoKm: e.target.value,
                                        })
                                    }
                                    placeholder="60000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Frecuencia (Km)
                                </label>
                                <input
                                    type="number"
                                    value={editForm.frecuenciaKm}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            frecuenciaKm: e.target.value,
                                        })
                                    }
                                    placeholder="10000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Frecuencia (Tiempo)
                                </label>
                                <select
                                    value={editForm.frecuenciaTiempo}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            frecuenciaTiempo: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900">
                                        Sin definir
                                    </option>
                                    {FRECUENCIA_OPTIONS.map((f) => (
                                        <option key={f} value={f} className="bg-slate-900">
                                            Cada {f}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Encargados */}
                    <div className="border-t border-white/10 pt-4 mt-2">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                            Encargado/s
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {usuarios.map((u) => {
                                const sel = editForm.encargadoIds.includes(u.id);
                                return (
                                    <button
                                        type="button"
                                        key={u.id}
                                        onClick={() => {
                                            const ids = editForm.encargadoIds;
                                            setEditForm({
                                                ...editForm,
                                                encargadoIds: sel
                                                    ? ids.filter((i) => i !== u.id)
                                                    : [...ids, u.id],
                                            });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${sel
                                                ? "bg-primary/30 text-primary-light border border-primary/40"
                                                : "bg-white/5 text-white/50 border border-white/10 hover:text-white/80"
                                            }`}
                                    >
                                        {u.name}
                                    </button>
                                );
                            })}
                            {usuarios.length === 0 && (
                                <p className="text-xs text-white/30 italic">
                                    No hay usuarios en este local
                                </p>
                            )}
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
                                {editForm.estado ? "Vehículo Activo" : "Vehículo Inactivo"}
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
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSavingEdit || editUploading}
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
