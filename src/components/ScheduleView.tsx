import React, { useState } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Search,
  PlusCircle,
  FileUp,
} from 'lucide-react';
import { Medication, DoseScheduleItem } from '../types/pharmacy';
import { MedicationCard } from './MedicationCard';

interface ScheduleViewProps {
  medications: Medication[];
  schedule: DoseScheduleItem[];
  onToggleDose: (scheduleId: string) => void;
  onOpenQuickDose: (medId?: string) => void;
  onOpenOrderRefill: (medId: string) => void;
  onOpenScanRx: () => void;
  onSelectMedicationDetails: (medication: Medication) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  medications,
  schedule,
  onToggleDose,
  onOpenQuickDose,
  onOpenOrderRefill,
  onOpenScanRx,
  onSelectMedicationDetails,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(2); // Martes (hoy)
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const daysOfWeek = [
    { day: 'Dom', date: '1 Nov' },
    { day: 'Lun', date: '2 Nov' },
    { day: 'Mar', date: '3 Nov', isToday: true },
    { day: 'Mié', date: '4 Nov' },
    { day: 'Jue', date: '5 Nov' },
    { day: 'Vie', date: '6 Nov' },
    { day: 'Sáb', date: '7 Nov' },
  ];

  // Calculations
  const takenCount = schedule.filter((s) => s.isTaken).length;
  const totalCount = schedule.length;
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  // Filtered medications
  const filteredMeds = medications.filter((med) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'refill_needed' && med.remainingPills <= 10) ||
      med.category.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const timeSlotsConfig = [
    {
      slot: 'morning' as const,
      label: 'Toma de la Mañana',
      time: '8:00 AM – 10:00 AM',
      icon: Sun,
      iconColor: 'text-[#d97706]',
      bgColor: 'bg-[#fffbeb]',
      borderColor: 'border-[#fef3c7]',
    },
    {
      slot: 'afternoon' as const,
      label: 'Toma de la Tarde',
      time: '12:00 PM – 2:00 PM',
      icon: Clock,
      iconColor: 'text-[#0284c7]',
      bgColor: 'bg-[#eff6ff]',
      borderColor: 'border-[#dbeafe]',
    },
    {
      slot: 'evening' as const,
      label: 'Toma de la Noche',
      time: '6:00 PM – 7:30 PM',
      icon: Sunset,
      iconColor: 'text-[#d97706]',
      bgColor: 'bg-[#fef3c7]/60',
      borderColor: 'border-[#fde68a]',
    },
    {
      slot: 'bedtime' as const,
      label: 'Antes de Dormir',
      time: '9:30 PM – 11:00 PM',
      icon: Moon,
      iconColor: 'text-[#2563eb]',
      bgColor: 'bg-[#eff6ff]',
      borderColor: 'border-[#bfdbfe]',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-24">
      {/* 1. Hero Adherence & Daily Overview Banner: continuous vertical flow on mobile */}
      <section className="w-full flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8faff] to-[#eff6ff] p-4 shadow-xs">
        {/* Top Header Text */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
              <Sparkles className="h-3 w-3" />
              Al Día
            </span>
            <span className="text-xs text-[#64748b]">Hoy · Martes, 3 de noviembre</span>
          </div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Horario Diario de Tomas
          </h1>
          <p className="text-xs text-[#334155] leading-relaxed">
            Has completado <strong className="text-[#2563eb] font-semibold">{takenCount} de {totalCount}</strong> tomas hoy. Mantén tu constancia clínica.
          </p>
        </div>

        {/* Adherence Radial Metric Widget: full width on mobile */}
        <div className="w-full flex items-center justify-between rounded-xl bg-white p-3 border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-[#e2e8f0]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#2563eb] transition-all duration-700 ease-out"
                  strokeDasharray={`${adherencePercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-heading text-xs font-bold text-[#0f172a]">
                  {adherencePercent}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#0f172a]">Cumplimiento Hoy</div>
              <div className="text-[11px] text-[#64748b]">
                {takenCount} de {totalCount} registradas
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-2 py-1 rounded-lg">
            <CheckCircle2 className="h-3 w-3" />
            <span>Racha 14 días</span>
          </div>
        </div>

        {/* Day Selector Carousel */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {daysOfWeek.map((dayItem, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <button
                key={dayItem.day}
                onClick={() => setSelectedDay(idx)}
                className={`flex min-h-[44px] min-w-[46px] flex-1 flex-col items-center justify-center rounded-xl p-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'bg-white text-[#334155] border border-[#e2e8f0] hover:border-[#cbd5e1]'
                }`}
              >
                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#64748b]'}`}>
                  {dayItem.day}
                </span>
                <span className="font-bold text-xs mt-0.5">{dayItem.date.split(' ')[0]}</span>
                {dayItem.isToday && !isSelected && (
                  <span className="mt-1 h-1 w-1 rounded-full bg-[#2563eb]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Today's Dosage Time Slots: Single vertical flow (grid-cols-1) on mobile */}
      <section className="w-full flex flex-col gap-2.5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#2563eb]" />
            <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
              Tomas Programadas
            </h2>
          </div>
          <button
            onClick={() => onOpenQuickDose()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Añadir Toma</span>
          </button>
        </div>

        {/* Vertical flow (grid-cols-1) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {timeSlotsConfig.map((slotConf) => {
            const SlotIcon = slotConf.icon;
            const slotItems = schedule.filter((s) => s.timeSlot === slotConf.slot);

            if (slotItems.length === 0) return null;

            return (
              <div
                key={slotConf.slot}
                className="w-full flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${slotConf.bgColor} ${slotConf.borderColor} border shrink-0`}>
                        <SlotIcon className={`h-4 w-4 ${slotConf.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xs font-semibold text-[#0f172a]">
                          {slotConf.label}
                        </h3>
                        <p className="text-[10px] text-[#64748b]">{slotConf.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* List of medications in this slot */}
                  <div className="mt-2 space-y-1.5 w-full">
                    {slotItems.map((item) => {
                      const med = medications.find((m) => m.id === item.medicationId);
                      if (!med) return null;

                      return (
                        <div
                          key={item.id}
                          onClick={() => onToggleDose(item.id)}
                          className={`w-full flex items-start justify-between rounded-xl p-2.5 border transition-all cursor-pointer ${
                            item.isTaken
                              ? 'bg-[#eff6ff]/60 border-[#bfdbfe]'
                              : 'bg-[#f8faff] border-[#e2e8f0] hover:border-[#cbd5e1]'
                          }`}
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <button
                              type="button"
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                                item.isTaken
                                  ? 'bg-[#2563eb] text-white'
                                  : 'border-2 border-[#cbd5e1] hover:border-[#2563eb]'
                              }`}
                            >
                              {item.isTaken ? (
                                <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                              ) : (
                                <Circle className="h-4 w-4 text-transparent" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-xs font-semibold truncate ${
                                    item.isTaken
                                      ? 'text-[#1d4ed8] line-through decoration-slate-400'
                                      : 'text-[#0f172a]'
                                  }`}
                                >
                                  {med.name}
                                </span>
                                <span className="text-[10px] text-[#64748b] font-medium">
                                  {med.dosage}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#64748b] mt-0.5 line-clamp-1">
                                {med.instructions}
                              </p>
                              {item.isTaken && item.takenAt && (
                                <p className="text-[9px] text-[#2563eb] font-semibold mt-0.5">
                                  Registrada a las {item.takenAt} {item.note ? `· ${item.note}` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          <span className="shrink-0 text-[10px] font-mono text-[#64748b] ml-1">
                            {item.scheduledTime}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Active Prescription Inventory Header & Controls: Full width on mobile */}
      <section className="w-full flex flex-col gap-3 pt-1">
        <div className="w-full flex flex-col gap-2">
          <div>
            <h2 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
              Medicamentos en Receta
            </h2>
            <p className="text-xs text-[#64748b]">
              {medications.length} tratamientos activos en Farmacia 701
            </p>
          </div>

          {/* Full width button in mobile */}
          <button
            onClick={onOpenScanRx}
            className="w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#2563eb] border border-[#e2e8f0] hover:bg-[#f8faff] shadow-xs cursor-pointer transition-colors"
          >
            <FileUp className="h-4 w-4" />
            <span>Escanear / Subir Nueva Receta</span>
          </button>
        </div>

        {/* Search input: w-full */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Buscar medicamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 sm:h-11 w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden transition-all"
          />
        </div>

        {/* Filter categories tabs: w-full horizontally scrollable */}
        <div className="w-full flex items-center gap-1 overflow-x-auto p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'refill_needed', label: 'Por Resurtir' },
            { id: 'Cardio', label: 'Cardio' },
            { id: 'Endocrin', label: 'Endocrino' },
            { id: 'Mental', label: 'Salud Mental' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-white text-[#2563eb] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Medication Cards Grid: 1 column on mobile (grid-cols-1), 2 on desktop (sm:grid-cols-2) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredMeds.map((med) => {
            const isTaken = schedule.some(
              (s) => s.medicationId === med.id && s.isTaken
            );
            return (
              <MedicationCard
                key={med.id}
                medication={med}
                onLogDose={() => onOpenQuickDose(med.id)}
                onOrderRefill={() => onOpenOrderRefill(med.id)}
                onSelectDetails={onSelectMedicationDetails}
                isTakenToday={isTaken}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
