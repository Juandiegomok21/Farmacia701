import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { Medication } from '../types/pharmacy';

interface ScanRxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPrescription: (newMed: Medication) => void;
}

export const ScanRxModal: React.FC<ScanRxModalProps> = ({
  isOpen,
  onClose,
  onAddPrescription,
}) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'verified'>('upload');

  if (!isOpen) return null;

  const handleStartScan = () => {
    setStep('scanning');
    setTimeout(() => {
      setStep('verified');
    }, 1100);
  };

  const handleConfirmAdd = () => {
    const newPrescription: Medication = {
      id: `med-${Date.now()}`,
      name: 'Amoxicilina Trihidrato',
      genericName: 'Amoxil (Genérico)',
      dosage: '500 mg',
      form: 'Cápsula',
      frequency: 'Tres veces al día con comidas',
      timeSlots: ['morning', 'afternoon', 'evening'],
      instructions: 'Tomar 1 cápsula por vía oral cada 8 horas con alimentos. Completar los 10 días del tratamiento.',
      remainingPills: 30,
      totalPills: 30,
      refillsLeft: 0,
      rxNumber: 'RX-701-994102-F',
      prescribedBy: 'Dra. Elena Rostova',
      doctorSpecialty: 'Medicina Interna',
      pharmacy: 'Farmacia 701 Central',
      status: 'active',
      rxRequired: true,
      isVerified: true,
      category: 'Antibiótico',
      color: '#2563eb',
      sideEffects: ['Molestia estomacal leve', 'Náusea leve ocasional'],
      foodInteractions: 'Tomar siempre con alimentos. Completar el ciclo antibiótico.',
    };

    onAddPrescription(newPrescription);
    setStep('upload');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#0f172a]">
                Escáner Inteligente de Recetas
              </h3>
              <p className="text-xs text-[#64748b]">Farmacia 701 · Reconocimiento OCR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'upload' && (
          <div className="mt-4 space-y-3.5">
            <div
              onClick={handleStartScan}
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd5e1] p-6 text-center hover:border-[#2563eb] hover:bg-[#f8faff] transition-all cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb] group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-[#0f172a] mt-2.5">
                Tomar Foto o Subir Receta Médica
              </h4>
              <p className="text-xs text-[#64748b] mt-1 max-w-xs">
                Soporta fotos de cámara, recetas digitales o fotos de frascos (JPG, PNG, PDF).
              </p>
              <button
                type="button"
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-xs"
              >
                <Camera className="h-4 w-4" />
                <span>Simular Escaneo de Receta</span>
              </button>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#eff6ff] p-3 text-xs text-[#1e3a8a] border border-[#bfdbfe]">
              <ShieldCheck className="h-4 w-4 text-[#2563eb] shrink-0 mt-0.5" />
              <span>
                El motor de Farmacia 701 detecta automáticamente cédula médica, dosis e incompatibilidades con tu perfil.
              </span>
            </div>
          </div>
        )}

        {step === 'scanning' && (
          <div className="my-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#2563eb]/20" />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563eb] text-white">
                <Sparkles className="h-6 w-6 animate-spin" />
              </div>
            </div>
            <h4 className="font-heading text-base font-bold text-[#0f172a]">
              Analizando Receta Médica...
            </h4>
            <p className="text-xs text-[#64748b] max-w-xs">
              Extrayendo principio activo, firma médica y posología de Farmacia 701...
            </p>
          </div>
        )}

        {step === 'verified' && (
          <div className="mt-3.5 space-y-3.5">
            <div className="rounded-2xl bg-[#eff6ff] p-3 border border-[#bfdbfe]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1d4ed8]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Receta Verificada y Autenticada con Éxito</span>
              </div>
            </div>

            {/* Extracted Prescription Card */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8faff] p-3.5 text-xs space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748b]">Fármaco Detectado</span>
                  <h4 className="font-heading text-base font-bold text-[#0f172a]">
                    Amoxicilina Trihidrato 500mg
                  </h4>
                  <p className="text-xs text-[#64748b]">Amoxil Genérico · Cápsula</p>
                </div>
                <span className="rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-xs font-semibold text-[#b45309] border border-[#fde68a]">
                  Rx #994102-F
                </span>
              </div>

              <div className="pt-2 border-t border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#64748b]">Instrucciones</span>
                <p className="text-xs font-medium text-[#0f172a] mt-0.5">
                  Tomar 1 cápsula por vía oral cada 8 horas con comida durante 10 días.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e2e8f0]">
                <div>
                  <span className="text-[10px] text-[#64748b]">Médico Emisor</span>
                  <p className="font-semibold text-[#0f172a]">Dra. Elena Rostova</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748b]">Cantidad</span>
                  <p className="font-semibold text-[#0f172a]">30 Cápsulas (10 Días)</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="flex-1 min-h-[44px] h-11 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#64748b] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Escanear Otra
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Añadir a mi Horario</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
