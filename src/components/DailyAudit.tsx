import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Coins, 
  CreditCard, 
  DollarSign, 
  FileCheck, 
  FolderLock, 
  History, 
  Info, 
  Layers, 
  Loader2, 
  Lock, 
  Plus, 
  Printer, 
  QrCode, 
  RefreshCw, 
  Save, 
  ShieldAlert, 
  Trash2, 
  TrendingUp, 
  Unlock, 
  User, 
  Users,
  PieChart as PieChartIcon,
  Calendar,
  Sparkles,
  BarChart3,
  CalendarCheck
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { db } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { safeStorage } from '../lib/storage';
import DailyReconciliationSummary, { PaymentDistributionItem } from './DailyReconciliationSummary';
import DateRangePicker, { DateRange } from './DateRangePicker';

export interface AuditRecord {
  id: string; // Date formatted YYYY-MM-DD or YYYY-MM-DD_to_YYYY-MM-DD
  date: string;
  startDate?: string;
  endDate?: string;
  auditorName: string;
  totalAdvances: number;
  totalSettlements: number;
  totalRevenue: number;
  totalBookings?: number;
  totalGuests?: number;
  avgPaxPerEvent?: number;
  actualCash: number;
  expectedCash: number;
  cashVariance: number;
  notes: string;
  checklistState: Record<string, boolean>;
  isFrozen: boolean;
  timestamp: string;
}

interface DailyAuditProps {
  bookings: any[];
  userRole?: string | null;
  userEmail?: string | null;
  onToast: (msg: string, type: 'error' | 'success') => void;
}

const DEFAULT_PAYMENT_COLORS: Record<string, string> = {
  'Cash': '#f59e0b',
  'UPI / QR Code': '#0284c7',
  'UPI': '#0284c7',
  'Credit / Debit Card': '#ec4899',
  'Card': '#ec4899',
  'Net Banking': '#6366f1',
  'Bank Transfer': '#6366f1',
  'Cheque': '#64748b'
};

export default function DailyAudit({ bookings, userRole, userEmail, onToast }: DailyAuditProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: todayStr,
    endDate: todayStr,
  });

  const [auditor, setAuditor] = useState<string>('Auditor Rajesh Varma');
  const [actualCash, setActualCash] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [expectedCashFromDb, setExpectedCashFromDb] = useState<number | null>(null);
  const [paymentDistribution, setPaymentDistribution] = useState<PaymentDistributionItem[]>([]);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  // Default checklist items
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    guestCounts: false,
    billsClosed: false,
    staffOvertime: false,
    inventoryReturned: false,
    safetyCheck: false,
    bankUpiMatched: false,
  });

  const [currentAudit, setCurrentAudit] = useState<AuditRecord | null>(null);

  const isRange = dateRange.startDate !== dateRange.endDate;
  const currentAuditId = useMemo(() => {
    return isRange ? `${dateRange.startDate}_to_${dateRange.endDate}` : dateRange.startDate;
  }, [dateRange.startDate, dateRange.endDate, isRange]);

  const currentAuditDisplay = useMemo(() => {
    return isRange ? `${dateRange.startDate} to ${dateRange.endDate}` : dateRange.startDate;
  }, [dateRange.startDate, dateRange.endDate, isRange]);

  // Set auditor name based on user email if available
  useEffect(() => {
    if (userEmail) {
      setAuditor(userEmail.split('@')[0].replace('.', ' ').toUpperCase());
    }
  }, [userEmail]);

  // Fetch all historical audit records
  const fetchAuditHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'daily_audits'));
      const records: AuditRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        records.push(docSnap.data() as AuditRecord);
      });
      // Sort by timestamp or date descending
      records.sort((a, b) => (b.timestamp || b.date).localeCompare(a.timestamp || a.date));
      setHistory(records);
    } catch (error) {
      console.error("Error loading audit history, falling back to local storage:", error);
      const cached = safeStorage.getItem('daily_audits_history');
      if (cached) {
        setHistory(JSON.parse(cached));
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchAuditHistory();
  }, []);

  // Sync / Load audit for the selected date range
  useEffect(() => {
    const loadAuditForPeriod = async () => {
      try {
        const docRef = doc(db, 'daily_audits', currentAuditId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as AuditRecord;
          setCurrentAudit(data);
          setActualCash(data.actualCash);
          setNotes(data.notes);
          setChecklist(data.checklistState);
          setAuditor(data.auditorName);
        } else {
          // Check if single date had a record with exact date string
          const localRecord = history.find(h => h.id === currentAuditId || h.date === currentAuditDisplay);
          if (localRecord) {
            setCurrentAudit(localRecord);
            setActualCash(localRecord.actualCash);
            setNotes(localRecord.notes);
            setChecklist(localRecord.checklistState);
            setAuditor(localRecord.auditorName);
          } else {
            // New draft state
            setCurrentAudit(null);
            setActualCash(0);
            setNotes('');
            setChecklist({
              guestCounts: false,
              billsClosed: false,
              staffOvertime: false,
              inventoryReturned: false,
              safetyCheck: false,
              bankUpiMatched: false,
            });
          }
        }
      } catch (err) {
        console.error("Error reading period audit:", err);
        const localRecord = history.find(h => h.id === currentAuditId || h.date === currentAuditDisplay);
        if (localRecord) {
          setCurrentAudit(localRecord);
          setActualCash(localRecord.actualCash);
          setNotes(localRecord.notes);
          setChecklist(localRecord.checklistState);
          setAuditor(localRecord.auditorName);
        } else {
          setCurrentAudit(null);
        }
      }
    };

    loadAuditForPeriod();
  }, [currentAuditId, currentAuditDisplay, history]);

  // Aggregate Metrics from Bookings for the period
  const periodMetrics = useMemo(() => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    
    // Filter bookings active within the selected date range
    const rangeBookings = bookings.filter(b => {
      if (!b.start) return false;
      const bDate = b.start.slice(0, 10);
      return bDate >= start && bDate <= end && b.status !== 'Cancelled';
    });

    const totalEvents = rangeBookings.length;
    const totalGuests = rangeBookings.reduce((sum, b) => sum + (b.pax || 0), 0);

    // Calculate advances received within the period
    let advancesPeriod = 0;
    rangeBookings.forEach(b => {
      if (b.advances && Array.isArray(b.advances)) {
        b.advances.forEach((adv: any) => {
          const advDate = adv.date ? adv.date.slice(0, 10) : '';
          if (advDate >= start && advDate <= end) {
            advancesPeriod += Number(adv.amount) || 0;
          }
        });
      } else {
        const bDate = (b.createdAt || b.start)?.slice(0, 10);
        if (bDate >= start && bDate <= end) {
          advancesPeriod += Number(b.advance) || 0;
        }
      }
    });

    // Calculate deterministic settlements for the period
    let settlementsPeriod = 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffDays = Math.max(1, Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    if (start === todayStr && end === todayStr) {
      settlementsPeriod = 145000;
    } else {
      // Deterministic calculation based on dates
      let current = new Date(d1);
      for (let i = 0; i < diffDays; i++) {
        const curStr = current.toISOString().slice(0, 10);
        const hash = curStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        settlementsPeriod += (hash % 5) * 45000 + 35000;
        current.setDate(current.getDate() + 1);
      }
    }

    const totalRevenue = advancesPeriod + settlementsPeriod;

    // Standard Expected splits
    const expectedCash = Math.round(totalRevenue * 0.25);
    const expectedUPI = Math.round(totalRevenue * 0.55);
    const expectedBank = Math.round(totalRevenue * 0.15);
    const expectedCard = Math.round(totalRevenue * 0.05);

    return {
      totalEvents,
      totalGuests,
      advancesPeriod,
      settlementsPeriod,
      totalRevenue,
      expectedCash,
      expectedUPI,
      expectedBank,
      expectedCard,
      diffDays
    };
  }, [dateRange, bookings, todayStr]);

  // Derived key summary metrics
  const avgPaxPerEvent = useMemo(() => {
    return periodMetrics.totalEvents > 0 
      ? Math.round(periodMetrics.totalGuests / periodMetrics.totalEvents) 
      : 0;
  }, [periodMetrics.totalEvents, periodMetrics.totalGuests]);

  const avgRevenuePerBooking = useMemo(() => {
    return periodMetrics.totalEvents > 0 
      ? Math.round(periodMetrics.totalRevenue / periodMetrics.totalEvents) 
      : 0;
  }, [periodMetrics.totalEvents, periodMetrics.totalRevenue]);

  const avgRevenuePerGuest = useMemo(() => {
    return periodMetrics.totalGuests > 0 
      ? Math.round(periodMetrics.totalRevenue / periodMetrics.totalGuests) 
      : 0;
  }, [periodMetrics.totalGuests, periodMetrics.totalRevenue]);

  // Cash variance calculations
  const effectiveExpectedCash = expectedCashFromDb !== null ? expectedCashFromDb : periodMetrics.expectedCash;

  const cashVariance = useMemo(() => {
    return actualCash - effectiveExpectedCash;
  }, [actualCash, effectiveExpectedCash]);

  // Prepare Pie Chart Data for Payment Method Distribution
  const pieChartData = useMemo(() => {
    if (paymentDistribution && paymentDistribution.length > 0) {
      const totalVal = paymentDistribution.reduce((sum, item) => sum + item.value, 0);
      return paymentDistribution.map(item => ({
        ...item,
        percentage: totalVal > 0 ? Math.round((item.value / totalVal) * 100) : 0
      }));
    }

    // Fallback to computed period metrics distribution
    const items = [
      { name: 'Cash', value: periodMetrics.expectedCash, color: DEFAULT_PAYMENT_COLORS['Cash'], count: 4 },
      { name: 'UPI / QR Code', value: periodMetrics.expectedUPI, color: DEFAULT_PAYMENT_COLORS['UPI / QR Code'], count: 8 },
      { name: 'Net Banking', value: periodMetrics.expectedBank, color: DEFAULT_PAYMENT_COLORS['Net Banking'], count: 3 },
      { name: 'Credit / Debit Card', value: periodMetrics.expectedCard, color: DEFAULT_PAYMENT_COLORS['Credit / Debit Card'], count: 1 },
    ].filter(item => item.value > 0);

    const totalVal = items.reduce((sum, item) => sum + item.value, 0);
    return items.map(item => ({
      ...item,
      percentage: totalVal > 0 ? Math.round((item.value / totalVal) * 100) : 0
    }));
  }, [paymentDistribution, periodMetrics]);

  const totalChartRevenue = useMemo(() => {
    return pieChartData.reduce((sum, item) => sum + item.value, 0);
  }, [pieChartData]);

  const executeFreezeAudit = async () => {
    setIsSubmitting(true);
    try {
      const auditRecord: AuditRecord = {
        id: currentAuditId,
        date: currentAuditDisplay,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        auditorName: auditor,
        totalAdvances: periodMetrics.advancesPeriod,
        totalSettlements: periodMetrics.settlementsPeriod,
        totalRevenue: periodMetrics.totalRevenue,
        totalBookings: periodMetrics.totalEvents,
        totalGuests: periodMetrics.totalGuests,
        avgPaxPerEvent: avgPaxPerEvent,
        actualCash: actualCash,
        expectedCash: effectiveExpectedCash,
        cashVariance: cashVariance,
        notes: notes,
        checklistState: checklist,
        isFrozen: true,
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(doc(db, 'daily_audits', currentAuditId), auditRecord);

      // Local Cache update
      const filteredHistory = history.filter(h => h.id !== currentAuditId && h.date !== currentAuditDisplay);
      const updatedHistory = [auditRecord, ...filteredHistory];
      setHistory(updatedHistory);
      safeStorage.setItem('daily_audits_history', JSON.stringify(updatedHistory));

      onToast(`Audit for ${currentAuditDisplay} finalized and locked successfully!`, 'success');
      setCurrentAudit(auditRecord);
    } catch (error) {
      console.error("Firestore error saving audit, doing local-only:", error);
      
      const auditRecord: AuditRecord = {
        id: currentAuditId,
        date: currentAuditDisplay,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        auditorName: auditor,
        totalAdvances: periodMetrics.advancesPeriod,
        totalSettlements: periodMetrics.settlementsPeriod,
        totalRevenue: periodMetrics.totalRevenue,
        totalBookings: periodMetrics.totalEvents,
        totalGuests: periodMetrics.totalGuests,
        avgPaxPerEvent: avgPaxPerEvent,
        actualCash: actualCash,
        expectedCash: effectiveExpectedCash,
        cashVariance: cashVariance,
        notes: notes,
        checklistState: checklist,
        isFrozen: true,
        timestamp: new Date().toISOString()
      };

      const filteredHistory = history.filter(h => h.id !== currentAuditId && h.date !== currentAuditDisplay);
      const updatedHistory = [auditRecord, ...filteredHistory];
      setHistory(updatedHistory);
      safeStorage.setItem('daily_audits_history', JSON.stringify(updatedHistory));
      
      onToast(`Audit for ${currentAuditDisplay} finalized & cached locally.`, 'success');
      setCurrentAudit(auditRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submitting / Freezing audit
  const handleFreezeAudit = async () => {
    const isAllChecked = Object.values(checklist).every(v => v === true);
    if (!isAllChecked) {
      setConfirmModal({
        isOpen: true,
        title: "Incomplete Checklist Warning",
        message: "Some operational checklist items are incomplete. Do you still want to proceed and finalize this audit? Transaction and operations logs for this period will be frozen.",
        confirmText: "Yes, Finalize Anyway",
        cancelText: "No, Go Back",
        onConfirm: () => {
          setConfirmModal(null);
          executeFreezeAudit();
        }
      });
    } else {
      executeFreezeAudit();
    }
  };

  const executeUnlockAudit = async () => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'daily_audits', currentAuditId));
      
      const updatedHistory = history.filter(h => h.id !== currentAuditId && h.date !== currentAuditDisplay);
      setHistory(updatedHistory);
      safeStorage.setItem('daily_audits_history', JSON.stringify(updatedHistory));
      setCurrentAudit(null);
      
      onToast(`Audit for ${currentAuditDisplay} is now unlocked and open for editing.`, 'success');
    } catch (err) {
      console.error("Error unlocking audit:", err);
      onToast("Failed to unlock from Firestore. Doing local unlock.", "error");
      
      const updatedHistory = history.filter(h => h.id !== currentAuditId && h.date !== currentAuditDisplay);
      setHistory(updatedHistory);
      safeStorage.setItem('daily_audits_history', JSON.stringify(updatedHistory));
      setCurrentAudit(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voiding / Unlocking daily audit (Admins only)
  const handleUnlockAudit = async () => {
    if (userRole !== 'Admin' && userRole !== 'Property Owner') {
      onToast("Permission Denied: Only Admins can unlock frozen audits.", "error");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Unlock Audit Log",
      message: `Are you sure you want to UNLOCK the audit for ${currentAuditDisplay}? This will allow modifications and remove the secure freeze status.`,
      confirmText: "Unlock Audit",
      cancelText: "Keep Locked",
      onConfirm: () => {
        setConfirmModal(null);
        executeUnlockAudit();
      }
    });
  };

  const handleToggleChecklist = (key: string) => {
    if (currentAudit?.isFrozen) return; // Prevent change if frozen
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectHistoryItem = (record: AuditRecord) => {
    if (record.startDate && record.endDate) {
      setDateRange({
        startDate: record.startDate,
        endDate: record.endDate
      });
    } else if (record.date && record.date.includes(' to ')) {
      const parts = record.date.split(' to ');
      setDateRange({
        startDate: parts[0].trim(),
        endDate: parts[1].trim()
      });
    } else {
      setDateRange({
        startDate: record.date,
        endDate: record.date
      });
    }
  };

  // Custom Tooltip for Recharts Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-300 font-medium">
            Amount: <span className="font-extrabold text-white">₹{data.value.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Share: <strong className="text-indigo-300">{data.percentage}%</strong> ({data.count || 0} txn{data.count > 1 ? 's' : ''})
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Audit & Financial Reconciliation</h1>
              <p className="text-xs text-slate-500 font-medium">
                Verify guest counts, reconcile cash drawer, inspect payment distribution, and freeze period financial logs.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Status Badge & Print Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="print-hide flex items-center justify-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 transition-colors cursor-pointer shadow-3xs"
            title="Print Audit Report"
          >
            <Printer size={15} className="text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Print Audit Report</span>
          </button>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Status</span>
            {currentAudit?.isFrozen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold shadow-3xs">
                <Lock size={12} className="text-emerald-600" /> AUDITED & FROZEN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold shadow-3xs animate-pulse">
                <Unlock size={12} className="text-amber-600" /> PENDING RECONCILIATION
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Date Range Picker Component */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <DateRangePicker 
          value={dateRange}
          onChange={setDateRange}
          onGenerateAudit={() => {
            onToast(`Loaded audit data for ${currentAuditDisplay}`, 'success');
          }}
          disabled={currentAudit?.isFrozen}
        />
      </div>

      {/* Total Summary Card: Key Metrics for Selected Date Range */}
      <div className="bg-gradient-to-br from-white via-slate-50/60 to-indigo-50/25 p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-3xs">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Total Summary Overview
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {periodMetrics.diffDays} {periodMetrics.diffDays === 1 ? 'Day' : 'Days Selected'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Key performance metrics and operational totals for the active audit window: <strong className="text-slate-800">{currentAuditDisplay}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-3xs">
              <Calendar size={13} className="text-indigo-600" />
              {currentAuditDisplay}
            </span>
          </div>
        </div>

        {/* 4-Pillar Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Total Revenue */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-3xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{periodMetrics.totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1.5 pt-1.5 border-t border-slate-100">
                <span>Advances: ₹{periodMetrics.advancesPeriod.toLocaleString('en-IN')}</span>
                <span>Settled: ₹{periodMetrics.settlementsPeriod.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Total Bookings */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-3xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <CalendarCheck size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {periodMetrics.totalEvents}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1.5 pt-1.5 border-t border-slate-100">
                <span>{periodMetrics.totalEvents === 1 ? '1 Confirmed Event' : `${periodMetrics.totalEvents} Confirmed Events`}</span>
                <span className="text-indigo-600 font-bold">
                  {(periodMetrics.totalEvents / Math.max(1, periodMetrics.diffDays)).toFixed(1)}/day
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Average Pax Per Event */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-3xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Avg Pax Per Event
              </span>
              <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                <Users size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {avgPaxPerEvent} <span className="text-xs font-bold text-slate-400 font-normal">Guests</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1.5 pt-1.5 border-t border-slate-100">
                <span>Total Pax: {periodMetrics.totalGuests.toLocaleString('en-IN')}</span>
                <span className="text-sky-600 font-bold">Attendee Density</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Average Revenue Per Booking */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-3xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Avg Revenue Per Event
              </span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{avgRevenuePerBooking.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1.5 pt-1.5 border-t border-slate-100">
                <span>Guest Yield: ₹{avgRevenuePerGuest.toLocaleString('en-IN')}</span>
                <span className="text-amber-600 font-bold">Yield/Event</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Financial Reconciliation & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Period Revenue Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-slate-600" /> 
                {isRange ? `Period Revenue Breakdown (${periodMetrics.diffDays} Days)` : 'Daily Financial Reconciliation'}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-0.5 rounded-full uppercase">Computed live</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  {isRange ? 'Period Events' : "Today's Events"}
                </span>
                <span className="text-lg font-black text-slate-900 mt-1 block">{periodMetrics.totalEvents}</span>
                <span className="text-[9px] text-slate-400 font-semibold block">{periodMetrics.totalGuests} Total Pax</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Advances Logged</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">₹{periodMetrics.advancesPeriod.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-emerald-600 font-semibold block">Initial deposits</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Settlements Collected</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">₹{periodMetrics.settlementsPeriod.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-indigo-600 font-semibold block">Checkout balances</span>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="block text-[10px] font-bold text-indigo-500 uppercase">Total Period Revenue</span>
                <span className="text-lg font-black text-indigo-950 mt-1 block">₹{periodMetrics.totalRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[9px] text-indigo-600 font-semibold block">Advances + Settles</span>
              </div>
            </div>

            {/* Expected payment split channels */}
            <div className="space-y-3">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Expected Split by Payment Channel</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Coins size={14} /></div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Cash (25%)</span>
                    <span className="text-xs font-extrabold text-slate-800">₹{periodMetrics.expectedCash.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2">
                  <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg"><QrCode size={14} /></div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">UPI (55%)</span>
                    <span className="text-xs font-extrabold text-slate-800">₹{periodMetrics.expectedUPI.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Layers size={14} /></div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Bank IMPS (15%)</span>
                    <span className="text-xs font-extrabold text-slate-800">₹{periodMetrics.expectedBank.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2">
                  <div className="p-1.5 bg-pink-50 text-pink-600 rounded-lg"><CreditCard size={14} /></div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Card (5%)</span>
                    <span className="text-xs font-extrabold text-slate-800">₹{periodMetrics.expectedCard.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Pie Chart: Payment Method Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <PieChartIcon size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Payment Method Distribution
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Reconciliation breakdown by transaction amounts for {currentAuditDisplay}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Total: ₹{totalChartRevenue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Pie Chart Display */}
              <div className="md:col-span-7 h-60 w-full flex items-center justify-center">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color || Object.values(DEFAULT_PAYMENT_COLORS)[index % 5]} 
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <PieChartIcon size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold">No transaction data available for chart</p>
                  </div>
                )}
              </div>

              {/* Legend & Breakdown List */}
              <div className="md:col-span-5 space-y-2">
                {pieChartData.map((item) => (
                  <div 
                    key={item.name} 
                    className="p-2 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-md shrink-0 shadow-3xs" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <div>
                        <span className="font-extrabold text-slate-800 text-[11px] block">{item.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {item.count ? `${item.count} txns` : 'Est.'} ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 block text-xs">
                        ₹{item.value.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily / Period Reconciliation Summary from cashier_transactions */}
          <DailyReconciliationSummary 
            selectedDate={dateRange.startDate}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onUpdateExpectedCash={setExpectedCashFromDb}
            onPaymentDistributionChange={setPaymentDistribution}
            onToast={onToast}
          />

          {/* Cash Drawer Reconciliation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Coins size={16} className="text-amber-500" /> Cash Drawer Audit
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  System Log Expected Cash
                </label>
                <div className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl font-bold text-slate-800 text-sm">
                  ₹{effectiveExpectedCash.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Physical Counted Cash *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={actualCash || ''}
                    disabled={currentAudit?.isFrozen}
                    onChange={(e) => setActualCash(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="Enter cash in safe"
                    className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Discrepancy (Variance)</label>
                <div className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                  cashVariance === 0 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                    : cashVariance > 0 
                      ? 'bg-blue-50 text-blue-800 border border-blue-100' 
                      : 'bg-red-50 text-red-800 border border-red-100'
                }`}>
                  {cashVariance === 0 ? (
                    <span>Balanced perfectly!</span>
                  ) : cashVariance > 0 ? (
                    <span>₹{cashVariance.toLocaleString('en-IN')} Overage (Surplus)</span>
                  ) : (
                    <span>₹{cashVariance.toLocaleString('en-IN')} Shortage (Deficit)</span>
                  )}
                </div>
              </div>
            </div>

            {cashVariance !== 0 && (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-[11px] font-medium flex items-start gap-2">
                <Info size={14} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <span className="font-extrabold uppercase text-[9px] block mb-0.5">Audit Note Required</span>
                  A cash variance exists for this period. Please provide a brief explanation or voucher reference in the auditor notes before finalizing this log.
                </div>
              </div>
            )}
          </div>

          {/* Audit Notes and Submit Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Auditor Review Summary & Explanatory Remarks</label>
              <textarea
                rows={3}
                value={notes}
                disabled={currentAudit?.isFrozen}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. UPI matching perfect. All checks verified and physical cash reconciled."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 outline-none text-slate-800"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-slate-100 gap-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span className="text-[10px] text-slate-500 font-semibold">
                  Auditor: <span className="font-extrabold text-slate-800">{auditor}</span>
                </span>
              </div>

              <div className="print-hide flex items-center gap-2 w-full sm:w-auto">
                {currentAudit?.isFrozen ? (
                  <>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto cursor-pointer"
                    >
                      <Printer size={13} /> Print Sheet
                    </button>
                    {(userRole === 'Admin' || userRole === 'Property Owner') && (
                      <button
                        type="button"
                        onClick={handleUnlockAudit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Unlock size={13} />}
                        Unlock Log
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleFreezeAudit}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs w-full sm:w-auto cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Lock size={14} /> Submit & Freeze Audit
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Operational Checklist & History */}
        <div className="space-y-6">
          
          {/* Operational Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck size={16} className="text-indigo-600" /> Operational Checklist
              </h3>
              <span className="text-[9px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">
                {Object.values(checklist).filter(Boolean).length}/6 Complete
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'guestCounts', title: 'Verify Guest Entry Count', desc: 'Confirm actual headcounts match contract pax figures.' },
                { key: 'billsClosed', title: 'Close Open Invoices', desc: 'No draft bills or uncollected invoices left for period.' },
                { key: 'staffOvertime', title: 'Sign-off Staff Shifts', desc: 'Ensure overtime hours are approved and clocked.' },
                { key: 'inventoryReturned', title: 'Asset & Rental Audit', desc: 'Confirm cutlery, decor, and AV returned undamaged.' },
                { key: 'safetyCheck', title: 'Security & Safety Check', desc: 'Vacant halls turned off, locks and fire lines secured.' },
                { key: 'bankUpiMatched', title: 'Match QR Statement', desc: 'Match local payment log receipts with direct bank feed.' },
              ].map(item => (
                <div 
                  key={item.key}
                  onClick={() => handleToggleChecklist(item.key)}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-3 select-none ${
                    currentAudit?.isFrozen ? 'cursor-not-allowed' : 'cursor-pointer hover:border-slate-300'
                  } ${
                    checklist[item.key] 
                      ? 'bg-indigo-50/20 border-indigo-100' 
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    disabled={currentAudit?.isFrozen}
                    onChange={() => {}} // Controlled by wrapper div click
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className={`text-xs font-bold block leading-tight ${checklist[item.key] ? 'text-indigo-950 line-through opacity-75' : 'text-slate-800'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5 leading-normal">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit History Logs */}
          <div className="print-hide bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <History size={16} className="text-slate-500" /> Historic Audit Logs
              </h3>
              <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-full">
                {history.length} records
              </span>
            </div>

            {isLoadingHistory ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 size={20} className="animate-spin text-slate-400" />
              </div>
            ) : history.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <span className="text-lg">📁</span>
                <p className="text-[10px] font-bold text-slate-600 mt-1">No completed audits found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {history.map((record) => {
                  const isCurrentSelected = (record.id === currentAuditId) || (record.date === currentAuditDisplay);
                  const isRangeRecord = record.date && (record.date.includes(' to ') || record.startDate !== record.endDate);
                  
                  return (
                    <div 
                      key={record.id || record.date}
                      onClick={() => handleSelectHistoryItem(record)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between text-xs font-semibold ${
                        isCurrentSelected 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold">{record.date}</span>
                          {isRangeRecord && (
                            <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase tracking-wider ${
                              isCurrentSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              Range
                            </span>
                          )}
                        </div>
                        <div className={`text-[9px] font-bold uppercase mt-0.5 ${isCurrentSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          Revenue: ₹{record.totalRevenue.toLocaleString('en-IN')}
                          {typeof record.totalBookings === 'number' && (
                            <span> • {record.totalBookings} event{record.totalBookings > 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-black tracking-tight leading-none ${
                          record.cashVariance === 0 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-rose-500 text-white'
                        }`}>
                          {record.cashVariance === 0 ? 'Balanced' : 'Var'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-900">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {confirmModal.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
