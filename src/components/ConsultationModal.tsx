import React, { useState } from 'react';
import {
  X,
  Video,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (slot: string, type: 'video' | 'phone') => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  const [callType, setCallType] = useState<'video' | 'phone'>('video');
  const [selectedDate, setSelectedDate] = useState('Mañana, 4 Nov');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [reason, setReason] = useState('Revisión de medicamentos y dudas sobre efectos secundarios');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const timeSlots = ['9:00 AM', '10:30 AM', '1:15 PM', '3:45 PM', '5:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      onConfirmBooking(`${selectedDate} a las ${selectedTime}`, callType);
      setIsBooked(false);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#0f172a]">
                Agendar Teleconsulta Clínica
              </h3>
              <p className="text-xs text-[#64748b]">Dra. Sara Jiménez · Farmacia 701</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#2563eb] animate-bounce" />
            <h4 className="font-heading text-lg font-bold text-[#0f172a]">
              ¡Teleconsulta Agendada con Éxito!
            </h4>
            <p className="text-xs text-[#64748b] max-w-xs mx-auto">
              Tu cita quedó reservada para {selectedDate} a las {selectedTime}. Se ha enviado el enlace de videollamada segura a tu correo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3.5 space-y-3.5">
            {/* Consultation Format */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Modalidad de la Sesión
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCallType('video')}
                  className={`flex items-center justify-center gap-2 rounded-xl p-2.5 sm:p-3 border text-xs font-semibold transition-all cursor-pointer ${
                    callType === 'video'
                      ? 'border-[#2563eb] bg-[#eff6ff] text-[#2563eb]'
                      : 'border-[#cbd5e1] text-[#64748b] hover:bg-slate-50'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>Videollamada</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCallType('phone')}
                  className={`flex items-center justify-center gap-2 rounded-xl p-2.5 sm:p-3 border text-xs font-semibold transition-all cursor-pointer ${
                    callType === 'phone'
                      ? 'border-[#2563eb] bg-[#eff6ff] text-[#2563eb]'
                      : 'border-[#cbd5e1] text-[#64748b] hover:bg-slate-50'
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  <span>Llamada Telefónica</span>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Fecha de la Cita
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Mañana, 4 Nov', 'Jue, 5 Nov', 'Vie, 6 Nov'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`rounded-xl p-2 text-xs font-semibold border text-center transition-all cursor-pointer ${
                      selectedDate === d
                        ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-xs'
                        : 'border-[#cbd5e1] text-[#334155] hover:border-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Horarios Disponibles
              </label>
              <div className="flex flex-wrap gap-1.5">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                      selectedTime === t
                        ? 'border-[#2563eb] bg-[#eff6ff] text-[#2563eb]'
                        : 'border-[#e2e8f0] text-[#64748b] hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Focus Topic */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Motivo de Consulta
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-10 sm:h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden"
              />
            </div>

            {/* Coverage note */}
            <div className="flex items-center gap-2 rounded-xl bg-[#f8faff] p-2.5 text-xs text-[#64748b] border border-[#e2e8f0]">
              <ShieldCheck className="h-4 w-4 text-[#2563eb] shrink-0" />
              <span>100% Cubierto con tu Plan Platino en Farmacia 701 ($0 Copago).</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
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
                <Calendar className="h-4 w-4" />
                <span>Confirmar Cita</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
