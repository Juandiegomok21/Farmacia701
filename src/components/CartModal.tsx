import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Building2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { CartItem, RefillOrder } from '../types/pharmacy';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (order: Partial<RefillOrder>) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.insuranceCovered && item.product.coPayPrice
      ? item.product.coPayPrice
      : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const deliveryFee = deliveryMethod === 'delivery' ? 0.0 : 0.0; // Free delivery
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const summaryNames = cart.map((i) => `${i.product.name} (x${i.quantity})`).join(', ');
      const newOrder: Partial<RefillOrder> = {
        id: `ORD-701-${Math.floor(100 + Math.random() * 900)}`,
        medicationId: cart[0]?.product.id || '',
        medicationName: cart.length === 1 ? cart[0].product.name : `Pedido Múltiple (${cart.length} productos)`,
        dosage: summaryNames,
        orderDate: 'Hace un momento',
        estimatedArrival:
          deliveryMethod === 'delivery'
            ? 'Mañana, antes de 11:30 AM'
            : 'Hoy en 90 minutos en Farmacia 701 Central',
        status: 'submitted',
        deliveryType: deliveryMethod,
        pharmacyName: 'Farmacia 701 Hub Central',
        pharmacyAddress: 'Av. Libertador 701, Zona Médica',
        coPay: total,
        trackingNumber: `ENV-F701-${Math.floor(100000 + Math.random() * 900000)}`,
        timeline: [
          {
            title: 'Pedido Confirmado',
            description: `${cart.length} productos registrados`,
            time: 'Hace un momento',
            completed: true,
          },
          {
            title: 'Verificación y Empaque Farmacia 701',
            description: 'Control de calidad y sellado hermético',
            time: 'En proceso',
            completed: false,
          },
          {
            title:
              deliveryMethod === 'delivery'
                ? 'En Ruta de Entrega Climatizada'
                : 'Listo en Mostrador Farmacia 701',
            description:
              deliveryMethod === 'delivery'
                ? 'Despacho matutino con chofer asignado'
                : 'Pasa a recoger al mostrador preferente',
            time: deliveryMethod === 'delivery' ? 'Mañana, 9:00 AM' : 'Hoy, 2:00 PM',
            completed: false,
          },
        ],
      };

      onCheckoutSuccess(newOrder);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClearCart();
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#0f172a]">
                Carrito de Farmacia 701
              </h3>
              <p className="text-[11px] text-[#64748b]">
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu orden
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#2563eb] animate-bounce" />
            <h4 className="font-heading text-lg font-bold text-[#0f172a]">
              ¡Pedido Confirmado con Éxito!
            </h4>
            <p className="text-xs text-[#64748b] max-w-xs mx-auto">
              Tu orden ha sido enviada al mostrador de dispensación de Farmacia 701. Puedes seguir el envío en tiempo real.
            </p>
          </div>
        ) : cart.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
            <p className="text-sm font-semibold text-[#0f172a]">Tu carrito está vacío</p>
            <p className="text-xs text-[#64748b] max-w-xs mx-auto">
              Explora el catálogo de Farmacia 701 y añade medicamentos o productos de cuidado personal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="mt-3.5 space-y-3.5">
            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-[#f1f5f9] pr-1">
              {cart.map((item) => {
                const itemPrice = item.product.insuranceCovered && item.product.coPayPrice
                  ? item.product.coPayPrice
                  : item.product.price;
                return (
                  <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-[#0f172a] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-[#64748b] truncate">
                        {item.product.presentation}
                      </p>
                      <span className="text-xs font-bold text-[#2563eb]">
                        ${itemPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f172a]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[#0f172a]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f172a]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-slate-400 hover:text-red-500 ml-1"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Method Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Modalidad de Entrega
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex items-start gap-2 rounded-xl p-2.5 border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'delivery'
                      ? 'border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]'
                      : 'border-[#cbd5e1] bg-white'
                  }`}
                >
                  <Truck className="h-4 w-4 text-[#2563eb] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#0f172a] block">A Domicilio</span>
                    <span className="text-[10px] text-[#2563eb] font-semibold">GRATIS</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-start gap-2 rounded-xl p-2.5 border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]'
                      : 'border-[#cbd5e1] bg-white'
                  }`}
                >
                  <Building2 className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#0f172a] block">En Sucursal</span>
                    <span className="text-[10px] text-[#0284c7] font-semibold">Listo en 90 min</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-xl bg-[#f8faff] p-3 text-xs border border-[#e2e8f0] space-y-1">
              <div className="flex items-center justify-between text-[#64748b]">
                <span>Subtotal ({cart.length} productos)</span>
                <span className="font-semibold text-[#0f172a]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#64748b]">
                <span>Costo de Envío Climatizado</span>
                <span className="font-semibold text-[#2563eb]">GRATIS ($0.00)</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-[#e2e8f0]">
                <span className="font-bold text-[#0f172a]">Total a Pagar</span>
                <span className="font-heading font-bold text-base text-[#2563eb]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] h-11 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#64748b] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Seguir Comprando
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
