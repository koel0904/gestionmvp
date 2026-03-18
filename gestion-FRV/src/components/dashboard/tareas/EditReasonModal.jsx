import { useState } from "react";
import PropTypes from "prop-types";

export default function EditReasonModal({ onClose, onSubmit, initialReason }) {
  const [reason, setReason] = useState(initialReason || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">edit_note</span>
            Detalles del Fallo
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">
              Motivo del problema
            </label>
            <textarea 
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explica detalladamente por qué no se pudo completar la tarea..."
              rows={8}
              className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none text-sm resize-y min-h-[160px] focus:border-amber-500/50 focus:bg-white/5 transition-all custom-scrollbar"
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-amber-500 flex items-center justify-center gap-2 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

EditReasonModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialReason: PropTypes.string,
};
