import GlassModal from "./GlassModal";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      icon="warning"
      iconColor="text-red-500"
      gradient="from-red-500/30 to-red-600/20"
    >
      <div className="space-y-4">
        <p className="text-white/80 text-sm font-medium">
          ¿Seguro que quieres eliminar este elemento? Esto no se puede deshacer!
        </p>
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-white/60 font-medium hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </GlassModal>
  );
}
