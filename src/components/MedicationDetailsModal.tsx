import React from 'react';
import {
  X,
  Pill,
  AlertTriangle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Medication } from '../types/pharmacy';

interface MedicationDetailsModalProps {
  medication: Medication | null;
  onClose: () => void;
  onOrderRefill: (medId: string) => void;
  onLogDose: (medId: string) => void;
}

export const MedicationDetailsModal: React.FC<MedicationDetailsModalProps> = ({
  medication,
  onClose,
  onOrderRefill,
  onLogDose,
}) => {
  if (!medication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#f1f5f9]">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb] shrink-0 mt-0.5">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-base sm:text-lg font-bold text-[#0f172a]">
                  {medication.name}
                </h3>
                {medication.rxRequired && (
                  <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#b45309] border border-[#fde68a]">
                    Receta Requerida
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748b]">
                {medication.genericName} · {medication.dosage} · {medication.form}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-3.5 space-y-3.5 text-xs">
          {/* Instructions Box */}
          <div className="rounded-2xl bg-[#f8faff] p-3.5 border border-[#e2e8f0]">
            <div className="flex items-center gap-2 text-[#2563eb] font-bold">
              <Clock className="h-4 w-4" />
              <span>Pauta y Posología de Toma</span>
            </div>
            <p className="font-semibold text-sm text-[#0f172a] mt-1.5">
              {medication.frequency}
            </p>
            <p className="text-[#334155] mt-1 leading-relaxed">
              {medication.instructions}
            </p>
          </div>

          {/* Food interactions / Precautions */}
          {medication.foodInteractions && (
            <div className="rounded-2xl bg-[#fffbeb] p-3.5 border border-[#fde68a]">
              <div className="flex items-center gap-2 text-[#b45309] font-bold">
                <AlertTriangle className="h-4 w-4" />
                <span>Interacción con Alimentos / Precaución</span>
              </div>
              <p className="text-[#92400e] mt-1 leading-relaxed">
                {medication.foodInteractions}
              </p>
            </div>
          )}

          {/* Clinical Prescriber & Pharmacy info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[#e2e8f0] p-2.5 sm:p-3">
              <span className="text-[10px] sm:text-[11px] text-[#64748b]">Médico Prescriptor</span>
              <p className="font-semibold text-[#0f172a] mt-0.5">{medication.prescribedBy}</p>
              <p className="text-[10px] text-[#64748b]">{medication.doctorSpecialty}</p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] p-2.5 sm:p-3">
              <span className="text-[10px] sm:text-[11px] text-[#64748b]">Farmacia y Folio Rx</span>
              <p className="font-semibold text-[#0f172a] mt-0.5 font-mono">{medication.rxNumber}</p>
              <p className="text-[10px] text-[#64748b]">{medication.pharmacy}</p>
            </div>
          </div>

          {/* Side Effects */}
          <div>
            <h4 className="font-semibold text-[#0f172a] mb-1">
              Efectos Secundarios Posibles (Comunes)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {medication.sideEffects.map((effect, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-medium text-[#475569] border border-[#e2e8f0]"
                >
                  {effect}
                </span>
              ))}
            </div>
          </div>

          {/* Inventory state */}
          <div className="flex items-center justify-between rounded-xl bg-[#f8faff] p-3 border border-[#e2e8f0]">
            <div>
              <span className="text-[11px] text-[#64748b]">Inventario en Casa</span>
              <p className="font-bold text-xs sm:text-sm text-[#0f172a]">
                {medication.remainingPills} de {medication.totalPills} dosis disponibles
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#64748b]">Resurtidos Autorizados</span>
              <p className="font-bold text-xs sm:text-sm text-[#2563eb]">
                {medication.refillsLeft} resurtidos restantes
              </p>
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center gap-2.5">
          <button
            onClick={() => {
              onOrderRefill(medication.id);
              onClose();
            }}
            className="flex-1 min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#eff6ff] text-xs font-semibold text-[#2563eb] border border-[#2563eb]/25 hover:bg-[#dbeafe] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Resurtir Receta</span>
          </button>

          <button
            onClick={() => {
              onLogDose(medication.id);
              onClose();
            }}
            className="flex-1 min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-colors cursor-pointer"
          >
            <Pill className="h-3.5 w-3.5" />
            <span>Registrar Toma</span>
          </button>
        </div>
      </div>
    </div>
  );
};
