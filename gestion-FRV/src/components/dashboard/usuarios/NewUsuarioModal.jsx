import GlassModal from "../../../components/GlassModal";

export default function NewUsuarioModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    formData,
    setFormData,
    confirmPassword,
    setConfirmPassword,
}) {
    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Invitar Miembro"
            icon="person_add"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                        Nombre Completo *
                    </label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                        Email *
                    </label>
                    <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="juan@empresa.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                </div>
                {/* Position */}
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                        Posición en el negocio
                    </label>
                    <input
                        type="text"
                        value={formData.position || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, position: e.target.value })
                        }
                        placeholder="ej: Chef, Cajero, Mesero..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Teléfono
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
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Rol *
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({ ...formData, role: e.target.value })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                            >
                                <option value="user" className="bg-slate-900">
                                    User
                                </option>
                                <option value="admin" className="bg-slate-900">
                                    Admin
                                </option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Contraseña *
                        </label>
                        <input
                            required
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                            Confirmar *
                        </label>
                        <input
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all ${confirmPassword && confirmPassword !== formData.password
                                    ? "border-red-400/50 focus:border-red-400"
                                    : "border-white/10 focus:border-primary/50"
                                }`}
                        />
                        {confirmPassword && confirmPassword !== formData.password && (
                            <p className="text-[10px] text-red-400 mt-1 ml-1 font-semibold">
                                No coinciden
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
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? "Invitando..." : "Enviar Invitación"}
                    </button>
                </div>
            </form>
        </GlassModal>
    );
}
