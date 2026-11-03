export type DosageTimeSlot = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export interface DoseScheduleItem {
  id: string;
  medicationId: string;
  timeSlot: DosageTimeSlot;
  scheduledTime: string;
  isTaken: boolean;
  takenAt?: string;
  note?: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  frequency: string;
  timeSlots: DosageTimeSlot[];
  instructions: string;
  remainingPills: number;
  totalPills: number;
  refillsLeft: number;
  rxNumber: string;
  prescribedBy: string;
  doctorSpecialty: string;
  pharmacy: string;
  status: 'active' | 'refill_needed' | 'pending_refill' | 'completed';
  rxRequired: boolean;
  isVerified: boolean;
  category: string;
  warningAlert?: string;
  color: string;
  sideEffects: string[];
  foodInteractions?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  genericName?: string;
  category: 'prescription' | 'otc' | 'vitamins' | 'skincare' | 'firstaid';
  categoryLabel: string;
  presentation: string;
  price: number;
  insuranceCovered: boolean;
  coPayPrice?: number;
  rxRequired: boolean;
  inStock: boolean;
  stockCount: number;
  description: string;
  brand: string;
  dosage?: string;
  badge?: string;
}

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
}

export interface RefillOrder {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  orderDate: string;
  estimatedArrival: string;
  status: 'submitted' | 'reviewing' | 'packaging' | 'out_for_delivery' | 'ready_for_pickup' | 'completed';
  deliveryType: 'delivery' | 'pickup';
  pharmacyName: string;
  pharmacyAddress: string;
  coPay: number;
  trackingNumber?: string;
  timeline: {
    title: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
}

export interface DrugInteraction {
  id: string;
  drugs: string[];
  severity: 'severe' | 'moderate' | 'mild';
  description: string;
  clinicalAction: string;
  mechanism: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pharmacist';
  text: string;
  timestamp: string;
  isActionable?: boolean;
}

export interface PatientProfile {
  name: string;
  dob: string;
  bloodType: string;
  weightKg: number;
  heightCm: number;
  allergies: string[];
  insuranceProvider: string;
  memberId: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
  tierCoPay: number;
  primaryDoctor: string;
  clinicAddress: string;
}
