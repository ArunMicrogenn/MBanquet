import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Printer, 
  Download, 
  Search, 
  Calendar, 
  Building2, 
  FileText, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ChevronRight, 
  X, 
  Layers, 
  Calculator, 
  ShieldCheck, 
  Tag, 
  Receipt,
  FileCode2
} from 'lucide-react';

export interface SalesVoucher {
  id: string;
  voucherNo: string;
  voucherDate: string;
  customerName: string;
  customerType: 'B2B Corporate' | 'B2C Retail';
  gstin: string;
  hallName: string;
  eventType: string;
  
  // Ledger Breakup
  hallRentalSales: number;
  cateringSales: number;
  decorAndAvSales: number;
  miscSales: number;
  
  // Tax Calculations
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  
  grossAmount: number;
  
  // Payment & Terms
  paymentTerms: 'Cash / Spot' | 'UPI / QR' | 'Credit (Net 15)' | 'Credit (Net 30)' | 'Advance Adjusted';
  paidAmount: number;
  balanceDue: number;
  
  status: 'Posted & Paid' | 'Credit Receivable' | 'Advance Settlement';
}

const mockSalesDayBook: SalesVoucher[] = [
  {
    id: 'sb-001',
    voucherNo: 'SAL/2026-27/0891',
    voucherDate: '2026-09-02',
    customerName: 'TechCorp Solutions India Pvt Ltd',
    customerType: 'B2B Corporate',
    gstin: '27AAACT1234F1Z5',
    hallName: 'Grand Crystal Ballroom',
    eventType: 'Annual Tech Summit 2026',
    hallRentalSales: 100000,
    cateringSales: 40000,
    decorAndAvSales: 10000,
    miscSales: 0,
    taxableValue: 150000,
    cgstRate: 9,
    cgstAmount: 13500,
    sgstRate: 9,
    sgstAmount: 13500,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 27000,
    grossAmount: 177000,
    paymentTerms: 'Credit (Net 15)',
    paidAmount: 50000,
    balanceDue: 127000,
    status: 'Credit Receivable'
  },
  {
    id: 'sb-002',
    voucherNo: 'SAL/2026-27/0892',
    voucherDate: '2026-09-02',
    customerName: 'Priya & Rahul Wedding Reception',
    customerType: 'B2C Retail',
    gstin: 'URP (Unregistered)',
    hallName: 'Royal Emerald Suite',
    eventType: 'Wedding Banquet & Dinner',
    hallRentalSales: 50000,
    cateringSales: 35000,
    decorAndAvSales: 5000,
    miscSales: 0,
    taxableValue: 90000,
    cgstRate: 9,
    cgstAmount: 8100,
    sgstRate: 9,
    sgstAmount: 8100,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 16200,
    grossAmount: 106200,
    paymentTerms: 'UPI / QR',
    paidAmount: 106200,
    balanceDue: 0,
    status: 'Posted & Paid'
  },
  {
    id: 'sb-003',
    voucherNo: 'SAL/2026-27/0893',
    voucherDate: '2026-09-02',
    customerName: 'Apex Healthcare Pvt Ltd',
    customerType: 'B2B Corporate',
    gstin: '36AAACA9876P1Z2',
    hallName: 'Sapphire Garden Lawn',
    eventType: 'Medical Conference Gala',
    hallRentalSales: 120000,
    cateringSales: 60000,
    decorAndAvSales: 15000,
    miscSales: 5000,
    taxableValue: 200000,
    cgstRate: 0,
    cgstAmount: 0,
    sgstRate: 0,
    sgstAmount: 0,
    igstRate: 18,
    igstAmount: 36000,
    totalTax: 36000,
    grossAmount: 236000,
    paymentTerms: 'Credit (Net 30)',
    paidAmount: 0,
    balanceDue: 236000,
    status: 'Credit Receivable'
  },
  {
    id: 'sb-004',
    voucherNo: 'SAL/2026-27/0894',
    voucherDate: '2026-09-02',
    customerName: 'Suresh Kumar Silver Jubilee',
    customerType: 'B2C Retail',
    gstin: 'URP (Unregistered)',
    hallName: 'Diamond Executive Lounge',
    eventType: 'Family Milestone Gala',
    hallRentalSales: 45000,
    cateringSales: 25000,
    decorAndAvSales: 5000,
    miscSales: 0,
    taxableValue: 75000,
    cgstRate: 9,
    cgstAmount: 6750,
    sgstRate: 9,
    sgstAmount: 6750,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 13500,
    grossAmount: 88500,
    paymentTerms: 'Cash / Spot',
    paidAmount: 88500,
    balanceDue: 0,
    status: 'Posted & Paid'
  },
  {
    id: 'sb-005',
    voucherNo: 'SAL/2026-27/0895',
    voucherDate: '2026-09-01',
    customerName: 'Global Media & Entertainment',
    customerType: 'B2B Corporate',
    gstin: '27AABCG4321H1Z9',
    hallName: 'Grand Crystal Ballroom',
    eventType: 'Film Music Release Event',
    hallRentalSales: 80000,
    cateringSales: 30000,
    decorAndAvSales: 10000,
    miscSales: 0,
    taxableValue: 120000,
    cgstRate: 9,
    cgstAmount: 10800,
    sgstRate: 9,
    sgstAmount: 10800,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 21600,
    grossAmount: 141600,
    paymentTerms: 'Advance Adjusted',
    paidAmount: 141600,
    balanceDue: 0,
    status: 'Advance Settlement'
  },
  {
    id: 'sb-006',
    voucherNo: 'SAL/2026-27/0896',
    voucherDate: '2026-09-01',
    customerName: 'Veritas Technologies Ltd',
    customerType: 'B2B Corporate',
    gstin: '27AAACV9911K1Z3',
    hallName: 'Royal Emerald Suite',
    eventType: 'Quarterly Executive Meeting',
    hallRentalSales: 200000,
    cateringSales: 80000,
    decorAndAvSales: 20000,
    miscSales: 0,
    taxableValue: 300000,
    cgstRate: 9,
    cgstAmount: 27000,
    sgstRate: 9,
    sgstAmount: 27000,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 54000,
    grossAmount: 354000,
    paymentTerms: 'Credit (Net 15)',
    paidAmount: 100000,
    balanceDue: 254000,
    status: 'Credit Receivable'
  }
];

export default function SalesDayBook() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-02');
  const [selectedSaleType, setSelectedSaleType] = useState<string>('all');
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState<SalesVoucher | null>(null);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return mockSalesDayBook.filter(voucher => {
      const matchesDate = !selectedDate || voucher.voucherDate === selectedDate;
      
      const matchesSaleType = 
        selectedSaleType === 'all' ||
        (selectedSaleType === 'cash' && (voucher.paymentTerms === 'Cash / Spot' || voucher.paymentTerms === 'UPI / QR')) ||
        (selectedSaleType === 'credit' && voucher.paymentTerms.startsWith('Credit')) ||
        (selectedSaleType === 'advance' && voucher.paymentTerms === 'Advance Adjusted');

      const matchesCustomer = 
        selectedCustomerType === 'all' ||
        (selectedCustomerType === 'b2b' && voucher.customerType === 'B2B Corporate') ||
        (selectedCustomerType === 'b2c' && voucher.customerType === 'B2C Retail');

      const matchesSearch = !searchQuery.trim() ||
        voucher.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.hallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.eventType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDate && matchesSaleType && matchesCustomer && matchesSearch;
    });
  }, [selectedDate, selectedSaleType, selectedCustomerType, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let grossSales = 0;
    let netTaxable = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let totalTax = 0;
    let totalHallRental = 0;
    let totalCatering = 0;
    let totalDecorAndAv = 0;
    let totalMisc = 0;
    let cashSpotSales = 0;
    let creditSales = 0;
    let advanceAdjustedSales = 0;

    filteredVouchers.forEach(v => {
      grossSales += v.grossAmount;
      netTaxable += v.taxableValue;
      totalCGST += v.cgstAmount;
      totalSGST += v.sgstAmount;
      totalIGST += v.igstAmount;
      totalTax += v.totalTax;

      totalHallRental += v.hallRentalSales;
      totalCatering += v.cateringSales;
      totalDecorAndAv += v.decorAndAvSales;
      totalMisc += v.miscSales;

      if (v.paymentTerms === 'Cash / Spot' || v.paymentTerms === 'UPI / QR') {
        cashSpotSales += v.grossAmount;
      } else if (v.paymentTerms.startsWith('Credit')) {
        creditSales += v.grossAmount;
      } else if (v.paymentTerms === 'Advance Adjusted') {
        advanceAdjustedSales += v.grossAmount;
      }
    });

    return {
      grossSales,
      netTaxable,
      totalCGST,
      totalSGST,
      totalIGST,
      totalTax,
      totalHallRental,
      totalCatering,
      totalDecorAndAv,
      totalMisc,
      cashSpotSales,
      creditSales,
      advanceAdjustedSales,
      voucherCount: filteredVouchers.length
    };
  }, [filteredVouchers]);

  // Download CSV Format
  const handleExportCSV = () => {
    let csv = "Voucher Date,Voucher Number,Customer Name,Customer Type,GSTIN,Hall Name,Event Description,Hall Rental Sales (INR),Catering Sales (INR),Decor & AV Sales (INR),Misc Sales (INR),Net Taxable Sales (INR),CGST (INR),SGST (INR),IGST (INR),Total Output GST (INR),Gross Total Sales (INR),Payment Terms,Paid Amount (INR),Balance Receivable (INR),Voucher Status\n";

    filteredVouchers.forEach(v => {
      csv += `"${v.voucherDate}","${v.voucherNo}","${v.customerName}","${v.customerType}","${v.gstin}","${v.hallName}","${v.eventType}",${v.hallRentalSales},${v.cateringSales},${v.decorAndAvSales},${v.miscSales},${v.taxableValue},${v.cgstAmount},${v.sgstAmount},${v.igstAmount},${v.totalTax},${v.grossAmount},"${v.paymentTerms}",${v.paidAmount},${v.balanceDue},"${v.status}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sales_Day_Book_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Tally XML
  const handleExportTallyXML = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE>\n  <HEADER>\n    <TALLYREQUEST>Import Data</TALLYREQUEST>\n  </HEADER>\n  <BODY>\n    <IMPORTDATA>\n      <REQUESTDESC>\n        <REPORTNAME>Vouchers</REPORTNAME>\n      </REQUESTDESC>\n      <REQUESTDATA>\n`;

    filteredVouchers.forEach(v => {
      xml += `        <TALLYMESSAGE xmlns:UDF="TallyUDF">\n          <VOUCHER VCHTYPE="Sales" ACTION="Create">\n            <DATE>${v.voucherDate.replace(/-/g, '')}</DATE>\n            <VOUCHERNUMBER>${v.voucherNo}</VOUCHERNUMBER>\n            <PARTYLEDGERNAME>${v.customerName}</PARTYLEDGERNAME>\n            <NARRATION>Banquet event sales for ${v.eventType} in ${v.hallName}</NARRATION>\n            <AMOUNT>-${v.grossAmount}</AMOUNT>\n            <ALLLEDGERENTRIES.LIST>\n              <LEDGERNAME>Banquet Hall Rental Income</LEDGERNAME>\n              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n              <AMOUNT>${v.hallRentalSales}</AMOUNT>\n            </ALLLEDGERENTRIES.LIST>\n            <ALLLEDGERENTRIES.LIST>\n              <LEDGERNAME>Catering & Food Sales</LEDGERNAME>\n              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n              <AMOUNT>${v.cateringSales}</AMOUNT>\n            </ALLLEDGERENTRIES.LIST>\n            <ALLLEDGERENTRIES.LIST>\n              <LEDGERNAME>Output CGST @ 9%</LEDGERNAME>\n              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n              <AMOUNT>${v.cgstAmount}</AMOUNT>\n            </ALLLEDGERENTRIES.LIST>\n            <ALLLEDGERENTRIES.LIST>\n              <LEDGERNAME>Output SGST @ 9%</LEDGERNAME>\n              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n              <AMOUNT>${v.sgstAmount}</AMOUNT>\n            </ALLLEDGERENTRIES.LIST>\n          </VOUCHER>\n        </TALLYMESSAGE>\n`;
    });

    xml += `      </REQUESTDATA>\n    </IMPORTDATA>\n  </BODY>\n</ENVELOPE>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tally_Sales_Vouchers_${selectedDate}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print Formal Day Book Register
  const handlePrintDayBook = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=1000');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Day Book Register - ${selectedDate}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; max-width: 900px; margin: 0 auto; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
            .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
            .header p { margin: 3px 0; font-size: 11px; color: #64748b; }
            .badge { display: inline-block; background: #0f172a; color: #fbbf24; font-weight: bold; font-size: 10.5px; padding: 4px 14px; border-radius: 4px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11.5px; }
            .meta-grid p { margin: 3px 0; }
            .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin: 18px 0 10px 0; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 15px; }
            th { background: #f1f5f9; padding: 7px 5px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; font-size: 9.5px; text-transform: uppercase; }
            td { padding: 7px 5px; border-bottom: 1px solid #e2e8f0; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
            .kpi-card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; text-align: center; }
            .kpi-title { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .kpi-val { font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 20px; }
            .sig-box { text-align: center; border-top: 1px solid #94a3b8; width: 220px; padding-top: 6px; font-size: 11px; font-weight: bold; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Grand Horizon Banquet & Convention Center</h1>
            <p>124 Convention Boulevard, Metro City • Phone: +91 98765 43210</p>
            <p>GSTIN: 27AAAAA0000A1Z5 • Financial Accounts Register</p>
            <div class="badge">OFFICIAL SALES DAY BOOK & REVENUE JOURNAL</div>
          </div>

          <div class="meta-grid">
            <div>
              <p><strong>Accounting Date:</strong> ${selectedDate}</p>
              <p><strong>Entity Name:</strong> Grand Horizon Hospitality LLP</p>
              <p><strong>Voucher Count:</strong> ${metrics.voucherCount} Sales Invoices</p>
            </div>
            <div>
              <p><strong>Generated Timestamp:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Currency:</strong> INR (₹) Indian Rupee</p>
              <p><strong>Status:</strong> Audited & Balanced</p>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-title">Gross Day Sales</div>
              <div class="kpi-val">₹${metrics.grossSales.toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Net Taxable Value</div>
              <div class="kpi-val">₹${metrics.netTaxable.toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Output GST Collected</div>
              <div class="kpi-val" style="color: #d97706;">₹${metrics.totalTax.toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Credit Accounts Receivable</div>
              <div class="kpi-val" style="color: #dc2626;">₹${metrics.creditSales.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div class="section-title">1. Detailed Sales Journal Register Entries</div>
          <table>
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Party & GSTIN</th>
                <th>Hall & Event</th>
                <th class="text-right">Rental (₹)</th>
                <th class="text-right">Catering (₹)</th>
                <th class="text-right">Taxable (₹)</th>
                <th class="text-right">GST (₹)</th>
                <th class="text-right">Gross Total (₹)</th>
                <th class="text-center">Terms</th>
              </tr>
            </thead>
            <tbody>
              ${filteredVouchers.map(v => `
                <tr>
                  <td><strong>${v.voucherNo}</strong></td>
                  <td>${v.customerName}<br/><small style="color: #64748b;">${v.gstin}</small></td>
                  <td>${v.hallName}<br/><small style="color: #64748b;">${v.eventType}</small></td>
                  <td class="text-right">₹${v.hallRentalSales.toLocaleString('en-IN')}</td>
                  <td class="text-right">₹${v.cateringSales.toLocaleString('en-IN')}</td>
                  <td class="text-right font-bold">₹${v.taxableValue.toLocaleString('en-IN')}</td>
                  <td class="text-right font-bold" style="color: #d97706;">₹${v.totalTax.toLocaleString('en-IN')}</td>
                  <td class="text-right font-bold">₹${v.grossAmount.toLocaleString('en-IN')}</td>
                  <td class="text-center">${v.paymentTerms}</td>
                </tr>
              `).join('')}
              <tr style="background: #f1f5f9; font-weight: bold;">
                <td colSpan="3">TOTAL DAY SALES SUMMARY</td>
                <td class="text-right">₹${metrics.totalHallRental.toLocaleString('en-IN')}</td>
                <td class="text-right">₹${metrics.totalCatering.toLocaleString('en-IN')}</td>
                <td class="text-right">₹${metrics.netTaxable.toLocaleString('en-IN')}</td>
                <td class="text-right" style="color: #d97706;">₹${metrics.totalTax.toLocaleString('en-IN')}</td>
                <td class="text-right" style="font-size: 11.5px;">₹${metrics.grossSales.toLocaleString('en-IN')}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">2. General Ledger Allocation Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Ledger Account Name</th>
                <th>Account Type</th>
                <th class="text-right">Credit Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>3100 - Banquet Hall Rental Income</strong></td>
                <td>Revenue Ledger</td>
                <td class="text-right font-bold">₹${metrics.totalHallRental.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td><strong>3200 - Catering & F&B Services Income</strong></td>
                <td>Revenue Ledger</td>
                <td class="text-right font-bold">₹${metrics.totalCatering.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td><strong>3300 - Decor, Stage & AV Services Income</strong></td>
                <td>Revenue Ledger</td>
                <td class="text-right font-bold">₹${metrics.totalDecorAndAv.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td><strong>2110 - Output CGST Payable (9%)</strong></td>
                <td>Liability / Statutory</td>
                <td class="text-right font-bold">₹${metrics.totalCGST.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td><strong>2120 - Output SGST Payable (9%)</strong></td>
                <td>Liability / Statutory</td>
                <td class="text-right font-bold">₹${metrics.totalSGST.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td><strong>2130 - Output IGST Payable (18%)</strong></td>
                <td>Liability / Statutory</td>
                <td class="text-right font-bold">₹${metrics.totalIGST.toLocaleString('en-IN')}</td>
              </tr>
              <tr style="background: #f1f5f9; font-weight: bold;">
                <td colSpan="2">TOTAL SALES JOURNAL CREDIT POSTING</td>
                <td class="text-right" style="font-size: 11.5px;">₹${metrics.grossSales.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="signatures">
            <div class="sig-box">Prepared by Senior Accountant</div>
            <div class="sig-box">Financial Controller / Auditor</div>
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
      {/* HEADER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-slate-900 text-amber-400 rounded-xl shadow-xs">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Sales Day Book & Revenue Journal</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md border border-amber-300 uppercase tracking-wider">
                  ERP Accounting Ledger
                </span>
              </div>
              <p className="text-xs text-slate-500">Daily accounting entries for hall rentals, catering sales, GST allocations, and party receivables</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handlePrintDayBook}
            className="flex-1 md:flex-none px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Printer size={15} className="text-amber-400" /> Print Day Book
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={handleExportTallyXML}
            className="flex-1 md:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            title="Download XML file formatted for Tally Prime ERP Import"
          >
            <FileCode2 size={15} className="text-blue-600" /> Tally XML
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Date Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sales Journal Date</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
            />
            <Calendar size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Sale Type / Payment Terms Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sales Terms Category</label>
          <div className="relative">
            <select
              value={selectedSaleType}
              onChange={e => setSelectedSaleType(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-500 outline-none appearance-none"
            >
              <option value="all">All Sales Terms</option>
              <option value="cash">Cash & Spot Settlements (Instant)</option>
              <option value="credit">Credit Accounts Receivable (Net 15 / Net 30)</option>
              <option value="advance">Advance Deposit Settlements</option>
            </select>
            <CreditCard size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Customer Type Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Ledger Category</label>
          <div className="relative">
            <select
              value={selectedCustomerType}
              onChange={e => setSelectedCustomerType(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-500 outline-none appearance-none"
            >
              <option value="all">All Party Types</option>
              <option value="b2b">B2B Corporate Clients (With GSTIN)</option>
              <option value="b2c">B2C Individual / Family Banquets</option>
            </select>
            <Building2 size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Search Day Book Vouchers</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Voucher #, Customer, GSTIN, Hall..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* METRIC KPI CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Gross Day Sales */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Total Gross Day Sales</div>
              <div className="text-2xl font-black text-amber-400 mt-1">₹{metrics.grossSales.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-300 mt-1 font-medium">
                Across {metrics.voucherCount} sales vouchers
              </div>
            </div>
            <div className="p-2.5 bg-white/10 backdrop-blur-xs rounded-xl text-amber-400">
              <Receipt size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
            <span>Net Taxable: ₹{metrics.netTaxable.toLocaleString('en-IN')}</span>
            <span className="text-amber-300 font-bold">Invoiced</span>
          </div>
        </div>

        {/* Card 2: Cash & Spot Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Spot & Instant Collections</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">₹{metrics.cashSpotSales.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                {metrics.grossSales > 0 ? ((metrics.cashSpotSales / metrics.grossSales) * 100).toFixed(1) : 0}% Cash / UPI Sales
              </div>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>Instant Liquidity</span>
            <span className="font-bold text-emerald-700">Settled</span>
          </div>
        </div>

        {/* Card 3: Credit Sales (Sundry Debtors) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Credit Sales (Sundry Debtors)</div>
              <div className="text-2xl font-black text-rose-600 mt-1">₹{metrics.creditSales.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-rose-600 font-medium mt-1">
                Accounts Receivable Balance
              </div>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>Net 15 / Net 30 Terms</span>
            <span className="font-bold text-rose-700">Pending Receipt</span>
          </div>
        </div>

        {/* Card 4: Output GST Liabilities */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Output GST Allocations</div>
              <div className="text-2xl font-black text-amber-700 mt-1">₹{metrics.totalTax.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-800 font-medium mt-1">
                CGST: ₹{metrics.totalCGST.toLocaleString('en-IN')} | SGST: ₹{metrics.totalSGST.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Calculator size={22} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>IGST Total: ₹{metrics.totalIGST.toLocaleString('en-IN')}</span>
            <span className="font-bold text-amber-800">GST Ledger</span>
          </div>
        </div>
      </div>

      {/* REVENUE HEAD BREAKUP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">3100 - Banquet Hall Rentals</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹{metrics.totalHallRental.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {metrics.netTaxable > 0 ? ((metrics.totalHallRental / metrics.netTaxable) * 100).toFixed(1) : 0}% of net turnover
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">3200 - Food & Catering Services</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹{metrics.totalCatering.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {metrics.netTaxable > 0 ? ((metrics.totalCatering / metrics.netTaxable) * 100).toFixed(1) : 0}% of net turnover
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">3300 - Stage Decor & Audio-Visual</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹{metrics.totalDecorAndAv.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {metrics.netTaxable > 0 ? ((metrics.totalDecorAndAv / metrics.netTaxable) * 100).toFixed(1) : 0}% of net turnover
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">3400 - Misc Services & Charges</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹{metrics.totalMisc.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {metrics.netTaxable > 0 ? ((metrics.totalMisc / metrics.netTaxable) * 100).toFixed(1) : 0}% of net turnover
          </div>
        </div>
      </div>

      {/* SALES DAY BOOK VOUCHER REGISTER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Sales Voucher Journal Ledger</h3>
            <p className="text-xs text-slate-500">Showing {filteredVouchers.length} posted vouchers for {selectedDate}</p>
          </div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Total Sales Posted: ₹{metrics.grossSales.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Voucher # & Date</th>
                <th className="p-3">Party Name & GSTIN</th>
                <th className="p-3">Hall & Event</th>
                <th className="p-3 text-right">Rental (₹)</th>
                <th className="p-3 text-right">Catering (₹)</th>
                <th className="p-3 text-right">Taxable Val (₹)</th>
                <th className="p-3 text-right">Output GST (₹)</th>
                <th className="p-3 text-right">Gross Total (₹)</th>
                <th className="p-3 text-center">Terms</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    No sales vouchers found matching the selected filters and search query.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map(voucher => (
                  <tr key={voucher.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono">
                      <span className="font-bold text-slate-900 block">{voucher.voucherNo}</span>
                      <span className="text-[10px] text-slate-400">{voucher.voucherDate}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{voucher.customerName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{voucher.gstin}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{voucher.hallName}</div>
                      <div className="text-[10px] text-slate-500">{voucher.eventType}</div>
                    </td>
                    <td className="p-3 text-right text-slate-700">₹{voucher.hallRentalSales.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-slate-700">₹{voucher.cateringSales.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">₹{voucher.taxableValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold text-amber-700">₹{voucher.totalTax.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-black text-slate-900 text-sm">₹{voucher.grossAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {voucher.paymentTerms}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        voucher.status === 'Posted & Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : voucher.status === 'Advance Settlement'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        ● {voucher.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedVoucherDetails(voucher)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 mx-auto"
                      >
                        Voucher <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED VOUCHER INSPECTION MODAL */}
      {selectedVoucherDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs">
                  ERP
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight leading-tight">Sales Journal Voucher</h3>
                  <p className="text-[11px] text-amber-400 font-mono">{selectedVoucherDetails.voucherNo}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVoucherDetails(null)} 
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Meta Info Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Party / Customer</span>
                    <div className="font-extrabold text-sm text-slate-900">{selectedVoucherDetails.customerName}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md text-[10px]">
                    {selectedVoucherDetails.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">GSTIN</span>
                    <strong className="font-mono text-slate-900">{selectedVoucherDetails.gstin}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Voucher Date</span>
                    <strong className="text-slate-900">{selectedVoucherDetails.voucherDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Venue Hall</span>
                    <strong className="text-slate-900">{selectedVoucherDetails.hallName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Payment Terms</span>
                    <strong className="text-slate-900">{selectedVoucherDetails.paymentTerms}</strong>
                  </div>
                </div>
              </div>

              {/* General Ledger Postings Table */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider text-slate-400">Double-Entry Ledger Postings</h4>
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 text-left">Ledger Account</th>
                        <th className="p-2.5 text-right">Debit (₹)</th>
                        <th className="p-2.5 text-right">Credit (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Sundry Debtors / Customer A/c</td>
                        <td className="p-2.5 text-right font-extrabold text-slate-900">₹{selectedVoucherDetails.grossAmount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-800 pl-6">Cr. Banquet Hall Rental Income</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">₹{selectedVoucherDetails.hallRentalSales.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-800 pl-6">Cr. Catering & Food Sales Income</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">₹{selectedVoucherDetails.cateringSales.toLocaleString('en-IN')}</td>
                      </tr>
                      {selectedVoucherDetails.decorAndAvSales > 0 && (
                        <tr>
                          <td className="p-2.5 text-slate-800 pl-6">Cr. Stage Decor & AV Services</td>
                          <td className="p-2.5 text-right text-slate-400">-</td>
                          <td className="p-2.5 text-right font-bold text-slate-800">₹{selectedVoucherDetails.decorAndAvSales.toLocaleString('en-IN')}</td>
                        </tr>
                      )}
                      {selectedVoucherDetails.cgstAmount > 0 && (
                        <tr>
                          <td className="p-2.5 text-amber-800 pl-6">Cr. Output CGST @ 9%</td>
                          <td className="p-2.5 text-right text-slate-400">-</td>
                          <td className="p-2.5 text-right font-bold text-amber-700">₹{selectedVoucherDetails.cgstAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      )}
                      {selectedVoucherDetails.sgstAmount > 0 && (
                        <tr>
                          <td className="p-2.5 text-amber-800 pl-6">Cr. Output SGST @ 9%</td>
                          <td className="p-2.5 text-right text-slate-400">-</td>
                          <td className="p-2.5 text-right font-bold text-amber-700">₹{selectedVoucherDetails.sgstAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      )}
                      {selectedVoucherDetails.igstAmount > 0 && (
                        <tr>
                          <td className="p-2.5 text-blue-800 pl-6">Cr. Output IGST @ 18%</td>
                          <td className="p-2.5 text-right text-slate-400">-</td>
                          <td className="p-2.5 text-right font-bold text-blue-700">₹{selectedVoucherDetails.igstAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      )}
                      <tr className="bg-slate-200/80 font-black text-slate-900 border-t-2 border-slate-300">
                        <td className="p-2.5 uppercase text-[10px]">Total Journal Entry</td>
                        <td className="p-2.5 text-right">₹{selectedVoucherDetails.grossAmount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right">₹{selectedVoucherDetails.grossAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedVoucherDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
