import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Search, 
  DollarSign, 
  CreditCard, 
  QrCode, 
  Building, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Filter, 
  ShieldCheck, 
  RefreshCw,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Landmark,
  Eye,
  Sparkles
} from 'lucide-react';

export interface CashierTransaction {
  id: string;
  billNo: string;
  time: string;
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
  counterId: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'Settled' | 'Advance Collected' | 'Refunded';
}

const mockCashierTransactions: CashierTransaction[] = [
  {
    id: 'tx-101',
    billNo: 'BILL-2026-8912',
    time: '2026-09-02 09:15 AM',
    customerName: 'Rohan Sharma',
    customerPhone: '+91 98765 43210',
    hallName: 'Grand Crystal Ballroom',
    eventType: 'Wedding Reception',
    paymentMode: 'Cash',
    txnRef: 'CASH-REC-001',
    subtotal: 150000,
    tax: 27000,
    totalAmount: 177000,
    advancePaid: 50000,
    netSettled: 127000,
    cashierName: 'Rajan Sharma',
    counterId: 'Counter 1 (Main Entrance)',
    shift: 'Morning',
    status: 'Settled'
  },
  {
    id: 'tx-102',
    billNo: 'BILL-2026-4410',
    time: '2026-09-02 10:30 AM',
    customerName: 'Priya Verma',
    customerPhone: '+91 98123 45678',
    hallName: 'Royal Emerald Suite',
    eventType: 'Corporate Summit',
    paymentMode: 'UPI / QR Code',
    txnRef: 'UPI-9918230192',
    subtotal: 90000,
    tax: 16200,
    totalAmount: 106200,
    advancePaid: 25000,
    netSettled: 81200,
    cashierName: 'Rajan Sharma',
    counterId: 'Counter 1 (Main Entrance)',
    shift: 'Morning',
    status: 'Settled'
  },
  {
    id: 'tx-103',
    billNo: 'BILL-2026-3109',
    time: '2026-09-02 11:45 AM',
    customerName: 'Anand Kumar',
    customerPhone: '+91 97654 32109',
    hallName: 'Sapphire Garden Lawn',
    eventType: 'Birthday Gala',
    paymentMode: 'Credit / Debit Card',
    txnRef: 'POS-AUTH-88219',
    subtotal: 65000,
    tax: 11700,
    totalAmount: 76700,
    advancePaid: 20000,
    netSettled: 56700,
    cashierName: 'Priya V.',
    counterId: 'Counter 2 (Billing Desk B)',
    shift: 'Morning',
    status: 'Settled'
  },
  {
    id: 'tx-104',
    billNo: 'REC-2026-9021',
    time: '2026-09-02 12:15 PM',
    customerName: 'Meera Patel',
    customerPhone: '+91 96543 21098',
    hallName: 'Grand Crystal Ballroom',
    eventType: 'Sangeet Ceremony',
    paymentMode: 'Cash',
    txnRef: 'CASH-ADV-402',
    subtotal: 40000,
    tax: 0,
    totalAmount: 40000,
    advancePaid: 0,
    netSettled: 40000,
    cashierName: 'Rajan Sharma',
    counterId: 'Counter 1 (Main Entrance)',
    shift: 'Morning',
    status: 'Advance Collected'
  },
  {
    id: 'tx-105',
    billNo: 'BILL-2026-1189',
    time: '2026-09-02 02:00 PM',
    customerName: 'Suresh Menon',
    customerPhone: '+91 95432 10987',
    hallName: 'Diamond Executive Lounge',
    eventType: 'Product Launch',
    paymentMode: 'Net Banking',
    txnRef: 'NEFT-AXIS-9921',
    subtotal: 120000,
    tax: 21600,
    totalAmount: 141600,
    advancePaid: 41600,
    netSettled: 100000,
    cashierName: 'Amit Verma',
    counterId: 'Counter 3 (VIP Desk)',
    shift: 'Morning',
    status: 'Settled'
  },
  {
    id: 'tx-106',
    billNo: 'BILL-2026-7823',
    time: '2026-09-02 04:30 PM',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 94321 09876',
    hallName: 'Royal Emerald Suite',
    eventType: 'Anniversary Celebration',
    paymentMode: 'UPI / QR Code',
    txnRef: 'PAYTM-882710492',
    subtotal: 75000,
    tax: 13500,
    totalAmount: 88500,
    advancePaid: 30000,
    netSettled: 58500,
    cashierName: 'Priya V.',
    counterId: 'Counter 2 (Billing Desk B)',
    shift: 'Evening',
    status: 'Settled'
  },
  {
    id: 'tx-107',
    billNo: 'BILL-2026-5501',
    time: '2026-09-02 06:15 PM',
    customerName: 'Kavita Sundaram',
    customerPhone: '+91 93210 98765',
    hallName: 'Grand Crystal Ballroom',
    eventType: 'Conference & Dinner',
    paymentMode: 'Cash',
    txnRef: 'CASH-REC-088',
    subtotal: 50000,
    tax: 9000,
    totalAmount: 59000,
    advancePaid: 15000,
    netSettled: 44000,
    cashierName: 'Amit Verma',
    counterId: 'Counter 3 (VIP Desk)',
    shift: 'Evening',
    status: 'Settled'
  },
  {
    id: 'tx-108',
    billNo: 'REF-2026-0012',
    time: '2026-09-02 07:00 PM',
    customerName: 'Deepak Chopra',
    customerPhone: '+91 92109 87654',
    hallName: 'Sapphire Garden Lawn',
    eventType: 'Pre-Wedding Shoot',
    paymentMode: 'Cash',
    txnRef: 'CASH-REFUND-02',
    subtotal: -5000,
    tax: 0,
    totalAmount: -5000,
    advancePaid: 0,
    netSettled: -5000,
    cashierName: 'Rajan Sharma',
    counterId: 'Counter 1 (Main Entrance)',
    shift: 'Evening',
    status: 'Refunded'
  }
];

export default function CashierReport() {
  const [selectedCashier, setSelectedCashier] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-02');

  // Cash Drawer Reconciliation State
  const [openingFloat, setOpeningFloat] = useState<number>(10000);
  const [actualCashNotes, setActualCashNotes] = useState({
    c2000: 10,
    c500: 350,
    c200: 50,
    c100: 60,
    c50: 0,
    coins: 0
  });

  const [selectedTxnForDetails, setSelectedTxnForDetails] = useState<CashierTransaction | null>(null);
  const [showShiftClosingModal, setShowShiftClosingModal] = useState<boolean>(false);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return mockCashierTransactions.filter(tx => {
      const matchesCashier = selectedCashier === 'all' || tx.cashierName === selectedCashier;
      const matchesShift = selectedShift === 'all' || tx.shift === selectedShift;
      const matchesMode = selectedPaymentMode === 'all' || tx.paymentMode === selectedPaymentMode;
      const matchesSearch = !searchQuery.trim() || 
        tx.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.hallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txnRef.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCashier && matchesShift && matchesMode && matchesSearch;
    });
  }, [selectedCashier, selectedShift, selectedPaymentMode, searchQuery]);

  // Financial Metrics
  const metrics = useMemo(() => {
    let totalCollected = 0;
    let cashTotal = 0;
    let upiTotal = 0;
    let cardTotal = 0;
    let netBankingTotal = 0;
    let chequeTotal = 0;
    let advanceTotal = 0;
    let refundTotal = 0;

    filteredTransactions.forEach(tx => {
      totalCollected += tx.netSettled;
      if (tx.status === 'Refunded') {
        refundTotal += Math.abs(tx.netSettled);
      } else if (tx.status === 'Advance Collected') {
        advanceTotal += tx.netSettled;
      }

      switch (tx.paymentMode) {
        case 'Cash':
          cashTotal += tx.netSettled;
          break;
        case 'UPI / QR Code':
          upiTotal += tx.netSettled;
          break;
        case 'Credit / Debit Card':
          cardTotal += tx.netSettled;
          break;
        case 'Net Banking':
          netBankingTotal += tx.netSettled;
          break;
        case 'Cheque':
          chequeTotal += tx.netSettled;
          break;
      }
    });

    const expectedCashInDrawer = openingFloat + cashTotal;

    // Calculate actual physical cash counted
    const countedCash = 
      (actualCashNotes.c2000 * 2000) +
      (actualCashNotes.c500 * 500) +
      (actualCashNotes.c200 * 200) +
      (actualCashNotes.c100 * 100) +
      (actualCashNotes.c50 * 50) +
      actualCashNotes.coins;

    const discrepancy = countedCash - expectedCashInDrawer;

    return {
      totalCollected,
      cashTotal,
      upiTotal,
      cardTotal,
      netBankingTotal,
      chequeTotal,
      advanceTotal,
      refundTotal,
      expectedCashInDrawer,
      countedCash,
      discrepancy,
      txCount: filteredTransactions.length
    };
  }, [filteredTransactions, openingFloat, actualCashNotes]);

  // Export CSV
  const handleExportCSV = () => {
    let csv = "Bill No,Time,Customer Name,Phone,Hall,Event Type,Payment Mode,Txn Ref,Total Amount,Advance Deducted,Net Settled,Cashier Name,Shift,Status\n";
    filteredTransactions.forEach(tx => {
      csv += `"${tx.billNo}","${tx.time}","${tx.customerName}","${tx.customerPhone}","${tx.hallName}","${tx.eventType}","${tx.paymentMode}","${tx.txnRef}",${tx.totalAmount},${tx.advancePaid},${tx.netSettled},"${tx.cashierName}","${tx.shift}","${tx.status}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Cashier_Report_${selectedDate}_${selectedCashier.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Print Z-Report
  const handlePrintZReport = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cashier Shift Closing Statement (Z-Report) - ${selectedDate}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; pb-12; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
            .header p { margin: 3px 0; font-size: 11px; color: #64748b; }
            .title-badge { display: inline-block; background: #0f172a; color: white; font-weight: bold; font-size: 11px; padding: 4px 15px; border-radius: 4px; margin-top: 8px; text-transform: uppercase; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11.5px; }
            .meta-grid p { margin: 3px 0; }
            .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin: 18px 0 10px 0; color: #334155; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px; }
            th { background: #f1f5f9; padding: 7px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
            td { padding: 7px; border-bottom: 1px solid #e2e8f0; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .summary-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 20px; }
            .summary-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px dashed #cbd5e1; }
            .summary-row:last-child { border-bottom: none; font-weight: bold; font-size: 13px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 20px; }
            .sig-box { text-align: center; border-top: 1px solid #94a3b8; width: 220px; padding-top: 6px; font-size: 11px; font-weight: bold; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Grand Horizon Banquet & Convention Hall</h1>
            <p>124 Convention Boulevard, Metro City • GSTIN: 27AAAAA0000A1Z5</p>
            <div class="title-badge">CASHIER SHIFT CLOSING Z-REPORT</div>
          </div>

          <div class="meta-grid">
            <div>
              <p><strong>Report Date:</strong> ${selectedDate}</p>
              <p><strong>Shift Covered:</strong> ${selectedShift === 'all' ? 'All Shifts (Morning, Evening, Night)' : `${selectedShift} Shift`}</p>
              <p><strong>Cashier Operator:</strong> ${selectedCashier === 'all' ? 'All Station Cashiers' : selectedCashier}</p>
            </div>
            <div>
              <p><strong>Total Transactions:</strong> ${metrics.txCount} Invoices & Receipts</p>
              <p><strong>Generated At:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Terminal Register:</strong> Main Banquet Cash Desk #1</p>
            </div>
          </div>

          <div class="section-title">1. Payment Collection Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Payment Method</th>
                <th class="text-right">No. of Receipts</th>
                <th class="text-right">Percentage</th>
                <th class="text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cash Collections</td>
                <td class="text-right">${filteredTransactions.filter(t => t.paymentMode === 'Cash').length}</td>
                <td class="text-right">${metrics.totalCollected > 0 ? ((metrics.cashTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%</td>
                <td class="text-right font-bold">₹${metrics.cashTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>UPI / QR Code (Digital)</td>
                <td class="text-right">${filteredTransactions.filter(t => t.paymentMode === 'UPI / QR Code').length}</td>
                <td class="text-right">${metrics.totalCollected > 0 ? ((metrics.upiTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%</td>
                <td class="text-right font-bold">₹${metrics.upiTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Credit / Debit Card (POS)</td>
                <td class="text-right">${filteredTransactions.filter(t => t.paymentMode === 'Credit / Debit Card').length}</td>
                <td class="text-right">${metrics.totalCollected > 0 ? ((metrics.cardTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%</td>
                <td class="text-right font-bold">₹${metrics.cardTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Net Banking / NEFT</td>
                <td class="text-right">${filteredTransactions.filter(t => t.paymentMode === 'Net Banking').length}</td>
                <td class="text-right">${metrics.totalCollected > 0 ? ((metrics.netBankingTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%</td>
                <td class="text-right font-bold">₹${metrics.netBankingTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr style="background: #f8fafc; font-weight: bold;">
                <td>NET TOTAL COLLECTIONS</td>
                <td class="text-right">${metrics.txCount}</td>
                <td class="text-right">100.0%</td>
                <td class="text-right">₹${metrics.totalCollected.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">2. Cash Drawer Reconciliation Statement</div>
          <div class="summary-box">
            <div class="summary-row">
              <span>Opening Cash Float Balance</span>
              <span>₹${openingFloat.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span>(+) Total Net Cash Collected</span>
              <span>₹${metrics.cashTotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span>EXPECTED CASH IN TILL / DRAWER</span>
              <span class="font-bold">₹${metrics.expectedCashInDrawer.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span>ACTUAL COUNTED CASH IN TILL</span>
              <span class="font-bold">₹${metrics.countedCash.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row" style="color: ${metrics.discrepancy === 0 ? '#16a34a' : metrics.discrepancy > 0 ? '#2563eb' : '#dc2626'}; font-weight: bold;">
              <span>VARIANCE / DISCREPANCY STATUS</span>
              <span>${metrics.discrepancy === 0 ? '✓ MATCHED EXACTLY (₹0)' : metrics.discrepancy > 0 ? `+ ₹${metrics.discrepancy.toLocaleString('en-IN')} (SURPLUS)` : `- ₹${Math.abs(metrics.discrepancy).toLocaleString('en-IN')} (SHORTAGE)`}</span>
            </div>
          </div>

          <div class="section-title">3. Shift Transaction Log</div>
          <table>
            <thead>
              <tr>
                <th>Bill / Ref #</th>
                <th>Time</th>
                <th>Customer & Hall</th>
                <th>Mode</th>
                <th>Cashier</th>
                <th class="text-right">Net Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(tx => `
                <tr>
                  <td><strong>${tx.billNo}</strong></td>
                  <td>${tx.time.split(' ')[1]} ${tx.time.split(' ')[2]}</td>
                  <td>${tx.customerName} (${tx.hallName.split(' ')[0]})</td>
                  <td>${tx.paymentMode}</td>
                  <td>${tx.cashierName}</td>
                  <td class="text-right font-bold">₹${tx.netSettled.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="signatures">
            <div class="sig-box">Cashier Operator Signature</div>
            <div class="sig-box">Duty Manager / Auditor Signoff</div>
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOP CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Daily Cashier & Shift Settlement Report</h2>
              <p className="text-xs text-slate-500">Track cashier shift collections, cash float reconciliation, and payment mode breakdowns</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handlePrintZReport}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Printer size={15} /> Print Shift Z-Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Download size={15} /> Export CSV Ledger
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Date Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Settlement Date</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
            />
            <Calendar size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Cashier Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cashier Operator</label>
          <div className="relative">
            <select
              value={selectedCashier}
              onChange={e => setSelectedCashier(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none appearance-none"
            >
              <option value="all">All Cashier Operators</option>
              <option value="Rajan Sharma">Rajan Sharma (Counter 1)</option>
              <option value="Priya V.">Priya V. (Counter 2)</option>
              <option value="Amit Verma">Amit Verma (Counter 3)</option>
            </select>
            <User size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Shift Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Shift Period</label>
          <div className="relative">
            <select
              value={selectedShift}
              onChange={e => setSelectedShift(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none appearance-none"
            >
              <option value="all">All Shifts (24 Hours)</option>
              <option value="Morning">Morning Shift (08:00 - 16:00)</option>
              <option value="Evening">Evening Shift (16:00 - 00:00)</option>
              <option value="Night">Night Shift (00:00 - 08:00)</option>
            </select>
            <Clock size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Payment Mode Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Method</label>
          <div className="relative">
            <select
              value={selectedPaymentMode}
              onChange={e => setSelectedPaymentMode(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none appearance-none"
            >
              <option value="all">All Payment Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI / QR Code">UPI / QR Code</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
            <CreditCard size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Search Audit</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Bill #, Customer, Ref..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Collections */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-blue-200">Total Shift Collections</div>
              <div className="text-2xl font-extrabold mt-1">₹{metrics.totalCollected.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-blue-100 mt-1 font-medium">
                From {metrics.txCount} settled receipts
              </div>
            </div>
            <div className="p-2.5 bg-white/10 backdrop-blur-xs rounded-xl text-blue-100">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[11px] text-blue-100 font-medium">
            <span>Advance Settled: ₹{metrics.advanceTotal.toLocaleString('en-IN')}</span>
            <span>Refunds: ₹{metrics.refundTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Card 2: Cash In Drawer */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Wallet size={12} className="text-emerald-600" /> Cash In Drawer (Till)
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{metrics.cashTotal.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">
                + Float: ₹{openingFloat.toLocaleString('en-IN')} = ₹{metrics.expectedCashInDrawer.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[10.5px] text-slate-500 font-medium">
            <span>Expected: ₹{metrics.expectedCashInDrawer.toLocaleString('en-IN')}</span>
            <span>Counted: ₹{metrics.countedCash.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Card 3: Digital & UPI */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <QrCode size={12} className="text-purple-600" /> Digital / UPI QR
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{metrics.upiTotal.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">
                {metrics.totalCollected > 0 ? ((metrics.upiTotal / metrics.totalCollected) * 100).toFixed(1) : 0}% of total shift
              </div>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <QrCode size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[10.5px] text-slate-500 font-medium">
            <span>Direct to Bank Account</span>
            <span className="font-bold text-purple-700">Verified</span>
          </div>
        </div>

        {/* Card 4: Cards & POS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <CreditCard size={12} className="text-amber-600" /> Credit / POS Cards
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{metrics.cardTotal.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">
                {metrics.totalCollected > 0 ? ((metrics.cardTotal / metrics.totalCollected) * 100).toFixed(1) : 0}% of total shift
              </div>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[10.5px] text-slate-500 font-medium">
            <span>POS Swipe Terminal</span>
            <span className="font-bold text-slate-700">Counter 1 & 2</span>
          </div>
        </div>
      </div>

      {/* RECONCILIATION & PAYMENT METHOD SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Cash Drawer Reconciliation Calculator */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Cash Drawer Reconciliation & Float Audit</h3>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Shift Closing Verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Opening Cash Float</label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={openingFloat}
                  onChange={e => setOpeningFloat(Number(e.target.value))}
                  className="w-full bg-white px-2 py-1 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Cash Inflow</div>
              <div className="text-sm font-extrabold text-emerald-700">+ ₹{metrics.cashTotal.toLocaleString('en-IN')}</div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <div className="text-[10px] font-bold text-blue-700 uppercase mb-1">Expected Cash in Drawer</div>
              <div className="text-sm font-extrabold text-blue-900">₹{metrics.expectedCashInDrawer.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Interactive Denomination Counter */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between items-center">
              <span>Physical Note Counter (Counted in Till)</span>
              <span className="text-[11px] font-extrabold text-slate-900">Counted Total: ₹{metrics.countedCash.toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">₹2000 ×</span>
                <input
                  type="number"
                  min="0"
                  value={actualCashNotes.c2000}
                  onChange={e => setActualCashNotes(prev => ({ ...prev, c2000: Number(e.target.value) }))}
                  className="w-16 p-1 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">₹500 ×</span>
                <input
                  type="number"
                  min="0"
                  value={actualCashNotes.c500}
                  onChange={e => setActualCashNotes(prev => ({ ...prev, c500: Number(e.target.value) }))}
                  className="w-16 p-1 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">₹200 ×</span>
                <input
                  type="number"
                  min="0"
                  value={actualCashNotes.c200}
                  onChange={e => setActualCashNotes(prev => ({ ...prev, c200: Number(e.target.value) }))}
                  className="w-16 p-1 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">₹100 ×</span>
                <input
                  type="number"
                  min="0"
                  value={actualCashNotes.c100}
                  onChange={e => setActualCashNotes(prev => ({ ...prev, c100: Number(e.target.value) }))}
                  className="w-16 p-1 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">₹50 ×</span>
                <input
                  type="number"
                  min="0"
                  value={actualCashNotes.c50}
                  onChange={e => setActualCashNotes(prev => ({ ...prev, c50: Number(e.target.value) }))}
                  className="w-16 p-1 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Coins ₹</span>
                <input
                  type="number"
                  min="0"
                  value={actualCashNotes.coins}
                  onChange={e => setActualCashNotes(prev => ({ ...prev, coins: Number(e.target.value) }))}
                  className="w-16 p-1 text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Discrepancy Alert Box */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
            metrics.discrepancy === 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : metrics.discrepancy > 0
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {metrics.discrepancy === 0 ? (
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle size={20} className={metrics.discrepancy > 0 ? 'text-blue-600 shrink-0' : 'text-red-600 shrink-0'} />
              )}
              <div>
                <div className="text-xs font-bold">
                  {metrics.discrepancy === 0 
                    ? 'Perfect Till Match! Counted cash matches expected total exactly.'
                    : metrics.discrepancy > 0
                      ? `Surplus Cash in Till: +₹${metrics.discrepancy.toLocaleString('en-IN')}`
                      : `Cash Shortage Warning: -₹${Math.abs(metrics.discrepancy).toLocaleString('en-IN')}`
                  }
                </div>
                <div className="text-[11px] opacity-80">
                  {metrics.discrepancy === 0
                    ? 'Handover ready for next shift supervisor.'
                    : 'Please verify receipt entries and petty cash vouchers before closing shift.'
                  }
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 bg-white rounded-lg shadow-2xs">
              Diff: ₹{metrics.discrepancy.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right Column: Payment Mode Visual Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Collection Share by Payment Mode</h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">100% Shift Total</span>
            </div>

            <div className="space-y-4">
              {/* Cash Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">
                    <DollarSign size={14} className="text-emerald-600" /> Cash
                  </span>
                  <span className="text-slate-900">
                    ₹{metrics.cashTotal.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 font-normal">
                      ({metrics.totalCollected > 0 ? ((metrics.cashTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.totalCollected > 0 ? (metrics.cashTotal / metrics.totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* UPI Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">
                    <QrCode size={14} className="text-purple-600" /> UPI / QR Code
                  </span>
                  <span className="text-slate-900">
                    ₹{metrics.upiTotal.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 font-normal">
                      ({metrics.totalCollected > 0 ? ((metrics.upiTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.totalCollected > 0 ? (metrics.upiTotal / metrics.totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Card Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">
                    <CreditCard size={14} className="text-amber-600" /> Credit / POS Card
                  </span>
                  <span className="text-slate-900">
                    ₹{metrics.cardTotal.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 font-normal">
                      ({metrics.totalCollected > 0 ? ((metrics.cardTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.totalCollected > 0 ? (metrics.cardTotal / metrics.totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Net Banking Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 flex items-center gap-1">
                    <Landmark size={14} className="text-blue-600" /> Net Banking / NEFT
                  </span>
                  <span className="text-slate-900">
                    ₹{metrics.netBankingTotal.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 font-normal">
                      ({metrics.totalCollected > 0 ? ((metrics.netBankingTotal / metrics.totalCollected) * 100).toFixed(1) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.totalCollected > 0 ? (metrics.netBankingTotal / metrics.totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Audit Operator: <strong className="text-slate-800">{selectedCashier === 'all' ? 'All Station Operators' : selectedCashier}</strong></span>
            <span className="font-bold text-emerald-600">Verified & Reconciled</span>
          </div>
        </div>
      </div>

      {/* DETAILED CASHIER TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Detailed Shift Transaction Audit Log</h3>
            <p className="text-xs text-slate-500">Showing {filteredTransactions.length} settled receipts and advance entries</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Total Net Collection: ₹{metrics.totalCollected.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Bill / Receipt #</th>
                <th className="p-3">Time & Shift</th>
                <th className="p-3">Customer & Contact</th>
                <th className="p-3">Hall & Event</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Txn Ref #</th>
                <th className="p-3 text-right">Gross Bill</th>
                <th className="p-3 text-right">Advance Paid</th>
                <th className="p-3 text-right">Net Settled</th>
                <th className="p-3">Cashier</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    No transactions match the selected cashier and shift filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-slate-900">{tx.billNo}</span>
                      <div className="text-[10px]">
                        <span className={`font-semibold ${
                          tx.status === 'Settled' ? 'text-emerald-600' : tx.status === 'Advance Collected' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          ● {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div className="font-medium text-slate-800">{tx.time.split(' ')[1]} {tx.time.split(' ')[2]}</div>
                      <span className="text-[10px] text-slate-400 font-bold">{tx.shift} Shift</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{tx.customerName}</div>
                      <div className="text-[10px] text-slate-400">{tx.customerPhone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{tx.hallName}</div>
                      <div className="text-[10px] text-slate-500">{tx.eventType}</div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[10px] ${
                        tx.paymentMode === 'Cash' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.paymentMode === 'UPI / QR Code'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : tx.paymentMode === 'Credit / Debit Card'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {tx.paymentMode}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">{tx.txnRef}</td>
                    <td className="p-3 text-right font-medium text-slate-700">₹{tx.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-emerald-600 font-medium">
                      {tx.advancePaid > 0 ? `- ₹${tx.advancePaid.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-extrabold text-sm ${tx.netSettled < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        ₹{tx.netSettled.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{tx.cashierName}</div>
                      <div className="text-[9.5px] text-slate-400">{tx.counterId.split(' ')[0]}</div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedTxnForDetails(tx)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      {selectedTxnForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">Receipt #{selectedTxnForDetails.billNo}</h3>
                <p className="text-[10px] text-slate-400">Cashier Settlement Audit Record</p>
              </div>
              <button 
                onClick={() => setSelectedTxnForDetails(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <strong className="text-slate-800">{selectedTxnForDetails.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Venue / Hall:</span>
                  <strong className="text-slate-800">{selectedTxnForDetails.hallName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Event Type:</span>
                  <strong className="text-slate-800">{selectedTxnForDetails.eventType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time & Shift:</span>
                  <strong className="text-slate-800">{selectedTxnForDetails.time} ({selectedTxnForDetails.shift})</strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Total Bill:</span>
                  <span className="font-bold">₹{selectedTxnForDetails.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Less: Advance Paid:</span>
                  <span className="font-bold">- ₹{selectedTxnForDetails.advancePaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-900 text-sm font-extrabold border-t border-slate-200 pt-2">
                  <span>Net Settled Amount:</span>
                  <span className="text-blue-600">₹{selectedTxnForDetails.netSettled.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <strong className="font-bold">{selectedTxnForDetails.paymentMode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Reference:</span>
                  <strong className="font-mono">{selectedTxnForDetails.txnRef}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cashier Handled:</span>
                  <strong>{selectedTxnForDetails.cashierName} ({selectedTxnForDetails.counterId})</strong>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedTxnForDetails(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
