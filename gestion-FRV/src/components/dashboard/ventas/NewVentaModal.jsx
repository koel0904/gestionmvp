import GlassModal from "../../../components/GlassModal";

export default function NewVentaModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  clientes,
  inventario,
  formClienteId,
  setFormClienteId,
  formLines,
  setFormLines,
}) {
  // Computed totals for Create modal
  const getLineSubtotal = (line) => {
    const item = inventario.find((i) => i.id === line.inventarioId);
    return item ? item.precio_venta * (parseInt(line.cantidad) || 0) : 0;
  };
  const grandTotal = formLines
    .reduce((sum, line) => sum + getLineSubtotal(line), 0)
    .toFixed(2);

  const updateLine = (index, field, value) => {
    setFormLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    );
  };
  const addLine = () => {
    setFormLines((prev) => [...prev, { inventarioId: "", cantidad: 1 }]);
  };
  const removeLine = (index) => {
    setFormLines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Venta"
      icon="point_of_sale"
      iconColor="text-accent-orange"
      gradient="from-accent-orange/30 to-red-500/20"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Cliente selector */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
            Cliente (Opcional)
          </label>
          <div className="relative">
            <select
              value={formClienteId}
              onChange={(e) => setFormClienteId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">
                Cliente directo
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Product lines header */}
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-white/50 uppercase tracking-wider ml-1">
            Productos *
          </label>
          <button
            type="button"
            onClick={addLine}
            className="flex items-center gap-1 text-xs font-bold text-accent-orange hover:text-accent-orange/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              add_circle
            </span>
            Agregar Producto
          </button>
        </div>

        {/* Product lines */}
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {formLines.map((line, idx) => {
            const lineItem = inventario.find((i) => i.id === line.inventarioId);
            const lineSubtotal = getLineSubtotal(line);
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      required
                      value={line.inventarioId}
                      onChange={(e) =>
                        updateLine(idx, "inventarioId", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-slate-900">
                        Selecciona producto
                      </option>
                      {inventario
                        .filter((i) => i.stock > 0)
                        .map((i) => (
                          <option
                            key={i.id}
                            value={i.id}
                            className="bg-slate-900"
                          >
                            {i.name} - ${Number(i.precio_venta).toFixed(2)} (
                            {i.stock} stock)
                          </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[16px]">
                      expand_more
                    </span>
                  </div>

                  <input
                    required
                    type="number"
                    min="1"
                    max={lineItem ? lineItem.stock : 9999}
                    value={line.cantidad}
                    onChange={(e) =>
                      updateLine(idx, "cantidad", e.target.value)
                    }
                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-accent-orange/50 focus:bg-white/10 transition-all"
                    placeholder="Cant."
                  />

                  {formLines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="size-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      title="Eliminar línea"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  )}
                </div>

                {lineItem && (
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-white/40">
                      {lineItem.name} × {parseInt(line.cantidad) || 0}
                    </span>
                    <span className="font-mono font-bold text-white/70">
                      ${lineSubtotal.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Grand Total */}
        <div className="bg-black/20 rounded-xl p-4 mt-2 border border-white/5 flex items-center justify-between">
          <span className="text-white/60 font-bold text-sm tracking-widest uppercase">
            Monto Total
          </span>
          <span className="text-2xl font-black text-white font-mono">
            ${grandTotal}
          </span>
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
            disabled={isSubmitting || formLines.every((l) => !l.inventarioId)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-orange to-red-500 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Procesando..." : "Completar Venta"}
          </button>
        </div>
      </form>
    </GlassModal>
  );
}
