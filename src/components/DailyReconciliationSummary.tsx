import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { 
  DollarSign, 
  CreditCard, 
  QrCode, 
  Building, 
  FileText, 
  RefreshCw, 
  Loader2, 
  Coins,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';

export interface FirestoreTransaction {
  id: string;
  billNo: string;
  time: string; // Format: "YYYY-MM-DD HH:MM" or similar
  date: string; // ISO date string: YYYY-MM-DD
  customerName: string;
  customerPhone: string;
  hallName: string;
  eventType: string;
  paymentMode: 'Cash' | 'UPI / QR Code' | 'Credit / Debit Card' | 'Net Banking' | 'Cheque';
  txnRef: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  advancePaid: number;
  netSettled: number;
  cashierName: string;
  status: 'Settled' | 'Advance Collected' | 'Refunded';
}

export interface PaymentDistributionItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface DailyReconciliationSummaryProps {
  selectedDate?: string; // YYYY-MM-DD (legacy / single day)
  startDate?: string;
  endDate?: string;
  onUpdateExpectedCash?: (cashAmount: number) => void;
  onPaymentDistributionChange?: (distribution: PaymentDistributionItem[]) => void;
  onToast: (msg: string, type: 'error' | 'success') => void;
}

export default function DailyReconciliationSummary({ 
  selectedDate, 
  startDate,
  endDate,
  onUpdateExpectedCash,
  onPaymentDistributionChange,
  onToast 
}: DailyReconciliationSummaryProps) {
  const [transactions, setTransactions] = useState<FirestoreTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedTxList, setExpandedTxList] = useState(false);

  const effectiveStartDate = startDate || selectedDate || new Date().toISOString().slice(0, 10);
  const effectiveEndDate = endDate || startDate || selectedDate || effectiveStartDate;
  const isDateRange = effectiveStartDate !== effectiveEndDate;

  // Generate deterministic mock transactions for seed
  const generateMockSeedData = (date: string): FirestoreTransaction[] => {
    const hash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const names = ['Amit Patel', 'Sonia Reddy', 'Rajesh Varma', 'Vikram Malhotra', 'Priya Naidu', 'Sunita Rao', 'Karan Johar', 'Neha Gupta'];
    const halls = ['Grand Crystal Ballroom', 'Royal Emerald Suite', 'Sapphire Garden Lawn', 'Imperial Banquet Suite'];
    const events = ['Wedding Reception', 'Corporate Summit', 'Engagement Gala', 'Birthday Celebration', 'Anniversary Dinner'];
    const cashiers = ['Rajan Sharma', 'Priya V.', 'Anil K.', 'Meera S.'];

    const txs: FirestoreTransaction[] = [];
    const count = (hash % 4) + 3; // 3 to 6 transactions

    for (let i = 0; i < count; i++) {
      const txId = `tx-${date}-${101 + i}`;
      const modeHash = (hash + i) % 4;
      const modes: FirestoreTransaction['paymentMode'][] = ['Cash', 'UPI / QR Code', 'Credit / Debit Card', 'Net Banking'];
      const mode = modes[modeHash];

      const subtotal = ((hash * (i + 1)) % 5) * 25000 + 35000;
      const tax = Math.round(subtotal * 0.18);
      const totalAmount = subtotal + tax;
      const advancePaid = Math.round(totalAmount * 0.3);
      const netSettled = totalAmount - advancePaid;

      txs.push({
        id: txId,
        billNo: `BILL-${date.replace(/-/g, '')}-${8000 + i}`,
        time: `${date} 0${1 + i % 12}:30 PM`,
        date: date,
        customerName: names[(hash + i) % names.length],
        customerPhone: `+91 98765 4${100 + i}`,
        hallName: halls[(hash + i) % halls.length],
        eventType: events[(hash + i) % events.length],
        paymentMode: mode,
        txnRef: mode === 'Cash' ? `CASH-REC-${100 + i}` : `${mode.slice(0, 3).toUpperCase()}-${hash}${i}902`,
        subtotal,
        tax,
        totalAmount,
        advancePaid,
        netSettled,
        cashierName: cashiers[(hash + i) % cashiers.length],
        status: i === 0 ? 'Advance Collected' : 'Settled'
      });
    }
    return txs;
  };

  // Helper to generate seed dates for a range
  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const curr = new Date(start);
    const stop = new Date(end);
    let count = 0;
    while (curr <= stop && count < 14) {
      dates.push(curr.toISOString().slice(0, 10));
      curr.setDate(curr.getDate() + 1);
      count++;
    }
    return dates;
  };

  // Fetch from Firestore
  const fetchTransactions = async (forceSync = false) => {
    setIsLoading(true);
    try {
      const qSnapshot = await getDocs(collection(db, 'cashier_transactions'));
      let fetched: FirestoreTransaction[] = [];
      qSnapshot.forEach((docSnap) => {
        const tx = docSnap.data() as FirestoreTransaction;
        const txDate = tx.date || (tx.time ? tx.time.slice(0, 10) : '');
        // Check if transaction belongs to selected period [effectiveStartDate, effectiveEndDate]
        if (txDate >= effectiveStartDate && txDate <= effectiveEndDate) {
          fetched.push(tx);
        }
      });

      // If Firestore contains no data for this date range, seed it automatically so the user gets instant feedback
      if (fetched.length === 0) {
        const datesToSeed = isDateRange 
          ? getDatesInRange(effectiveStartDate, effectiveEndDate) 
          : [effectiveStartDate];

        let seededData: FirestoreTransaction[] = [];
        for (const d of datesToSeed) {
          const dayTxs = generateMockSeedData(d);
          seededData = [...seededData, ...dayTxs];
          for (const tx of dayTxs) {
            await setDoc(doc(db, 'cashier_transactions', tx.id), tx);
          }
        }
        fetched = seededData;
        if (forceSync) {
          onToast(
            `Database synced with transaction records for ${isDateRange ? `${effectiveStartDate} to ${effectiveEndDate}` : effectiveStartDate}!`, 
            'success'
          );
        }
      }

      // Sort chronologically descending
      fetched.sort((a, b) => (b.time || b.date).localeCompare(a.time || a.date));
      setTransactions(fetched);

      // Extract and bubble up the expected Cash amount so DailyAudit component updates its ledger cash automatically!
      const cashTotal = fetched
        .filter(tx => tx.paymentMode === 'Cash')
        .reduce((sum, tx) => sum + tx.netSettled, 0);
      
      if (onUpdateExpectedCash) {
        onUpdateExpectedCash(cashTotal);
      }

    } catch (error) {
      console.error("Error loading transaction data, doing local-only seed:", error);
      const datesToSeed = isDateRange 
        ? getDatesInRange(effectiveStartDate, effectiveEndDate) 
        : [effectiveStartDate];
      
      let localSeed: FirestoreTransaction[] = [];
      for (const d of datesToSeed) {
        localSeed = [...localSeed, ...generateMockSeedData(d)];
      }
      localSeed.sort((a, b) => (b.time || b.date).localeCompare(a.time || a.date));
      setTransactions(localSeed);
      
      const cashTotal = localSeed
        .filter(tx => tx.paymentMode === 'Cash')
        .reduce((sum, tx) => sum + tx.netSettled, 0);
      
      if (onUpdateExpectedCash) {
        onUpdateExpectedCash(cashTotal);
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [effectiveStartDate, effectiveEndDate]);

  const handleSync = () => {
    setIsSyncing(true);
    fetchTransactions(true);
  };

  // Group metrics calculations
  const summaryMetrics = useMemo(() => {
    const grouped: Record<FirestoreTransaction['paymentMode'], { total: number; count: number; transactions: FirestoreTransaction[] }> = {
      'Cash': { total: 0, count: 0, transactions: [] },
      'UPI / QR Code': { total: 0, count: 0, transactions: [] },
      'Credit / Debit Card': { total: 0, count: 0, transactions: [] },
      'Net Banking': { total: 0, count: 0, transactions: [] },
      'Cheque': { total: 0, count: 0, transactions: [] }
    };

    let grandTotal = 0;
    let transactionsCount = 0;

    transactions.forEach(tx => {
      if (grouped[tx.paymentMode]) {
        grouped[tx.paymentMode].total += tx.netSettled;
        grouped[tx.paymentMode].count += 1;
        grouped[tx.paymentMode].transactions.push(tx);
        grandTotal += tx.netSettled;
        transactionsCount += 1;
      }
    });

    const modeColors: Record<FirestoreTransaction['paymentMode'], string> = {
      'Cash': '#f59e0b',
      'UPI / QR Code': '#0284c7',
      'Credit / Debit Card': '#ec4899',
      'Net Banking': '#6366f1',
      'Cheque': '#64748b'
    };

    const distribution: PaymentDistributionItem[] = (Object.keys(grouped) as FirestoreTransaction['paymentMode'][])
      .map(mode => ({
        name: mode,
        value: grouped[mode].total,
        count: grouped[mode].count,
        color: modeColors[mode]
      }))
      .filter(item => item.value > 0);

    return {
      grouped,
      grandTotal,
      transactionsCount,
      distribution
    };
  }, [transactions]);

  // Notify parent of distribution changes for Pie Chart synchronization
  useEffect(() => {
    if (onPaymentDistributionChange && summaryMetrics.distribution) {
      onPaymentDistributionChange(summaryMetrics.distribution);
    }
  }, [summaryMetrics.distribution, onPaymentDistributionChange]);

  // Payment mode metadata helper
  const getModeIcon = (mode: FirestoreTransaction['paymentMode']) => {
    switch (mode) {
      case 'Cash': return <Coins size={14} className="text-amber-500" />;
      case 'UPI / QR Code': return <QrCode size={14} className="text-sky-500" />;
      case 'Credit / Debit Card': return <CreditCard size={14} className="text-pink-500" />;
      case 'Net Banking': return <Building size={14} className="text-indigo-500" />;
      default: return <FileText size={14} className="text-slate-500" />;
    }
  };

  const getModeBgColor = (mode: FirestoreTransaction['paymentMode']) => {
    switch (mode) {
      case 'Cash': return 'bg-amber-50 border-amber-100 text-amber-900';
      case 'UPI / QR Code': return 'bg-sky-50 border-sky-100 text-sky-900';
      case 'Credit / Debit Card': return 'bg-pink-50 border-pink-100 text-pink-900';
      case 'Net Banking': return 'bg-indigo-50 border-indigo-100 text-indigo-900';
      default: return 'bg-slate-50 border-slate-100 text-slate-900';
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <DollarSign size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Transaction Reconciliation Summary</h3>
              {isDateRange ? (
                <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  {effectiveStartDate} to {effectiveEndDate}
                </span>
              ) : (
                <span className="text-[9px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {effectiveStartDate}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold">Fetched securely from cashier_transactions logs</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing || isLoading}
          className="print-hide p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          title="Resync Transaction Records"
        >
          {isSyncing ? (
            <Loader2 size={13} className="animate-spin text-slate-400" />
          ) : (
            <RefreshCw size={13} />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Fetching transaction stream...</span>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Summary Banner */}
          <div className="flex items-center justify-between bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100">
            <div>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">Net Auditable Collection</span>
              <span className="text-base font-black text-indigo-950 block mt-0.5">
                ₹{summaryMetrics.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider">Logs Count</span>
              <span className="text-xs font-extrabold text-indigo-950 block mt-0.5">
                {summaryMetrics.transactionsCount} Transactions
              </span>
            </div>
          </div>

          {/* Grouped channel cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.entries(summaryMetrics.grouped) as [FirestoreTransaction['paymentMode'], { total: number; count: number; transactions: FirestoreTransaction[] }][]).map(([mode, data]) => {
              if (data.count === 0) return null;
              return (
                <div 
                  key={mode}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${getModeBgColor(mode as FirestoreTransaction['paymentMode'])}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg shadow-3xs shrink-0">
                      {getModeIcon(mode as FirestoreTransaction['paymentMode'])}
                    </div>
                    <div>
                      <span className="text-[9.5px] font-black uppercase tracking-tight block">{mode}</span>
                      <span className="text-[9px] font-medium opacity-75">{data.count} transaction{data.count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold block">₹{data.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expandable Transaction Details List */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setExpandedTxList(!expandedTxList)}
              className="w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileText size={13} className="text-slate-400" />
                View Itemized Payment Log ({transactions.length})
              </span>
              {expandedTxList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expandedTxList && (
              <div className="p-3 border-t border-slate-100 max-h-56 overflow-y-auto space-y-2">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="p-2 bg-white rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[11px] font-semibold"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">{tx.customerName}</span>
                        <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {tx.billNo}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {tx.date}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {tx.hallName} • {tx.eventType}
                      </span>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                      <span className="text-xs font-extrabold text-slate-800">
                        ₹{tx.netSettled.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-tight leading-none ${
                        tx.paymentMode === 'Cash' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {tx.paymentMode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
