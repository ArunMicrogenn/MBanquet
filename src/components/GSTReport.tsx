import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Download, 
  Printer, 
  Search, 
  FileText, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  PieChart, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Info,
  BadgeCheck,
  X,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';

export interface GSTInvoiceRecord {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
  customerType: 'B2B Registered' | 'B2C Retail' | 'B2C Large';
  gstin: string;
  placeOfSupply: string;
  isInterState: boolean;
  sacCode: string;
  sacDescription: string;
  hallName: string;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalInvoiceAmount: number;
  status: 'Tax Paid' | 'Pending Return' | 'Advance Collected';
}

const mockGSTRecords: GSTInvoiceRecord[] = [
  {
    id: 'gst-001',
    invoiceNo: 'INV-2026-8912',
    invoiceDate: '2026-09-02',
    customerName: 'TechCorp Solutions India Pvt Ltd',
    customerType: 'B2B Registered',
    gstin: '27AAACT1234F1Z5',
    placeOfSupply: '27-Maharashtra',
    isInterState: false,
    sacCode: '996311',
    sacDescription: 'Banquet Hall & Event Venue Rental',
    hallName: 'Grand Crystal Ballroom',
    taxableValue: 150000,
    cgstRate: 9,
    cgstAmount: 13500,
    sgstRate: 9,
    sgstAmount: 13500,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 27000,
    totalInvoiceAmount: 177000,
    status: 'Tax Paid'
  },
  {
    id: 'gst-002',
    invoiceNo: 'INV-2026-4410',
    invoiceDate: '2026-09-02',
    customerName: 'Priya & Rahul Wedding Event',
    customerType: 'B2C Retail',
    gstin: 'URP (Unregistered)',
    placeOfSupply: '27-Maharashtra',
    isInterState: false,
    sacCode: '996331',
    sacDescription: 'Banquet Food & Outdoor Catering Services',
    hallName: 'Royal Emerald Suite',
    taxableValue: 90000,
    cgstRate: 9,
    cgstAmount: 8100,
    sgstRate: 9,
    sgstAmount: 8100,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 16200,
    totalInvoiceAmount: 106200,
    status: 'Tax Paid'
  },
  {
    id: 'gst-003',
    invoiceNo: 'INV-2026-3109',
    invoiceDate: '2026-09-01',
    customerName: 'Apex Healthcare Pvt Ltd',
    customerType: 'B2B Registered',
    gstin: '36AAACA9876P1Z2',
    placeOfSupply: '36-Telangana',
    isInterState: true,
    sacCode: '996311',
    sacDescription: 'Banquet Hall & Event Venue Rental',
    hallName: 'Sapphire Garden Lawn',
    taxableValue: 200000,
    cgstRate: 0,
    cgstAmount: 0,
    sgstRate: 0,
    sgstAmount: 0,
    igstRate: 18,
    igstAmount: 36000,
    totalTax: 36000,
    totalInvoiceAmount: 236000,
    status: 'Tax Paid'
  },
  {
    id: 'gst-004',
    invoiceNo: 'INV-2026-1189',
    invoiceDate: '2026-08-30',
    customerName: 'Global Media & Entertainment',
    customerType: 'B2B Registered',
    gstin: '27AABCG4321H1Z9',
    placeOfSupply: '27-Maharashtra',
    isInterState: false,
    sacCode: '996332',
    sacDescription: 'Stage Decoration, AV & Lighting Services',
    hallName: 'Diamond Executive Lounge',
    taxableValue: 120000,
    cgstRate: 9,
    cgstAmount: 10800,
    sgstRate: 9,
    sgstAmount: 10800,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 21600,
    totalInvoiceAmount: 141600,
    status: 'Tax Paid'
  },
  {
    id: 'gst-005',
    invoiceNo: 'INV-2026-7823',
    invoiceDate: '2026-08-28',
    customerName: 'Suresh Kumar Anniversary Gala',
    customerType: 'B2C Retail',
    gstin: 'URP (Unregistered)',
    placeOfSupply: '27-Maharashtra',
    isInterState: false,
    sacCode: '996311',
    sacDescription: 'Banquet Hall & Event Venue Rental',
    hallName: 'Royal Emerald Suite',
    taxableValue: 75000,
    cgstRate: 9,
    cgstAmount: 6750,
    sgstRate: 9,
    sgstAmount: 6750,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 13500,
    totalInvoiceAmount: 88500,
    status: 'Tax Paid'
  },
  {
    id: 'gst-006',
    invoiceNo: 'INV-2026-5501',
    invoiceDate: '2026-08-25',
    customerName: 'Veritas Technologies Ltd',
    customerType: 'B2B Registered',
    gstin: '27AAACV9911K1Z3',
    placeOfSupply: '27-Maharashtra',
    isInterState: false,
    sacCode: '996331',
    sacDescription: 'Banquet Food & Outdoor Catering Services',
    hallName: 'Grand Crystal Ballroom',
    taxableValue: 300000,
    cgstRate: 9,
    cgstAmount: 27000,
    sgstRate: 9,
    sgstAmount: 27000,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 54000,
    totalInvoiceAmount: 354000,
    status: 'Pending Return'
  },
  {
    id: 'gst-007',
    invoiceNo: 'ADV-2026-0921',
    invoiceDate: '2026-08-20',
    customerName: 'Ananya Deshmukh Engagement',
    customerType: 'B2C Retail',
    gstin: 'URP (Unregistered)',
    placeOfSupply: '27-Maharashtra',
    isInterState: false,
    sacCode: '996311',
    sacDescription: 'Advance Booking Deposit for Hall Rental',
    hallName: 'Sapphire Garden Lawn',
    taxableValue: 50000,
    cgstRate: 9,
    cgstAmount: 4500,
    sgstRate: 9,
    sgstAmount: 4500,
    igstRate: 0,
    igstAmount: 0,
    totalTax: 9000,
    totalInvoiceAmount: 59000,
    status: 'Advance Collected'
  }
];

export default function GSTReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-09');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplyType, setSelectedSupplyType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'b2b' | 'b2c' | 'hsn'>('all');
  const [selectedRecordDetails, setSelectedRecordDetails] = useState<GSTInvoiceRecord | null>(null);

  // Filtered GST Invoices
  const filteredRecords = useMemo(() => {
    return mockGSTRecords.filter(rec => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'b2b' && rec.customerType === 'B2B Registered') ||
        (selectedCategory === 'b2c' && (rec.customerType === 'B2C Retail' || rec.customerType === 'B2C Large'));

      const matchesSupply = 
        selectedSupplyType === 'all' ||
        (selectedSupplyType === 'intra' && !rec.isInterState) ||
        (selectedSupplyType === 'inter' && rec.isInterState);

      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'b2b' && rec.customerType === 'B2B Registered') ||
        (activeTab === 'b2c' && rec.customerType !== 'B2B Registered') ||
        (activeTab === 'hsn'); // HSN view shows all aggregated

      const matchesSearch = !searchQuery.trim() ||
        rec.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.sacCode.includes(searchQuery) ||
        rec.hallName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSupply && matchesTab && matchesSearch;
    });
  }, [selectedCategory, selectedSupplyType, activeTab, searchQuery]);

  // Aggregate GST Tax Totals
  const gstTotals = useMemo(() => {
    let totalGrossValue = 0;
    let totalTaxableValue = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let totalTaxCollected = 0;
    let b2bCount = 0;
    let b2cCount = 0;

    filteredRecords.forEach(rec => {
      totalGrossValue += rec.totalInvoiceAmount;
      totalTaxableValue += rec.taxableValue;
      totalCGST += rec.cgstAmount;
      totalSGST += rec.sgstAmount;
      totalIGST += rec.igstAmount;
      totalTaxCollected += rec.totalTax;

      if (rec.customerType === 'B2B Registered') {
        b2bCount++;
      } else {
        b2cCount++;
      }
    });

    return {
      totalGrossValue,
      totalTaxableValue,
      totalCGST,
      totalSGST,
      totalIGST,
      totalTaxCollected,
      b2bCount,
      b2cCount,
      invoiceCount: filteredRecords.length
    };
  }, [filteredRecords]);

  // SAC Code Aggregations (Table 12 HSN/SAC Summary)
  const sacAggregates = useMemo(() => {
    const sacMap: Record<string, {
      sacCode: string;
      description: string;
      taxableValue: number;
      cgst: number;
      sgst: number;
      igst: number;
      totalTax: number;
      count: number;
    }> = {};

    filteredRecords.forEach(rec => {
      if (!sacMap[rec.sacCode]) {
        sacMap[rec.sacCode] = {
          sacCode: rec.sacCode,
          description: rec.sacDescription,
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0,
          count: 0
        };
      }

      sacMap[rec.sacCode].taxableValue += rec.taxableValue;
      sacMap[rec.sacCode].cgst += rec.cgstAmount;
      sacMap[rec.sacCode].sgst += rec.sgstAmount;
      sacMap[rec.sacCode].igst += rec.igstAmount;
      sacMap[rec.sacCode].totalTax += rec.totalTax;
      sacMap[rec.sacCode].count += 1;
    });

    return Object.values(sacMap);
  }, [filteredRecords]);

  // Export GST CSV (GSTR-1 Format)
  const handleExportGSTCSV = () => {
    let csv = "Invoice Number,Invoice Date,Customer Name,Customer Type,GSTIN,Place of Supply,SAC Code,SAC Description,Taxable Value (INR),CGST Rate %,CGST Amount (INR),SGST Rate %,SGST Amount (INR),IGST Rate %,IGST Amount (INR),Total Tax (INR),Gross Invoice Amount (INR),Status\n";
    
    filteredRecords.forEach(rec => {
      csv += `"${rec.invoiceNo}","${rec.invoiceDate}","${rec.customerName}","${rec.customerType}","${rec.gstin}","${rec.placeOfSupply}","${rec.sacCode}","${rec.sacDescription}",${rec.taxableValue},${rec.cgstRate},${rec.cgstAmount},${rec.sgstRate},${rec.sgstAmount},${rec.igstRate},${rec.igstAmount},${rec.totalTax},${rec.totalInvoiceAmount},"${rec.status}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GSTR1_Tax_Report_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print GSTR-1 Tax Return Worksheet
  const handlePrintGSTWorksheet = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GSTR-1 Tax Computation Statement - ${selectedPeriod}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; max-width: 850px; margin: 0 auto; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
            .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
            .header p { margin: 3px 0; font-size: 11px; color: #64748b; }
            .badge { display: inline-block; background: #0f172a; color: #38bdf8; font-weight: bold; font-size: 10.5px; padding: 4px 14px; border-radius: 4px; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11.5px; }
            .meta-grid p { margin: 3px 0; }
            .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin: 18px 0 10px 0; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px; }
            th { background: #f1f5f9; padding: 7px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
            td { padding: 7px; border-bottom: 1px solid #e2e8f0; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
            .kpi-card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; text-align: center; }
            .kpi-title { font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .kpi-val { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 20px; }
            .sig-box { text-align: center; border-top: 1px solid #94a3b8; width: 220px; padding-top: 6px; font-size: 11px; font-weight: bold; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Grand Horizon Banquet & Convention Hall</h1>
            <p>124 Convention Boulevard, Metro City • GSTIN: 27AAAAA0000A1Z5</p>
            <p>State Code: 27 (Maharashtra) • Tax Accounting Register</p>
            <div class="badge">STATUTORY GSTR-1 TAX RETURN COMPUTATION WORKSHEET</div>
          </div>

          <div class="meta-grid">
            <div>
              <p><strong>Tax Return Period:</strong> ${selectedPeriod}</p>
              <p><strong>Taxable Entity Name:</strong> Grand Horizon Hospitality LLP</p>
              <p><strong>GSTIN Status:</strong> Active Regular Taxpayer</p>
            </div>
            <div>
              <p><strong>Total Tax Invoices:</strong> ${gstTotals.invoiceCount} Bills Generated</p>
              <p><strong>Generated Timestamp:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Filing Jurisdiction:</strong> Ward 4, GST Division II, Metro Region</p>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-title">Gross Turnover</div>
              <div class="kpi-val">₹${gstTotals.totalGrossValue.toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Net Taxable Value</div>
              <div class="kpi-val">₹${gstTotals.totalTaxableValue.toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">CGST + SGST (9%+9%)</div>
              <div class="kpi-val">₹${(gstTotals.totalCGST + gstTotals.totalSGST).toLocaleString('en-IN')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total GST Liability</div>
              <div class="kpi-val" style="color: #0284c7;">₹${gstTotals.totalTaxCollected.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div class="section-title">1. Service Accounting Code (SAC) Summary (Table 12)</div>
          <table>
            <thead>
              <tr>
                <th>SAC Code</th>
                <th>Service Description</th>
                <th class="text-right">Invoices</th>
                <th class="text-right">Taxable Value (₹)</th>
                <th class="text-right">CGST (9%)</th>
                <th class="text-right">SGST (9%)</th>
                <th class="text-right">IGST (18%)</th>
                <th class="text-right">Total Tax (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${sacAggregates.map(s => `
                <tr>
                  <td><strong>${s.sacCode}</strong></td>
                  <td>${s.description}</td>
                  <td class="text-right">${s.count}</td>
                  <td class="text-right font-bold">₹${s.taxableValue.toLocaleString('en-IN')}</td>
                  <td class="text-right">₹${s.cgst.toLocaleString('en-IN')}</td>
                  <td class="text-right">₹${s.sgst.toLocaleString('en-IN')}</td>
                  <td class="text-right">₹${s.igst.toLocaleString('en-IN')}</td>
                  <td class="text-right font-bold">₹${s.totalTax.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr style="background: #f1f5f9; font-weight: bold;">
                <td colSpan="3">TOTAL SAC BREAKDOWN</td>
                <td class="text-right">₹${gstTotals.totalTaxableValue.toLocaleString('en-IN')}</td>
                <td class="text-right">₹${gstTotals.totalCGST.toLocaleString('en-IN')}</td>
                <td class="text-right">₹${gstTotals.totalSGST.toLocaleString('en-IN')}</td>
                <td class="text-right">₹${gstTotals.totalIGST.toLocaleString('en-IN')}</td>
                <td class="text-right">₹${gstTotals.totalTaxCollected.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">2. Tax Invoice Ledger & Party Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Customer & GSTIN</th>
                <th>POS</th>
                <th class="text-right">Taxable Val (₹)</th>
                <th class="text-right">GST Liability (₹)</th>
                <th class="text-right">Total Invoice (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(r => `
                <tr>
                  <td><strong>${r.invoiceNo}</strong></td>
                  <td>${r.invoiceDate}</td>
                  <td>
                    ${r.customerName}<br/>
                    <small style="color: #64748b;">${r.gstin}</small>
                  </td>
                  <td>${r.placeOfSupply}</td>
                  <td class="text-right font-bold">₹${r.taxableValue.toLocaleString('en-IN')}</td>
                  <td class="text-right font-bold" style="color: #0284c7;">₹${r.totalTax.toLocaleString('en-IN')}</td>
                  <td class="text-right font-bold">₹${r.totalInvoiceAmount.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="signatures">
            <div class="sig-box">Prepared by Banquet Accounts</div>
            <div class="sig-box">Chartered Accountant / Tax Auditor</div>
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
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Calculator size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Detailed GST Audit & Return Filing Report</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md border border-amber-300">
                  GSTIN: 27AAAAA0000A1Z5
                </span>
              </div>
              <p className="text-xs text-slate-500">Statutory tax liability, CGST / SGST / IGST breakdown, and GSTR-1 SAC summary</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handlePrintGSTWorksheet}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Printer size={15} /> Print GSTR-1 Computation
          </button>
          <button
            onClick={handleExportGSTCSV}
            className="flex-1 md:flex-none px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Download size={15} /> Export GSTR-1 CSV
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tax Period Selector */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Return Filing Period</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-500 outline-none appearance-none"
            >
              <option value="2026-09">September 2026 (Current Period)</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-Q2">Q2 FY 2026-27 (Jul - Sep)</option>
              <option value="2026-FY">Full FY 2026-27 Year</option>
            </select>
            <Calendar size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Taxpayer Category</label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-500 outline-none appearance-none"
            >
              <option value="all">All Taxpayer Types</option>
              <option value="b2b">B2B Registered Persons (With GSTIN)</option>
              <option value="b2c">B2C Retail Unregistered Consumers</option>
            </select>
            <Building2 size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Place of Supply */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Supply Jurisdiction</label>
          <div className="relative">
            <select
              value={selectedSupplyType}
              onChange={e => setSelectedSupplyType(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-amber-500 outline-none appearance-none"
            >
              <option value="all">All Jurisdiction Types</option>
              <option value="intra">Intra-State (CGST 9% + SGST 9%)</option>
              <option value="inter">Inter-State (IGST 18%)</option>
            </select>
            <Layers size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Search GST Records</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Invoice #, GSTIN, Customer, SAC..."
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
        {/* Card 1: Gross Invoice Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Invoice Value</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{gstTotals.totalGrossValue.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Across {gstTotals.invoiceCount} tax invoices
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>B2B: {gstTotals.b2bCount} Bills</span>
            <span>B2C: {gstTotals.b2cCount} Bills</span>
          </div>
        </div>

        {/* Card 2: Net Taxable Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Net Taxable Turnover</div>
              <div className="text-2xl font-extrabold text-blue-900 mt-1">₹{gstTotals.totalTaxableValue.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-blue-600 font-bold mt-1">
                Base Revenue for GST Calculation
              </div>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>SAC 996311 (Hall): ₹{sacAggregates.find(s => s.sacCode === '996311')?.taxableValue.toLocaleString('en-IN') || 0}</span>
          </div>
        </div>

        {/* Card 3: Central & State Tax (CGST + SGST) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Intra-State GST (CGST + SGST)</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                ₹{(gstTotals.totalCGST + gstTotals.totalSGST).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                CGST: ₹{gstTotals.totalCGST.toLocaleString('en-IN')} | SGST: ₹{gstTotals.totalSGST.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
            <span>Split: 9% CGST + 9% SGST</span>
            <span className="font-bold text-emerald-700">Matched</span>
          </div>
        </div>

        {/* Card 4: Total Output GST Liability */}
        <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-200">Total Output GST Payable</div>
              <div className="text-2xl font-extrabold mt-1">₹{gstTotals.totalTaxCollected.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-100 mt-1 font-medium">
                Combined CGST + SGST + IGST
              </div>
            </div>
            <div className="p-2.5 bg-white/10 backdrop-blur-xs rounded-xl text-amber-100">
              <Calculator size={20} />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between text-[11px] text-amber-100">
            <span>IGST Total: ₹{gstTotals.totalIGST.toLocaleString('en-IN')}</span>
            <span className="font-bold text-white">GSTR-3B Ready</span>
          </div>
        </div>
      </div>

      {/* GSTR-1 TABBED VIEW HEADER */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tax Invoices ({gstTotals.invoiceCount})
          </button>
          <button
            onClick={() => setActiveTab('b2b')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'b2b'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 size={14} className={activeTab === 'b2b' ? 'text-amber-400' : 'text-slate-400'} />
            B2B Tax Invoices (Table 4A - {gstTotals.b2bCount})
          </button>
          <button
            onClick={() => setActiveTab('b2c')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'b2c'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            B2C Retail Sales (Table 7 - {gstTotals.b2cCount})
          </button>
          <button
            onClick={() => setActiveTab('hsn')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'hsn'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers size={14} className={activeTab === 'hsn' ? 'text-blue-400' : 'text-slate-400'} />
            SAC / HSN Service Breakdown (Table 12)
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-50 rounded-xl border border-slate-200">
          State Code: <strong>27 (Maharashtra)</strong>
        </div>
      </div>

      {/* VIEW CONTENT 1: SAC / HSN SERVICE CODE AGGREGATE SUMMARY (TABLE 12) */}
      {activeTab === 'hsn' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">GSTR-1 Table 12: Service Accounting Code (SAC) Summary</h3>
              <p className="text-xs text-slate-500">Mandatory tax summary breakdown required for Indian GST Return submission</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {sacAggregates.length} Service Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">SAC Code</th>
                  <th className="p-3">Service Description</th>
                  <th className="p-3 text-center">Invoices</th>
                  <th className="p-3 text-right">Taxable Value (₹)</th>
                  <th className="p-3 text-right">CGST (9%)</th>
                  <th className="p-3 text-right">SGST (9%)</th>
                  <th className="p-3 text-right">IGST (18%)</th>
                  <th className="p-3 text-right">Total GST Output (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sacAggregates.map(sac => (
                  <tr key={sac.sacCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold font-mono text-slate-900">{sac.sacCode}</td>
                    <td className="p-3 font-semibold text-slate-800">{sac.description}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{sac.count}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">₹{sac.taxableValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-emerald-700 font-medium">₹{sac.cgst.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-emerald-700 font-medium">₹{sac.sgst.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-blue-700 font-medium">₹{sac.igst.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-extrabold text-amber-700">₹{sac.totalTax.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={3} className="p-3 text-slate-800 uppercase text-[11px]">Total SAC Statutory Summary</td>
                  <td className="p-3 text-right text-sm">₹{gstTotals.totalTaxableValue.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right text-emerald-800">₹{gstTotals.totalCGST.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right text-emerald-800">₹{gstTotals.totalSGST.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right text-blue-800">₹{gstTotals.totalIGST.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right text-sm text-amber-800">₹{gstTotals.totalTaxCollected.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW CONTENT 2: ITEMISED TAX INVOICE LEDGER TABLE */}
      {activeTab !== 'hsn' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {activeTab === 'b2b' ? 'B2B Registered Tax Invoices (Table 4A)' : activeTab === 'b2c' ? 'B2C Retail Invoice Register (Table 7)' : 'Comprehensive Tax Invoice Register'}
              </h3>
              <p className="text-xs text-slate-500">Showing {filteredRecords.length} records matching GST filters</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Total Tax Liability: ₹{gstTotals.totalTaxCollected.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Invoice # & Date</th>
                  <th className="p-3">Customer & GSTIN</th>
                  <th className="p-3">Category & POS</th>
                  <th className="p-3">SAC Code</th>
                  <th className="p-3 text-right">Taxable Val (₹)</th>
                  <th className="p-3 text-right">CGST (9%)</th>
                  <th className="p-3 text-right">SGST (9%)</th>
                  <th className="p-3 text-right">IGST (18%)</th>
                  <th className="p-3 text-right">Total Invoice (₹)</th>
                  <th className="p-3 text-center">Filing Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-400">
                      No GST records match the selected category and search query.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-slate-900">{rec.invoiceNo}</span>
                        <div className="text-[10px] text-slate-500">{rec.invoiceDate}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          {rec.customerName}
                          {rec.customerType === 'B2B Registered' && (
                            <BadgeCheck size={14} className="text-blue-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {rec.gstin}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.customerType === 'B2B Registered'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {rec.customerType}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{rec.placeOfSupply}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <span className="font-bold text-slate-800">{rec.sacCode}</span>
                        <div className="text-[9.5px] text-slate-400 truncate max-w-[120px]">{rec.sacDescription}</div>
                      </td>
                      <td className="p-3 text-right font-extrabold text-slate-900">₹{rec.taxableValue.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-emerald-700 font-medium">₹{rec.cgstAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-emerald-700 font-medium">₹{rec.sgstAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-blue-700 font-medium">₹{rec.igstAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-extrabold text-slate-900">₹{rec.totalInvoiceAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.status === 'Tax Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.status === 'Advance Collected'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          ● {rec.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedRecordDetails(rec)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 mx-auto"
                        >
                          Details <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED GST RECORD INSPECTION MODAL */}
      {selectedRecordDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <Calculator size={20} className="text-amber-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight leading-tight">Tax Invoice Breakdown</h3>
                  <p className="text-[11px] text-amber-100 font-medium">GST Statutory Computation Audit</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecordDetails(null)} 
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Invoice Meta Grid */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Invoice Number</span>
                    <div className="font-extrabold text-sm text-slate-900">{selectedRecordDetails.invoiceNo}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    {selectedRecordDetails.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Customer Party</span>
                    <strong className="text-slate-900">{selectedRecordDetails.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">GSTIN / Tax ID</span>
                    <strong className="font-mono text-slate-900">{selectedRecordDetails.gstin}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Place of Supply</span>
                    <strong className="text-slate-900">{selectedRecordDetails.placeOfSupply}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Venue / Hall</span>
                    <strong className="text-slate-900">{selectedRecordDetails.hallName}</strong>
                  </div>
                </div>
              </div>

              {/* SAC Service Information */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                  <Layers size={12} /> Service Accounting Code (SAC)
                </div>
                <div className="font-bold text-slate-900 text-xs">
                  SAC {selectedRecordDetails.sacCode} - {selectedRecordDetails.sacDescription}
                </div>
              </div>

              {/* Tax Calculations Detail Table */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statutory Tax Calculation Breakdown</div>
                
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Net Taxable Value</span>
                  <span className="font-extrabold text-slate-900">₹{selectedRecordDetails.taxableValue.toLocaleString('en-IN')}</span>
                </div>

                {!selectedRecordDetails.isInterState ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Central GST (CGST @ {selectedRecordDetails.cgstRate}%)</span>
                      <span className="font-bold text-emerald-700">₹{selectedRecordDetails.cgstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">State GST (SGST @ {selectedRecordDetails.sgstRate}%)</span>
                      <span className="font-bold text-emerald-700">₹{selectedRecordDetails.sgstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Integrated GST (IGST @ {selectedRecordDetails.igstRate}%)</span>
                    <span className="font-bold text-blue-700">₹{selectedRecordDetails.igstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-200 font-bold text-slate-800">
                  <span>Total Tax Payable</span>
                  <span className="text-amber-700">₹{selectedRecordDetails.totalTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between pt-1 font-extrabold text-sm text-slate-900">
                  <span>Gross Invoice Value</span>
                  <span>₹{selectedRecordDetails.totalInvoiceAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecordDetails(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
