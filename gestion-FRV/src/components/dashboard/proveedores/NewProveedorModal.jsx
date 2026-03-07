import GlassModal from "../../../components/GlassModal";

export default function NewProveedorModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    formData,
    setFormData,
}) {
    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="New Supplier"
            icon="local_shipping"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                        Supplier Name *
                    </label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? "Saving..." : "Create Supplier"}
                    </button>
                </div>
            </form>
        </GlassModal>
    );
}
