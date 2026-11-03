import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  X,
  Apple,
  Wine,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { Medication, DrugInteraction, PatientProfile } from '../types/pharmacy';
import { knownDrugInteractions } from '../data/mockData';

interface DrugSafetyViewProps {
  medications: Medication[];
  patient: PatientProfile;
  onConsultPharmacist: () => void;
}

export const DrugSafetyView: React.FC<DrugSafetyViewProps> = ({
  medications,
  patient,
  onConsultPharmacist,
}) => {
  // Currently selected drugs in the safety checker
  const [selectedMeds, setSelectedMeds] = useState<string[]>([
    'Atorvastatina Cálcica',
    'Pomelo (Toronja) / Inhibidores CYP3A4',
  ]);

  const otcOptions = [
    'Pomelo (Toronja) / Inhibidores CYP3A4',
    'AINEs (Ibuprofeno, Naproxeno)',
    'Cloruro de Potasio / Suplementos de Potasio',
    'Hierba de San Juan (Hipérico)',
    'Consumo Excesivo de Alcohol',
    'Paracetamol / Acetaminofén',
    'Omeprazol',
    'Aspirina 81mg',
  ];

  const handleToggleMed = (drugName: string) => {
    if (selectedMeds.includes(drugName)) {
      if (selectedMeds.length > 1) {
        setSelectedMeds(selectedMeds.filter((m) => m !== drugName));
      }
    } else {
      setSelectedMeds([...selectedMeds, drugName]);
    }
  };

  // Evaluate interactions among selected medications
  const activeInteractions: DrugInteraction[] = [];
  knownDrugInteractions.forEach((interaction) => {
    const hasAll = interaction.drugs.every((d) => selectedMeds.includes(d));
    if (hasAll) {
      activeInteractions.push(interaction);
    }
  });

  return (
    <div className="w-full flex flex-col gap-4 pb-24">
      {/* 1. Safety Header: continuous vertical flow on mobile */}
      <section className="w-full flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8faff] to-[#eff6ff] p-4 shadow-xs">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
              <ShieldCheck className="h-3 w-3" />
              Seguridad Farmacia 701
            </span>
            <span className="text-xs text-[#64748b]">Detección de Contraindicaciones</span>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Seguridad e Interacciones
          </h1>
          <p className="text-xs text-[#334155] leading-relaxed">
            Comprueba tus medicamentos antes de combinarlos con analgésicos de venta libre o alimentos.
          </p>
        </div>

        {/* Full width button in mobile */}
        <button
          onClick={onConsultPharmacist}
          className="w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Stethoscope className="h-4 w-4" />
          <span>Consultar con Farmacéutico</span>
        </button>
      </section>

      {/* 2. Patient Allergy Cross-Check Guard */}
      <section className="w-full rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-3.5">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="h-5 w-5 text-[#dc2626] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-xs sm:text-sm font-bold text-[#991b1b]">
              Filtro Activo de Alergias
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#b91c1c] mt-0.5">
              Validamos automáticamente cada dispensación contra tu historial clínico:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {patient.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[10px] font-semibold text-[#b91c1c] border border-[#fca5a5] shadow-xs"
                >
                  <AlertTriangle className="h-2.5 w-2.5 text-[#dc2626]" />
                  {allergy}
                </span>
              ))}
              <span className="inline-flex items-center rounded-lg bg-[#eff6ff] px-2 py-0.5 text-[10px] font-medium text-[#1d4ed8] border border-[#bfdbfe]">
                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                Sin conflictos actuales
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Interaction Simulator */}
      <section className="w-full flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
        <div>
          <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
            Simulador de Combinación
          </h2>
          <p className="text-[11px] text-[#64748b]">
            Selecciona sustancias para verificar riesgos de interacción:
          </p>
        </div>

        {/* Selected Drugs Box */}
        <div className="w-full rounded-xl bg-[#f8faff] p-2.5 border border-[#e2e8f0]">
          <span className="text-[11px] font-semibold text-[#0f172a] block mb-1.5">
            Sustancias Seleccionadas ({selectedMeds.length}):
          </span>
          <div className="flex flex-wrap gap-1">
            {selectedMeds.map((med) => (
              <span
                key={med}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-2 py-0.5 text-[11px] font-semibold text-[#0f172a] border border-[#cbd5e1]"
              >
                <span className="truncate max-w-[200px]">{med}</span>
                <button
                  onClick={() => handleToggleMed(med)}
                  className="rounded-full p-0.5 text-[#64748b] hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  title="Eliminar"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Quick Add Buttons: Wrapped cleanly */}
        <div className="w-full">
          <span className="text-[11px] font-medium text-[#64748b] block mb-1.5">
            Toca para agregar o quitar:
          </span>
          <div className="flex flex-wrap gap-1">
            {medications.map((m) => {
              const isSelected = selectedMeds.includes(m.name);
              return (
                <button
                  key={m.id}
                  onClick={() => handleToggleMed(m.name)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#f8faff] text-[#334155] border border-[#e2e8f0] hover:bg-slate-100'
                  }`}
                >
                  <Plus className="h-3 w-3" />
                  <span>{m.name}</span>
                </button>
              );
            })}

            {otcOptions.map((otc) => {
              const isSelected = selectedMeds.includes(otc);
              return (
                <button
                  key={otc}
                  onClick={() => handleToggleMed(otc)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0284c7] text-white'
                      : 'bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] hover:bg-slate-200'
                  }`}
                >
                  <Plus className="h-3 w-3" />
                  <span>{otc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interaction Results Output */}
        <div className="w-full pt-1">
          {activeInteractions.length > 0 ? (
            <div className="space-y-2.5 w-full">
              <span className="font-heading text-xs font-bold text-[#dc2626] block">
                {activeInteractions.length} Interacción de Relevancia Detectada:
              </span>

              {activeInteractions.map((act) => {
                const isSevere = act.severity === 'severe';
                return (
                  <div
                    key={act.id}
                    className={`w-full rounded-2xl p-3 border transition-all ${
                      isSevere
                        ? 'bg-[#fff5f5] border-[#fecaca]'
                        : 'bg-[#fffbeb] border-[#fde68a]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isSevere
                            ? 'bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5]'
                            : 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a]'
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {isSevere ? 'Contraindicación Severa' : 'Advertencia'}
                      </span>
                      <span className="text-[9px] font-mono text-[#64748b]">
                        {act.mechanism}
                      </span>
                    </div>

                    <div className="mt-1.5">
                      <h4 className="font-heading text-xs font-bold text-[#0f172a]">
                        {act.drugs.join(' + ')}
                      </h4>
                      <p className="text-[11px] text-[#334155] mt-0.5 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="mt-2 rounded-xl bg-white/80 p-2 border border-black/5">
                      <div className="flex items-start gap-1.5">
                        <Info className="h-3.5 w-3.5 text-[#2563eb] shrink-0 mt-0.5" />
                        <div className="text-[11px]">
                          <span className="font-bold text-[#2563eb]">
                            Recomendación Farmacia 701:
                          </span>
                          <p className="text-[#1e293b] mt-0.5">
                            {act.clinicalAction}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-[#eff6ff] p-4 border border-[#bfdbfe] text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-[#2563eb]" />
              <h4 className="font-heading text-xs sm:text-sm font-bold text-[#1d4ed8] mt-1.5">
                Sin Interacciones Severas
              </h4>
              <p className="text-[11px] text-[#2563eb] mt-0.5 max-w-xs mx-auto">
                No se encontraron contraindicaciones graves entre las sustancias seleccionadas.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Food Advisories: 1 column on mobile (grid-cols-1), 2 on desktop (sm:grid-cols-2) */}
      <section className="w-full flex flex-col gap-2.5">
        <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
          Consejos Clínicos con Alimentos
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fffbeb] text-[#d97706] shrink-0">
                <Apple className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-[#fef3c7] px-2 py-0.5 text-[9px] font-bold text-[#b45309]">
                  Pomelo / Toronja
                </span>
                <h4 className="text-xs font-semibold text-[#0f172a] mt-1">
                  Atorvastatina y Cítricos
                </h4>
                <p className="text-[10px] text-[#64748b] mt-0.5 leading-relaxed">
                  Inhibe la absorción hepática y puede triplicar los niveles en sangre. Evitar por completo.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fee2e2] text-[#dc2626] shrink-0">
                <Wine className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-[#fee2e2] px-2 py-0.5 text-[9px] font-bold text-[#dc2626]">
                  Alcohol
                </span>
                <h4 className="text-xs font-semibold text-[#0f172a] mt-1">
                  Metformina y Acidosis Láctica
                </h4>
                <p className="text-[10px] text-[#64748b] mt-0.5 leading-relaxed">
                  El consumo alcohólico con metformina eleva el peligro de acidosis láctica. Tomar con alimentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
