import React, { useState, useMemo, useEffect } from 'react';
import { 
  XCircle, 
  RefreshCw, 
  Search, 
  Download, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  User, 
  Clock, 
  AlertTriangle, 
  FileCheck2, 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Printer,
  FileSpreadsheet,
  Undo2,
  Ban,
  X,
  ShieldCheck
} from 'lucide-react';

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

const defaultSettledHistory: SettledBill[] = [
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

export default function CancelResettleReport() {
  const [bills, setBills] = useState<SettledBill[]>(() => {
    try {
      const saved = localStorage.getItem('banquet_settled_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading history in report:', e);
    }
    return defaultSettledHistory;
  });

  useEffect(() => {
    try {
      localStorage.setItem('banquet_settled_history', JSON.stringify(bills));
    } catch (e) {
      console.error('Error saving history in report:', e);
    }
  }, [bills]);

  // Settled Bill Reinstate State in Report
  const [reinstatingBill, setReinstatingBill] = useState<SettledBill | null>(null);
  const [reinstateReason, setReinstateReason] = useState('');
  const [reinstatedByStaff, setReinstatedByStaff] = useState('Manager Rajan');

  const handleOpenReinstateModal = (bill: SettledBill) => {
    setReinstatingBill(bill);
    setReinstateReason('');
    setReinstatedByStaff('Manager Rajan');
  };

  const handleConfirmReinstateBill = () => {
    if (!reinstatingBill) return;
    if (!reinstateReason.trim()) {
      alert('Error: Please enter a reason for reinstatement.');
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

    setBills(prev => prev.map(b => b.billNo === reinstatingBill.billNo ? updatedBill : b));
    setReinstatingBill(null);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cancelled' | 'resettled'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedBill, setExpandedBill] = useState<string | null>(null);

  // Filter bills based on search query, filterType, and date range
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      // Filter Type logic
      if (filterType === 'cancelled' && !bill.isCancelled) return false;
      if (filterType === 'resettled' && !bill.isResettled) return false;
      if (filterType === 'all' && !bill.isCancelled && !bill.isResettled) return false;

      // Search query matching (billNo, customerName, bookingId, hall, settledBy, cancelledBy, resettledBy)
      const matchesSearch = 
        bill.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.hall.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bill.settledBy && bill.settledBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (bill.cancelledBy && bill.cancelledBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (bill.resettledBy && bill.resettledBy.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Date range filtering based on eventDate
      if (startDate && bill.eventDate < startDate) return false;
      if (endDate && bill.eventDate > endDate) return false;

      return true;
    });
  }, [bills, searchQuery, filterType, startDate, endDate]);

  // Compute metrics
  const metrics = useMemo(() => {
    let cancelledCount = 0;
    let totalRefunds = 0;
    let resettledCount = 0;
    let positiveAdjustments = 0;
    let negativeAdjustments = 0;
    let netRevenueImpact = 0;

    bills.forEach(bill => {
      if (bill.isCancelled) {
        cancelledCount++;
        totalRefunds += bill.refundAmount !== undefined ? bill.refundAmount : bill.netPaid;
        netRevenueImpact -= bill.grandTotal; // Lost revenue from voided bill
      } else if (bill.isResettled) {
        resettledCount++;
        if (bill.resettlementHistory) {
          bill.resettlementHistory.forEach(log => {
            netRevenueImpact += log.differentialAmount;
            if (log.differentialAmount > 0) {
              positiveAdjustments += log.differentialAmount;
            } else {
              negativeAdjustments += Math.abs(log.differentialAmount);
            }
          });
        }
      }
    });

    return {
      cancelledCount,
      totalRefunds,
      resettledCount,
      positiveAdjustments,
      negativeAdjustments,
      netRevenueImpact
    };
  }, [bills]);

  // Toggle row expand
  const toggleRow = (billNo: string) => {
    setExpandedBill(prev => prev === billNo ? null : billNo);
  };

  // Download CSV report
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Bill No,Booking ID,Customer,Event Date,Hall,Type,Original Amount,Adjustment / Refund,Net Impact,Staff Responsible,Reason\n";

    filteredBills.forEach(b => {
      const type = b.isCancelled ? "Cancelled & Void" : "Resettled / Revised";
      const originalAmount = b.isCancelled ? b.grandTotal : (b.subtotal + b.cgst + b.sgst);
      
      let adjAmount = 0;
      let netImpact = 0;
      let reason = "";
      let staff = "";

      if (b.isCancelled) {
        adjAmount = b.refundAmount !== undefined ? b.refundAmount : b.netPaid;
        netImpact = -b.grandTotal;
        reason = b.cancellationReason || "N/A";
        staff = b.cancelledBy || b.settledBy;
      } else {
        const historySum = b.resettlementHistory 
          ? b.resettlementHistory.reduce((sum, h) => sum + h.differentialAmount, 0)
          : 0;
        adjAmount = historySum;
        netImpact = historySum;
        reason = b.resettlementReason || "N/A";
        staff = b.resettledBy || b.settledBy;
      }

      // Escape quotes for CSV
      const escapedCustomer = b.customerName.replace(/"/g, '""');
      const escapedReason = reason.replace(/"/g, '""');

      csvContent += `${b.billNo},${b.bookingId},"${escapedCustomer}",${b.eventDate},"${b.hall}",${type},₹${originalAmount},₹${adjAmount},₹${netImpact},"${staff}","${escapedReason}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `checkout_cancel_and_resettlement_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger browser print for Audit Sheet
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Checkout Cancellation & Resettlement Audit Report</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; }
            h1 { font-size: 20px; text-transform: uppercase; margin-bottom: 2px; }
            h2 { font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 25px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
            .metric-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc; }
            .metric-title { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .metric-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th { background: #f1f5f9; padding: 8px; text-align: left; font-weight: bold; border-bottom: 2px solid #cbd5e1; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
            .badge-cancelled { background: #fee2e2; color: #991b1b; }
            .badge-resettled { background: #fef3c7; color: #92400e; }
            .negative { color: #dc2626; }
            .positive { color: #16a34a; }
            .footer { border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 10px; text-align: center; font-size: 10px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <h1>Checkout Cancellation & Resettlement Audit Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</h2>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">Total Cancellations (Voided)</div>
              <div class="metric-value" style="color: #b91c1c;">${metrics.cancelledCount} Bills (Refunded ₹${metrics.totalRefunds.toLocaleString('en-IN')})</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Total Resettled / Revised</div>
              <div class="metric-value" style="color: #d97706;">${metrics.resettledCount} Bills</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Net Financial Impact</div>
              <div class="metric-value ${metrics.netRevenueImpact < 0 ? 'negative' : 'positive'}">
                ₹${metrics.netRevenueImpact.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Customer Name</th>
                <th>Event Date</th>
                <th>Hall Assigned</th>
                <th>Audit Action Type</th>
                <th>Original Total</th>
                <th>Adj / Refund</th>
                <th>Net Impact</th>
                <th>Authorizing Staff</th>
                <th>Reason Note</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBills.map(b => {
                const action = b.isCancelled ? 'Cancelled' : 'Resettled';
                const originalTotal = b.isCancelled ? b.grandTotal : b.subtotal + b.cgst + b.sgst;
                const impactVal = b.isCancelled ? -b.grandTotal : (b.resettlementHistory ? b.resettlementHistory.reduce((s, h) => s + h.differentialAmount, 0) : 0);
                const adjVal = b.isCancelled ? (b.refundAmount !== undefined ? b.refundAmount : b.netPaid) : impactVal;
                
                return `
                  <tr>
                    <td><strong>${b.billNo}</strong><br/><span style="color:#64748b; font-size:9px;">Ref: ${b.bookingId}</span></td>
                    <td>${b.customerName}</td>
                    <td>${b.eventDate}</td>
                    <td>${b.hall}</td>
                    <td><span class="badge ${b.isCancelled ? 'badge-cancelled' : 'badge-resettled'}">${action}</span></td>
                    <td>₹${originalTotal.toLocaleString('en-IN')}</td>
                    <td class="${b.isCancelled ? 'negative' : impactVal >= 0 ? 'positive' : 'negative'}">
                      ₹${adjVal.toLocaleString('en-IN')}
                    </td>
                    <td class="${impactVal < 0 ? 'negative' : 'positive'}">
                      ₹${impactVal.toLocaleString('en-IN')}
                    </td>
                    <td>${b.isCancelled ? (b.cancelledBy || 'N/A') : (b.resettledBy || 'N/A')}</td>
                    <td style="max-width: 150px; font-size: 9.5px;">${b.isCancelled ? (b.cancellationReason || '') : (b.resettlementReason || '')}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Grand Horizon ERP System - Security & Audit Trail Logs • Confirmed under jurisdiction rules.</p>
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
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-red-600" size={20} />
              Checkout Cancellation & Resettlement Audit Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tracks financial adjustments, voided sales invoices, credit refunds, and billing resettlements. Critical for financial accountability and audit security.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button 
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              Export CSV Ledger
            </button>
            <button 
              onClick={handlePrintReport}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer size={14} className="text-amber-400" />
              Print Audit Sheet
            </button>
          </div>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search by Bill No, Customer, Booking ID, Staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="md:col-span-3 flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                filterType === 'all' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setFilterType('cancelled')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                filterType === 'cancelled' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Cancellations
            </button>
            <button
              onClick={() => setFilterType('resettled')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                filterType === 'resettled' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Resettlements
            </button>
          </div>

          <div className="md:col-span-5 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <Calendar size={13} className="text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none w-full"
              />
            </div>
            <span className="text-slate-400 text-xs">to</span>
            <div className="flex-1 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <Calendar size={13} className="text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none w-full"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* METRIC STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Cancellation Void Volume */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Cancellations & Refunds</span>
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold">Void Logs</span>
            </div>
            <h4 className="text-2xl font-black text-slate-950 mt-2">
              ₹{metrics.totalRefunds.toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Refunded across <strong>{metrics.cancelledCount} voided</strong> invoices.
            </p>
          </div>
          <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>Average Refund:</span>
            <span className="text-slate-900 font-bold">
              ₹{metrics.cancelledCount > 0 ? Math.round(metrics.totalRefunds / metrics.cancelledCount).toLocaleString('en-IN') : 0}
            </span>
          </div>
        </div>

        {/* Metric 2: Resettlement Delta Volume */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Resettlement Adjustments</span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">Revised Bills</span>
            </div>
            <h4 className="text-2xl font-black text-slate-950 mt-2">
              ₹{(metrics.positiveAdjustments - metrics.negativeAdjustments).toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Net delta: <span className="text-emerald-600 font-bold">+₹{metrics.positiveAdjustments.toLocaleString('en-IN')}</span> / <span className="text-red-500 font-bold">-₹{metrics.negativeAdjustments.toLocaleString('en-IN')}</span>.
            </p>
          </div>
          <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>Resettled Audits:</span>
            <span className="text-slate-900 font-bold">{metrics.resettledCount} Invoices</span>
          </div>
        </div>

        {/* Metric 3: Total Sales Adjustments Impact */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Net Financial Adjustment</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">Consolidated Impact</span>
            </div>
            <h4 className={`text-2xl font-black mt-2 ${metrics.netRevenueImpact < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              ₹{metrics.netRevenueImpact.toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Combined change in overall banquet book value.
            </p>
          </div>
          <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>Audit Status:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <FileCheck2 size={13} /> Balanced
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED LOG TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Audit Ledger Logs ({filteredBills.length} records matching)
          </h4>
          <span className="text-[10px] font-bold text-slate-400">Click a record to expand detailed transaction breakdown</span>
        </div>

        {filteredBills.length === 0 ? (
          <div className="p-12 text-center">
            <HelpCircle size={40} className="mx-auto text-slate-300 mb-3" />
            <h5 className="font-bold text-slate-700 text-sm">No Audit Logs Found</h5>
            <p className="text-xs text-slate-400 mt-1">
              There are no cancelled or resettled bills fitting the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-extrabold uppercase">
                  <th className="py-3 px-4">Bill No / Ref</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Event Hall</th>
                  <th className="py-3 px-4">Adjustment Type</th>
                  <th className="py-3 px-4 text-right">Original Amt</th>
                  <th className="py-3 px-4 text-right">Adj Value</th>
                  <th className="py-3 px-4 text-right">Net Impact</th>
                  <th className="py-3 px-4">Authorizer</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => {
                  const isExpanded = expandedBill === bill.billNo;
                  const originalTotal = bill.isCancelled ? bill.grandTotal : bill.subtotal + bill.cgst + bill.sgst;
                  
                  // Compute net adjustment impact
                  let adjValueStr = "";
                  let impactVal = 0;
                  let badge = null;

                  if (bill.isCancelled) {
                    const refundAmt = bill.refundAmount !== undefined ? bill.refundAmount : bill.netPaid;
                    adjValueStr = `-₹${refundAmt.toLocaleString('en-IN')}`;
                    impactVal = -bill.grandTotal;
                    badge = (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        <XCircle size={10} /> Voided
                      </span>
                    );
                  } else {
                    const historySum = bill.resettlementHistory 
                      ? bill.resettlementHistory.reduce((sum, h) => sum + h.differentialAmount, 0)
                      : 0;
                    adjValueStr = historySum >= 0 ? `+₹${historySum.toLocaleString('en-IN')}` : `-₹${Math.abs(historySum).toLocaleString('en-IN')}`;
                    impactVal = historySum;
                    badge = (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        <RefreshCw size={10} className="animate-spin duration-3000" /> Resettled (v{bill.version || 2})
                      </span>
                    );
                  }

                  return (
                    <React.Fragment key={bill.billNo}>
                      {/* Parent Row */}
                      <tr 
                        onClick={() => toggleRow(bill.billNo)}
                        className={`hover:bg-slate-50/70 border-b border-slate-100 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-slate-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-xs text-slate-900 block">{bill.billNo}</span>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">ID: {bill.bookingId}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-xs text-slate-800 block">{bill.customerName}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{bill.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-xs text-slate-700 block">{bill.hall}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{bill.eventType}</span>
                        </td>
                        <td className="py-3.5 px-4">{badge}</td>
                        <td className="py-3.5 px-4 text-right font-semibold text-xs text-slate-600">
                          ₹{originalTotal.toLocaleString('en-IN')}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-bold text-xs ${
                          bill.isCancelled ? 'text-red-500' : impactVal >= 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          {adjValueStr}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-extrabold text-xs ${
                          impactVal < 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          ₹{impactVal.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[9px] text-slate-600">
                              {(bill.isCancelled ? (bill.cancelledBy || 'R') : (bill.resettledBy || 'R')).charAt(0)}
                            </div>
                            <span className="text-xs text-slate-700 font-bold">
                              {bill.isCancelled ? (bill.cancelledBy || 'Duty Manager') : (bill.resettledBy || 'Duty Manager')}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{bill.isCancelled ? bill.cancelledAt : bill.resettledAt}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isExpanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                        </td>
                      </tr>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <td colSpan={9} className="p-5">
                            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Action Reason Details */}
                                <div className="space-y-2">
                                  <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    {bill.isCancelled ? '⛔ Void Audit Reasons' : '📝 Resettlement Reasons & Scope'}
                                  </h5>
                                  <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                                    bill.isCancelled ? 'bg-red-50/40 border-red-100 text-red-900' : 'bg-amber-50/30 border-amber-100 text-amber-900'
                                  }`}>
                                    <p className="font-medium">
                                      {bill.isCancelled ? bill.cancellationReason : bill.resettlementReason}
                                    </p>
                                  </div>

                                  {bill.isCancelled && (
                                    <div className="text-[11px] text-slate-600 space-y-1">
                                      <p><strong>Refund Mode:</strong> {bill.refundMode || 'N/A'}</p>
                                      <p><strong>Refund Transaction Ref:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 text-[10px]">{bill.refundTxnRef || 'N/A'}</code></p>
                                      <div className="pt-3">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenReinstateModal(bill)}
                                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                          title="Reinstate / Reactivate cancelled bill back to Settled status"
                                        >
                                          <Undo2 size={14} /> Reinstate & Re-activate Invoice
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Right: Original vs Revised particulars summary */}
                                <div className="space-y-2">
                                  <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    Itemized Charges Summary
                                  </h5>
                                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    {bill.charges.map((c) => (
                                      <div key={c.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                                        <span className="text-slate-600">{c.item} <span className="text-[10px] text-slate-400 font-bold">(x{c.qty})</span></span>
                                        <span className="font-semibold text-slate-800">₹{c.amount.toLocaleString('en-IN')}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center pt-2 text-xs font-bold border-t border-slate-100">
                                    <span className="text-slate-700">Subtotal</span>
                                    <span>₹{bill.subtotal.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                                    <span>CGST + SGST (18%)</span>
                                    <span>₹{(bill.cgst + bill.sgst).toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs font-black text-slate-900 pt-1 border-t border-slate-100">
                                    <span>Grand Total</span>
                                    <span>₹{bill.grandTotal.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Timeline log list (Only for resettlement which might have multiple versions) */}
                              {bill.isResettled && bill.resettlementHistory && (
                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                  <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    Resettlement Version Audit Timeline (Total {bill.resettlementHistory.length} revisions)
                                  </h5>
                                  <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 py-1">
                                    {bill.resettlementHistory.map((log, idx) => (
                                      <div key={idx} className="relative text-xs">
                                        <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white"></span>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                                          <div>
                                            <span className="font-bold text-slate-800 block">Revision #{bill.resettlementHistory!.length - idx}</span>
                                            <p className="text-slate-500 text-[11px] mt-0.5">{log.reason}</p>
                                          </div>
                                          <div className="text-right shrink-0">
                                            <span className={`font-bold block ${log.differentialAmount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                              {log.differentialAmount >= 0 ? `+₹${log.differentialAmount.toLocaleString('en-IN')}` : `-₹${Math.abs(log.differentialAmount).toLocaleString('en-IN')}`}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{log.resettledAt} • By {log.resettledBy}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REASON ANALYSIS & SECURITY POLICIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis: Common Causes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
            <AlertTriangle className="text-amber-500" size={16} />
            Common Void & Resettle Causes
          </h4>
          <p className="text-[11px] text-slate-500">
            Audit intelligence automatically extracted from billing logs to prevent future invoicing errors.
          </p>

          <div className="space-y-2.5 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                <span>Severe Weather / Natural Disruptions</span>
                <span>40% of cases</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                <span>Post-Event Service Adjustments (AV / Extra Tea)</span>
                <span>35% of cases</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                <span>Initial Quotation / Booking Entry Errors</span>
                <span>25% of cases</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Governance Policies */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white space-y-3 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert size={16} />
              Invoicing & Refund Governance Rules
            </h4>
            <ul className="text-[11px] text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong>Authorized Personnel ONLY:</strong> Only staff members tagged as Admin or Manager are allowed to confirm bill cancellations or resettlements.</li>
              <li><strong>Mandatory Auditing reasons:</strong> All voided bills or billing adjustments require explicit descriptions and comments before credit generation.</li>
              <li><strong>Version History Lock:</strong> Upon resettling a bill, the previous copy is preserved as a locked version to prevent tampering or ledger manipulations.</li>
              <li><strong>Credit Note Issuance:</strong> Standard credit notes are automatically computed and forwarded to the local tax authorities via unified ERP pipelines.</li>
            </ul>
          </div>
          <div className="text-[10px] text-slate-500 text-center font-semibold pt-4 border-t border-slate-800">
            Grand Horizon ERP System Governance Console • Audited Under Section 31
          </div>
        </div>
      </div>

      {/* MODAL: REINSTATE / REACTIVATE CANCELLED BILL */}
      {reinstatingBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
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
                onClick={handleConfirmReinstateBill}
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
