import { safeStorage } from './storage';
import { InvoiceData, getInvoicePDFFilename, generateInvoicePDFBlob } from './invoicePdfGenerator';

export interface EmailTemplate {
  id: string | number;
  name: string;
  subject: string;
  body: string;
  category?: 'invoice' | 'booking' | 'reminder' | 'receipt' | 'notification' | string;
  isDefault?: boolean;
}

export interface EmailDispatchLog {
  id: string;
  invoiceId: string;
  customerName: string;
  recipientEmail: string;
  templateName: string;
  subject: string;
  body: string;
  attachmentName: string;
  attachmentSizeKB: number;
  sentAt: string;
  status: 'delivered' | 'sent' | 'failed';
  sender: string;
}

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: 'tpl-invoice',
    name: 'Invoice Dispatch (Official)',
    subject: 'Tax Invoice {id} for your event at {hall} - Grand Horizon',
    body: `Dear {customer},

Greetings from Grand Horizon Banquets & Convention Hall.

Please find attached the official itemized Tax Invoice ({id}) for your upcoming banquet reservation.

Event Details & Billing Summary:
----------------------------------------
• Invoice ID: {id}
• Event: {event}
• Venue Hall: {hall}
• Event Date: {date}
• Total Invoice Amount: ₹{amount}
• Advance Received: ₹{advancePaid}
• Outstanding Balance Due: ₹{balanceDue}
• Payment Due Date: {dueDate}

The official signed and stamped PDF invoice document is attached to this email for your accounting records.

If you have any questions or need remittance assistance, please reply directly to this email or call our billing desk at +91 98765 43210.

Warm regards,
Accounts & Finance Department
Grand Horizon Banquets & Conventions
124 Convention Boulevard, Jubilee Hills, Hyderabad
Web: www.grandhorizon.com | Email: billing@grandhorizon.com`,
    category: 'invoice',
    isDefault: true
  },
  {
    id: 'tpl-reminder',
    name: 'Payment Due Reminder',
    subject: 'Payment Reminder: Balance Due for Invoice {id} ({hall})',
    body: `Dear {customer},

We hope you are having a wonderful day.

This is a gentle reminder that an outstanding balance of ₹{balanceDue} for Invoice {id} ({event} at {hall} on {date}) is scheduled for settlement by {dueDate}.

Invoice Highlights:
• Total Amount: ₹{amount}
• Balance Pending: ₹{balanceDue}
• Due Date: {dueDate}

Please find the updated PDF invoice attached. We request you to clear the balance at your earliest convenience.

Bank Transfer / UPI Details:
• Account Name: Grand Horizon Banquets Pvt Ltd
• Bank: HDFC Bank, Jubilee Hills Branch
• A/C No: 50200098765432
• IFSC: HDFC0001234
• UPI ID: grandhorizon@hdfcbank

Thank you for your cooperation!

Warm regards,
Accounts Desk
Grand Horizon Banquets`,
    category: 'reminder'
  },
  {
    id: 'tpl-receipt',
    name: 'Payment Receipt / Fully Paid',
    subject: 'Payment Receipt Confirmation: Invoice {id} Cleared',
    body: `Dear {customer},

Thank you for your payment! We are pleased to confirm that Invoice {id} for your event on {date} at {hall} has been settled in full.

Settlement Summary:
• Invoice Number: {id}
• Total Paid: ₹{amount}
• Balance Due: ₹0 (Cleared)
• Event Date: {date}

Your official stamped tax receipt and finalized invoice is attached as a PDF.

We look forward to hosting a spectacular event for you and your guests!

Warm regards,
Banquet Operations & Front Desk
Grand Horizon Banquets`,
    category: 'receipt'
  },
  {
    id: 'tpl-booking',
    name: 'Booking Confirmation',
    subject: 'Booking Confirmation: {event} on {date} at {hall}',
    body: `Dear {customer},

We are delighted to confirm your venue reservation with Grand Horizon Banquets!

Reservation Details:
• Event: {event}
• Date: {date}
• Venue: {hall}
• Estimated Guests: {pax} Pax
• Property: {property}

Please find your booking prospectus and initial advance invoice attached as a PDF.

Warm regards,
Event Planning Team
Grand Horizon Banquets`,
    category: 'booking'
  },
  {
    id: 'tpl-staff',
    name: 'Staff & Banquet Captain Notification',
    subject: 'Staff Notification: Booking Confirmed - {event} ({date})',
    body: `Hello Banquet Operations Team,

A booking has been finalized and requires operational scheduling:

Customer: {customer}
Contact: {phone} | {email}
Event: {event}
Date: {date}
Hall: {hall}
Pax Count: {pax} Guests
Property: {property}

Please coordinate housekeeping, catering preparations, and AV setup accordingly.

- Automated ERP System`,
    category: 'notification'
  }
];

const STORAGE_KEY_TEMPLATES = 'banquet_email_templates';
const STORAGE_KEY_LOGS = 'banquet_email_dispatch_logs';

/**
 * Retrieves all configured email templates from storage, falling back to defaults.
 */
export function getEmailTemplates(): EmailTemplate[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading email templates from storage:', e);
  }
  return initialEmailTemplates;
}

/**
 * Saves email templates to storage.
 */
export function saveEmailTemplates(templates: EmailTemplate[]): void {
  try {
    safeStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('email-templates-updated', { detail: templates }));
    }
  } catch (e) {
    console.error('Error saving email templates to storage:', e);
  }
}

/**
 * Resets templates back to default system templates.
 */
export function resetEmailTemplates(): EmailTemplate[] {
  saveEmailTemplates(initialEmailTemplates);
  return initialEmailTemplates;
}

/**
 * Extract variable replacement dictionary from an invoice object.
 */
export function getInvoiceVariables(invoice: InvoiceData): Record<string, string | number> {
  const advance = invoice.amount - invoice.balanceDue;
  return {
    customer: invoice.customer || 'Valued Customer',
    id: invoice.id || '',
    event: invoice.eventType || 'Banquet Event',
    date: invoice.eventDate || invoice.date || '',
    invoiceDate: invoice.date || '',
    dueDate: invoice.dueDate || '',
    hall: invoice.hallName || 'Crystal Ballroom',
    property: invoice.property || 'Grand Royal Jubilee Hills',
    amount: invoice.amount ? invoice.amount.toLocaleString('en-IN') : '0',
    rawAmount: invoice.amount || 0,
    balanceDue: invoice.balanceDue !== undefined ? invoice.balanceDue.toLocaleString('en-IN') : '0',
    rawBalanceDue: invoice.balanceDue || 0,
    advancePaid: advance > 0 ? advance.toLocaleString('en-IN') : '0',
    pax: invoice.pax || 200,
    email: invoice.customerEmail || 'customer@example.com',
    phone: invoice.customerPhone || '+91 98765 43210',
    status: (invoice.status || 'pending').toUpperCase()
  };
}

/**
 * Replaces placeholder tokens like {customer}, {id}, {amount} in text.
 */
export function renderTemplateText(templateText: string, variables: Record<string, string | number>): string {
  if (!templateText) return '';
  let result = templateText;
  Object.keys(variables).forEach(key => {
    const value = String(variables[key]);
    // Replace {key} and {{key}}
    const regex1 = new RegExp(`\\{${key}\\}`, 'gi');
    const regex2 = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
    result = result.replace(regex1, value).replace(regex2, value);
  });
  return result;
}

/**
 * Select the most suitable template for an invoice based on its status.
 */
export function getBestTemplateForInvoice(invoice: InvoiceData, templates: EmailTemplate[] = getEmailTemplates()): EmailTemplate {
  const isPaid = invoice.status?.toLowerCase() === 'paid' || invoice.balanceDue === 0;
  
  if (isPaid) {
    const receiptTpl = templates.find(t => t.category === 'receipt' || t.name.toLowerCase().includes('receipt'));
    if (receiptTpl) return receiptTpl;
  } else if (invoice.balanceDue > 0) {
    // Check if due soon or default invoice
    const invTpl = templates.find(t => t.isDefault || t.category === 'invoice' || t.name.toLowerCase().includes('invoice'));
    if (invTpl) return invTpl;
  }

  return templates[0] || initialEmailTemplates[0];
}

/**
 * Retrieves audit logs of sent emails.
 */
export function getEmailDispatchLogs(): EmailDispatchLog[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading email dispatch logs:', e);
  }
  return [];
}

/**
 * Records a new email dispatch log in storage.
 */
export function recordEmailDispatch(log: Omit<EmailDispatchLog, 'id' | 'sentAt'>): EmailDispatchLog {
  const fullLog: EmailDispatchLog = {
    ...log,
    id: `EML-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sentAt: new Date().toISOString()
  };
  try {
    const logs = getEmailDispatchLogs();
    const updated = [fullLog, ...logs].slice(0, 100); // keep last 100 logs
    safeStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error recording email dispatch log:', e);
  }
  return fullLog;
}

export interface SendInvoiceEmailParams {
  invoice: InvoiceData;
  recipientEmail?: string;
  template?: EmailTemplate;
  customSubject?: string;
  customBody?: string;
  ccEmail?: string;
  bccEmail?: string;
  sender?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId: string;
  sentAt: string;
  recipientEmail: string;
  subject: string;
  body: string;
  attachmentName: string;
  attachmentSizeKB: number;
}

/**
 * Dispatches an email with the generated PDF invoice attached.
 */
export async function dispatchInvoiceEmail(params: SendInvoiceEmailParams): Promise<SendEmailResult> {
  const {
    invoice,
    recipientEmail = invoice.customerEmail || 'customer@example.com',
    template = getBestTemplateForInvoice(invoice),
    customSubject,
    customBody,
    sender = 'Grand Horizon Billing Desk <billing@grandhorizon.com>'
  } = params;

  const vars = getInvoiceVariables(invoice);
  const finalSubject = customSubject !== undefined ? customSubject : renderTemplateText(template.subject, vars);
  const finalBody = customBody !== undefined ? customBody : renderTemplateText(template.body, vars);
  
  // Generate the actual PDF blob to measure size and verify PDF generation
  const pdfBlob = generateInvoicePDFBlob(invoice);
  const sizeKB = Math.round((pdfBlob.size || 15000) / 1024);
  const attachmentFilename = getInvoicePDFFilename(invoice);

  // Simulate network dispatch with realistic latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const log = recordEmailDispatch({
    invoiceId: invoice.id,
    customerName: invoice.customer,
    recipientEmail,
    templateName: template.name,
    subject: finalSubject,
    body: finalBody,
    attachmentName: attachmentFilename,
    attachmentSizeKB: sizeKB,
    status: 'delivered',
    sender
  });

  return {
    success: true,
    messageId: log.id,
    sentAt: log.sentAt,
    recipientEmail,
    subject: finalSubject,
    body: finalBody,
    attachmentName: attachmentFilename,
    attachmentSizeKB: sizeKB
  };
}
