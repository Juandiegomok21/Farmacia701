import React from 'react';
import { Pill, Check, Clock, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { Medication } from '../types/pharmacy';

interface MedicationCardProps {
  medication: Medication;
  onLogDose: (medId: string) => void;
  onOrderRefill: (medId: string) => void;
  onSelectDetails?: (medication: Medication) => void;
  isTakenToday?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onLogDose,
  onOrderRefill,
  onSelectDetails,
  isTakenToday = false,
}) => {
  const isLowSupply = medication.remainingPills <= 10;
  const supplyPercent = Math.min(
    100,
    Math.round((medication.remainingPills / medication.totalPills) * 100)
  );

  return (
    <div className="w-full flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs transition-all duration-200 hover:border-[#cbd5e1] hover:shadow-md">
      {/* Top: Drug Name, Dosage metadata & Status Chips */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base font-bold tracking-tight text-[#0f172a] truncate">
              {medication.name}
            </h3>
            <p className="text-xs text-[#64748b] truncate mt-0.5">
              {medication.genericName}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-[#64748b]">
              <span className="font-semibold text-[#0f172a]">{medication.dosage}</span>
              <span>·</span>
              <span>{medication.form}</span>
              <span>·</span>
              <span className="font-mono text-[11px] text-[#64748b]">{medication.rxNumber}</span>
            </div>
          </div>

          {/* Right-aligned Status Chip */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {medication.rxRequired ? (
              <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#b45309] border border-[#fde68a]">
                Receta
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] font-bold text-[#1d4ed8] border border-[#bfdbfe]">
                Venta Libre
              </span>
            )}

            {medication.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
                <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                Verificado
              </span>
            )}
          </div>
        </div>

        {/* Center Section: Scheduling rules and dosage instructions */}
        <div className="mt-3 rounded-xl bg-[#f8faff] p-3 border border-[#e2e8f0]">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" />
            <div className="text-xs min-w-0">
              <span className="font-semibold text-[#0f172a] block truncate">{medication.frequency}</span>
              <p className="mt-0.5 text-[#334155] leading-relaxed text-[11px] line-clamp-2">
                {medication.instructions}
              </p>
            </div>
          </div>

          {/* Low inventory alert if applicable */}
          {isLowSupply && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#fff1f2] px-2 py-1 text-[11px] font-semibold text-[#be123c] border border-[#fecdd3]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Poco inventario: quedan {medication.remainingPills} tabletas</span>
            </div>
          )}
        </div>

        {/* Inventory Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-[#64748b]">
            <span>Suministro disponible</span>
            <span className="font-medium text-[#0f172a]">
              {medication.remainingPills} de {medication.totalPills} ({supplyPercent}%)
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isLowSupply ? 'bg-[#d97706]' : 'bg-[#2563eb]'
              }`}
              style={{ width: `${supplyPercent}%` }}
            />
          </div>
        </div>

        {/* Prescriber & Pharmacy footnote */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748b]">
          <span className="truncate max-w-[170px]">Por {medication.prescribedBy}</span>
          {onSelectDetails && (
            <button
              onClick={() => onSelectDetails(medication)}
              className="inline-flex items-center text-[#2563eb] font-semibold hover:underline cursor-pointer shrink-0"
            >
              Detalles <ChevronRight className="h-3 w-3 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons: Full width 2-column grid in mobile */}
      <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] grid grid-cols-2 gap-2 w-full">
        {/* Button 1: Refill */}
        <button
          onClick={() => onOrderRefill(medication.id)}
          className="w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-1 rounded-xl bg-[#eff6ff] px-2 text-xs font-semibold text-[#2563eb] border border-[#2563eb]/20 hover:bg-[#dbeafe] active:scale-[0.98] transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Resurtir ({medication.refillsLeft})</span>
        </button>

        {/* Button 2: Log Dose */}
        <button
          onClick={() => onLogDose(medication.id)}
          className={`w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-1 rounded-xl px-2 text-xs font-semibold text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
            isTakenToday
              ? 'bg-[#1d4ed8] hover:bg-[#1e40af]'
              : 'bg-[#2563eb] hover:bg-[#1d4ed8] focus:ring-3 focus:ring-[#2563eb]/30'
          }`}
        >
          {isTakenToday ? (
            <>
              <Check className="h-4 w-4 stroke-[2.5] shrink-0" />
              <span>Registrada</span>
            </>
          ) : (
            <>
              <Pill className="h-4 w-4 shrink-0" />
              <span>Registrar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
