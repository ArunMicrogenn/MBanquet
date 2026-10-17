import { SettledBill } from '../components/CheckoutSettlement';

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  field?: string;
  billNo?: string;
}

export interface TallyValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  summary: {
    totalVouchersChecked: number;
    passedVouchers: number;
    failedVouchers: number;
  };
}

/**
 * Validates a single settled bill for Tally Prime XML import compliance.
 */
export function validateBillForTally(bill: SettledBill, config: { salesLedger: string; cgstLedger: string; sgstLedger: string; sundryGroup: string }): { errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Voucher Number check
  if (!bill.billNo || bill.billNo.trim() === '') {
    errors.push({ type: 'error', message: 'Missing voucher number (Bill No). Tally requires a unique voucher reference number.', field: 'billNo', billNo: bill.billNo });
  }

  // 2. Customer Party Ledger check
  if (!bill.customerName || bill.customerName.trim() === '') {
    errors.push({ type: 'error', message: 'Missing customer name (Party Ledger Name). Tally requires a valid party ledger for sales vouchers.', field: 'customerName', billNo: bill.billNo });
  } else if (bill.customerName.length > 100) {
    warnings.push({ type: 'warning', message: `Customer name "${bill.customerName}" is unusually long (>100 chars). Tally ledger name length may be truncated.`, field: 'customerName', billNo: bill.billNo });
  }

  // 3. Date check
  if (!bill.settledAt) {
    errors.push({ type: 'error', message: 'Missing settlement date for voucher.', field: 'settledAt', billNo: bill.billNo });
  } else {
    const cleanDate = bill.settledAt.replace(/[^0-9]/g, '');
    if (cleanDate.length < 8) {
      warnings.push({ type: 'warning', message: `Date format "${bill.settledAt}" might not map cleanly to Tally YYYYMMDD format.`, field: 'settledAt', billNo: bill.billNo });
    }
  }

  // 4. Financial amounts check
  if (typeof bill.grandTotal !== 'number' || isNaN(bill.grandTotal) || bill.grandTotal <= 0) {
    errors.push({ type: 'error', message: `Invalid grand total amount (${bill.grandTotal}). Tally voucher amount must be positive.`, field: 'grandTotal', billNo: bill.billNo });
  }

  if (typeof bill.subtotal !== 'number' || isNaN(bill.subtotal) || bill.subtotal < 0) {
    errors.push({ type: 'error', message: `Invalid subtotal amount (${bill.subtotal}).`, field: 'subtotal', billNo: bill.billNo });
  }

  // 5. Ledger Configuration check
  if (!config.salesLedger) {
    errors.push({ type: 'error', message: 'Sales Ledger is not configured in Tally mapping settings.', field: 'salesLedger', billNo: bill.billNo });
  }
  if (bill.cgst > 0 && !config.cgstLedger) {
    errors.push({ type: 'error', message: 'CGST is present on bill but CGST Ledger is not configured.', field: 'cgstLedger', billNo: bill.billNo });
  }
  if (bill.sgst > 0 && !config.sgstLedger) {
    errors.push({ type: 'error', message: 'SGST is present on bill but SGST Ledger is not configured.', field: 'sgstLedger', billNo: bill.billNo });
  }

  // 6. Double-entry arithmetic balancing check (Debits == Credits)
  const partyAmount = Number(bill.grandTotal.toFixed(2));
  const revenueAmount = Number(bill.subtotal.toFixed(2));
  const cgstAmount = Number((bill.cgst || 0).toFixed(2));
  const sgstAmount = Number((bill.sgst || 0).toFixed(2));
  const totalCreditSum = Number((revenueAmount + cgstAmount + sgstAmount).toFixed(2));

  if (Math.abs(partyAmount - totalCreditSum) > 0.05) {
    errors.push({
      type: 'error',
      message: `Ledger amount mismatch for bill ${bill.billNo}: Party Debit (${partyAmount}) does not match sum of Credits [Sales: ${revenueAmount} + CGST: ${cgstAmount} + SGST: ${sgstAmount} = ${totalCreditSum}].`,
      field: 'ledgerBalance',
      billNo: bill.billNo
    });
  }

  return { errors, warnings };
}

/**
 * Validates a full Tally XML Envelope string against Tally Prime schema standards.
 */
export function validateTallyXMLEnvelope(xmlContent: string): TallyValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // Check XML root and envelope structure
  if (!xmlContent.includes('<?xml version="1.0" encoding="UTF-8"?>') && !xmlContent.includes('<?xml')) {
    warnings.push({ type: 'warning', message: 'Missing standard XML declaration prolog.' });
  }

  if (!xmlContent.includes('<ENVELOPE>') || !xmlContent.includes('</ENVELOPE>')) {
    errors.push({ type: 'error', message: 'Invalid Tally XML structure: Missing root <ENVELOPE> tags.' });
  }

  if (!xmlContent.includes('<TALLYREQUEST>Import Data</TALLYREQUEST>')) {
    errors.push({ type: 'error', message: 'Missing mandatory Tally request header <TALLYREQUEST>Import Data</TALLYREQUEST>.' });
  }

  if (!xmlContent.includes('<IMPORTDATA>') || !xmlContent.includes('</IMPORTDATA>')) {
    errors.push({ type: 'error', message: 'Missing mandatory <IMPORTDATA> envelope wrapper.' });
  }

  if (!xmlContent.includes('<REPORTNAME>Vouchers</REPORTNAME>')) {
    errors.push({ type: 'error', message: 'Missing mandatory <REPORTNAME>Vouchers</REPORTNAME> tag in request description.' });
  }

  // Count vouchers in XML
  const voucherMatches = xmlContent.match(/<VOUCHER\b[^>]*>/g) || [];
  const tallyMessageMatches = xmlContent.match(/<TALLYMESSAGE\b[^>]*>/g) || [];

  if (voucherMatches.length === 0) {
    errors.push({ type: 'error', message: 'No <VOUCHER> elements found in XML payload for Tally import.' });
  }

  if (voucherMatches.length !== tallyMessageMatches.length) {
    warnings.push({ type: 'warning', message: 'Mismatch between <TALLYMESSAGE> and <VOUCHER> counts. Verify wrapper tags.' });
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    summary: {
      totalVouchersChecked: voucherMatches.length,
      passedVouchers: isValid ? voucherMatches.length : Math.max(0, voucherMatches.length - errors.length),
      failedVouchers: errors.filter(e => e.billNo).length
    }
  };
}

/**
 * Validates a list of settled bills against Tally config before bulk export.
 */
export function validateBulkTallyExport(bills: SettledBill[], config: { salesLedger: string; cgstLedger: string; sgstLedger: string; sundryGroup: string }): TallyValidationResult {
  const allErrors: ValidationIssue[] = [];
  const allWarnings: ValidationIssue[] = [];
  let passedCount = 0;
  let failedCount = 0;

  if (bills.length === 0) {
    allErrors.push({ type: 'error', message: 'No bills provided for validation.' });
  }

  for (const bill of bills) {
    const { errors, warnings } = validateBillForTally(bill, config);
    if (errors.length > 0) {
      failedCount++;
      allErrors.push(...errors);
    } else {
      passedCount++;
    }
    allWarnings.push(...warnings);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    summary: {
      totalVouchersChecked: bills.length,
      passedVouchers: passedCount,
      failedVouchers: failedCount
    }
  };
}
