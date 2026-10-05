import jsPDF from 'jspdf';

export interface InvoiceData {
  id: string;
  customer: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  dueDate: string;
  eventDate: string;
  hallName?: string;
  eventType?: string;
  pax?: number;
  amount: number;
  balanceDue: number;
  status: 'paid' | 'pending' | 'overdue' | string;
  property?: string;
  items?: Array<{
    description: string;
    qty: number | string;
    rate: number;
    amount: number;
  }>;
}

export function getInvoicePDFFilename(invoice: InvoiceData): string {
  const sanitizedCustomer = (invoice.customer || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
  return `Invoice_${invoice.id}_${sanitizedCustomer}.pdf`;
}

export function createInvoicePDFDocument(invoice: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // ----------------------------------------------------
  // 1. TOP HEADER BANNER (Executive Navy & Gold Accent)
  // ----------------------------------------------------
  doc.setFillColor(7, 13, 27); // #070D1B Dark Navy
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent bottom stripe
  doc.setFillColor(217, 119, 6); // #D97706 Amber/Gold
  doc.rect(0, 37.2, pageWidth, 1.2, 'F');

  // GH Logo badge
  doc.setFillColor(245, 158, 11); // Gold
  doc.roundedRect(margin, 7, 13, 13, 2.5, 2.5, 'F');
  doc.setTextColor(2, 6, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GH', margin + 3.2, 15.5);

  // Company Brand Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('GRAND HORIZON BANQUETS', margin + 16, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(251, 191, 36); // #FBBF24 Amber-300
  doc.text('Luxury Banquet Halls, Convention Suites & Catering Operations', margin + 16, 16.5);

  doc.setTextColor(203, 213, 225); // Slate-300
  doc.setFontSize(7);
  doc.text('124 Convention Boulevard, Jubilee Hills, Hyderabad • Ph: +91 98765 43210 • billing@grandhorizon.com', margin + 16, 21);
  doc.text('GSTIN: 27AAAAA0000A1Z5  |  FSSAI Central Lic: 10020011000123  |  PAN: AABCG1234F', margin + 16, 25);

  // Document Title on Right side
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('TAX INVOICE', pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(251, 191, 36);
  doc.text(`ORIGINAL FOR RECIPIENT`, pageWidth - margin, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Ref: ${invoice.id}`, pageWidth - margin, 22, { align: 'right' });

  // ----------------------------------------------------
  // 2. INVOICE & CLIENT METADATA CARDS (Two Columns)
  // ----------------------------------------------------
  let currentY = 44;
  const colWidth = (contentWidth - 6) / 2; // 88mm

  // Left Box: Invoice & Event Particulars
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(margin, currentY, colWidth, 40, 2, 2, 'FD');

  doc.setFillColor(15, 23, 42); // Navy title bar
  doc.roundedRect(margin, currentY, colWidth, 7, 2, 2, 'F');
  doc.rect(margin, currentY + 4, colWidth, 3, 'F'); // square bottom corners of subheader
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INVOICE & EVENT DETAILS', margin + 4, currentY + 4.8);

  const leftLabels = [
    { label: 'Invoice Number:', val: invoice.id, bold: true },
    { label: 'Invoice Date:', val: invoice.date },
    { label: 'Payment Due Date:', val: invoice.dueDate },
    { label: 'Event Date & Session:', val: `${invoice.eventDate} (Evening Session)` },
    { label: 'Hall Reserved:', val: invoice.hallName || 'Crystal Ballroom & Lawns' },
  ];

  let lineY = currentY + 11.5;
  leftLabels.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(item.label, margin + 4, lineY);

    doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(item.val, margin + 35, lineY);
    lineY += 5.8;
  });

  // Right Box: Billed To / Customer Details
  const rightX = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightX, currentY, colWidth, 40, 2, 2, 'FD');

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(rightX, currentY, colWidth, 7, 2, 2, 'F');
  doc.rect(rightX, currentY + 4, colWidth, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BILLED TO (CLIENT DETAILS)', rightX + 4, currentY + 4.8);

  const rightLabels = [
    { label: 'Client / Company:', val: invoice.customer, bold: true },
    { label: 'Contact Phone:', val: invoice.customerPhone || '+91 98450 11223' },
    { label: 'Email Address:', val: invoice.customerEmail || `${invoice.customer.toLowerCase().replace(/\s+/g, '.')}@clientmail.com` },
    { label: 'Venue Property:', val: invoice.property || 'Grand Royal Jubilee Hills (GR-HYD)' },
  ];

  lineY = currentY + 11.5;
  rightLabels.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, rightX + 4, lineY);

    doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(item.val, rightX + 32, lineY);
    lineY += 5.8;
  });

  // Status Badge in right box bottom
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Payment Status:', rightX + 4, lineY);

  const isPaid = invoice.status.toLowerCase() === 'paid' || invoice.balanceDue === 0;
  if (isPaid) {
    doc.setFillColor(22, 163, 74); // Emerald 600
    doc.roundedRect(rightX + 32, lineY - 3.5, 22, 4.8, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('PAID IN FULL', rightX + 34, lineY);
  } else {
    doc.setFillColor(217, 119, 6); // Amber 600
    doc.roundedRect(rightX + 32, lineY - 3.5, 28, 4.8, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(`BALANCE DUE`, rightX + 34, lineY);
  }

  // ----------------------------------------------------
  // 3. ITEMIZED PARTICULARS TABLE
  // ----------------------------------------------------
  currentY = 88;

  // Table Header
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.roundedRect(margin, currentY, contentWidth, 7.5, 1.5, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  const colX = {
    sl: margin + 4,
    desc: margin + 14,
    qty: margin + 105,
    rate: margin + 138,
    amount: margin + contentWidth - 4,
  };

  doc.text('SL', colX.sl, currentY + 5);
  doc.text('SERVICE / ITEM PARTICULARS', colX.desc, currentY + 5);
  doc.text('QTY / PAX', colX.qty, currentY + 5, { align: 'right' });
  doc.text('UNIT RATE (INR)', colX.rate, currentY + 5, { align: 'right' });
  doc.text('AMOUNT (INR)', colX.amount, currentY + 5, { align: 'right' });

  // Generate dynamic itemized breakdown from total amount
  const totalAmount = invoice.amount;
  const subTotalBeforeTax = Math.round(totalAmount / 1.18);
  const hallRental = Math.round(subTotalBeforeTax * 0.45);
  const cateringAmt = Math.round(subTotalBeforeTax * 0.40);
  const decorAmt = Math.round(subTotalBeforeTax * 0.10);
  const staffAmt = subTotalBeforeTax - (hallRental + cateringAmt + decorAmt);

  const items = invoice.items || [
    {
      description: `Prime Banquet Hall Hire & Session Reservation (${invoice.hallName || 'Crystal Ballroom'})`,
      qty: '1 Session',
      rate: hallRental,
      amount: hallRental,
    },
    {
      description: 'Royal Multi-Cuisine Deluxe Buffet Catering & Welcome Mocktails',
      qty: '250 Pax',
      rate: Math.round(cateringAmt / 250),
      amount: cateringAmt,
    },
    {
      description: 'Stage Architecture, Intelligent Truss Lighting & Acoustic Sound System',
      qty: '1 Setup',
      rate: decorAmt,
      amount: decorAmt,
    },
    {
      description: 'Dedicated Event Captain, Service Crew, Valet & Housekeeping Services',
      qty: '1 Service',
      rate: staffAmt,
      amount: staffAmt,
    },
  ];

  currentY += 7.5;
  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 7.5;

    if (isEven) {
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    doc.text(String(index + 1), colX.sl, currentY + 5);
    doc.text(item.description, colX.desc, currentY + 5);
    doc.text(String(item.qty), colX.qty, currentY + 5, { align: 'right' });
    doc.text(`₹${item.rate.toLocaleString('en-IN')}`, colX.rate, currentY + 5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`₹${item.amount.toLocaleString('en-IN')}`, colX.amount, currentY + 5, { align: 'right' });

    currentY += rowHeight;
  });

  // ----------------------------------------------------
  // 4. SUMMARY, TAXES & TOTALS SECTION
  // ----------------------------------------------------
  currentY += 4;
  const summaryBoxWidth = 85;
  const summaryX = margin + contentWidth - summaryBoxWidth;

  const cgst = Math.round(subTotalBeforeTax * 0.09);
  const sgst = totalAmount - subTotalBeforeTax - cgst;
  const advancePaid = totalAmount - invoice.balanceDue;

  // Banking Details Box (Left Side)
  const bankBoxWidth = contentWidth - summaryBoxWidth - 8; // 89mm
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, bankBoxWidth, 44, 2, 2, 'FD');

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, currentY, bankBoxWidth, 6, 2, 2, 'F');
  doc.rect(margin, currentY + 3, bankBoxWidth, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('OFFICIAL BANK REMITTANCE DETAILS', margin + 4, currentY + 4.2);

  const bankLines = [
    { label: 'Bank Name:', val: 'HDFC Bank Ltd. (Jubilee Hills Branch)' },
    { label: 'Account Name:', val: 'Grand Horizon Hospitality Pvt Ltd' },
    { label: 'Account Number:', val: '50200098765432 (Current A/c)' },
    { label: 'IFSC / RTGS Code:', val: 'HDFC0001234' },
    { label: 'UPI ID for QR Pay:', val: 'grandhorizon.banquet@hdfcbank' },
  ];

  let bY = currentY + 10;
  bankLines.forEach(bl => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(bl.label, margin + 4, bY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(bl.val, margin + 28, bY);
    bY += 5.5;
  });

  // Summary Totals Table (Right Side)
  const summaryRows = [
    { label: 'Subtotal (Taxable Value):', val: `₹${subTotalBeforeTax.toLocaleString('en-IN')}`, bold: false },
    { label: 'CGST @ 9.0%:', val: `₹${cgst.toLocaleString('en-IN')}`, bold: false },
    { label: 'SGST @ 9.0%:', val: `₹${sgst.toLocaleString('en-IN')}`, bold: false },
    { label: 'Total Invoice Amount:', val: `₹${totalAmount.toLocaleString('en-IN')}`, bold: true, highlight: true },
    { label: 'Advance Paid / Receipts:', val: `₹${advancePaid.toLocaleString('en-IN')}`, bold: false },
    {
      label: 'Balance Due / Payable:',
      val: `₹${invoice.balanceDue.toLocaleString('en-IN')}`,
      bold: true,
      dueBox: true,
    },
  ];

  let sY = currentY;
  summaryRows.forEach(sr => {
    if (sr.highlight) {
      doc.setFillColor(241, 245, 249);
      doc.rect(summaryX, sY - 1, summaryBoxWidth, 6, 'F');
    }

    if (sr.dueBox) {
      doc.setFillColor(invoice.balanceDue > 0 ? 254 : 240, invoice.balanceDue > 0 ? 242 : 253, invoice.balanceDue > 0 ? 242 : 244);
      doc.setDrawColor(invoice.balanceDue > 0 ? 239 : 34, invoice.balanceDue > 0 ? 68 : 197, invoice.balanceDue > 0 ? 68 : 94);
      doc.roundedRect(summaryX, sY - 1.5, summaryBoxWidth, 7.5, 1.5, 1.5, 'FD');
    }

    doc.setFont('helvetica', sr.bold ? 'bold' : 'normal');
    doc.setFontSize(sr.dueBox ? 8.5 : 7.5);
    doc.setTextColor(sr.dueBox && invoice.balanceDue > 0 ? 185 : 30, sr.dueBox && invoice.balanceDue > 0 ? 28 : 41, sr.dueBox && invoice.balanceDue > 0 ? 28 : 59);

    doc.text(sr.label, summaryX + 3, sY + 3.5);
    doc.text(sr.val, summaryX + summaryBoxWidth - 3, sY + 3.5, { align: 'right' });

    sY += sr.dueBox ? 8 : 6;
  });

  // ----------------------------------------------------
  // 5. TERMS & CONDITIONS AND SIGNATURE BLOCKS
  // ----------------------------------------------------
  currentY = 172;

  // Terms Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 24, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TERMS & CONDITIONS:', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  const termsText = [
    '1. 100% of the total billing amount must be fully cleared at least 48 hours before event commencement.',
    '2. Outside catering and unauthorized acoustic sound systems are strictly prohibited without written consent.',
    '3. GST invoices are final; any discrepancy must be notified within 7 days of invoice generation date.',
    '4. Cancellation charges apply as per the executed banquet booking contract and date closure policies.',
  ];

  let tY = currentY + 9;
  termsText.forEach(t => {
    doc.text(t, margin + 4, tY);
    tY += 3.8;
  });

  // Signature Area
  currentY = 202;
  const sigBoxWidth = 55;

  // Customer signature
  doc.setDrawColor(148, 163, 184); // Slate-400
  doc.line(margin + 5, currentY + 15, margin + 5 + sigBoxWidth, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Customer Acknowledgment', margin + 5 + sigBoxWidth / 2, currentY + 19, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`(${invoice.customer})`, margin + 5 + sigBoxWidth / 2, currentY + 22.5, { align: 'center' });

  // Authorized Signatory
  const authSigX = margin + contentWidth - sigBoxWidth - 5;
  doc.line(authSigX, currentY + 15, authSigX + sigBoxWidth, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('For Grand Horizon Banquets', authSigX + sigBoxWidth / 2, currentY + 19, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Signatory & Finance Seal', authSigX + sigBoxWidth / 2, currentY + 22.5, { align: 'center' });

  // ----------------------------------------------------
  // 6. FOOTER WITH SECURITY & WATERMARK
  // ----------------------------------------------------
  doc.setFillColor(7, 13, 27);
  doc.rect(0, 285, pageWidth, 12, 'F');

  doc.setFillColor(217, 119, 6);
  doc.rect(0, 284.5, pageWidth, 0.5, 'F');

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Grand Horizon ERP • Cloud Banquet Management Platform', margin, 291);

  const timestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${timestamp} | Page 1 of 1`, pageWidth - margin, 291, { align: 'right' });

  return doc;
}

export function generateInvoicePDF(invoice: InvoiceData): void {
  const doc = createInvoicePDFDocument(invoice);
  const filename = getInvoicePDFFilename(invoice);
  doc.save(filename);
}

export function generateInvoicePDFBlob(invoice: InvoiceData): Blob {
  const doc = createInvoicePDFDocument(invoice);
  return doc.output('blob');
}

export function generateInvoicePDFDataUri(invoice: InvoiceData): string {
  const doc = createInvoicePDFDocument(invoice);
  return doc.output('datauristring');
}
