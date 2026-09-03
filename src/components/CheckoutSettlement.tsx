import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  Plus, 
  Trash2, 
  Search, 
  Receipt, 
  RotateCcw, 
  Eye, 
  FileText,
  DollarSign,
  Building,
  Calendar,
  User,
  Check,
  Sparkles,
  ArrowRight,
  Sliders,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Save,
  ShieldCheck,
  Landmark,
  Edit3,
  History,
  AlertTriangle,
  ChevronRight,
  X,
  Filter,
  CheckSquare,
  XCircle,
  Ban,
  AlertOctagon,
  Undo2
} from 'lucide-react';
import CashierReport from './CashierReport';

export interface ChargeItem {
  id: string;
  item: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface ResettlementLog {
  resettledAt: string;
  resettledBy: string;
  previousGrandTotal: number;
  newGrandTotal: number;
  differentialAmount: number;
  reason: string;
  paymentMode: string;
  txnRef: string;
}

export interface SettledBill {
  billNo: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  hall: string;
  eventDate: string;
  eventType: string;
  pax: number;
  charges: ChargeItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  advancePaid: number;
  advancePayMode: string;
  netPaid: number;
  paymentMode: string;
  txnRef: string;
  settledAt: string;
  settledBy: string;
  // Resettlement Fields
  isResettled?: boolean;
  resettledAt?: string;
  resettledBy?: string;
  resettlementReason?: string;
  resettlementHistory?: ResettlementLog[];
  version?: number;
  // Cancellation / Void Fields
  isCancelled?: boolean;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundMode?: string;
  refundTxnRef?: string;
}

interface PrintCustomizerSettings {
  venueName: string;
  venueAddress: string;
  taxDetails: string;
  selectedLogoId: string;
  customLogoUrl: string;
  footerTerms: string;
  showSignatures: boolean;
  showWatermark: boolean;
}

const PRESET_LOGOS = [
  {
    id: 'gold_crown',
    name: 'Royal Gold Emblem',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23d97706"><path d="M50 15 l12 25 l28 -15 l-10 35 l20 5 l-15 20 h-70 l-15 -20 l20 -5 l-10 -35 l28 15 z" /><circle cx="50" cy="12" r="5" fill="%23b45309"/><circle cx="15" cy="22" r="4" fill="%23b45309"/><circle cx="85" cy="22" r="4" fill="%23b45309"/><rect x="25" y="88" width="50" height="6" rx="3" fill="%2392400e"/></svg>'
  },
  {
    id: 'blue_crest',
    name: 'Luxury Sapphire Crest',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%231e40af"><path d="M50 5 L85 20 V50 C85 72 50 95 50 95 C50 95 15 72 15 50 V20 Z" stroke="%233b82f6" stroke-width="4"/><path d="M50 25 L60 45 L82 48 L66 63 L70 85 L50 74 L30 85 L34 63 L18 48 L40 45 Z" fill="%23fbbf24"/></svg>'
  },
  {
    id: 'emerald_diamond',
    name: 'Emerald Geometric',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" fill="%23059669" stroke="%2310b981" stroke-width="3"/><polygon points="50,25 75,50 50,75 25,50" fill="%2334d399"/></svg>'
  },
  {
    id: 'classic_monogram',
    name: 'Classic Monogram GH',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="%230f172a" stroke="%2394a3b8" stroke-width="3"/><text x="50" y="62" font-family="serif" font-size="42" font-weight="bold" fill="%23f8fafc" text-anchor="middle">GH</text></svg>'
  }
];

const PRESET_TERMS = [
  {
    name: 'Standard Banquet Terms',
    text: `1. All payments once settled are final and non-refundable.\n2. Any damages to venue property, sound equipment, or decor during the event will be charged as per actuals.\n3. Cheques are subject to realization.\n4. All legal disputes are strictly subject to Metro City jurisdiction. E. & O.E.`
  },
  {
    name: 'Strict Refund & Policy',
    text: `1. Advance deposits are strictly non-refundable upon final settlement.\n2. Outside catering or alcohol is strictly prohibited without prior written license approval.\n3. Event sound levels must comply with local municipality noise cutoff guidelines after 10:00 PM.`
  },
  {
    name: 'Corporate Net-15 Terms',
    text: `1. Tax invoice generated under Section 31 of CGST Act, 2017.\n2. Payment due within 15 calendar days of invoice date for approved corporate credit accounts.\n3. Subject to Tax Deducted at Source (TDS) under Section 194C of the Income Tax Act.`
  }
];

const defaultCustomizerSettings: PrintCustomizerSettings = {
  venueName: 'Grand Horizon Banquet & Convention Hall',
  venueAddress: '124 Convention Boulevard, Metro City • Phone: +91 98765 43210 • Email: billing@grandhorizon.com',
  taxDetails: 'GSTIN: 27AAAAA0000A1Z5 | FSSAI Lic: 10020011000123',
  selectedLogoId: 'gold_crown',
  customLogoUrl: '',
  footerTerms: `1. All payments once settled are final and non-refundable.\n2. Any damages to venue property, sound equipment, or decor during the event will be charged as per actuals.\n3. Cheques are subject to realization.\n4. All legal disputes are strictly subject to Metro City jurisdiction. E. & O.E.`,
  showSignatures: true,
  showWatermark: true,
};

const initialSettledHistory: SettledBill[] = [
  {
    billNo: 'BILL-2026-0841',
    bookingId: 'B-8821',
    customerName: 'Suresh & Priya Wedding',
    customerPhone: '+91 98765 12345',
    hall: 'Grand Crystal Ballroom',
    eventDate: '2026-08-20',
    eventType: 'Wedding Reception',
    pax: 450,
    charges: [
      { id: '1', item: 'Hall Rental (Full Day)', qty: 1, rate: 150000, amount: 150000 },
      { id: '2', item: 'Royal Buffet Menu (450 pax)', qty: 450, rate: 850, amount: 382500 },
      { id: '3', item: 'Floral Stage Decoration & Entry Arch', qty: 1, rate: 45000, amount: 45000 },
      { id: '4', item: 'Pro DJ & Intelligent Lighting System', qty: 1, rate: 25000, amount: 25000 },
    ],
    subtotal: 602500,
    cgst: 54225,
    sgst: 54225,
    grandTotal: 710950,
    advancePaid: 200000,
    advancePayMode: 'Bank Transfer (IMPS)',
    netPaid: 510950,
    paymentMode: 'Credit Card',
    txnRef: 'TXN-99812401',
    settledAt: '2026-08-21 11:30 AM',
    settledBy: 'Manager Rajan',
    isResettled: false,
    version: 1
  },
  {
    billNo: 'BILL-2026-0842',
    bookingId: 'B-8825',
    customerName: 'TechCorp India Pvt Ltd',
    customerPhone: '+91 98111 22334',
    hall: 'Ruby Executive Suite',
    eventDate: '2026-08-25',
    eventType: 'Corporate Summit',
    pax: 120,
    charges: [
      { id: '1', item: 'Hall Rental (Morning Shift)', qty: 1, rate: 45000, amount: 45000 },
      { id: '2', item: 'Executive High-Tea & Lunch Buffet', qty: 120, rate: 650, amount: 78000 },
      { id: '3', item: 'Dual 4K Laser Projector & Audio Setup', qty: 1, rate: 15000, amount: 15000 },
    ],
    subtotal: 138000,
    cgst: 12420,
    sgst: 12420,
    grandTotal: 162840,
    advancePaid: 50000,
    advancePayMode: 'UPI',
    netPaid: 112840,
    paymentMode: 'Corporate NEFT',
    txnRef: 'NEFT-55102941',
    settledAt: '2026-08-25 06:15 PM',
    settledBy: 'Accountant Priya',
    isResettled: true,
    version: 2,
    resettledAt: '2026-08-26 10:15 AM',
    resettledBy: 'Manager Rajan',
    resettlementReason: 'Added late-evening tea snacks & extra projector rental for breakout room.',
    resettlementHistory: [
      {
        resettledAt: '2026-08-26 10:15 AM',
        resettledBy: 'Manager Rajan',
        previousGrandTotal: 147500,
        newGrandTotal: 162840,
        differentialAmount: 15340,
        reason: 'Added late-evening tea snacks & extra projector rental for breakout room.',
        paymentMode: 'UPI',
        txnRef: 'UPI-9812401'
      }
    ]
  },
  {
    billNo: 'BILL-2026-0839',
    bookingId: 'B-8815',
    customerName: 'Karan & Meera Engagement',
    customerPhone: '+91 98450 67890',
    hall: 'Emerald Garden Lawn',
    eventDate: '2026-08-15',
    eventType: 'Ring Ceremony',
    pax: 180,
    charges: [
      { id: '1', item: 'Garden Lawn Rental', qty: 1, rate: 75000, amount: 75000 },
      { id: '2', item: 'High Tea & Dinner Buffet', qty: 180, rate: 600, amount: 108000 },
    ],
    subtotal: 183000,
    cgst: 16470,
    sgst: 16470,
    grandTotal: 215940,
    advancePaid: 50000,
    advancePayMode: 'Cash',
    netPaid: 165940,
    paymentMode: 'UPI',
    txnRef: 'UPI-77182901',
    settledAt: '2026-08-15 09:30 PM',
    settledBy: 'Manager Rajan',
    isCancelled: true,
    cancelledAt: '2026-08-16 11:00 AM',
    cancelledBy: 'Manager Rajan',
    cancellationReason: 'Event cancelled due to sudden extreme rain alert. Full refund granted per management directive.',
    refundAmount: 165940,
    refundMode: 'Bank Transfer (NEFT)',
    refundTxnRef: 'REFUND-NEFT-8812901'
  }
];

const mockActiveBookings = [
  {
    id: 'B-8830',
    customer: 'Dr. Ramesh Sharma',
    phone: '+91 99887 76655',
    email: 'ramesh.sharma@gmail.com',
    hall: 'Crystal Ballroom',
    eventDate: '2026-08-27',
    eventType: 'Silver Jubilee Celebration',
    pax: 350,
    advance: 100000,
    advancePayMode: 'UPI',
    baseHallRate: 120000,
    platePrice: 750,
    foodPlanName: 'Premium Vegetarian Buffet',
    defaultCharges: [
      { id: 'c1', item: 'Hall Rental Fee', qty: 1, rate: 120000, amount: 120000 },
      { id: 'c2', item: 'Catering - Premium Veg Buffet', qty: 350, rate: 750, amount: 262500 },
      { id: 'c3', item: 'Stage Flower Setup', qty: 1, rate: 30000, amount: 30000 },
      { id: 'c4', item: 'Diesel Generator Backup', qty: 4, rate: 2500, amount: 10000 },
    ]
  },
  {
    id: 'B-8831',
    customer: 'Ananya Verma',
    phone: '+91 97766 55443',
    email: 'ananya.v@yahoo.com',
    hall: 'Emerald Sapphire Garden',
    eventDate: '2026-08-28',
    eventType: 'Engagement & Sangeet',
    pax: 200,
    advance: 75000,
    advancePayMode: 'Credit Card',
    baseHallRate: 85000,
    platePrice: 900,
    foodPlanName: 'Royal Non-Veg Feast',
    defaultCharges: [
      { id: 'c1', item: 'Garden & Lawn Rental', qty: 1, rate: 85000, amount: 85000 },
      { id: 'c2', item: 'Catering - Royal Feast', qty: 200, rate: 900, amount: 180000 },
      { id: 'c3', item: 'LED Wall & Sound System', qty: 1, rate: 35000, amount: 35000 },
    ]
  }
];

export default function CheckoutSettlement() {
  const [activeTab, setActiveTab] = useState<'checkout' | 'reprint_history' | 'customizer' | 'cashier_report'>('checkout');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(mockActiveBookings[0].id);
  
  // Customizer Settings State with localStorage persistence
  const [customizerSettings, setCustomizerSettings] = useState<PrintCustomizerSettings>(() => {
    try {
      const saved = localStorage.getItem('banquet_print_customizer_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultCustomizerSettings;
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('banquet_print_customizer_settings', JSON.stringify(customizerSettings));
    } catch (e) {
      console.error(e);
    }
  }, [customizerSettings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper to get current active logo URL
  const getActiveLogoUrl = () => {
    if (customizerSettings.selectedLogoId === 'custom' && customizerSettings.customLogoUrl) {
      return customizerSettings.customLogoUrl;
    }
    const preset = PRESET_LOGOS.find(p => p.id === customizerSettings.selectedLogoId);
    return preset ? preset.url : PRESET_LOGOS[0].url;
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('File too large! Please upload a logo smaller than 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomizerSettings(prev => ({
          ...prev,
          selectedLogoId: 'custom',
          customLogoUrl: result
        }));
        showToast('Custom logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Current editing bill details
  const currentBooking = mockActiveBookings.find(b => b.id === selectedBookingId) || mockActiveBookings[0];
  
  const [customerName, setCustomerName] = useState(currentBooking.customer);
  const [customerPhone, setCustomerPhone] = useState(currentBooking.phone);
  const [hallName, setHallName] = useState(currentBooking.hall);
  const [eventType, setEventType] = useState(currentBooking.eventType);
  const [paxCount, setPaxCount] = useState(currentBooking.pax);
  const [advancePaid, setAdvancePaid] = useState(currentBooking.advance);
  const [advancePayMode, setAdvancePayMode] = useState(currentBooking.advancePayMode);
  const [paymentMode, setPaymentMode] = useState('UPI / QR Code');
  const [txnRef, setTxnRef] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const [charges, setCharges] = useState<ChargeItem[]>(currentBooking.defaultCharges);
  
  // Custom new charge item inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemRate, setNewItemRate] = useState(0);

  // History and Printable Modal state
  const [settledHistory, setSettledHistory] = useState<SettledBill[]>(() => {
    try {
      const saved = localStorage.getItem('banquet_settled_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialSettledHistory;
  });

  useEffect(() => {
    try {
      localStorage.setItem('banquet_settled_history', JSON.stringify(settledHistory));
    } catch (e) {
      console.error(e);
    }
  }, [settledHistory]);

  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState<'all' | 'settled' | 'resettled' | 'cancelled'>('all');
  const [billToPrint, setBillToPrint] = useState<SettledBill | null>(null);

  // Active Checkout Cancel Modal State
  const [showActiveCancelModal, setShowActiveCancelModal] = useState(false);
  const [activeCancelReason, setActiveCancelReason] = useState('Guest requested checkout cancellation/postponement');

  // Settled Bill Cancellation & Void Modal State
  const [cancellingBill, setCancellingBill] = useState<SettledBill | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundMode, setRefundMode] = useState('UPI / QR Code');
  const [refundTxnRef, setRefundTxnRef] = useState('');
  const [cancelledByStaff, setCancelledByStaff] = useState('Manager Rajan');

  // Settled Bill Reinstate State
  const [reinstatingBill, setReinstatingBill] = useState<SettledBill | null>(null);
  const [reinstateReason, setReinstateReason] = useState('');
  const [reinstatedByStaff, setReinstatedByStaff] = useState('Manager Rajan');

  // --- RESETTLEMENT STATE & MODALS ---
  const [resettlingBill, setResettlingBill] = useState<SettledBill | null>(null);
  const [resettlementCharges, setResettlementCharges] = useState<ChargeItem[]>([]);
  const [resettlementReason, setResettlementReason] = useState('');
  const [resettledByStaff, setResettledByStaff] = useState('Manager Rajan');
  const [resettlementPaymentMode, setResettlementPaymentMode] = useState('UPI / QR Code');
  const [resettlementTxnRef, setResettlementTxnRef] = useState('');
  const [resettlementDiscount, setResettlementDiscount] = useState(0);

  // Resettlement Custom Charge Inputs
  const [resNewItemName, setResNewItemName] = useState('');
  const [resNewItemQty, setResNewItemQty] = useState(1);
  const [resNewItemRate, setResNewItemRate] = useState(0);

  // Audit History Modal View
  const [auditTrailModalBill, setAuditTrailModalBill] = useState<SettledBill | null>(null);

  // Synchronize when changing active booking selection
  const handleSelectBooking = (id: string) => {
    setSelectedBookingId(id);
    const bk = mockActiveBookings.find(b => b.id === id);
    if (bk) {
      setCustomerName(bk.customer);
      setCustomerPhone(bk.phone);
      setHallName(bk.hall);
      setEventType(bk.eventType);
      setPaxCount(bk.pax);
      setAdvancePaid(bk.advance);
      setAdvancePayMode(bk.advancePayMode);
      setCharges(bk.defaultCharges);
      setDiscountAmount(0);
      setTxnRef('');
    }
  };

  const handleCancelActiveCheckout = (action: 'reset_form' | 'abort_session') => {
    if (action === 'reset_form') {
      const bk = mockActiveBookings.find(b => b.id === selectedBookingId);
      if (bk) {
        setCustomerName(bk.customer);
        setCustomerPhone(bk.phone);
        setHallName(bk.hall);
        setEventType(bk.eventType);
        setPaxCount(bk.pax);
        setAdvancePaid(bk.advance);
        setAdvancePayMode(bk.advancePayMode);
        setCharges(bk.defaultCharges);
        setDiscountAmount(0);
        setTxnRef('');
      }
      showToast(`Active checkout form reset to original booking defaults for ${selectedBookingId}.`);
    } else {
      showToast(`Active checkout session cancelled for booking ${selectedBookingId}: ${activeCancelReason}`);
    }
    setShowActiveCancelModal(false);
  };

  const handleOpenCancelBillModal = (bill: SettledBill) => {
    setCancellingBill(bill);
    setCancellationReason('');
    setRefundAmount(bill.netPaid);
    setRefundMode(bill.paymentMode || 'UPI / QR Code');
    setRefundTxnRef(`REFUND-${Math.floor(100000 + Math.random() * 900000)}`);
    setCancelledByStaff('Manager Rajan');
  };

  const handleConfirmBillCancellation = () => {
    if (!cancellingBill) return;
    if (!cancellationReason.trim()) {
      showToast('Error: Please provide a cancellation reason.');
      return;
    }

    const timestamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const log: ResettlementLog = {
      resettledAt: timestamp,
      resettledBy: cancelledByStaff || 'Manager Rajan',
      previousGrandTotal: cancellingBill.grandTotal,
      newGrandTotal: 0,
      differentialAmount: -cancellingBill.grandTotal,
      reason: `[CANCELLED & VOIDED] ${cancellationReason.trim()} (Refund: ₹${refundAmount.toLocaleString('en-IN')} via ${refundMode})`,
      paymentMode: refundMode,
      txnRef: refundTxnRef
    };

    const updatedBill: SettledBill = {
      ...cancellingBill,
      isCancelled: true,
      cancelledAt: timestamp,
      cancelledBy: cancelledByStaff || 'Manager Rajan',
      cancellationReason: cancellationReason.trim(),
      refundAmount,
      refundMode,
      refundTxnRef,
      resettlementHistory: [log, ...(cancellingBill.resettlementHistory || [])]
    };

    setSettledHistory(prev => prev.map(b => b.billNo === cancellingBill.billNo ? updatedBill : b));
    showToast(`Bill ${cancellingBill.billNo} VOIDED & CANCELLED! Credit note generated.`);
    setCancellingBill(null);
    triggerPrintBill(updatedBill);
  };

  const handleOpenReinstateBillModal = (bill: SettledBill) => {
    setReinstatingBill(bill);
    setReinstateReason('');
    setReinstatedByStaff('Manager Rajan');
  };

  const handleConfirmBillReinstate = () => {
    if (!reinstatingBill) return;
    if (!reinstateReason.trim()) {
      showToast('Error: Please provide a reinstatement reason.');
      return;
    }

    const timestamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const log: ResettlementLog = {
      resettledAt: timestamp,
      resettledBy: reinstatedByStaff || 'Manager Rajan',
      previousGrandTotal: 0,
      newGrandTotal: reinstatingBill.grandTotal,
      differentialAmount: reinstatingBill.grandTotal,
      reason: `[REINSTATED & REACTIVATED] ${reinstateReason.trim()}`,
      paymentMode: reinstatingBill.paymentMode || 'Original Payment',
      txnRef: reinstatingBill.txnRef || ''
    };

    const updatedBill: SettledBill = {
      ...reinstatingBill,
      isCancelled: false,
      cancelledAt: undefined,
      cancelledBy: undefined,
      cancellationReason: undefined,
      refundAmount: undefined,
      refundMode: undefined,
      refundTxnRef: undefined,
      resettlementHistory: [log, ...(reinstatingBill.resettlementHistory || [])]
    };

    setSettledHistory(prev => prev.map(b => b.billNo === reinstatingBill.billNo ? updatedBill : b));
    showToast(`Bill ${reinstatingBill.billNo} REINSTATED & REACTIVATED!`);
    setReinstatingBill(null);
  };

  const handleAddChargeItem = () => {
    if (!newItemName.trim() || newItemRate <= 0) return;
    const item: ChargeItem = {
      id: Date.now().toString(),
      item: newItemName,
      qty: newItemQty,
      rate: newItemRate,
      amount: newItemQty * newItemRate
    };
    setCharges(prev => [...prev, item]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemRate(0);
  };

  const handleRemoveChargeItem = (id: string) => {
    setCharges(prev => prev.filter(c => c.id !== id));
  };

  // Tax and Total calculations for active checkout
  const subtotal = Math.max(0, charges.reduce((sum, item) => sum + item.amount, 0) - discountAmount);
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const grandTotal = subtotal + cgst + sgst;
  const balanceDue = grandTotal - advancePaid;

  // Print helper function using Customizer Settings
  const triggerPrintBill = (bill: SettledBill) => {
    setBillToPrint(bill);
    const activeLogoUrl = getActiveLogoUrl();
    const logoHtml = activeLogoUrl ? `<img src="${activeLogoUrl}" alt="Venue Logo" style="max-height: 60px; max-width: 160px; margin-bottom: 8px; display: inline-block;" />` : '';

    const watermarkText = bill.isCancelled 
      ? 'VOID / CANCELLED' 
      : bill.isResettled 
        ? `REVISED & RESETTLED (REV-${bill.version || 2})` 
        : 'PAID & SETTLED';

    const watermarkColor = bill.isCancelled ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.12)';

    const watermarkHtml = customizerSettings.showWatermark ? `
      <div style="position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 42px; font-weight: 900; color: ${watermarkColor}; border: 6px solid ${watermarkColor}; padding: 8px 30px; border-radius: 12px; pointer-events: none; z-index: -1; text-transform: uppercase; text-align: center;">
        ${watermarkText}
      </div>
    ` : '';

    const signaturesHtml = customizerSettings.showSignatures ? `
      <div class="signatures">
        <div class="sig-box">Guest Signature</div>
        <div class="sig-box">Authorized Manager Signature</div>
      </div>
    ` : '';

    const formattedTerms = customizerSettings.footerTerms.trim();
    const termsBlockHtml = formattedTerms ? `
      <div style="text-align: left; background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
        <strong style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin-bottom: 6px;">Terms & Conditions / Policy Notes:</strong>
        <div style="font-size: 10.5px; color: #64748b; line-height: 1.5; white-space: pre-line;">${formattedTerms}</div>
      </div>
    ` : '';

    const cancellationCalloutHtml = bill.isCancelled ? `
      <div style="background: #fef2f2; border: 2px solid #ef4444; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 11.5px;">
        <div style="font-weight: 800; color: #b91c1c; text-transform: uppercase; font-size: 12px; margin-bottom: 6px; display: flex; justify-content: space-between;">
          <span>⛔ INVOICE CANCELLED & VOIDED RECEIPT (CREDIT NOTE)</span>
          <span>Cancelled At: ${bill.cancelledAt || 'Recent'}</span>
        </div>
        <div style="color: #991b1b; line-height: 1.5;">
          <strong>Cancellation Reason:</strong> ${bill.cancellationReason || 'Requested by guest or management.'}<br/>
          <strong>Refund Amount Issued:</strong> ₹${(bill.refundAmount !== undefined ? bill.refundAmount : bill.netPaid).toLocaleString('en-IN')} via ${bill.refundMode || 'Original Payment Mode'} ${bill.refundTxnRef ? `(Ref: ${bill.refundTxnRef})` : ''}<br/>
          <strong>Authorized By Manager:</strong> ${bill.cancelledBy || 'Duty Manager'}
        </div>
      </div>
    ` : '';

    const resettlementCalloutHtml = bill.isResettled && !bill.isCancelled ? `
      <div style="background: #fffbebfb; border: 1.5px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 11.5px;">
        <div style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 11px; margin-bottom: 4px; display: flex; justify-content: space-between;">
          <span>⚠️ REVISED & RESETTLED INVOICE SUMMARY (REV-${bill.version || 2})</span>
          <span>Resettled At: ${bill.resettledAt || 'Recent'}</span>
        </div>
        <div style="color: #78350f; line-height: 1.4;">
          <strong>Resettlement Reason / Justification:</strong> ${bill.resettlementReason || 'Adjustment of charges or services post-checkout.'}<br/>
          <strong>Resettled By Staff:</strong> ${bill.resettledBy || 'Duty Manager'}
        </div>
      </div>
    ` : '';

    const badgeText = bill.isCancelled 
      ? 'OFFICIAL CREDIT NOTE / VOIDED INVOICE' 
      : bill.isResettled 
        ? `REVISED & RESETTLED TAX INVOICE (REV-${bill.version || 2})` 
        : 'FINAL CHECKOUT TAX INVOICE';

    const badgeBg = bill.isCancelled ? '#dc2626' : bill.isResettled ? '#b45309' : '#0f172a';

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Checkout Bill - ${bill.billNo}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; max-width: 800px; margin: 0 auto; position: relative; }
              .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
              .header h1 { margin: 4px 0 0 0; font-size: 22px; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; }
              .header p { margin: 3px 0; font-size: 11.5px; color: #64748b; }
              .badge { display: inline-block; background: ${badgeBg}; color: white; font-weight: bold; font-size: 10.5px; padding: 4px 12px; border-radius: 4px; margin-top: 6px; letter-spacing: 0.5px; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
              .meta-grid div p { margin: 4px 0; font-size: 12px; }
              .meta-grid strong { color: #334155; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
              th { background: #f1f5f9; padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; font-size: 10px; }
              td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
              .text-right { text-align: right; }
              .totals-table { width: 340px; margin-left: auto; margin-bottom: 25px; font-size: 12px; }
              .totals-table td { padding: 6px 10px; }
              .totals-table .grand-total { font-weight: bold; font-size: 14.5px; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; background: #f8fafc; }
              .footer { border-top: 1px dashed #cbd5e1; pt-15; margin-top: 30px; text-align: center; font-size: 11px; color: #64748b; }
              .signatures { display: flex; justify-content: space-between; margin-top: 45px; margin-bottom: 25px; padding: 0 20px; }
              .sig-box { text-align: center; border-top: 1px solid #94a3b8; width: 200px; padding-top: 5px; font-size: 11px; font-weight: bold; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${watermarkHtml}

            <div class="header">
              ${logoHtml}
              <h1>${customizerSettings.venueName}</h1>
              <p>${customizerSettings.venueAddress}</p>
              <p>${customizerSettings.taxDetails}</p>
              <div class="badge">${badgeText}</div>
            </div>

            ${cancellationCalloutHtml}
            ${resettlementCalloutHtml}

            <div class="meta-grid">
              <div>
                <p><strong>Invoice / Bill No:</strong> ${bill.billNo} ${bill.isResettled ? `(Rev ${bill.version || 2})` : ''}</p>
                <p><strong>Booking Reference:</strong> ${bill.bookingId}</p>
                <p><strong>Original Date:</strong> ${bill.settledAt}</p>
                <p><strong>Billed By:</strong> ${bill.settledBy}</p>
              </div>
              <div>
                <p><strong>Customer Name:</strong> ${bill.customerName}</p>
                <p><strong>Contact Phone:</strong> ${bill.customerPhone}</p>
                <p><strong>Hall Assigned:</strong> ${bill.hall}</p>
                <p><strong>Event Type & Pax:</strong> ${bill.eventType} (${bill.pax} Pax)</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Particulars / Description</th>
                  <th class="text-right">Qty / Pax</th>
                  <th class="text-right">Rate (₹)</th>
                  <th class="text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${bill.charges.map((c, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${c.item}</td>
                    <td class="text-right">${c.qty}</td>
                    <td class="text-right">₹${c.rate.toLocaleString('en-IN')}</td>
                    <td class="text-right">₹${c.amount.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <table class="totals-table">
              <tr>
                <td>Subtotal</td>
                <td class="text-right">₹${bill.subtotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>CGST (9%)</td>
                <td class="text-right">₹${bill.cgst.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>SGST (9%)</td>
                <td class="text-right">₹${bill.sgst.toLocaleString('en-IN')}</td>
              </tr>
              <tr class="grand-total">
                <td>Revised Grand Total</td>
                <td class="text-right">₹${bill.grandTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Less: Advance Paid (${bill.advancePayMode})</td>
                <td class="text-right" style="color: #16a34a;">- ₹${bill.advancePaid.toLocaleString('en-IN')}</td>
              </tr>
              <tr style="font-weight: bold; background: #eff6ff; color: #1d4ed8;">
                <td>Net Resettled Amount (${bill.paymentMode})</td>
                <td class="text-right">₹${bill.netPaid.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <p style="font-size: 11px; margin-bottom: 25px;"><strong>Payment Method:</strong> ${bill.paymentMode} ${bill.txnRef ? `(Ref: ${bill.txnRef})` : ''} • <strong>Status:</strong> ${bill.isResettled ? 'RESETTLED & FULLY SETTLED' : 'FULLY PAID & SETTLED'}</p>

            ${signaturesHtml}

            ${termsBlockHtml}

            <div class="footer">
              <p>Thank you for choosing ${customizerSettings.venueName}! We look forward to serving you again.</p>
              <p>This is an official computer-generated tax invoice receipt.</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleConfirmSettlement = () => {
    const billNo = `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const settledBillObj: SettledBill = {
      billNo,
      bookingId: currentBooking.id,
      customerName,
      customerPhone,
      hall: hallName,
      eventDate: currentBooking.eventDate,
      eventType,
      pax: paxCount,
      charges: [...charges],
      subtotal,
      cgst,
      sgst,
      grandTotal,
      advancePaid,
      advancePayMode,
      netPaid: Math.max(0, balanceDue),
      paymentMode,
      txnRef: txnRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      settledAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      settledBy: 'Manager Rajan',
      isResettled: false,
      version: 1
    };

    setSettledHistory(prev => [settledBillObj, ...prev]);
    showToast(`Bill ${billNo} settled successfully! Opening tax invoice receipt.`);
    triggerPrintBill(settledBillObj);
  };

  // --- RESETTLEMENT HANDLERS ---
  const handleOpenResettlementModal = (bill: SettledBill) => {
    setResettlingBill(bill);
    setResettlementCharges(bill.charges.map(c => ({ ...c })));
    setResettlementPaymentMode(bill.paymentMode);
    setResettlementTxnRef(bill.txnRef || '');
    setResettlementReason('');
    setResettledByStaff('Manager Rajan');
    setResettlementDiscount(0);
    setResNewItemName('');
    setResNewItemQty(1);
    setResNewItemRate(0);
  };

  const handleAddResettlementCharge = () => {
    if (!resNewItemName.trim() || resNewItemRate <= 0) return;
    const item: ChargeItem = {
      id: `res-${Date.now()}`,
      item: resNewItemName.trim(),
      qty: resNewItemQty,
      rate: resNewItemRate,
      amount: resNewItemQty * resNewItemRate
    };
    setResettlementCharges(prev => [...prev, item]);
    setResNewItemName('');
    setResNewItemQty(1);
    setResNewItemRate(0);
  };

  const handleRemoveResettlementCharge = (id: string) => {
    setResettlementCharges(prev => prev.filter(c => c.id !== id));
  };

  // Resettlement Calculations
  const resSubtotal = Math.max(0, resettlementCharges.reduce((sum, c) => sum + c.amount, 0) - resettlementDiscount);
  const resCgst = Math.round(resSubtotal * 0.09);
  const resSgst = Math.round(resSubtotal * 0.09);
  const resGrandTotal = resSubtotal + resCgst + resSgst;
  const differentialAmount = resettlingBill ? resGrandTotal - resettlingBill.grandTotal : 0;

  const handleConfirmResettlement = () => {
    if (!resettlingBill) return;
    if (!resettlementReason.trim()) {
      showToast('Error: Please state the reason for bill resettlement.');
      return;
    }

    const timestamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const log: ResettlementLog = {
      resettledAt: timestamp,
      resettledBy: resettledByStaff || 'Manager Rajan',
      previousGrandTotal: resettlingBill.grandTotal,
      newGrandTotal: resGrandTotal,
      differentialAmount: differentialAmount,
      reason: resettlementReason.trim(),
      paymentMode: resettlementPaymentMode,
      txnRef: resettlementTxnRef
    };

    const updatedBill: SettledBill = {
      ...resettlingBill,
      charges: [...resettlementCharges],
      subtotal: resSubtotal,
      cgst: resCgst,
      sgst: resSgst,
      grandTotal: resGrandTotal,
      netPaid: Math.max(0, resGrandTotal - resettlingBill.advancePaid),
      paymentMode: resettlementPaymentMode,
      txnRef: resettlementTxnRef,
      isResettled: true,
      resettledAt: timestamp,
      resettledBy: resettledByStaff || 'Manager Rajan',
      resettlementReason: resettlementReason.trim(),
      version: (resettlingBill.version || 1) + 1,
      resettlementHistory: [log, ...(resettlingBill.resettlementHistory || [])]
    };

    setSettledHistory(prev => prev.map(b => b.billNo === resettlingBill.billNo ? updatedBill : b));
    showToast(`Bill ${resettlingBill.billNo} successfully RESETTLED (Rev ${updatedBill.version})!`);
    setResettlingBill(null);
    triggerPrintBill(updatedBill);
  };

  const filteredHistory = settledHistory.filter(b => {
    const matchesSearch = 
      b.billNo.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      b.hall.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      b.customerPhone.includes(searchHistoryQuery);
    
    if (historyFilterType === 'resettled') {
      return matchesSearch && b.isResettled;
    }
    return matchesSearch;
  });

  return (
    <div className="h-full w-full bg-slate-50/50 p-4 md:p-6 overflow-y-auto">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="text-blue-600" size={24} />
            Checkout Settlement & Bill Resettlement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Finalize banquet charges, generate official tax invoices, re-open past bills for resettlement, and track audit history.
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-200/80 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'checkout'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt size={15} /> Active Checkout
          </button>
          <button
            onClick={() => setActiveTab('reprint_history')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'reprint_history'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw size={15} /> Bill Resettlement & History ({settledHistory.length})
            {settledHistory.some(b => b.isResettled) && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'customizer'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={15} /> Print Bill Customizer
          </button>
          <button
            onClick={() => setActiveTab('cashier_report')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cashier_report'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark size={15} className={activeTab === 'cashier_report' ? 'text-blue-400' : ''} /> Cashier Shift Report
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="mb-4 p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-white/80 hover:text-white text-xs font-normal">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: ACTIVE CHECKOUT SETTLEMENT */}
      {activeTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Booking Selection & Itemized Charges Builder */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Resettlement Link Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-700 rounded-lg">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Need to adjust or re-settle a closed bill?</h4>
                  <p className="text-[11px] text-amber-800">Re-open settled invoices to add post-checkout charges, update payment modes, or issue refunds.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('reprint_history')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
              >
                Go to Resettlement <ArrowRight size={14} />
              </button>
            </div>

            {/* Booking Selector */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Active Booking for Checkout
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockActiveBookings.map(bk => (
                  <button
                    key={bk.id}
                    type="button"
                    onClick={() => handleSelectBooking(bk.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      selectedBookingId === bk.id
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-800">{bk.customer}</span>
                      <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {bk.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p className="font-medium text-blue-900">{bk.hall}</p>
                      <p className="text-[11px] text-slate-500">{bk.eventType} • {bk.pax} Pax</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Event & Customer Meta */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <User size={15} className="text-blue-600" /> Customer & Event Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Customer Name</label>
                  <input 
                    type="text" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium mt-1" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                  <input 
                    type="text" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium mt-1" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Hall Name</label>
                  <input 
                    type="text" 
                    value={hallName} 
                    onChange={e => setHallName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium mt-1" 
                  />
                </div>
              </div>
            </div>

            {/* Itemized Charges Table & Custom Additions */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText size={15} className="text-blue-600" /> Itemized Bill Line-Items
                </h2>
                <span className="text-xs font-bold text-slate-500">{charges.length} Items</span>
              </div>

              {/* Charges List */}
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                {charges.map((c) => (
                  <div key={c.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">{c.item}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {c.qty} × ₹{c.rate.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">
                        ₹{c.amount.toLocaleString('en-IN')}
                      </span>
                      <button 
                        onClick={() => handleRemoveChargeItem(c.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove Line Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Charge Line Item */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                  + Add Additional Service Charge / Add-on
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Extra Cleaning, DJ Extension, Generator Fuel" 
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input 
                    type="number" 
                    min="1" 
                    placeholder="Qty" 
                    value={newItemQty}
                    onChange={e => setNewItemQty(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input 
                    type="number" 
                    min="0" 
                    placeholder="Rate (₹)" 
                    value={newItemRate || ''}
                    onChange={e => setNewItemRate(parseInt(e.target.value) || 0)}
                    className="w-28 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddChargeItem}
                    className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Add Line
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tax Breakdown, Settlement & Instant Print Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-3 flex justify-between items-center">
                <span>Bill Summary & GST Taxes</span>
                <span className="text-blue-600 font-extrabold">{currentBooking.id}</span>
              </h2>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between font-medium">
                  <span>Gross Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-500 pl-2 border-l-2 border-slate-200">
                  <span>CGST (9%)</span>
                  <span>₹{cgst.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-500 pl-2 border-l-2 border-slate-200">
                  <span>SGST (9%)</span>
                  <span>₹{sgst.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-xs font-bold text-slate-800 pt-2 border-t border-slate-100">
                  <span>Grand Total (Incl. GST)</span>
                  <span className="text-sm">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2.5 rounded-lg font-semibold border border-emerald-100">
                  <span>Less: Advance Deposit Paid ({advancePayMode})</span>
                  <span>- ₹{advancePaid.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900 text-base font-black text-slate-900">
                  <span>Net Payable Amount</span>
                  <span className="text-blue-700 text-xl">₹{Math.max(0, balanceDue).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Settlement Options */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                  Final Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['UPI / QR Code', 'Credit Card', 'Cash', 'Bank Transfer'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        paymentMode === mode
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mt-2 mb-1">
                    Transaction / Ref No. (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-99182301 or Card Auth #1294"
                    value={txnRef}
                    onChange={e => setTxnRef(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmSettlement}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Printer size={16} /> Confirm Settlement & Print Tax Bill
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowActiveCancelModal(true)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-3 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    title="Cancel active checkout process or reset form"
                  >
                    <XCircle size={16} /> Cancel Checkout
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-400">
                  Clicking "Confirm Settlement" records the transaction in history and prints receipt. "Cancel Checkout" resets or aborts the session.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPRINT & RESETTLEMENT HISTORY */}
      {activeTab === 'reprint_history' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={e => setSearchHistoryQuery(e.target.value)}
                placeholder="Search past bills by Invoice #, Customer Name, Booking ID, Phone, or Hall..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setHistoryFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  historyFilterType === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Bills ({settledHistory.length})
              </button>
              <button
                onClick={() => setHistoryFilterType('settled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  historyFilterType === 'settled'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Normal Settled ({settledHistory.filter(b => !b.isResettled && !b.isCancelled).length})
              </button>
              <button
                onClick={() => setHistoryFilterType('resettled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  historyFilterType === 'resettled'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <RefreshCw size={12} /> Resettled ({settledHistory.filter(b => b.isResettled && !b.isCancelled).length})
              </button>
              <button
                onClick={() => setHistoryFilterType('cancelled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  historyFilterType === 'cancelled'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                <Ban size={12} /> Voided / Cancelled ({settledHistory.filter(b => b.isCancelled).length})
              </button>
            </div>
          </div>

          {/* Bills List Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Closed Bills Directory ({filteredHistory.length})
              </h3>
              <span className="text-[11px] text-slate-500">
                Re-settle or void/cancel settled invoices with automated credit note generation.
              </span>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Receipt className="mx-auto text-slate-300" size={36} />
                <p className="text-xs font-bold text-slate-600">No settled bills match your search criteria.</p>
                <p className="text-[11px] text-slate-400">Try searching for a different customer name or invoice number.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="p-3">Invoice # / Booking</th>
                      <th className="p-3">Customer & Event Details</th>
                      <th className="p-3">Date & Settled By</th>
                      <th className="p-3 text-right">Grand Total</th>
                      <th className="p-3 text-right">Net Paid</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3 text-center">Status / Version</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((bill) => (
                      <tr key={bill.billNo} className={`transition-colors ${bill.isCancelled ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-slate-50/80'}`}>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          <div className={bill.isCancelled ? 'line-through text-red-700' : ''}>{bill.billNo}</div>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {bill.bookingId}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{bill.customerName}</p>
                          <p className="text-[11px] text-slate-500">{bill.customerPhone} • {bill.hall}</p>
                          <span className="text-[10px] text-slate-400">{bill.eventType} ({bill.pax} Pax)</span>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-slate-700">{bill.settledAt}</p>
                          <p className="text-[10px] text-slate-400">By {bill.settledBy}</p>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{bill.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-extrabold text-blue-700">
                          ₹{bill.netPaid.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                            {bill.paymentMode}
                          </span>
                          {bill.txnRef && (
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{bill.txnRef}</p>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {bill.isCancelled ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
                                <Ban size={10} /> VOIDED
                              </span>
                              <span className="text-[9.5px] text-red-600 mt-0.5">Credit Note</span>
                            </div>
                          ) : bill.isResettled ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                                <RefreshCw size={10} className="animate-spin-slow" /> REV-{bill.version || 2}
                              </span>
                              <span className="text-[9.5px] text-slate-400 mt-0.5">Resettled</span>
                            </div>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                              Settled v1
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => triggerPrintBill(bill)}
                              className={`p-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                                bill.isCancelled 
                                  ? 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title={bill.isCancelled ? "Print Credit Note / Cancelled Receipt" : "Print Invoice Copy"}
                            >
                              <Printer size={13} /> {bill.isCancelled ? 'Credit Note' : 'Print'}
                            </button>

                            {bill.isCancelled ? (
                              <button
                                onClick={() => handleOpenReinstateBillModal(bill)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                title="Reinstate / Reactivate cancelled bill back to Settled status"
                              >
                                <Undo2 size={13} /> Reinstate
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleOpenResettlementModal(bill)}
                                  className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                  title="Re-Settle / Adjust Closed Bill"
                                >
                                  <RefreshCw size={13} /> Re-Settle
                                </button>

                                <button
                                  onClick={() => handleOpenCancelBillModal(bill)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                                  title="Cancel / Void Settled Invoice & Issue Refund Credit Note"
                                >
                                  <XCircle size={13} /> Void / Cancel
                                </button>
                              </>
                            )}

                            {(bill.isResettled || bill.isCancelled) && (
                              <button
                                onClick={() => setAuditTrailModalBill(bill)}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors border border-blue-200"
                                title="View Resettlement & Cancellation Audit Trail"
                              >
                                <History size={13} /> Audit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESETTLEMENT EDIT DRAWER MODAL */}
      {resettlingBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    Checkout Bill Resettlement Mode ({resettlingBill.billNo})
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    Re-open settled invoice • Current Version: REV-{resettlingBill.version || 1}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setResettlingBill(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Customer & Original Summary Snapshot */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Customer Name</label>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{resettlingBill.customerName}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Hall & Pax</label>
                  <p className="font-medium text-slate-700 text-xs mt-0.5">{resettlingBill.hall} ({resettlingBill.pax} Pax)</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Original Settled Total</label>
                  <p className="font-extrabold text-slate-900 text-xs mt-0.5">₹{resettlingBill.grandTotal.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Advance Deposit Paid</label>
                  <p className="font-bold text-emerald-700 text-xs mt-0.5">₹{resettlingBill.advancePaid.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Itemized Line Item Adjustments */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Edit3 size={15} className="text-amber-600" /> Resettlement Line Items & Charges
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">{resettlementCharges.length} Charges</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {resettlementCharges.map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800">{c.item}</p>
                        <p className="text-[11px] text-slate-500">Qty: {c.qty} × ₹{c.rate.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">₹{c.amount.toLocaleString('en-IN')}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChargeItem(c.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Presets for Common Post-Checkout Additions */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    Quick Add Post-Checkout Ancillary Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Extra Food Plates (20 Pax)', qty: 20, rate: 750 },
                      { name: 'Late Hour DJ Extension (1 hr)', qty: 1, rate: 5000 },
                      { name: 'Damage Clearance Fee', qty: 1, rate: 3500 },
                      { name: 'Extra Beverage Service', qty: 1, rate: 4500 }
                    ].map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          const item: ChargeItem = {
                            id: `preset-${Date.now()}`,
                            item: preset.name,
                            qty: preset.qty,
                            rate: preset.rate,
                            amount: preset.qty * preset.rate
                          };
                          setResettlementCharges(prev => [...prev, item]);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[10.5px] px-2.5 py-1 rounded-lg transition-colors"
                      >
                        + {preset.name} (+₹{(preset.qty * preset.rate).toLocaleString('en-IN')})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Charge Line Item */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">
                    + Add Custom Charge / Service Adjustment
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Additional Valet Parking Staff"
                      value={resNewItemName}
                      onChange={e => setResNewItemName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={resNewItemQty}
                      onChange={e => setResNewItemQty(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Rate (₹)"
                      value={resNewItemRate || ''}
                      onChange={e => setResNewItemRate(parseInt(e.target.value) || 0)}
                      className="w-28 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddResettlementCharge}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Resettlement Calculation Summary & Differential */}
              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Revised Resettlement Calculation</span>
                  <span>Rev Version: REV-{(resettlingBill.version || 1) + 1}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Revised Gross Subtotal</span>
                    <span className="font-bold text-white">₹{resSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GST Output Tax (18%)</span>
                    <span className="font-bold text-white">₹{(resCgst + resSgst).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">New Grand Total</span>
                    <span className="font-extrabold text-amber-300 text-sm">₹{resGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Previous Settled Total</span>
                    <span className="font-bold text-slate-300">₹{resettlingBill.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Differential Adjustment Indicator */}
                <div className={`p-3 rounded-lg border font-bold flex items-center justify-between ${
                  differentialAmount > 0
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : differentialAmount < 0
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {differentialAmount > 0
                      ? 'Additional Differential Payment to Collect from Guest:'
                      : differentialAmount < 0
                      ? 'Refund / Credit Note Balance Due to Guest:'
                      : 'No Net Financial Difference (Re-classification / Mode Change):'}
                  </span>
                  <span className="text-base font-black">
                    {differentialAmount >= 0 ? `+ ₹${differentialAmount.toLocaleString('en-IN')}` : `- ₹${Math.abs(differentialAmount).toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Justification & Staff Signoff */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Mandatory Resettlement Reason / Justification <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={resettlementReason}
                    onChange={e => setResettlementReason(e.target.value)}
                    placeholder="e.g. Added 20 extra dinner plates consumed after midnight & extended hall sound system by 1 hour."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Resettled By (Staff / Manager Name)
                  </label>
                  <input
                    type="text"
                    value={resettledByStaff}
                    onChange={e => setResettledByStaff(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Payment Mode for Adjustment
                  </label>
                  <select
                    value={resettlementPaymentMode}
                    onChange={e => setResettlementPaymentMode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-slate-500">
                Confirming will record an audit log entry and print the revised tax invoice.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResettlingBill(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResettlement}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Printer size={15} /> Confirm Resettlement & Print Revised Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL MODAL FOR RESETTLED BILLS */}
      {auditTrailModalBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="text-blue-600" size={20} />
                <h3 className="text-sm font-bold text-slate-900">
                  Resettlement Audit Log ({auditTrailModalBill.billNo})
                </h3>
              </div>
              <button
                onClick={() => setAuditTrailModalBill(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {(auditTrailModalBill.resettlementHistory || []).map((log, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Resettlement Revision #{ (auditTrailModalBill.resettlementHistory?.length || 0) - idx }</span>
                    <span className="text-slate-500 font-normal">{log.resettledAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong>Resettled By:</strong> {log.resettledBy} • <strong>Payment Mode:</strong> {log.paymentMode}
                  </p>
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                    <strong>Reason:</strong> {log.reason}
                  </p>
                  <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    <span>Previous Total: ₹{log.previousGrandTotal.toLocaleString('en-IN')}</span>
                    <span className="font-bold text-slate-900">New Total: ₹{log.newGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setAuditTrailModalBill(null)}
                className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINT BILL CUSTOMIZER */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Customizer Controls */}
          <div className="lg:col-span-6 space-y-5">
            {/* Header Branding Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Building size={15} className="text-blue-600" /> Venue Header & Tax Registration
              </h2>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Venue / Business Title
                </label>
                <input
                  type="text"
                  value={customizerSettings.venueName}
                  onChange={e => setCustomizerSettings(prev => ({ ...prev, venueName: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Grand Horizon Banquet & Convention Hall"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Address & Contact Details Line
                </label>
                <input
                  type="text"
                  value={customizerSettings.venueAddress}
                  onChange={e => setCustomizerSettings(prev => ({ ...prev, venueAddress: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 124 Convention Boulevard, Metro City • Phone: +91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  GSTIN & Tax Registration License
                </label>
                <input
                  type="text"
                  value={customizerSettings.taxDetails}
                  onChange={e => setCustomizerSettings(prev => ({ ...prev, taxDetails: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. GSTIN: 27AAAAA0000A1Z5 | FSSAI Lic: 10020011000123"
                />
              </div>
            </div>

            {/* Logo Selection & Custom Upload */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <ImageIcon size={15} className="text-blue-600" /> Invoice Branding Logo
                </span>
                <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, SVG supported</span>
              </h2>

              {/* Logo Presets */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                  Select Preset Emblem / Logo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_LOGOS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCustomizerSettings(prev => ({ ...prev, selectedLogoId: preset.id }))}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                        customizerSettings.selectedLogoId === preset.id
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="h-8 w-8 object-contain" />
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Logo File */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">
                  Or Upload Custom Brand Logo File
                </label>
                
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="logo-upload-input"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Upload size={14} /> Choose Logo Image...
                  </label>

                  {customizerSettings.selectedLogoId === 'custom' && customizerSettings.customLogoUrl && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
                      <img src={customizerSettings.customLogoUrl} alt="Custom Logo" className="h-6 max-w-20 object-contain" />
                      <span className="text-[10px] font-bold text-emerald-800">Custom Uploaded</span>
                      <button
                        type="button"
                        onClick={() => setCustomizerSettings(prev => ({ ...prev, selectedLogoId: 'gold_crown', customLogoUrl: '' }))}
                        className="text-slate-400 hover:text-rose-600 ml-1"
                        title="Remove Custom Logo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Terms & Policy Customizer */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText size={15} className="text-blue-600" /> Custom Footer Terms & Policies
                </h2>
              </div>

              {/* Template Presets */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                  Quick Term Template Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TERMS.map((term) => (
                    <button
                      key={term.name}
                      type="button"
                      onClick={() => setCustomizerSettings(prev => ({ ...prev, footerTerms: term.text }))}
                      className="text-[11px] font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                    >
                      + {term.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Footer Terms & Conditions (PDF / Print Text)
                </label>
                <textarea
                  rows={4}
                  value={customizerSettings.footerTerms}
                  onChange={e => setCustomizerSettings(prev => ({ ...prev, footerTerms: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                  placeholder="Enter custom terms line-by-line..."
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  These terms will be formatted neatly at the bottom of all generated printable PDF bills.
                </p>
              </div>
            </div>

            {/* Layout Options & Actions */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <ShieldCheck size={15} className="text-blue-600" /> Print Display & Watermark Options
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={customizerSettings.showSignatures}
                    onChange={e => setCustomizerSettings(prev => ({ ...prev, showSignatures: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Include Guest & Manager Signatures</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={customizerSettings.showWatermark}
                    onChange={e => setCustomizerSettings(prev => ({ ...prev, showWatermark: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Include 'PAID & SETTLED' Watermark</span>
                </label>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => showToast('Customizer settings saved & persisted to system memory!')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Save size={15} /> Save Customizer Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomizerSettings(defaultCustomizerSettings);
                    showToast('Reset to factory default print settings.');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200"
                >
                  <RefreshCw size={14} /> Reset Defaults
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Live Print Preview */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 text-white p-4 rounded-t-xl flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Eye size={15} className="text-blue-400" /> Live Interactive Invoice Print Preview
              </span>
              <button
                onClick={() => triggerPrintBill(initialSettledHistory[0])}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <Printer size={13} /> Test Print Output
              </button>
            </div>

            {/* Simulated Printed Paper */}
            <div className="bg-white border-x border-b border-slate-300 rounded-b-xl p-6 shadow-md text-slate-800 space-y-4 relative overflow-hidden">
              {/* Watermark in preview if enabled */}
              {customizerSettings.showWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-emerald-500/10 font-black text-5xl uppercase border-8 border-emerald-500/10 px-6 py-2 rounded-2xl -rotate-25">
                    PAID & SETTLED
                  </span>
                </div>
              )}

              {/* Preview Header */}
              <div className="text-center border-b-2 border-slate-900 pb-3">
                {getActiveLogoUrl() && (
                  <img src={getActiveLogoUrl()} alt="Venue Logo" className="h-12 mx-auto mb-2 object-contain" />
                )}
                <h3 className="font-bold text-base text-slate-900 uppercase tracking-tight">{customizerSettings.venueName}</h3>
                <p className="text-[11px] text-slate-500">{customizerSettings.venueAddress}</p>
                <p className="text-[10px] text-slate-400 font-medium">{customizerSettings.taxDetails}</p>
                <span className="inline-block bg-slate-900 text-white font-bold text-[9px] px-2.5 py-0.5 rounded mt-2 uppercase tracking-wide">
                  FINAL CHECKOUT TAX INVOICE
                </span>
              </div>

              {/* Preview Meta Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
                <div>
                  <p><strong className="text-slate-700">Invoice No:</strong> SAMPLE-2026-0901</p>
                  <p><strong className="text-slate-700">Settlement Date:</strong> Sep 02, 2026</p>
                </div>
                <div>
                  <p><strong className="text-slate-700">Customer:</strong> Dr. Ramesh Sharma</p>
                  <p><strong className="text-slate-700">Hall:</strong> Crystal Ballroom (350 Pax)</p>
                </div>
              </div>

              {/* Preview Line Items */}
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[9px] text-slate-600">
                    <th className="p-1.5 text-left">Particulars</th>
                    <th className="p-1.5 text-right">Qty</th>
                    <th className="p-1.5 text-right">Rate</th>
                    <th className="p-1.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-1.5">Hall Rental Fee</td>
                    <td className="p-1.5 text-right">1</td>
                    <td className="p-1.5 text-right">₹1,20,000</td>
                    <td className="p-1.5 text-right font-medium">₹1,20,000</td>
                  </tr>
                  <tr>
                    <td className="p-1.5">Catering - Premium Veg Buffet</td>
                    <td className="p-1.5 text-right">350</td>
                    <td className="p-1.5 text-right">₹750</td>
                    <td className="p-1.5 text-right font-medium">₹2,62,500</td>
                  </tr>
                </tbody>
              </table>

              {/* Preview Totals */}
              <div className="w-56 ml-auto space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹3,82,500</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CGST (9%) + SGST (9%)</span>
                  <span>₹68,850</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-b border-slate-900">
                  <span>Grand Total</span>
                  <span>₹4,51,350</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Less: Advance Paid</span>
                  <span>- ₹1,00,000</span>
                </div>
                <div className="flex justify-between font-extrabold text-blue-800 bg-blue-50 p-1 rounded">
                  <span>Net Settled Amount</span>
                  <span>₹3,51,350</span>
                </div>
              </div>

              {/* Signatures Preview */}
              {customizerSettings.showSignatures && (
                <div className="flex justify-between pt-6 border-t border-slate-200 text-[10px] font-bold text-slate-500">
                  <div className="border-t border-slate-400 w-36 text-center pt-1">Guest Signature</div>
                  <div className="border-t border-slate-400 w-36 text-center pt-1">Authorized Manager</div>
                </div>
              )}

              {/* Footer Terms Preview */}
              {customizerSettings.footerTerms.trim() && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-600">
                  <strong className="block font-bold text-[9px] uppercase tracking-wide text-slate-700 mb-1">
                    Terms & Conditions / Policy Notes:
                  </strong>
                  <div className="whitespace-pre-line leading-normal text-slate-500 font-mono text-[9.5px]">
                    {customizerSettings.footerTerms}
                  </div>
                </div>
              )}

              <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-200">
                Thank you for choosing {customizerSettings.venueName}!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CASHIER SHIFT REPORT */}
      {activeTab === 'cashier_report' && (
        <CashierReport />
      )}

      {/* MODAL 1: CANCEL ACTIVE CHECKOUT SESSION / RESET FORM */}
      {showActiveCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-red-700 rounded-xl">
                  <XCircle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Cancel Active Checkout Session</h3>
                  <p className="text-xs text-slate-500">Booking Reference: <span className="font-mono font-bold text-slate-700">{selectedBookingId}</span> ({customerName})</p>
                </div>
              </div>
              <button
                onClick={() => setShowActiveCancelModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Choose your cancellation / reset preference:</strong>
                  <p className="mt-0.5 text-amber-800">You can either reset the checkout form line items back to default booking values, or abort the active settlement session.</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Cancellation / Reset Reason
                </label>
                <select
                  value={activeCancelReason}
                  onChange={e => setActiveCancelReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                >
                  <option value="Guest requested checkout cancellation/postponement">Guest requested checkout cancellation / postponement</option>
                  <option value="Billing discrepancy / recalculation required">Billing discrepancy / recalculation required</option>
                  <option value="Payment processing failed / card declined">Payment processing failed / card declined</option>
                  <option value="Duplicate checkout entry created">Duplicate checkout entry created</option>
                  <option value="Event date or hall shift required">Event date or hall shift required</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleCancelActiveCheckout('reset_form')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-between border border-slate-200 group"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-blue-600" />
                    <div className="text-left">
                      <p className="font-bold">1. Reset Form to Original Booking Defaults</p>
                      <p className="text-[10px] text-slate-500 font-normal">Restores initial line items & clears custom discounts/refs.</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleCancelActiveCheckout('abort_session')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-between shadow-sm group"
                >
                  <div className="flex items-center gap-2">
                    <Ban size={16} />
                    <div className="text-left">
                      <p className="font-bold">2. Abort & Clear Active Checkout Session</p>
                      <p className="text-[10px] text-red-100 font-normal">Cancels current checkout attempt without finalizing a bill.</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-red-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowActiveCancelModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close & Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL / VOID SETTLED BILL & ISSUE CREDIT NOTE */}
      {cancellingBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                  <Ban size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Void Invoice & Issue Credit Note</h3>
                  <p className="text-xs text-slate-500">Invoice: <span className="font-mono font-bold text-red-700">{cancellingBill.billNo}</span> • Booking <span className="font-mono text-slate-700">{cancellingBill.bookingId}</span></p>
                </div>
              </div>
              <button
                onClick={() => setCancellingBill(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Customer Name</p>
                  <p className="font-bold text-slate-800">{cancellingBill.customerName}</p>
                  <p className="text-[10px] text-slate-500">{cancellingBill.hall} ({cancellingBill.pax} Pax)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Originally Paid Net</p>
                  <p className="font-extrabold text-blue-700 text-sm">₹{cancellingBill.netPaid.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-500">via {cancellingBill.paymentMode}</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-900 flex items-start gap-2">
                <AlertOctagon size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Warning:</strong> Voiding this invoice will invalidate the tax document and mark it as <strong>CANCELLED</strong> in history. A printable <strong>Credit Note</strong> receipt with watermark will be generated.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Cancellation & Refund Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={cancellationReason}
                  onChange={e => setCancellationReason(e.target.value)}
                  placeholder="e.g. Guest cancelled booking due to emergency; full refund approved by director."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Refund Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={e => setRefundAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Refund Mode
                  </label>
                  <select
                    value={refundMode}
                    onChange={e => setRefundMode(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  >
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card Reversal">Credit Card Reversal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Refund Txn Ref / Slip #
                  </label>
                  <input
                    type="text"
                    value={refundTxnRef}
                    onChange={e => setRefundTxnRef(e.target.value)}
                    placeholder="e.g. REFUND-99182"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Authorized By Manager
                  </label>
                  <input
                    type="text"
                    value={cancelledByStaff}
                    onChange={e => setCancelledByStaff(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellingBill(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleConfirmBillCancellation}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Ban size={15} /> Confirm Void & Print Credit Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REINSTATE / REACTIVATE CANCELLED BILL */}
      {reinstatingBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Undo2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Reinstate & Reactivate Invoice</h3>
                  <p className="text-xs text-slate-500">Invoice: <span className="font-mono font-bold text-emerald-700">{reinstatingBill.billNo}</span> • Booking <span className="font-mono text-slate-700">{reinstatingBill.bookingId}</span></p>
                </div>
              </div>
              <button
                onClick={() => setReinstatingBill(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Customer Name</p>
                  <p className="font-bold text-slate-800">{reinstatingBill.customerName}</p>
                  <p className="text-[10px] text-slate-500">{reinstatingBill.hall} ({reinstatingBill.pax} Pax)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Reactivated Invoice Total</p>
                  <p className="font-extrabold text-emerald-700 text-sm">₹{reinstatingBill.grandTotal.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-500">Advance Paid: ₹{reinstatingBill.advancePaid.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <p>
                  <strong>Security Directive:</strong> Reinstating this invoice will revoke the cancelled/voided status, restore its active entry in the sales books, and mark it back as <strong>SETTLED</strong>. An audit log recording this action will be appended to the transaction trail.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Reason for Reinstatement <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={reinstateReason}
                  onChange={e => setReinstateReason(e.target.value)}
                  placeholder="e.g. Booking reinstated after guest cleared dual transaction discrepancy / client re-scheduled."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Authorized By Manager
                </label>
                <input
                  type="text"
                  value={reinstatedByStaff}
                  onChange={e => setReinstatedByStaff(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReinstatingBill(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleConfirmBillReinstate}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Undo2 size={15} /> Confirm Reinstate & Reactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
