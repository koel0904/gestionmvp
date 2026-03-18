import { useState, useRef } from "react";

export default function VentasTable({
  loading,
  ventas,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
}) {
  const [popoverVenta, setPopoverVenta] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const popoverTimeout = useRef(null);

  const showPopover = (e, venta) => {
    clearTimeout(popoverTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
    setPopoverVenta(venta);
  };
  const hidePopover = () => {
    popoverTimeout.current = setTimeout(() => setPopoverVenta(null), 150);
  };

  const formatDate = (dateString) => {
    const opts = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, opts);
  };

  return (
    <div className="flex-1 glass-heavy rounded-2xl p-6 relative flex flex-col min-h-[400px]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">
          Registro de Transacciones
        </h3>
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar ventas..."
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
      ) : ventas.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="size-20 rounded-2xl glass-panel flex items-center justify-center mb-5 shadow-inner">
            <span className="material-symbols-outlined text-4xl text-white/30 drop-shadow-md">
              receipt_long
            </span>
          </div>
          <p className="text-white/60 text-lg font-bold mb-1">
            Sin ventas registradas
          </p>
          <p className="text-white/40 text-sm font-medium">
            Las transacciones de ventas aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1 h-full">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider">
                  Ref & Fecha
                </th>
                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:table-cell">
                  Productos
                </th>
                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider hidden sm:table-cell">
                  Cliente
                </th>
                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                  Artículos
                </th>
                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                  Total
                </th>
                <th className="py-4 px-4 text-xs font-bold text-white/50 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  {/* Ref & Date */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] text-primary-light">
                          receipt
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-wide font-mono">
                          #{v.ref}
                        </div>
                        <div className="text-xs text-white/50">
                          {formatDate(v.fecha)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Products (hover trigger for fixed popover) */}
                  <td className="py-3 px-4 hidden md:table-cell align-middle">
                    {v.items && v.items.length > 0 ? (
                      <div className="cursor-default">
                        <div className="space-y-0.5">
                          {v.items.length === 1 ? (
                            <div className="font-medium text-white/90 truncate max-w-[200px]">
                              {v.items[0].nombre || "—"}
                            </div>
                          ) : (
                            <>
                              <div className="font-medium text-white/90 text-sm flex items-center gap-1.5">
                                {v.items.length} artículos
                                <span
                                  className={`material-symbols-outlined text-[14px] transition-colors cursor-help ${popoverVenta?.id === v.id ? "text-primary-light" : "text-white/30"}`}
                                  onMouseEnter={(e) => showPopover(e, v)}
                                  onMouseLeave={hidePopover}
                                >
                                  info
                                </span>
                              </div>
                              <div className="text-xs text-white/40 truncate max-w-[200px]">
                                {v.items
                                  .map((it) => it.nombre)
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-white/30 italic">—</span>
                    )}
                  </td>

                  {/* Customer name */}
                  <td className="py-3 px-4 hidden sm:table-cell align-middle">
                    {v.cliente ? (
                      <div className="font-medium text-white/90">
                        {v.cliente.name}
                      </div>
                    ) : (
                      <span className="text-sm text-white/70 font-medium">
                        Usuario Común
                      </span>
                    )}
                  </td>

                  {/* Quantity (total items) */}
                  <td className="py-3 px-4 text-right align-middle">
                    <span className="text-sm font-medium text-white/70 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      {v.items
                        ? v.items.reduce(
                            (sum, it) => sum + (it.cantidad || 0),
                            0,
                          )
                        : 0}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 text-right align-middle">
                    <div className="font-mono font-bold text-white">
                      ${Number(v.total).toFixed(2)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(v)}
                        className="size-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white cursor-pointer hover:bg-sky-500/20 hover:border-sky-400 border border-transparent hover:shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(v.id)}
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

      {/* ── Fixed-position items popover (outside overflow containers) ── */}
      {popoverVenta && popoverVenta.items && (
        <div
          className="fixed z-[9999] min-w-[280px] max-w-[360px] animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: "translate(-50%, -100%)",
          }}
          onMouseEnter={() => clearTimeout(popoverTimeout.current)}
          onMouseLeave={hidePopover}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_12px_rgba(124,58,237,0.1)] p-3">
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2 px-1">
              Detalle de artículos
            </div>
            <div className="space-y-1.5">
              {popoverVenta.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 px-2 py-1.5 rounded-lg bg-black/[0.03] border border-black/5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-black/80 truncate">
                      {item.nombre || "—"}
                    </div>
                    <div className="text-[11px] text-black/40">
                      {item.cantidad} × $
                      {Number(item.precio_venta || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-bold text-black/70 shrink-0">
                    ${Number(item.subtotal || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 px-2">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">
                Total
              </span>
              <span className="text-sm font-mono font-black text-black/90">
                ${Number(popoverVenta.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
