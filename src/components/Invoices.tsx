import { useState, useEffect } from 'react';
import { FileDown, Printer, AlertCircle, CheckCircle2, BellRing, Check } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2026-001', customer: 'Suresh Kumar', date: '2026-08-15', dueDate: '2026-08-20', eventDate: '2026-08-27', amount: 250000, balanceDue: 0, status: 'paid' },
  { id: 'INV-2026-002', customer: 'TCS Corp Events', date: '2026-08-20', dueDate: '2026-08-25', eventDate: '2026-09-07', amount: 120000, balanceDue: 50000, status: 'pending' },
  { id: 'INV-2026-003', customer: 'Anita Sharma', date: '2026-08-25', dueDate: '2026-09-01', eventDate: '2026-09-15', amount: 85000, balanceDue: 85000, status: 'pending' },
  { id: 'INV-2026-004', customer: 'Global Tech', date: '2026-08-28', dueDate: '2026-09-05', eventDate: '2026-09-05', amount: 200000, balanceDue: 200000, status: 'pending' },
];

export default function Invoices() {
  const [remindersSent, setRemindersSent] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // In a real application, we'd rely on the actual system clock.
  // We'll update this once just in case the system is running on a different time, 
  // but use a fallback of '2026-08-31' for demonstration purposes if needed.
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  const handlePrint = (invoice: typeof mockInvoices[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
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
              .badge { display: inline-block; background: #2563eb; color: white; font-weight: bold; font-size: 11px; padding: 4px 12px; border-radius: 4px; margin-top: 5px; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
              .meta-grid div p { margin: 4px 0; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
              th { background: #f1f5f9; padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; font-size: 10px; }
              td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
              .text-right { text-align: right; }
              .totals-table { width: 280px; margin-left: auto; margin-bottom: 30px; font-size: 12px; }
              .totals-table td { padding: 6px 10px; }
              .totals-table .grand-total { font-weight: bold; font-size: 14px; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; background: #f8fafc; }
              .footer { border-top: 1px dashed #cbd5e1; pt-15; margin-top: 40px; text-align: center; font-size: 11px; color: #64748b; }
              .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 20px; }
              .sig-box { text-align: center; border-top: 1px solid #94a3b8; width: 180px; pt-5; font-size: 11px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Grand Horizon Banquet & Convention Hall</h1>
              <p>124 Convention Boulevard, Metro City • Phone: +91 98765 43210</p>
              <p>GSTIN: 27AAAAA0000A1Z5 | FSSAI Lic: 10020011000123</p>
              <div class="badge">BANQUET TAX INVOICE RECEIPT</div>
            </div>

            <div class="meta-grid">
              <div>
                <p><strong>Invoice Number:</strong> ${invoice.id}</p>
                <p><strong>Invoice Date:</strong> ${invoice.date}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
              </div>
              <div>
                <p><strong>Billed To:</strong> ${invoice.customer}</p>
                <p><strong>Event Date:</strong> ${invoice.eventDate}</p>
                <p><strong>Payment Status:</strong> ${invoice.status.toUpperCase()}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th class="text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Banquet Hall & Event Services Package</td>
                  <td class="text-right">₹${invoice.amount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <table class="totals-table">
              <tr class="grand-total">
                <td>Total Invoice Amount</td>
                <td class="text-right">₹${invoice.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Balance Due</td>
                <td class="text-right" style="color: ${invoice.balanceDue > 0 ? '#dc2626' : '#16a34a'}; font-weight: bold;">
                  ₹${invoice.balanceDue.toLocaleString('en-IN')}
                </td>
              </tr>
            </table>

            <div class="signatures">
              <div class="sig-box">Customer Signature</div>
              <div class="sig-box">Authorized Signatory</div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Grand Horizon Banquet! This is an official tax invoice copy.</p>
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
    // In a real application, trigger an email via the backend
  };

  return (
    <div className="h-full w-full bg-white p-2 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-2 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Invoices & Billing</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0">
            <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
              <th className="p-2">Invoice ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Event Date</th>
              <th className="p-2 text-right">Amount (₹)</th>
              <th className="p-2 text-right">Balance Due (₹)</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockInvoices.map(invoice => {
              const needsReminder = checkNeedsReminder(invoice.eventDate, invoice.balanceDue);
              const reminderSent = remindersSent[invoice.id];

              return (
                <tr key={invoice.id} className="even:bg-slate-50/50 hover:bg-blue-50/50 transition-colors">
                  <td className="p-2 font-medium text-slate-900">{invoice.id}</td>
                  <td className="p-2 text-slate-600">{invoice.customer}</td>
                  <td className="p-2 text-slate-600">{invoice.eventDate}</td>
                  <td className="p-2 text-right font-bold text-slate-900">{invoice.amount.toLocaleString('en-IN')}</td>
                  <td className="p-2 text-right font-bold text-red-600">{invoice.balanceDue > 0 ? invoice.balanceDue.toLocaleString('en-IN') : '-'}</td>
                  <td className="p-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`flex items-center justify-center gap-1.5 font-bold ${invoice.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {invoice.status === 'paid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {invoice.status.toUpperCase()}
                      </div>
                      {needsReminder && !reminderSent && invoice.status !== 'paid' && (
                        <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          7-Day Warning
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center flex items-center justify-center gap-3">
                    {needsReminder && invoice.status !== 'paid' && (
                      <button 
                        onClick={() => handleSendReminder(invoice.id)}
                        disabled={reminderSent}
                        title="Send Payment Reminder"
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors ${reminderSent ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                      >
                        {reminderSent ? <Check size={12} /> : <BellRing size={12} />}
                        {reminderSent ? 'Sent' : 'Remind'}
                      </button>
                    )}
                    <button className="text-slate-500 hover:text-blue-600 transition-colors" title="Download">
                      <FileDown size={14} />
                    </button>
                    <button 
                      onClick={() => handlePrint(invoice)} 
                      className="flex items-center gap-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded border border-slate-200 text-[10px] font-bold transition-colors" 
                      title="Print / Reprint Official Invoice"
                    >
                      <Printer size={13} /> Print / Reprint
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
