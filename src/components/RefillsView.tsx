import React, { useState } from 'react';
import {
  RefreshCw,
  Truck,
  Building2,
  CheckCircle2,
  Package,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  FileUp,
  MapPin,
  Phone,
  CreditCard,
} from 'lucide-react';
import { Medication, RefillOrder } from '../types/pharmacy';

interface RefillsViewProps {
  medications: Medication[];
  orders: RefillOrder[];
  onOpenOrderRefill: (medId: string) => void;
  onOpenScanRx: () => void;
  onSelectOrderDetails?: (order: RefillOrder) => void;
}

export const RefillsView: React.FC<RefillsViewProps> = ({
  medications,
  orders,
  onOpenOrderRefill,
  onOpenScanRx,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<RefillOrder | null>(orders[0] || null);

  const refillNeededMeds = medications.filter(
    (m) => m.remainingPills <= 15 || m.status === 'refill_needed'
  );

  return (
    <div className="w-full flex flex-col gap-4 pb-24">
      {/* 1. Header Banner: continuous vertical flow on mobile */}
      <section className="w-full flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8faff] to-[#eff6ff] p-4 shadow-xs">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
              <ShieldCheck className="h-3 w-3" />
              Dispensario Oficial
            </span>
            <span className="text-xs text-[#64748b]">Farmacia 701</span>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Resurtidos y Envíos
          </h1>
          <p className="text-xs text-[#334155] leading-relaxed">
            Solicita resurtidos automáticos y rastrea la entrega climatizada a tu domicilio.
          </p>
        </div>

        {/* Full width button in mobile */}
        <button
          onClick={onOpenScanRx}
          className="w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#2563eb] border border-[#e2e8f0] hover:bg-[#f8faff] shadow-xs cursor-pointer transition-all active:scale-[0.98]"
        >
          <FileUp className="h-4 w-4" />
          <span>Subir Nueva Receta</span>
        </button>
      </section>

      {/* 2. Active Delivery Tracking Card */}
      {selectedOrder && (
        <section className="w-full flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-1.5 w-full pb-3 border-b border-[#f1f5f9]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
                <Truck className="h-3 w-3" />
                Pedido · {selectedOrder.id}
              </span>
              <span className="text-[10px] text-[#64748b]">{selectedOrder.orderDate}</span>
            </div>

            <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a] truncate">
              {selectedOrder.medicationName} ({selectedOrder.dosage})
            </h2>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#64748b]">Entrega Estimada:</span>
              <span className="font-bold text-[#2563eb]">{selectedOrder.estimatedArrival}</span>
            </div>
          </div>

          {/* Stepper Timeline: vertical flow on mobile (grid-cols-1), 4-cols on desktop */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3">
            {selectedOrder.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 sm:flex-col sm:gap-1.5">
                <div
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full shrink-0 text-xs font-bold transition-all ${
                    step.completed
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'border-2 border-[#cbd5e1] bg-white text-[#64748b]'
                  }`}
                >
                  {step.completed ? <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" /> : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-xs font-semibold ${
                      step.completed ? 'text-[#0f172a]' : 'text-[#64748b]'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-[#64748b] leading-tight mt-0.5">
                    {step.description}
                  </p>
                  <span className="text-[9px] font-mono font-medium text-[#2563eb] mt-0.5 block">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer info: full-width stacked */}
          <div className="w-full flex flex-col gap-1.5 rounded-xl bg-[#f8faff] p-2.5 text-xs text-[#64748b] border border-[#e2e8f0]">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="h-3.5 w-3.5 text-[#2563eb] shrink-0" />
              <span className="truncate">{selectedOrder.pharmacyName}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#e2e8f0]">
              <span className="font-semibold text-[#0f172a]">
                Copago: ${selectedOrder.coPay.toFixed(2)}
              </span>
              {selectedOrder.trackingNumber && (
                <span className="font-mono text-[10px] text-[#2563eb] font-semibold">
                  {selectedOrder.trackingNumber}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Action Required: Prescriptions Needing Refill: 1 column on mobile (grid-cols-1) */}
      <section className="w-full flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-[#d97706]" />
            <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
              Por Resurtir ({refillNeededMeds.length})
            </h2>
          </div>
          <span className="text-[11px] text-[#64748b]">Menos de 15 tomas</span>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {refillNeededMeds.map((med) => (
            <div
              key={med.id}
              className="w-full flex flex-col justify-between rounded-2xl border border-[#fde68a] bg-[#fffdfa] p-3.5 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#b45309] border border-[#fde68a]">
                      Quedan {med.remainingPills} tabletas
                    </span>
                    <h3 className="font-heading text-sm font-bold text-[#0f172a] mt-1 truncate">
                      {med.name}
                    </h3>
                    <p className="text-[10px] text-[#64748b] truncate">
                      {med.dosage} · {med.instructions}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#64748b]">Resurtidos</span>
                    <p className="font-heading font-bold text-sm text-[#0f172a]">
                      {med.refillsLeft}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-[#64748b] bg-white rounded-lg p-2 border border-[#f1f5f9]">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-[#2563eb]" />
                    <span>Copago est.: <strong>$10.00</strong></span>
                  </div>
                  <span className="text-[10px] font-mono text-[#64748b]">{med.rxNumber}</span>
                </div>
              </div>

              {/* Full-width 1-tap refill button */}
              <button
                onClick={() => onOpenOrderRefill(med.id)}
                className="w-full min-h-[44px] h-11 mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Pedir Resurtido en 1-Clic</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Past Orders History */}
      <section className="w-full flex flex-col gap-2.5">
        <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
          Historial de Pedidos
        </h2>

        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white divide-y divide-[#f1f5f9] overflow-hidden shadow-xs">
          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className="w-full flex items-center justify-between p-3 hover:bg-[#f8faff] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                    ord.status === 'completed'
                      ? 'bg-[#eff6ff] text-[#1d4ed8]'
                      : 'bg-[#eff6ff] text-[#2563eb]'
                  }`}
                >
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-[#0f172a] truncate">
                    {ord.medicationName}
                  </h4>
                  <p className="text-[10px] text-[#64748b] truncate">
                    {ord.dosage} · Copago: ${ord.coPay.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      ord.status === 'completed'
                        ? 'bg-[#eff6ff] text-[#1d4ed8]'
                        : 'bg-[#eff6ff] text-[#2563eb]'
                    }`}
                  >
                    {ord.status === 'completed' ? 'Entregado' : 'En Ruta'}
                  </span>
                  <p className="text-[9px] text-[#64748b] mt-0.5">{ord.orderDate}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Support Card: Full width in mobile */}
      <section className="w-full flex flex-col gap-2.5 rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb] shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-[#0f172a]">
              Farmacia 701 Central
            </h3>
            <p className="text-[11px] text-[#64748b]">
              Av. Libertador 701 · Abierto de 7:00 AM a 11:00 PM
            </p>
          </div>
        </div>

        <a
          href="tel:701701701"
          className="w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors"
        >
          <Phone className="h-3.5 w-3.5 text-[#2563eb]" />
          <span>Llamar al (701) 701-7010</span>
        </a>
      </section>
    </div>
  );
};
