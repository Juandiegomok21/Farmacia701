import React, { useState } from 'react';
import { ShieldCheck, Flame, Bell, Pill, CheckCircle2, AlertTriangle, X, User as UserIcon, LogIn, LogOut, Sparkles } from 'lucide-react';
import { PatientProfile, DoseScheduleItem } from '../types/pharmacy';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  patient: PatientProfile;
  schedule: DoseScheduleItem[];
  onOpenQuickDose: () => void;
  onOpenOrderRefill: (medId?: string) => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schedule,
  onOpenQuickDose,
  onOpenAuthModal,
}) => {
  const { currentUser, dbUser, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Calculate adherence
  const takenCount = schedule.filter((s) => s.isTaken).length;
  const totalCount = schedule.length;
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;
  const pendingCount = totalCount - takenCount;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-xs shrink-0 ring-2 ring-[#2563eb]/20">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-[#0f172a] truncate">
                Farmacia 701
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Oficial
              </span>
            </div>
            <p className="text-[10px] text-[#64748b] leading-tight truncate">
              Salud y Farmacia Digital
            </p>
          </div>
        </div>

        {/* Adherence Streak Badge (Shown on desktop/tablet, simplified on mobile) */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-[#eff6ff] px-3 py-1.5 border border-[#dbeafe] text-xs">
          <Flame className="h-4 w-4 text-[#d97706]" />
          <span className="font-semibold text-[#0f172a]">Racha 14 días</span>
          <span className="text-[#64748b]">·</span>
          <span className="text-[#2563eb] font-semibold">{adherencePercent}% hoy</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Dose Log CTA */}
          {pendingCount > 0 && (
            <button
              onClick={onOpenQuickDose}
              className="flex items-center gap-1 rounded-xl bg-[#eff6ff] px-2.5 py-1.5 text-xs font-semibold text-[#2563eb] border border-[#2563eb]/25 hover:bg-[#dbeafe] transition-colors cursor-pointer"
            >
              <Pill className="h-3.5 w-3.5" />
              <span>Toma</span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2563eb] text-[10px] text-white font-bold">
                {pendingCount}
              </span>
            </button>
          )}

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] transition-colors cursor-pointer"
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#d97706] ring-2 ring-white" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f5f9]">
                  <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#0f172a]">
                    Alertas Farmacéuticas
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto">
                  {pendingCount > 0 ? (
                    <div className="rounded-xl bg-[#eff6ff] p-2.5 border border-[#bfdbfe]">
                      <div className="flex items-start gap-2">
                        <Pill className="h-3.5 w-3.5 text-[#1d4ed8] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-[#1e3a8a]">
                            Tienes {pendingCount} {pendingCount === 1 ? 'toma pendiente' : 'tomas pendientes'} hoy
                          </p>
                          <p className="text-[11px] text-[#2563eb] mt-0.5">
                            Metformina 500mg (6:30 PM) y Atorvastatina 20mg (10:00 PM)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#eff6ff] p-2.5 border border-[#bfdbfe]">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#1d4ed8]">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>¡Todas las dosis registradas hoy!</span>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-[#fffbeb] p-2.5 border border-[#fde68a]">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-[#d97706] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-[#92400e]">
                          Resurtido en Preparación
                        </p>
                        <p className="text-[11px] text-[#b45309] mt-0.5">
                          El pedido ORD-701-92 está en preparación para entrega mañana.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Auth Control */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 p-1 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100/70 transition-colors cursor-pointer"
                title="Mi Perfil"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Usuario'}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline-block text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Cuenta'}
                </span>
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {currentUser.displayName || 'Usuario Farmacia 701'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Rol de cuenta:</span>
                      <span className="font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {dbUser?.role || 'user'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Base de datos:</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Sincronizado
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await logout();
                    }}
                    className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 hover:border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
