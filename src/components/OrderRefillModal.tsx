import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Truck,
  Building2,
} from 'lucide-react';
import { Medication, RefillOrder } from '../types/pharmacy';

interface OrderRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  initialMedId?: string;
  onPlaceOrder: (order: Partial<RefillOrder>) => void;
}

export const OrderRefillModal: React.FC<OrderRefillModalProps> = ({
  isOpen,
  onClose,
  medications,
  initialMedId,
  onPlaceOrder,
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(
    initialMedId || medications[0]?.id || ''
  );
  const [supplyDuration, setSupplyDuration] = useState<'30' | '90'>('30');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentMed = medications.find((m) => m.id === selectedMedId) || medications[0];
  const copayAmount = supplyDuration === '30' ? 10.0 : 25.0;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder: Partial<RefillOrder> = {
        id: `ORD-701-${Math.floor(100 + Math.random() * 900)}`,
        medicationId: currentMed.id,
        medicationName: currentMed.name,
        dosage: `${currentMed.dosage} (Suministro de ${supplyDuration} días)`,
        orderDate: 'Hace un momento',
        estimatedArrival:
          deliveryMethod === 'delivery'
            ? 'Mañana, antes de 11:30 AM'
            : 'Hoy en 90 minutos (En mostrador)',
        status: 'submitted',
        deliveryType: deliveryMethod,
        pharmacyName: 'Farmacia 701 Hub Central',
        pharmacyAddress: 'Av. Libertador 701, Zona Médica',
        coPay: copayAmount,
        trackingNumber: `ENV-F701-${Math.floor(100000 + Math.random() * 900000)}`,
        timeline: [
          {
            title: 'Solicitud Recibida',
            description: 'Verificada con Plan Platino Farmacia 701',
            time: 'Hace un momento',
            completed: true,
          },
          {
            title: 'Validación por Farmacéutico Clínico',
            description: 'Asignada a la Dra. Sara Jiménez',
            time: 'En proceso',
            completed: false,
          },
          {
            title: 'Dispensación y Sellado Hermético',
            description: 'Inspección con código de barras de seguridad',
            time: 'Pendiente',
            completed: false,
          },
          {
            title:
              deliveryMethod === 'delivery'
                ? 'En Ruta de Entrega Climatizada'
                : 'Listo en Mostrador de Farmacia 701',
            description:
              deliveryMethod === 'delivery'
                ? 'Despacho matutino programado'
                : 'Pasa a recoger al mostrador preferente',
            time: deliveryMethod === 'delivery' ? 'Mañana, 9:00 AM' : 'Hoy, 2:00 PM',
            completed: false,
          },
        ],
      };

      onPlaceOrder(newOrder);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#0f172a]">
                Solicitar Resurtido de Receta
              </h3>
              <p className="text-xs text-[#64748b]">Farmacia 701 · Dispensación Rápida</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleOrderSubmit} className="mt-3.5 space-y-3.5">
          {/* Select Medication */}
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Seleccionar Medicamento
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="h-11 sm:h-12 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs sm:text-sm text-[#0f172a] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden"
            >
              {medications.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.dosage} — {m.refillsLeft} resurtidos disponibles
                </option>
              ))}
            </select>
          </div>

          {/* Supply Duration Switcher */}
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Cantidad de Suministro
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSupplyDuration('30')}
                className={`flex flex-col items-start rounded-xl p-3 border text-left transition-all cursor-pointer ${
                  supplyDuration === '30'
                    ? 'border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]'
                    : 'border-[#cbd5e1] bg-white hover:border-slate-400'
                }`}
              >
                <span className="text-xs font-bold text-[#0f172a]">Suministro 30 Días</span>
                <span className="text-[11px] text-[#64748b] mt-0.5">Tratamiento estándar</span>
                <span className="text-xs font-bold text-[#2563eb] mt-1.5">$10.00 Copago</span>
              </button>

              <button
                type="button"
                onClick={() => setSupplyDuration('90')}
                className={`flex flex-col items-start rounded-xl p-3 border text-left transition-all cursor-pointer ${
                  supplyDuration === '90'
                    ? 'border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]'
                    : 'border-[#cbd5e1] bg-white hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#0f172a]">Suministro 90 Días</span>
                  <span className="rounded-sm bg-[#dbeafe] px-1 text-[9px] font-bold text-[#1d4ed8]">
                    Ahorro
                  </span>
                </div>
                <span className="text-[11px] text-[#64748b] mt-0.5">Mantenimiento trimestral</span>
                <span className="text-xs font-bold text-[#2563eb] mt-1.5">$25.00 Copago</span>
              </button>
            </div>
          </div>

          {/* Fulfillment Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Modalidad de Entrega
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex items-start gap-2.5 rounded-xl p-3 border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'delivery'
                    ? 'border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]'
                    : 'border-[#cbd5e1] bg-white hover:border-slate-400'
                }`}
              >
                <Truck className="h-4 w-4 text-[#2563eb] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#0f172a] block">
                    Envío a Domicilio
                  </span>
                  <span className="text-[11px] text-[#2563eb] font-semibold">GRATIS con control</span>
                  <p className="text-[10px] text-[#64748b] mt-0.5">Mañana antes 11:30 AM</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex items-start gap-2.5 rounded-xl p-3 border text-left transition-all cursor-pointer ${
                  deliveryMethod === 'pickup'
                    ? 'border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]'
                    : 'border-[#cbd5e1] bg-white hover:border-slate-400'
                }`}
              >
                <Building2 className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#0f172a] block">
                    Recoger en Tienda
                  </span>
                  <span className="text-[11px] text-[#0284c7] font-semibold">Listo en 90 min</span>
                  <p className="text-[10px] text-[#64748b] mt-0.5">Farmacia 701 Central</p>
                </div>
              </button>
            </div>
          </div>

          {/* Insurance Billing Verification Card */}
          <div className="rounded-2xl bg-[#f8faff] p-3 border border-[#e2e8f0] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#64748b]">
              <span>Plan de Salud</span>
              <span className="font-semibold text-[#0f172a]">Plan Platino Rx 701</span>
            </div>
            <div className="flex items-center justify-between text-[#64748b]">
              <span>Farmacia de Despacho</span>
              <span className="font-medium text-[#0f172a]">Farmacia 701 Central</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
              <span className="font-bold text-[#0f172a]">Copago Total del Paciente</span>
              <span className="font-heading font-bold text-base text-[#2563eb]">
                ${copayAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
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
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Verificando con Farmacia 701...' : 'Confirmar Resurtido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
