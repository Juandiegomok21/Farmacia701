import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Plus,
  Check,
  ShieldCheck,
  FileText,
  Truck,
  Building2,
  Package,
  AlertTriangle,
  RefreshCw,
  FileUp,
  CreditCard,
  MapPin,
  Phone,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { CatalogProduct, Medication, RefillOrder, CartItem } from '../types/pharmacy';

interface CatalogViewProps {
  products: CatalogProduct[];
  medications: Medication[];
  orders: RefillOrder[];
  cart: CartItem[];
  onAddToCart: (product: CatalogProduct) => void;
  onOpenCart: () => void;
  onOpenOrderRefill: (medId: string) => void;
  onOpenScanRx: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  medications,
  orders,
  cart,
  onAddToCart,
  onOpenCart,
  onOpenOrderRefill,
  onOpenScanRx,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    { id: 'all', label: 'Todo el Catálogo' },
    { id: 'prescription', label: 'Receta Médica' },
    { id: 'otc', label: 'Venta Libre' },
    { id: 'vitamins', label: 'Vitaminas' },
    { id: 'skincare', label: 'Dermatología' },
    { id: 'firstaid', label: 'Primeros Auxilios' },
    { id: 'refills', label: 'Mis Resurtidos y Pedidos' },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.genericName && prod.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAdd = (product: CatalogProduct) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1200);
  };

  const refillNeededMeds = medications.filter(
    (m) => m.remainingPills <= 15 || m.status === 'refill_needed'
  );

  return (
    <div className="w-full flex flex-col gap-4 pb-24">
      {/* 1. Header Banner */}
      <section className="w-full flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-[#e2e8f0] bg-gradient-to-br from-white via-[#f8faff] to-[#eff6ff] p-4 shadow-xs">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
              <ShieldCheck className="h-3 w-3" />
              Dispensario y Farmacia 701
            </span>

            {/* Quick Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-all cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Ver Carrito</span>
              {cartTotalCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#2563eb]">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>

          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-[#0f172a] mt-1">
            Catálogo de Productos Farmacia 701
          </h1>
          <p className="text-xs text-[#334155] leading-relaxed">
            Explora más de 250 medicamentos certificados, productos de venta libre, suplementos y equipo médico.
          </p>
        </div>

        {/* Search input: w-full */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Buscar por nombre de producto, marca o fórmula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 sm:h-11 w-full rounded-xl border border-[#cbd5e1] bg-white pl-9 pr-3 text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden transition-all"
          />
        </div>

        {/* Categories Tab Bar */}
        <div className="w-full flex items-center gap-1 overflow-x-auto p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#2563eb] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Main Content View: Either Catalog Grid or "Mis Resurtidos y Pedidos" */}
      {selectedCategory === 'refills' ? (
        /* Section: Resurtidos y Pedidos Activos */
        <div className="w-full flex flex-col gap-4">
          {/* Active order tracker */}
          {orders.length > 0 && (
            <section className="w-full flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
              <div className="flex flex-col gap-1.5 w-full pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
                    <Truck className="h-3 w-3" />
                    Pedido · {orders[0].id}
                  </span>
                  <span className="text-[10px] text-[#64748b]">{orders[0].orderDate}</span>
                </div>
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
                  {orders[0].medicationName}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Llegada estimada:</span>
                  <span className="font-bold text-[#2563eb]">{orders[0].estimatedArrival}</span>
                </div>
              </div>

              {/* Stepper */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {orders[0].timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:flex-col">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 text-xs font-bold ${
                        step.completed
                          ? 'bg-[#2563eb] text-white'
                          : 'border-2 border-[#cbd5e1] text-[#64748b]'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold ${step.completed ? 'text-[#0f172a]' : 'text-[#64748b]'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-[#64748b] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prescriptions Needing Refill */}
          <section className="w-full flex flex-col gap-2.5">
            <h3 className="font-heading text-sm sm:text-base font-bold text-[#0f172a]">
              Recetas Próximas a Resurtir
            </h3>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {refillNeededMeds.map((med) => (
                <div
                  key={med.id}
                  className="w-full flex flex-col justify-between rounded-2xl border border-[#fde68a] bg-[#fffdfa] p-3.5 shadow-xs"
                >
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#b45309]">
                      Quedan {med.remainingPills} tabletas
                    </span>
                    <h4 className="font-heading text-sm font-bold text-[#0f172a] mt-1">
                      {med.name} ({med.dosage})
                    </h4>
                    <p className="text-[10px] text-[#64748b] mt-0.5">{med.instructions}</p>
                  </div>
                  <button
                    onClick={() => onOpenOrderRefill(med.id)}
                    className="w-full min-h-[44px] h-11 mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Pedir Resurtido 1-Clic</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Section: Product Catalog Grid */
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>Mostrando {filteredProducts.length} productos</span>
            <span>Farmacia 701 Central</span>
          </div>

          {/* Grid of Products: 1 col on mobile, 2 cols on desktop */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((prod) => {
              const isAdded = addedProductId === prod.id;
              return (
                <div
                  key={prod.id}
                  className="w-full flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs hover:border-[#cbd5e1] hover:shadow-md transition-all"
                >
                  <div>
                    {/* Top Row: Brand & Category Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
                        {prod.brand}
                      </span>
                      <div className="flex items-center gap-1">
                        {prod.badge && (
                          <span className="inline-flex items-center rounded-full bg-[#dbeafe] px-2 py-0.5 text-[9px] font-bold text-[#1d4ed8]">
                            {prod.badge}
                          </span>
                        )}
                        {prod.rxRequired ? (
                          <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5 text-[9px] font-bold text-[#b45309] border border-[#fde68a]">
                            Receta Rx
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2 py-0.5 text-[9px] font-bold text-[#1d4ed8] border border-[#bfdbfe]">
                            Venta Libre
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Title & Presentation */}
                    <h3 className="font-heading text-sm sm:text-base font-bold text-[#0f172a] mt-1.5 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      {prod.presentation}
                    </p>

                    {/* Description */}
                    <p className="text-[11px] text-[#334155] mt-1.5 leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>

                    {/* Stock Status */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-[#1d4ed8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
                      <span>En existencia ({prod.stockCount} disponibles en Farmacia 701)</span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-[#f1f5f9]">
                      <div>
                        <span className="text-[10px] text-[#64748b] block">Precio Público</span>
                        <span className="font-heading text-base font-bold text-[#0f172a]">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>

                      {prod.insuranceCovered && prod.coPayPrice && (
                        <div className="text-right">
                          <span className="text-[9px] text-[#2563eb] font-semibold block">
                            Con Plan Platino
                          </span>
                          <span className="text-xs font-bold text-[#2563eb]">
                            Copago: ${prod.coPayPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Full-width button */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#f1f5f9] w-full">
                    <button
                      onClick={() => handleAdd(prod)}
                      className={`w-full min-h-[44px] h-11 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                        isAdded
                          ? 'bg-[#1d4ed8] text-white'
                          : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4 stroke-[2.5]" />
                          <span>¡Agregado al Carrito!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>
                            {prod.rxRequired ? 'Solicitar con Receta' : 'Agregar al Carrito'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Bottom Pharmacy Contact info card */}
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
              Av. Libertador 701 · Envíos a domicilio y recolección rápida
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <button
            onClick={onOpenScanRx}
            className="w-full min-h-[44px] h-10 inline-flex items-center justify-center gap-1 rounded-xl bg-[#eff6ff] text-xs font-semibold text-[#2563eb] border border-[#2563eb]/25 hover:bg-[#dbeafe] cursor-pointer"
          >
            <FileUp className="h-3.5 w-3.5" />
            <span>Subir Receta</span>
          </button>

          <a
            href="tel:701701701"
            className="w-full min-h-[44px] h-10 inline-flex items-center justify-center gap-1 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#0f172a] hover:bg-slate-50"
          >
            <Phone className="h-3.5 w-3.5 text-[#2563eb]" />
            <span>Llamar</span>
          </a>
        </div>
      </section>
    </div>
  );
};
