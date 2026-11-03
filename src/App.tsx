/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initialPatient,
  initialMedications,
  initialSchedule,
  initialOrders,
  initialChatMessages,
  initialCatalogProducts,
} from './data/mockData';
import {
  Medication,
  DoseScheduleItem,
  RefillOrder,
  ChatMessage,
  PatientProfile,
  CatalogProduct,
  CartItem,
} from './types/pharmacy';
import { Header } from './components/Header';
import { MobileNavBar, NavTab } from './components/MobileNavBar';
import { ScheduleView } from './components/ScheduleView';
import { CatalogView } from './components/CatalogView';
import { DrugSafetyView } from './components/DrugSafetyView';
import { CareChatView } from './components/CareChatView';
import { RxWalletView } from './components/RxWalletView';
import { LogDoseModal } from './components/LogDoseModal';
import { OrderRefillModal } from './components/OrderRefillModal';
import { ScanRxModal } from './components/ScanRxModal';
import { ConsultationModal } from './components/ConsultationModal';
import { MedicationDetailsModal } from './components/MedicationDetailsModal';
import { CartModal } from './components/CartModal';
import { AuthScreen } from './components/AuthScreen';
import { useAuth } from './context/AuthContext.tsx';

export default function App() {
  const { currentUser } = useAuth();
  // Persisted state initialization
  const [patient] = useState<PatientProfile>(initialPatient);

  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      const saved = localStorage.getItem('f701_medications');
      return saved ? JSON.parse(saved) : initialMedications;
    } catch {
      return initialMedications;
    }
  });

  const [products, setProducts] = useState<CatalogProduct[]>(initialCatalogProducts);

  useEffect(() => {
    let isMounted = true;
    async function loadProductsFromDb() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            const mappedProducts: CatalogProduct[] = data.map((p: any) => ({
              id: p.code || String(p.id),
              name: p.name,
              genericName: p.genericName || undefined,
              category: p.category,
              categoryLabel: p.categoryLabel,
              presentation: p.presentation,
              price: Number(p.price),
              insuranceCovered: Boolean(p.insuranceCovered),
              coPayPrice: p.coPayPrice ? Number(p.coPayPrice) : undefined,
              rxRequired: Boolean(p.rxRequired),
              inStock: Boolean(p.inStock),
              stockCount: Number(p.stockCount),
              description: p.description,
              brand: p.brand,
              dosage: p.dosage || undefined,
              badge: p.badge || undefined,
            }));
            setProducts(mappedProducts);
          }
        }
      } catch (err) {
        console.warn('Usando catálogo local:', err);
      }
    }
    loadProductsFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('f701_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [schedule, setSchedule] = useState<DoseScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('f701_schedule');
      return saved ? JSON.parse(saved) : initialSchedule;
    } catch {
      return initialSchedule;
    }
  });

  const [orders, setOrders] = useState<RefillOrder[]>(() => {
    try {
      const saved = localStorage.getItem('f701_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('f701_messages');
      return saved ? JSON.parse(saved) : initialChatMessages;
    } catch {
      return initialChatMessages;
    }
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('schedule');

  // Modals state
  const [cartOpen, setCartOpen] = useState(false);
  const [logDoseOpen, setLogDoseOpen] = useState(false);
  const [selectedMedForDose, setSelectedMedForDose] = useState<string | undefined>(undefined);

  const [orderRefillOpen, setOrderRefillOpen] = useState(false);
  const [selectedMedForRefill, setSelectedMedForRefill] = useState<string | undefined>(undefined);

  const [scanRxOpen, setScanRxOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedMedDetails, setSelectedMedDetails] = useState<Medication | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync patient name with logged in user if available
  const activePatient: PatientProfile = {
    ...patient,
    name: currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : patient.name),
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('f701_medications', JSON.stringify(medications));
    } catch (e) {
      console.error(e);
    }
  }, [medications]);

  useEffect(() => {
    try {
      localStorage.setItem('f701_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('f701_schedule', JSON.stringify(schedule));
    } catch (e) {
      console.error(e);
    }
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem('f701_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('f701_messages', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Cart operations
  const handleAddToCart = (product: CatalogProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Handlers
  const handleToggleDose = (scheduleId: string) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id === scheduleId) {
          const nextState = !item.isTaken;
          const updated = {
            ...item,
            isTaken: nextState,
            takenAt: nextState
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };

          setMedications((meds) =>
            meds.map((m) => {
              if (m.id === item.medicationId) {
                const diff = nextState ? -1 : 1;
                return {
                  ...m,
                  remainingPills: Math.max(0, m.remainingPills + diff),
                };
              }
              return m;
            })
          );

          return updated;
        }
        return item;
      })
    );
  };

  const handleConfirmDose = (medId: string, timeStr: string, noteStr?: string) => {
    const uncompletedItem = schedule.find(
      (s) => s.medicationId === medId && !s.isTaken
    );

    if (uncompletedItem) {
      setSchedule((prev) =>
        prev.map((s) =>
          s.id === uncompletedItem.id
            ? { ...s, isTaken: true, takenAt: timeStr, note: noteStr }
            : s
        )
      );
    } else {
      const newItem: DoseScheduleItem = {
        id: `sched-${Date.now()}`,
        medicationId: medId,
        timeSlot: 'morning',
        scheduledTime: timeStr,
        isTaken: true,
        takenAt: timeStr,
        note: noteStr,
      };
      setSchedule((prev) => [...prev, newItem]);
    }

    setMedications((meds) =>
      meds.map((m) =>
        m.id === medId
          ? { ...m, remainingPills: Math.max(0, m.remainingPills - 1) }
          : m
      )
    );
  };

  const handlePlaceOrder = (newOrderData: Partial<RefillOrder>) => {
    const fullOrder: RefillOrder = {
      id: newOrderData.id || `ORD-701-${Date.now()}`,
      medicationId: newOrderData.medicationId || '',
      medicationName: newOrderData.medicationName || '',
      dosage: newOrderData.dosage || '',
      orderDate: newOrderData.orderDate || 'Hoy',
      estimatedArrival: newOrderData.estimatedArrival || 'Mañana',
      status: newOrderData.status || 'submitted',
      deliveryType: newOrderData.deliveryType || 'delivery',
      pharmacyName: newOrderData.pharmacyName || 'Farmacia 701 Central',
      pharmacyAddress: newOrderData.pharmacyAddress || 'Av. Libertador 701, Zona Médica',
      coPay: newOrderData.coPay || 10.0,
      trackingNumber: newOrderData.trackingNumber,
      timeline: newOrderData.timeline || [],
    };

    setOrders((prev) => [fullOrder, ...prev]);

    if (fullOrder.medicationId) {
      setMedications((meds) =>
        meds.map((m) => {
          if (m.id === fullOrder.medicationId) {
            return {
              ...m,
              refillsLeft: Math.max(0, m.refillsLeft - 1),
              status: 'pending_refill',
            };
          }
          return m;
        })
      );
    }

    const confirmMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'pharmacist',
      text: `Pedido confirmado: ${fullOrder.medicationName} (${fullOrder.dosage}). Pedido #${fullOrder.id} en Farmacia 701. Llegada estimada: ${fullOrder.estimatedArrival}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  const handleAddPrescription = (newMed: Medication) => {
    setMedications((prev) => [newMed, ...prev]);

    const newScheduleItems: DoseScheduleItem[] = newMed.timeSlots.map((slot, i) => ({
      id: `sched-new-${Date.now()}-${i}`,
      medicationId: newMed.id,
      timeSlot: slot,
      scheduledTime: slot === 'morning' ? '8:00 AM' : slot === 'afternoon' ? '1:00 PM' : '7:00 PM',
      isTaken: false,
    }));

    setSchedule((prev) => [...prev, ...newScheduleItems]);

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'pharmacist',
      text: `Tu nueva receta para ${newMed.name} (${newMed.dosage}) fue validada en Farmacia 701 contra tu perfil. Ha sido agregada a tu horario diario.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let replyText =
        'Gracias por consultar, Juandiego. He registrado tu observación en tu expediente de Farmacia 701. Mantén tus tomas con regularidad y avísame si presentas algún síntoma nuevo.';

      const lower = text.toLowerCase();
      if (lower.includes('atorvastatina') && (lower.includes('desayuno') || lower.includes('mañana'))) {
        replyText =
          'La Atorvastatina puede tomarse a cualquier hora, pero dado que la síntesis hepática de colesterol alcanza su punto máximo durante la noche, tomarla al acostarse provee la mayor eficacia terapéutica. Tomarla con agua antes de dormir es lo más recomendado.';
      } else if (lower.includes('olvid') || lower.includes('metformina')) {
        replyText =
          'Si olvidaste una dosis de Metformina, tómala en cuanto lo notes junto con algún alimento. No obstante, si ya está cerca tu siguiente dosis, salta la toma olvidada y continúa con tu horario usual. Nunca dupliques la dosis para compensar.';
      } else if (lower.includes('ibuprofeno') || lower.includes('dolor')) {
        replyText =
          'Precaución: El Ibuprofeno (AINE) combinado con Sertralina aumenta el riesgo de sangrado digestivo, y con Lisinopril puede alterar la presión y la función renal. Para dolor leve a moderado, el Paracetamol/Acetaminofén (500mg) es más seguro para ti. Consúltame antes si deseas que hablemos con el Dr. Chen.';
      } else if (lower.includes('pomelo') || lower.includes('toronja')) {
        replyText =
          'El pomelo (toronja) contiene compuestos que inhiben la enzima intestinal CYP3A4. Esto impide que el hígado metabolice la Atorvastatina, elevando drásticamente sus niveles en sangre y el riesgo de toxicidad muscular (rabdomiólisis). Es fundamental evitarlo.';
      } else if (lower.includes('resurtido') || lower.includes('pedido') || lower.includes('llega') || lower.includes('catalogo')) {
        replyText =
          '¡Tu pedido en Farmacia 701 está en preparación! Puedes consultar todo nuestro catálogo de productos en la pestaña "Catálogo". Realizamos entregas prioritarias climatizadas cada mañana.';
      }

      const pharmReply: ChatMessage = {
        id: `msg-pharm-${Date.now()}`,
        sender: 'pharmacist',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, pharmReply]);
    }, 600);
  };

  const handleConfirmBooking = (slot: string, type: 'video' | 'phone') => {
    const confirmationMsg: ChatMessage = {
      id: `msg-booking-${Date.now()}`,
      sender: 'pharmacist',
      text: `Cita confirmada: Consulta de Farmacoterapia Clínica el ${slot} mediante ${
        type === 'video' ? 'Videollamada Médica Segura' : 'Llamada Telefónica Directa'
      }. He revisado tus medicamentos en preparación.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confirmationMsg]);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#0f172a] flex flex-col selection:bg-[#2563eb]/20">
      {/* 1. Header: max-w-md centered container for mobile-first native app feel */}
      <Header
        patient={activePatient}
        schedule={schedule}
        onOpenQuickDose={() => {
          setSelectedMedForDose(undefined);
          setLogDoseOpen(true);
        }}
        onOpenOrderRefill={(medId) => {
          setSelectedMedForRefill(medId);
          setOrderRefillOpen(true);
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* 2. Main Content Container: max-w-md mx-auto simulating a native mobile app */}
      <main className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 flex-1 py-3">
        {activeTab === 'schedule' && (
          <ScheduleView
            medications={medications}
            schedule={schedule}
            onToggleDose={handleToggleDose}
            onOpenQuickDose={(medId) => {
              setSelectedMedForDose(medId);
              setLogDoseOpen(true);
            }}
            onOpenOrderRefill={(medId) => {
              setSelectedMedForRefill(medId);
              setOrderRefillOpen(true);
            }}
            onOpenScanRx={() => setScanRxOpen(true)}
            onSelectMedicationDetails={(med) => setSelectedMedDetails(med)}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            products={products}
            medications={medications}
            orders={orders}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setCartOpen(true)}
            onOpenOrderRefill={(medId) => {
              setSelectedMedForRefill(medId);
              setOrderRefillOpen(true);
            }}
            onOpenScanRx={() => setScanRxOpen(true)}
          />
        )}

        {activeTab === 'safety' && (
          <DrugSafetyView
            medications={medications}
            patient={patient}
            onConsultPharmacist={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'chat' && (
          <CareChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            onBookConsultation={() => setConsultationOpen(true)}
            patient={patient}
          />
        )}

        {activeTab === 'wallet' && (
          <RxWalletView patient={patient} medications={medications} />
        )}
      </main>

      {/* 3. Bottom Mobile Navigation Bar: Fixed at bottom with max-w-md mx-auto container */}
      <MobileNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemCount={cart.reduce((a, b) => a + b.quantity, 0)}
      />

      {/* Shopping Cart Drawer / Modal */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handlePlaceOrder}
      />

      {/* Floating Modals: w-full max-w-md mx-auto */}
      <LogDoseModal
        isOpen={logDoseOpen}
        onClose={() => setLogDoseOpen(false)}
        medications={medications}
        initialMedId={selectedMedForDose}
        onConfirmDose={handleConfirmDose}
      />

      <OrderRefillModal
        isOpen={orderRefillOpen}
        onClose={() => setOrderRefillOpen(false)}
        medications={medications}
        initialMedId={selectedMedForRefill}
        onPlaceOrder={handlePlaceOrder}
      />

      <ScanRxModal
        isOpen={scanRxOpen}
        onClose={() => setScanRxOpen(false)}
        onAddPrescription={handleAddPrescription}
      />

      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />

      <MedicationDetailsModal
        medication={selectedMedDetails}
        onClose={() => setSelectedMedDetails(null)}
        onOrderRefill={(medId) => {
          setSelectedMedForRefill(medId);
          setOrderRefillOpen(true);
        }}
        onLogDose={(medId) => {
          setSelectedMedForDose(medId);
          setLogDoseOpen(true);
        }}
      />

      {/* Firebase Auth Modal */}
      {authModalOpen && (
        <AuthScreen
          isModal={true}
          onSuccess={() => setAuthModalOpen(false)}
          onCancel={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
