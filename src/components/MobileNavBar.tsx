import React from 'react';
import { Pill, ShoppingBag, ShieldAlert, MessageSquareText, FileText } from 'lucide-react';

export type NavTab = 'schedule' | 'catalog' | 'safety' | 'chat' | 'wallet';

interface MobileNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  cartItemCount?: number;
  unreadChatCount?: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab,
  onTabChange,
  cartItemCount = 0,
  unreadChatCount = 0,
}) => {
  const tabs = [
    {
      id: 'schedule' as NavTab,
      label: 'Medicinas',
      icon: Pill,
    },
    {
      id: 'catalog' as NavTab,
      label: 'Catálogo',
      icon: ShoppingBag,
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      id: 'safety' as NavTab,
      label: 'Seguridad',
      icon: ShieldAlert,
    },
    {
      id: 'chat' as NavTab,
      label: 'Consulta',
      icon: MessageSquareText,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      id: 'wallet' as NavTab,
      label: 'Tarjeta Rx',
      icon: FileText,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-[#e2e8f0] bg-white/95 backdrop-blur-xl shadow-lg"
      aria-label="Navegación Móvil"
    >
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto grid h-full grid-cols-5 items-center px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group relative flex h-full min-h-[44px] flex-col items-center justify-center transition-colors focus:outline-hidden cursor-pointer"
              aria-selected={isActive}
              role="tab"
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 group-active:scale-90 ${
                    isActive
                      ? 'text-[#2563eb] stroke-[2.2]'
                      : 'text-[#64748b] group-hover:text-[#0f172a]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[9px] font-bold text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`mt-1 text-[10px] font-semibold tracking-tight transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#2563eb]' : 'text-[#64748b]'
                }`}
              >
                {tab.label}
              </span>

              {/* Active indicator pip underneath */}
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#2563eb]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
