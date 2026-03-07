import GlassModal from "../../../components/GlassModal";
import {
    VEHICLE_TYPES,
    FRECUENCIA_OPTIONS,
    ImageSection,
} from "../../../utils/vehicleUtils";
import { uploadVehiculoImage } from "../../../services/api/dashboardVehiculos";

export default function NewVehiculoModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    formData,
    setFormData,
    usuarios,
    uploading,
    setUploading,
    createFileRef,
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
            isOpen={isOpen}
            onClose={onClose}
            title="Agregar Vehículo"
            icon="directions_car"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Código de vehículo */}
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                        Código de Vehículo
                    </label>
                    <input
                        type="text"
                        value={formData.carName}
                        onChange={(e) =>
                            setFormData({ ...formData, carName: e.target.value })
                        }
                        placeholder="Ej: CAM-001, Repartidor-Norte"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
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
                            value={formData.marca}
                            onChange={(e) =>
                                setFormData({ ...formData, marca: e.target.value })
                            }
                            placeholder="Toyota"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Modelo *
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.modelo}
                            onChange={(e) =>
                                setFormData({ ...formData, modelo: e.target.value })
                            }
                            placeholder="Hilux"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
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
                            value={formData.year}
                            onChange={(e) =>
                                setFormData({ ...formData, year: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Tipo *
                        </label>
                        <select
                            value={formData.tipo}
                            onChange={(e) =>
                                setFormData({ ...formData, tipo: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                            {VEHICLE_TYPES.map((t) => (
                                <option key={t} value={t} className="bg-slate-900">
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Image section */}
                <div className="border-t border-white/10 pt-4 mt-2">
                    <ImageSection
                        imagen={formData.imagen}
                        tipo={formData.tipo}
                        onImageChange={(url) => setFormData({ ...formData, imagen: url })}
                        fileRef={createFileRef}
                        isUploading={uploading}
                        focusColor="primary"
                        uploadImage={handleUpload}
                        setUploadingState={setUploading}
                    />
                </div>

                {/* Maintenance section */}
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
                                value={formData.ultimoMantenimientoFecha}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        ultimoMantenimientoFecha: e.target.value,
                                    })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Último - Km
                            </label>
                            <input
                                type="number"
                                value={formData.ultimoMantenimientoKm}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        ultimoMantenimientoKm: e.target.value,
                                    })
                                }
                                placeholder="50000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Próximo - Fecha
                            </label>
                            <input
                                type="date"
                                value={formData.proximoMantenimientoFecha}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        proximoMantenimientoFecha: e.target.value,
                                    })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Próximo - Km
                            </label>
                            <input
                                type="number"
                                value={formData.proximoMantenimientoKm}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        proximoMantenimientoKm: e.target.value,
                                    })
                                }
                                placeholder="60000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
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
                                value={formData.frecuenciaKm}
                                onChange={(e) =>
                                    setFormData({ ...formData, frecuenciaKm: e.target.value })
                                }
                                placeholder="10000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                Frecuencia (Tiempo)
                            </label>
                            <select
                                value={formData.frecuenciaTiempo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        frecuenciaTiempo: e.target.value,
                                    })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
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
                            const sel = formData.encargadoIds.includes(u.id);
                            return (
                                <button
                                    type="button"
                                    key={u.id}
                                    onClick={() => {
                                        const ids = formData.encargadoIds;
                                        setFormData({
                                            ...formData,
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
                        disabled={isSubmitting || uploading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? "Creando..." : "Agregar Vehículo"}
                    </button>
                </div>
            </form>
        </GlassModal>
    );
}
