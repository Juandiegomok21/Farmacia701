import React, { useState } from 'react';
import { X, Pill, Clock, Check } from 'lucide-react';
import { Medication } from '../types/pharmacy';

interface LogDoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  initialMedId?: string;
  onConfirmDose: (medId: string, time: string, note?: string) => void;
}

export const LogDoseModal: React.FC<LogDoseModalProps> = ({
  isOpen,
  onClose,
  medications,
  initialMedId,
  onConfirmDose,
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(
    initialMedId || medications[0]?.id || ''
  );
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const currentMed = medications.find((m) => m.id === selectedMedId) || medications[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDose(selectedMedId, time, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#0f172a]">
                Registrar Toma de Medicamento
              </h3>
              <p className="text-xs text-[#64748b]">Farmacia 701 · Control de Adherencia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3.5">
          {/* Select Medication */}
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Seleccionar Medicamento
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs sm:text-sm text-[#0f172a] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden"
            >
              {medications.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.dosage}) — {m.frequency}
                </option>
              ))}
            </select>
          </div>

          {/* Medication Summary Pill */}
          {currentMed && (
            <div className="rounded-xl bg-[#f8faff] p-2.5 text-xs border border-[#e2e8f0]">
              <p className="font-semibold text-[#0f172a]">{currentMed.instructions}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                Inventario tras esta toma: {Math.max(0, currentMed.remainingPills - 1)} tabletas
              </p>
            </div>
          )}

          {/* Time Taken */}
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Hora de la Toma
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="ej. 8:15 AM"
                className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white pl-10 pr-3 text-xs sm:text-sm text-[#0f172a] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Nota Clínica (Opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ej. Tomada con fruta y un vaso con agua"
              className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] h-11 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#64748b] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Confirmar Toma</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
