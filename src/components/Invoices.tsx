import { useState, useEffect, useMemo } from 'react';
import { 
  FileDown, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  BellRing, 
  Check, 
  Search, 
  Filter, 
  Download, 
  Receipt, 
  Building2, 
  Calendar, 
  DollarSign, 
  Clock, 
  X,
  FileText,
  Mail,
  Send,
  History,
  AtSign,
  Sparkles,
  Eye,
  RefreshCw,
  CheckCheck
} from 'lucide-react';
import { 
  generateInvoicePDF, 
  InvoiceData, 
  getInvoicePDFFilename 
} from '../lib/invoicePdfGenerator';
import { 
  EmailTemplate, 
  EmailDispatchLog, 
  getEmailTemplates, 
  getBestTemplateForInvoice, 
  getInvoiceVariables, 
  renderTemplateText, 
  dispatchInvoiceEmail, 
  getEmailDispatchLogs 
} from '../lib/emailService';

const initialMockInvoices: InvoiceData[] = [
  { 
    id: 'INV-2026-001', 
    customer: 'Suresh Kumar (Kumar Wedding Gala)', 
    customerPhone: '+91 98450 12345',
    customerEmail: 'suresh.kumar@weddinggala.in',
    date: '2026-08-15', 
    dueDate: '2026-08-20', 
    eventDate: '2026-08-27', 
    hallName: 'Crystal Ballroom & Royal Lawns',
    eventType: 'Grand Wedding & Reception',
    pax: 350,
    amount: 250000, 
    balanceDue: 0, 
    status: 'paid',
    property: 'Grand Royal Jubilee Hills (GR-HYD)',
    items: [
      { description: 'Crystal Ballroom Grand Hire (Full Evening 4PM - 12AM)', qty: '1 Session', rate: 105000, amount: 105000 },
      { description: 'Royal Gold Buffet Catering (Live Counters, Starters & Desserts)', qty: '350 Pax', rate: 260, amount: 91000 },
      { description: 'Royal Floral Stage Architecture & Intelligent Moving-Head Lighting', qty: '1 Package', rate: 22000, amount: 22000 },
      { description: 'Housekeeping, Dedicated Banquet Captain, Valet & Sound Engineer', qty: '1 Team', rate: 10000, amount: 10000 },
    ]
  },
  { 
    id: 'INV-2026-002', 
    customer: 'TCS Corp Events (Annual Leadership Summit)', 
    customerPhone: '+91 99887 76655',
    customerEmail: 'corpevents@tcs-india.com',
    date: '2026-08-20', 
    dueDate: '2026-08-25', 
    eventDate: '2026-09-07', 
    hallName: 'Ruby Suite & Business Lounge',
    eventType: 'Corporate Summit & Conference',
    pax: 120,
    amount: 120000, 
    balanceDue: 50000, 
    status: 'pending',
    property: 'Imperial Palace Banjara Hills (IP-BNJ)',
    items: [
      { description: 'Ruby Suite Corporate Hall Hire (Full Day 9AM - 6PM)', qty: '1 Day', rate: 50000, amount: 50000 },
      { description: 'Executive Hi-Tea, Mid-day Corporate Buffet & Refreshments', qty: '120 Pax', rate: 350, amount: 42000 },
      { description: 'Dual 4K Laser Projection, Wireless Podium Mics & Stage Lighting', qty: '1 Setup', rate: 18000, amount: 18000 },
      { description: 'Technical AV Operator & Corporate Event Coordinator', qty: '1 Crew', rate: 8000, amount: 8000 },
    ]
  },
  { 
    id: 'INV-2026-003', 
    customer: 'Anita Sharma (25th Anniversary Celebration)', 
    customerPhone: '+91 97112 33445',
    customerEmail: 'anita.sharma@gmail.com',
    date: '2026-08-25', 
    dueDate: '2026-09-01', 
    eventDate: '2026-09-15', 
    hallName: 'Emerald Garden Lawn & Pavilion',
    eventType: 'Silver Jubilee Family Celebration',
    pax: 180,
    amount: 85000, 
    balanceDue: 85000, 
    status: 'pending',
    property: 'Emerald Palms Oceanfront Resort (EP-CHE)',
    items: [
      { description: 'Emerald Pavilion & Lawn Reservation (Evening Session)', qty: '1 Session', rate: 38000, amount: 38000 },
      { description: 'Mughlai & Continental Dinner Buffet with Live Chaat', qty: '180 Pax', rate: 160, amount: 28800 },
      { description: 'Ambient Fairy Lighting, Lawn Photo Booth & PA System', qty: '1 Setup', rate: 12000, amount: 12000 },
      { description: 'Dedicated Service Staff & Lawn Cleanliness Crew', qty: '1 Team', rate: 6200, amount: 6200 },
    ]
  },
  { 
    id: 'INV-2026-004', 
    customer: 'Global Tech Solutions (Tech Conference)', 
    customerPhone: '+91 98220 99887',
    customerEmail: 'finance@globaltechsol.io',
    date: '2026-08-28', 
    dueDate: '2026-09-05', 
    eventDate: '2026-09-05', 
    hallName: 'Crystal Convention Arena',
    eventType: 'Annual Tech Expo & Keynote',
    pax: 500,
    amount: 200000, 
    balanceDue: 200000, 
    status: 'pending',
    property: 'Crystal Convention Gachibowli (CC-GCB)',
    items: [
      { description: 'Main Convention Arena & Exhibition Foyer Hire', qty: '1 Day', rate: 95000, amount: 95000 },
      { description: 'All-Day Corporate Delegate Catering & Beverage Service', qty: '500 Pax', rate: 130, amount: 65000 },
      { description: 'LED Video Wall Setup (20x10ft), Truss Rigging & Line Array Sound', qty: '1 Rig', rate: 25000, amount: 25000 },
      { description: 'Security Personnel, Valet Team & Facility Supervisors', qty: '1 Squad', rate: 15000, amount: 15000 },
    ]
  },
  { 
    id: 'INV-2026-005', 
    customer: 'Dr. Vikram Reddy (Medical Society Banquet)', 
    customerPhone: '+91 94401 22334',
    customerEmail: 'dr.vikram@medsociety.org',
    date: '2026-08-10', 
    dueDate: '2026-08-18', 
    eventDate: '2026-08-22', 
    hallName: 'Crystal Ballroom',
    eventType: 'State Medical Society Annual Dinner',
    pax: 220,
    amount: 175000, 
    balanceDue: 0, 
    status: 'paid',
    property: 'Grand Royal Jubilee Hills (GR-HYD)',
    items: [
      { description: 'Crystal Ballroom Premium Session Booking', qty: '1 Session', rate: 80000, amount: 80000 },
      { description: 'Five-Star Multi-Course Executive Dinner Buffet', qty: '220 Pax', rate: 280, amount: 61600 },
      { description: 'Stage Backdrop, Podium Projection & Ambient Hall Up-lighting', qty: '1 Setup', rate: 18400, amount: 18400 },
      { description: 'Banquet Stewards, Valet Management & Concierge Desk', qty: '1 Crew', rate: 15000, amount: 15000 },
    ]
  }
];

export default function Invoices() {
  const [invoices] = useState<InvoiceData[]>(initialMockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceData | null>(null);
  const [remindersSent, setRemindersSent] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime] = useState(new Date());

  // Email Templates & Dispatch State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => getEmailTemplates());
  const [emailModalInvoice, setEmailModalInvoice] = useState<InvoiceData | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | number>('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);
  
  // Sent Email Tracking
  const [dispatchLogs, setDispatchLogs] = useState<EmailDispatchLog[]>(() => getEmailDispatchLogs());
  const [showLogsModal, setShowLogsModal] = useState(false);

  // Sync templates on updates
  useEffect(() => {
    const handleTemplatesUpdate = () => {
      setEmailTemplates(getEmailTemplates());
    };
    window.addEventListener('email-templates-updated', handleTemplatesUpdate);
    return () => window.removeEventListener('email-templates-updated', handleTemplatesUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadPDF = async (invoice: InvoiceData) => {
    try {
      setDownloadingId(invoice.id);
      await new Promise(resolve => setTimeout(resolve, 80));
      generateInvoicePDF(invoice);
      showToast(`PDF Invoice for ${invoice.id} downloaded successfully!`);
    } catch (err) {
      console.error('Error generating PDF invoice:', err);
      showToast('Error generating PDF invoice document');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setIsDownloadingAll(true);
      showToast(`Generating and downloading ${filteredInvoices.length} PDF invoices...`);
      for (const inv of filteredInvoices) {
        generateInvoicePDF(inv);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      showToast('All invoices downloaded successfully!');
    } catch (err) {
      console.error('Error exporting all invoices:', err);
      showToast('Failed to download batch invoices');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Open the Email Dispatch Modal for an invoice
  const handleOpenEmailModal = (invoice: InvoiceData) => {
    const defaultTpl = getBestTemplateForInvoice(invoice, emailTemplates);
    const vars = getInvoiceVariables(invoice);
    
    setEmailModalInvoice(invoice);
    setSelectedTemplateId(defaultTpl.id);
    setEmailRecipient(invoice.customerEmail || 'customer@example.com');
    setEmailSubject(renderTemplateText(defaultTpl.subject, vars));
    setEmailBody(renderTemplateText(defaultTpl.body, vars));
  };

  // When selected template changes in modal, re-render subject & body
  const handleTemplateChange = (templateId: string | number) => {
    setSelectedTemplateId(templateId);
    if (!emailModalInvoice) return;
    const tpl = emailTemplates.find(t => String(t.id) === String(templateId));
    if (tpl) {
      const vars = getInvoiceVariables(emailModalInvoice);
      setEmailSubject(renderTemplateText(tpl.subject, vars));
      setEmailBody(renderTemplateText(tpl.body, vars));
    }
  };

  // Quick 1-click send or modal send
  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailModalInvoice) return;

    if (!emailRecipient.trim() || !emailRecipient.includes('@')) {
      showToast('Please enter a valid customer email address');
      return;
    }

    try {
      setIsSendingEmail(true);
      const chosenTemplate = emailTemplates.find(t => String(t.id) === String(selectedTemplateId)) || emailTemplates[0];

      const result = await dispatchInvoiceEmail({
        invoice: emailModalInvoice,
        recipientEmail: emailRecipient.trim(),
        template: chosenTemplate,
        customSubject: emailSubject,
        customBody: emailBody
      });

      // Update local logs
      const updatedLogs = getEmailDispatchLogs();
      setDispatchLogs(updatedLogs);

      showToast(`✓ Invoice ${emailModalInvoice.id} with attached PDF successfully dispatched to ${result.recipientEmail}`);
      setEmailModalInvoice(null);
    } catch (err) {
      console.error('Failed to send invoice email:', err);
      showToast('Failed to dispatch invoice email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Instant Quick Send directly from table row
  const handleQuickSendEmail = async (invoice: InvoiceData) => {
    try {
      setSendingInvoiceId(invoice.id);
      const chosenTemplate = getBestTemplateForInvoice(invoice, emailTemplates);
      const recipient = invoice.customerEmail || 'customer@example.com';

      const result = await dispatchInvoiceEmail({
        invoice,
        recipientEmail: recipient,
        template: chosenTemplate
      });

      const updatedLogs = getEmailDispatchLogs();
      setDispatchLogs(updatedLogs);

      showToast(`✓ PDF Invoice ${invoice.id} sent via email template "${chosenTemplate.name}" to ${result.recipientEmail}`);
    } catch (err) {
      console.error('Error quick sending email:', err);
      showToast('Failed to dispatch invoice email');
    } finally {
      setSendingInvoiceId(null);
    }
  };

  const handlePrint = (invoice: InvoiceData) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const isPaid = invoice.status.toLowerCase() === 'paid' || invoice.balanceDue === 0;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tax Invoice - ${invoice.id}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
              .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
              .header p { margin: 3px 0; font-size: 11px; color: #64748b; }
              .badge { display: inline-block; background: ${isPaid ? '#16a34a' : '#d97706'}; color: white; font-weight: bold; font-size: 11px; padding: 4px 12px; border-radius: 4px; margin-top: 5px; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
              .meta-grid div p { margin: 4px 0; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
              th { background: #0f172a; color: white; padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; font-size: 10px; }
              td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
              .text-right { text-align: right; }
              .totals-table { width: 320px; margin-left: auto; margin-bottom: 30px; font-size: 12px; }
              .totals-table td { padding: 6px 10px; }
              .totals-table .grand-total { font-weight: bold; font-size: 13px; border-top: 2px solid #0f172a; background: #f8fafc; }
              .totals-table .due-total { font-weight: bold; font-size: 14px; border-bottom: 2px solid #0f172a; background: #fee2e2; color: #b91c1c; }
              .footer { border-top: 1px dashed #cbd5e1; padding-top: 15px; margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; }
              .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 20px; }
              .sig-box { text-align: center; border-top: 1px solid #94a3b8; width: 180px; padding-top: 5px; font-size: 11px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Grand Horizon Banquet & Convention Hall</h1>
              <p>124 Convention Boulevard, Jubilee Hills, Hyderabad • Phone: +91 98765 43210</p>
              <p>GSTIN: 27AAAAA0000A1Z5 | FSSAI Lic: 10020011000123</p>
              <div class="badge">${isPaid ? 'TAX INVOICE - PAID IN FULL' : 'TAX INVOICE - PAYMENT PENDING'}</div>
            </div>

            <div class="meta-grid">
              <div>
                <p><strong>Invoice Number:</strong> ${invoice.id}</p>
                <p><strong>Invoice Date:</strong> ${invoice.date}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
                <p><strong>Venue Hall:</strong> ${invoice.hallName || 'Crystal Ballroom'}</p>
              </div>
              <div>
                <p><strong>Billed To:</strong> ${invoice.customer}</p>
                <p><strong>Email:</strong> ${invoice.customerEmail || 'N/A'}</p>
                <p><strong>Event Date:</strong> ${invoice.eventDate}</p>
                <p><strong>Property:</strong> ${invoice.property || 'Grand Royal Jubilee Hills'}</p>
                <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Particulars & Services</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Rate (₹)</th>
                  <th class="text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${(invoice.items || [
                  { description: 'Banquet Hall Hire & Event Operations', qty: '1 Session', rate: Math.round(invoice.amount * 0.5), amount: Math.round(invoice.amount * 0.5) },
                  { description: 'Deluxe Multi-Cuisine Catering Service', qty: `${invoice.pax || 200} Pax`, rate: Math.round((invoice.amount * 0.4) / (invoice.pax || 200)), amount: Math.round(invoice.amount * 0.4) },
                  { description: 'Lighting, AV Sound System & Valet Service', qty: '1 Setup', rate: Math.round(invoice.amount * 0.1), amount: Math.round(invoice.amount * 0.1) }
                ]).map(it => `
                  <tr>
                    <td>${it.description}</td>
                    <td class="text-right">${it.qty}</td>
                    <td class="text-right">₹${it.rate.toLocaleString('en-IN')}</td>
                    <td class="text-right">₹${it.amount.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <table class="totals-table">
              <tr class="grand-total">
                <td>Total Gross Amount</td>
                <td class="text-right">₹${invoice.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Advance Received</td>
                <td class="text-right">₹${(invoice.amount - invoice.balanceDue).toLocaleString('en-IN')}</td>
              </tr>
              <tr class="${invoice.balanceDue > 0 ? 'due-total' : ''}">
                <td>Balance Due</td>
                <td class="text-right" style="color: ${invoice.balanceDue > 0 ? '#dc2626' : '#16a34a'}; font-weight: bold;">
                  ₹${invoice.balanceDue.toLocaleString('en-IN')}
                </td>
              </tr>
            </table>

            <div class="signatures">
              <div class="sig-box">Customer Signature</div>
              <div class="sig-box">Authorized Signatory (Grand Horizon)</div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Grand Horizon Banquets! This document is an authentic tax invoice voucher.</p>
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

  const checkNeedsReminder = (eventDate: string, balanceDue: number) => {
    if (balanceDue <= 0) return false;
    const eventObj = new Date(eventDate);
    const diffTime = eventObj.getTime() - currentTime.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const handleSendReminder = (id: string) => {
    setRemindersSent(prev => ({ ...prev, [id]: true }));
    showToast(`Payment reminder dispatch queued for ${id}`);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Status filtering
      if (statusFilter === 'paid' && inv.status !== 'paid' && inv.balanceDue > 0) return false;
      if (statusFilter === 'pending' && inv.balanceDue === 0) return false;
      if (statusFilter === 'overdue') {
        const isOverdue = inv.balanceDue > 0 && new Date(inv.dueDate).getTime() < currentTime.getTime();
        if (!isOverdue) return false;
      }

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = inv.id.toLowerCase().includes(q);
        const matchesCust = inv.customer.toLowerCase().includes(q);
        const matchesEmail = (inv.customerEmail || '').toLowerCase().includes(q);
        const matchesHall = (inv.hallName || '').toLowerCase().includes(q);
        const matchesProp = (inv.property || '').toLowerCase().includes(q);
        return matchesId || matchesCust || matchesEmail || matchesHall || matchesProp;
      }

      return true;
    });
  }, [invoices, statusFilter, searchQuery, currentTime]);

  const totalBilled = useMemo(() => invoices.reduce((acc, curr) => acc + curr.amount, 0), [invoices]);
  const totalCollected = useMemo(() => invoices.reduce((acc, curr) => acc + (curr.amount - curr.balanceDue), 0), [invoices]);
  const totalOutstanding = useMemo(() => invoices.reduce((acc, curr) => acc + curr.balanceDue, 0), [invoices]);

  return (
    <div className="h-full w-full bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden flex flex-col font-sans">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Metrics Bar */}
      <div className="pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500/15 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Receipt size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Invoices, Billing & Email Dispatch</h2>
              <p className="text-[11px] text-slate-500 font-medium">Generate official branded tax invoice PDFs & automatically dispatch via configured Email Templates</p>
            </div>
          </div>
        </div>

        {/* Global Actions: Email History & Batch Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogsModal(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-300/80 cursor-pointer"
            title="View email dispatch audit logs"
          >
            <History size={13} className="text-slate-500" />
            <span>Email Logs ({dispatchLogs.length})</span>
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll || filteredInvoices.length === 0}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border border-slate-700 cursor-pointer disabled:opacity-50"
            title="Download all filtered invoice PDFs at once"
          >
            <Download size={13} className={isDownloadingAll ? 'animate-bounce' : ''} />
            <span>{isDownloadingAll ? 'Downloading Batch...' : 'Download All PDFs'}</span>
          </button>
        </div>
      </div>

      {/* Quick Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-2.5">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Billed Volume</div>
            <div className="text-base font-black text-slate-900 mt-0.5">₹{totalBilled.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <DollarSign size={16} />
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Total Realized Revenue</div>
            <div className="text-base font-black text-emerald-800 mt-0.5">₹{totalCollected.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Outstanding Balance</div>
            <div className="text-base font-black text-amber-900 mt-0.5">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock size={16} />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-b border-slate-100 flex-shrink-0">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, client, email, hall..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter size={11} /> Filter:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-slate-900 text-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All ({invoices.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Paid ({invoices.filter(i => i.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Pending Due ({invoices.filter(i => i.balanceDue > 0).length})
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="flex-1 overflow-auto mt-2 rounded-xl border border-slate-200/80">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead className="bg-slate-50/90 backdrop-blur sticky top-0 z-10">
            <tr className="border-b border-slate-200 text-slate-600 uppercase font-extrabold tracking-wider">
              <th className="p-2.5 pl-3">Invoice Details</th>
              <th className="p-2.5">Customer & Email</th>
              <th className="p-2.5">Venue & Dates</th>
              <th className="p-2.5 text-right">Total Amount</th>
              <th className="p-2.5 text-right">Balance Due</th>
              <th className="p-2.5 text-center">Status</th>
              <th className="p-2.5 text-right pr-3">Actions, PDF & Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <FileText size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-slate-600">No matching invoices found</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Try adjusting your search query or status filter.</p>
                </td>
              </tr>
            ) : (
              filteredInvoices.map(invoice => {
                const needsReminder = checkNeedsReminder(invoice.eventDate, invoice.balanceDue);
                const reminderSent = remindersSent[invoice.id];
                const isDownloadingThis = downloadingId === invoice.id;
                const isSendingThis = sendingInvoiceId === invoice.id;
                const isPaid = invoice.status.toLowerCase() === 'paid' || invoice.balanceDue === 0;

                // Find if any email dispatch history exists for this invoice
                const invoiceLogs = dispatchLogs.filter(l => l.invoiceId === invoice.id);
                const lastLog = invoiceLogs[0];

                return (
                  <tr 
                    key={invoice.id} 
                    className="even:bg-slate-50/40 hover:bg-amber-50/30 transition-colors group"
                  >
                    {/* Invoice ID & Badge */}
                    <td className="p-2.5 pl-3">
                      <div className="font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {invoice.id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Billed: {invoice.date}</div>
                    </td>

                    {/* Customer & Registered Email */}
                    <td className="p-2.5">
                      <div className="font-bold text-slate-900">{invoice.customer}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                        <AtSign size={10} className="text-blue-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{invoice.customerEmail || 'No email registered'}</span>
                      </div>
                      {lastLog && (
                        <div className="flex items-center gap-1 text-[9.5px] text-emerald-600 font-bold mt-0.5">
                          <CheckCheck size={11} />
                          <span>Emailed to {lastLog.recipientEmail.split('@')[0]}...</span>
                        </div>
                      )}
                    </td>

                    {/* Venue & Dates */}
                    <td className="p-2.5">
                      <div className="text-[10.5px] text-slate-700 font-bold flex items-center gap-1">
                        <Building2 size={11} className="text-amber-600" />
                        <span>{invoice.hallName || 'Crystal Ballroom'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
                        <Calendar size={10} />
                        <span>Event: {invoice.eventDate} • Due: {invoice.dueDate}</span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="p-2.5 text-right font-black text-slate-900 text-xs">
                      ₹{invoice.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Balance Due */}
                    <td className="p-2.5 text-right">
                      {invoice.balanceDue > 0 ? (
                        <div>
                          <span className="font-black text-rose-600 text-xs">₹{invoice.balanceDue.toLocaleString('en-IN')}</span>
                          <div className="text-[9px] font-bold text-rose-500 uppercase tracking-tight">Pending</div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-extrabold text-emerald-600">₹0</span>
                          <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-tight">Cleared</div>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-2.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPaid 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300/60'
                        }`}>
                          {isPaid ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                          {isPaid ? 'PAID' : 'PENDING'}
                        </span>
                        {needsReminder && !reminderSent && invoice.status !== 'paid' && (
                          <span className="bg-rose-100 text-rose-700 text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-tight animate-pulse">
                            7-Day Warning
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions: Send via Email, Download PDF, Print */}
                    <td className="p-2.5 text-right pr-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Send Reminder button if pending */}
                        {needsReminder && invoice.status !== 'paid' && (
                          <button 
                            onClick={() => handleSendReminder(invoice.id)}
                            disabled={reminderSent}
                            title="Send Payment Reminder Notice"
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              reminderSent 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            }`}
                          >
                            {reminderSent ? <Check size={11} /> : <BellRing size={11} />}
                            <span>{reminderSent ? 'Notified' : 'Remind'}</span>
                          </button>
                        )}

                        {/* Quick View Button */}
                        <button
                          onClick={() => setPreviewInvoice(invoice)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Invoice Summary Breakdown"
                        >
                          <FileText size={14} />
                        </button>

                        {/* SEND VIA EMAIL BUTTON */}
                        <button
                          onClick={() => handleOpenEmailModal(invoice)}
                          disabled={isSendingThis}
                          className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60 border border-blue-500/30"
                          title={`Send PDF Invoice via Email Template to ${invoice.customerEmail || 'Customer'}`}
                        >
                          <Mail size={12} className={isSendingThis ? 'animate-spin' : ''} />
                          <span>{isSendingThis ? 'Sending...' : 'Send via Email'}</span>
                        </button>

                        {/* PRIMARY DOWNLOAD PDF BUTTON */}
                        <button 
                          onClick={() => handleDownloadPDF(invoice)}
                          disabled={isDownloadingThis}
                          className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60 border border-amber-400/30"
                          title="Download Official Branded PDF Invoice Document"
                        >
                          <FileDown size={13} className={isDownloadingThis ? 'animate-spin' : ''} />
                          <span>{isDownloadingThis ? 'Exporting...' : 'Download PDF'}</span>
                        </button>

                        {/* Print / Thermal Receipt */}
                        <button 
                          onClick={() => handlePrint(invoice)} 
                          className="flex items-center gap-1 text-slate-600 hover:text-slate-950 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-[10.5px] font-bold transition-colors cursor-pointer" 
                          title="Print / Thermal Receipt"
                        >
                          <Printer size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* SEND INVOICE VIA EMAIL DISPATCH MODAL */}
      {/* ========================================================= */}
      {emailModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-[#070D1B] text-white p-4 flex items-center justify-between border-b border-amber-500/30 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Mail size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span>Dispatch PDF Invoice via Email</span>
                    <span className="text-amber-300 font-mono text-xs">({emailModalInvoice.id})</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-300">
                    Billed to: <strong className="text-white">{emailModalInvoice.customer}</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEmailModalInvoice(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body & Form */}
            <form onSubmit={handleSendEmail} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1 flex flex-col">
              {/* Row: Template Selector & Customer Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                    Select Email Template *
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={e => handleTemplateChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  >
                    {emailTemplates.map(tpl => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.category || 'invoice'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                    Customer Registered Email *
                  </label>
                  <div className="relative">
                    <AtSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={emailRecipient}
                      onChange={e => setEmailRecipient(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* PDF Attachment Banner */}
              <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
                    <FileDown size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Automatic Attachment:</span>
                      <span className="font-mono text-amber-900 font-extrabold">
                        {getInvoicePDFFilename(emailModalInvoice)}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-slate-600">
                      Branded vector PDF invoice with itemized charges (₹{emailModalInvoice.amount.toLocaleString('en-IN')}) & remittance details
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => generateInvoicePDF(emailModalInvoice)}
                  className="text-amber-800 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold transition-colors flex-shrink-0"
                  title="Download a copy of the attached PDF"
                >
                  Inspect PDF
                </button>
              </div>

              {/* Email Body Message */}
              <div className="flex-1 flex flex-col min-h-[140px]">
                <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Message Body (Auto-Populated with Invoice Variables) *
                </label>
                <textarea
                  rows={7}
                  required
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-blue-600 font-sans font-medium resize-none"
                />
              </div>

              {/* Sender & Security Note */}
              <div className="text-[10.5px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Sender: <strong>Grand Horizon Billing Desk &lt;billing@grandhorizon.com&gt;</strong></span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCheck size={12} /> TLS 1.3 Verified Dispatch
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={() => setEmailModalInvoice(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  <Send size={13} className={isSendingEmail ? 'animate-spin' : ''} />
                  <span>{isSendingEmail ? 'Dispatching PDF & Email...' : 'Send Invoice via Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EMAIL DISPATCH AUDIT LOGS MODAL */}
      {/* ========================================================= */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#070D1B] text-white p-4 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                  <History size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Email Dispatch Audit Logs</h3>
                  <p className="text-[10.5px] text-amber-300/90">Historical record of sent invoice emails with PDF attachments</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLogsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {dispatchLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Mail size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
                  <p className="text-xs font-bold text-slate-600">No emails dispatched yet</p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Click 'Send via Email' on any invoice row to dispatch.</p>
                </div>
              ) : (
                dispatchLogs.map((log) => (
                  <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{log.invoiceId}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {log.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.templateName}</span>
                      </div>
                      <span className="text-[10.5px] text-slate-400">
                        {new Date(log.sentAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      <strong>To:</strong> {log.recipientEmail} ({log.customerName})
                    </div>
                    <div className="text-slate-600 font-medium">
                      <strong>Subject:</strong> {log.subject}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200">
                      <FileDown size={12} className="text-amber-600" />
                      <span>{log.attachmentName} ({log.attachmentSizeKB} KB PDF)</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INVOICE QUICK BREAKDOWN MODAL */}
      {/* ========================================================= */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#070D1B] text-white p-4 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
                  GH
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight text-white">Invoice Details • {previewInvoice.id}</h3>
                  <p className="text-[10px] text-amber-300/90 font-medium">{previewInvoice.property || 'Grand Royal Jubilee Hills'}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewInvoice(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Name</span>
                  <span className="font-extrabold text-slate-900 block">{previewInvoice.customer}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">{previewInvoice.customerEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hall & Venue</span>
                  <span className="font-bold text-slate-800 block">{previewInvoice.hallName || 'Crystal Ballroom'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event Date</span>
                  <span className="font-medium text-slate-700 block">{previewInvoice.eventDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Status</span>
                  <span className={`inline-block font-extrabold uppercase text-[10px] px-2 py-0.5 rounded-md ${
                    previewInvoice.balanceDue === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {previewInvoice.balanceDue === 0 ? 'PAID IN FULL' : `DUE: ₹${previewInvoice.balanceDue.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">Itemized Particulars</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9.5px]">
                      <tr>
                        <th className="p-2">Particulars</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(previewInvoice.items || []).map((it, idx) => (
                        <tr key={idx} className="even:bg-slate-50/50">
                          <td className="p-2 text-slate-800">{it.description}</td>
                          <td className="p-2 text-right text-slate-500">{it.qty}</td>
                          <td className="p-2 text-right font-bold text-slate-900">₹{it.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Gross Invoice Total:</span>
                  <span className="font-bold">₹{previewInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Advance Realized:</span>
                  <span className="font-bold text-emerald-400">₹{(previewInvoice.amount - previewInvoice.balanceDue).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-extrabold text-amber-300 pt-1.5 border-t border-slate-800">
                  <span>Balance Outstanding:</span>
                  <span>₹{previewInvoice.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const inv = previewInvoice;
                  setPreviewInvoice(null);
                  handleOpenEmailModal(inv);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Mail size={13} /> Send via Email
              </button>
              <button
                onClick={() => {
                  handleDownloadPDF(previewInvoice);
                  setPreviewInvoice(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileDown size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
