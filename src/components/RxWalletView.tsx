import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  User,
  Heart,
  Activity,
  Calendar,
  AlertTriangle,
  Building,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { PatientProfile, Medication } from '../types/pharmacy';

interface RxWalletViewProps {
  patient: PatientProfile;
  medications: Medication[];
}

export const RxWalletView: React.FC<RxWalletViewProps> = ({ patient, medications }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportPDF = () => {
    // Generate clean text/medical export report
    const report = `
==================================================
EXPEDIENTE DE MEDICACIÓN Y TARJETA RX - FARMACIA 701
Fecha de Emisión: ${new Date().toLocaleDateString('es-ES')}
Paciente: ${patient.name} (${patient.dob})
==================================================

1. DATOS GENERALES DEL PACIENTE
- Grupo Sanguíneo: ${patient.bloodType}
- Peso: ${patient.weightKg} kg | Altura: ${patient.heightCm} cm
- Médico Prescriptor Principal: ${patient.primaryDoctor}
- Consultorio / Clínica: ${patient.clinicAddress}

2. ALERGIAS Y SENSIBILIDADES DOCUMENTADAS
${patient.allergies.map((a) => `- [!] ${a}`).join('\n')}

3. AFILIACIÓN Y SEGURO DE RECETA
- Aseguradora: ${patient.insuranceProvider}
- No. de Afiliado: ${patient.memberId}
- RxBIN: ${patient.rxBin}
- RxPCN: ${patient.rxPcn}
- RxGroup: ${patient.rxGroup}
- Nivel de Copago: $${patient.tierCoPay.toFixed(2)} USD

4. TRATAMIENTOS ACTIVOS DISPENSADOS (${medications.length} medicamentos)
${medications
  .map(
    (m, idx) =>
      `${idx + 1}. ${m.name} (${m.dosage}) - ${m.form}
   No. Receta: ${m.rxNumber} | Resurtidos Restantes: ${m.refillsLeft} | Saldo: ${m.remainingPills} tabletas
   Instrucciones: ${m.instructions}
   Médico: ${m.prescribedBy}`
  )
  .join('\n\n')}

Certificado por el Departamento Clínico de Farmacia 701
Especialista Responsable: Dra. Sara Jiménez, Farmacéutica Clínica (BCPS)
==================================================
    `.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Farmacia701_Expediente_${patient.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-24">
      {/* 1. Wallet Banner: continuous vertical flow on mobile */}
      <section className="w-full flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8faff] to-[#eff6ff] p-4 shadow-xs">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
              <ShieldCheck className="h-3 w-3" />
              Pase Digital Farmacia 701
            </span>
            <span className="text-xs text-[#64748b]">2026–2027</span>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Tarjeta Digital y Expediente
          </h1>
          <p className="text-xs text-[#334155] leading-relaxed">
            Credencial oficial de farmacia con códigos de facturación y registro de alergias.
          </p>
        </div>

        {/* Full width button in mobile */}
        <button
          onClick={handleExportPDF}
          className="w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>¡Expediente Descargado!</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Descargar Expediente Médico</span>
            </>
          )}
        </button>
      </section>

      {/* 2. Digital Health Insurance Card: full-width on mobile */}
      <section className="relative overflow-hidden w-full rounded-2xl sm:rounded-3xl border border-[#1d4ed8]/30 bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#0284c7] p-4 sm:p-5 text-white shadow-md">
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
          {/* Card Top */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5 text-[#93c5fd]" />
                <span className="font-heading text-sm sm:text-base font-bold tracking-tight">
                  {patient.insuranceProvider}
                </span>
              </div>
              <span className="text-[10px] text-white/80">
                Programa Farmacia 701
              </span>
            </div>

            <span className="rounded-xl bg-white/15 px-2 py-0.5 text-[10px] font-mono font-semibold backdrop-blur-md border border-white/20 shrink-0">
              COPAGO $10.00
            </span>
          </div>

          {/* Card Middle: Member Name & ID */}
          <div className="my-2.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">
              Titular de la Receta
            </span>
            <p className="font-heading text-base sm:text-lg font-bold tracking-wide">
              {patient.name}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono text-xs sm:text-sm tracking-widest text-[#bfdbfe]">
                {patient.memberId}
              </span>
              <button
                onClick={() => copyToClipboard(patient.memberId, 'memberId')}
                className="rounded-md p-1 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Copiar Afiliado"
              >
                {copiedField === 'memberId' ? (
                  <Check className="h-3 w-3 text-[#93c5fd]" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>

          {/* Card Bottom: Telemetry Routing numbers */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-2">
            <div>
              <span className="text-[9px] text-white/70 uppercase">RxBIN</span>
              <p className="font-mono text-xs font-bold text-white">{patient.rxBin}</p>
            </div>
            <div>
              <span className="text-[9px] text-white/70 uppercase">RxPCN</span>
              <p className="font-mono text-xs font-bold text-white">{patient.rxPcn}</p>
            </div>
            <div>
              <span className="text-[9px] text-white/70 uppercase">RxGroup</span>
              <p className="font-mono text-xs font-bold text-white">{patient.rxGroup}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Patient Vitals: Maximum 2 columns on mobile (grid-cols-2), 4 on desktop (sm:grid-cols-4) */}
      <section className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#64748b]">
            <Heart className="h-3.5 w-3.5 text-[#dc2626]" />
            <span className="text-[11px] font-semibold text-[#0f172a]">Grupo Sanguíneo</span>
          </div>
          <p className="font-heading text-sm sm:text-base font-bold text-[#0f172a] mt-1">
            {patient.bloodType}
          </p>
          <span className="text-[10px] text-[#2563eb] font-semibold block truncate">Donante Universal</span>
        </div>

        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#64748b]">
            <Activity className="h-3.5 w-3.5 text-[#2563eb]" />
            <span className="text-[11px] font-semibold text-[#0f172a]">Signos Vitales</span>
          </div>
          <p className="font-heading text-sm sm:text-base font-bold text-[#0f172a] mt-1">
            118 / 76
          </p>
          <span className="text-[10px] text-[#2563eb] font-semibold block truncate">Presión Óptima</span>
        </div>

        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#64748b]">
            <User className="h-3.5 w-3.5 text-[#0284c7]" />
            <span className="text-[11px] font-semibold text-[#0f172a]">Parámetros</span>
          </div>
          <p className="font-heading text-sm sm:text-base font-bold text-[#0f172a] mt-1">
            {patient.weightKg} kg
          </p>
          <span className="text-[10px] text-[#64748b] block truncate">IMC: 23.4 (Normal)</span>
        </div>

        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#64748b]">
            <Calendar className="h-3.5 w-3.5 text-[#d97706]" />
            <span className="text-[11px] font-semibold text-[#0f172a]">Nacimiento</span>
          </div>
          <p className="font-heading text-sm sm:text-base font-bold text-[#0f172a] mt-1">
            14 May 1988
          </p>
          <span className="text-[10px] text-[#64748b] block truncate">38 años</span>
        </div>
      </section>

      {/* 4. Allergies & Prescriber Directory: 1 column on mobile (grid-cols-1) */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Allergies */}
        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-[#dc2626]" />
            <h3 className="font-heading text-xs sm:text-sm font-bold text-[#0f172a]">
              Alergias Clínicas Registradas
            </h3>
          </div>
          <div className="mt-2 space-y-1.5 w-full">
            {patient.allergies.map((allergy, idx) => (
              <div
                key={idx}
                className="w-full flex items-center justify-between rounded-xl bg-[#fef2f2] p-2 text-xs font-semibold text-[#991b1b] border border-[#fecaca]"
              >
                <span className="text-[11px]">{allergy}</span>
                <span className="text-[9px] font-bold text-[#dc2626] uppercase">
                  Alerta
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Physician */}
        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5">
            <Building className="h-4 w-4 text-[#2563eb]" />
            <h3 className="font-heading text-xs sm:text-sm font-bold text-[#0f172a]">
              Médico Tratante Vinculado
            </h3>
          </div>
          <div className="mt-2 rounded-xl bg-[#f8faff] p-2.5 border border-[#e2e8f0] w-full">
            <p className="text-xs font-bold text-[#0f172a]">
              {patient.primaryDoctor}
            </p>
            <p className="text-[10px] text-[#64748b] mt-0.5">
              {patient.clinicAddress}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#2563eb] font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              <span>Receta Electrónica Conectada</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
