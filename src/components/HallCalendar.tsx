import { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Lightbulb, 
  X, 
  Loader2, 
  QrCode, 
  Printer, 
  Package, 
  Plus, 
  Minus, 
  Search, 
  Palette,
  AlertTriangle,
  ExternalLink,
  Clock,
  Building,
  ArrowRight,
  ShieldAlert,
  Flame,
  TrendingUp,
  Copy,
  Check,
  Sparkles,
  Info,
  Percent,
  Coins,
  AlertCircle,
  DollarSign,
  Trash2,
  Receipt,
  Building2,
  Shuffle,
  ArrowUpCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const INVENTORY = [
  { id: 'inv1', name: 'Banquet Chairs', category: 'Furniture', total: 500 },
  { id: 'inv2', name: 'Round Tables (8 pax)', category: 'Furniture', total: 60 },
  { id: 'inv3', name: 'Rectangular Tables', category: 'Furniture', total: 40 },
  { id: 'inv4', name: 'HD Projector', category: 'AV Gear', total: 5 },
  { id: 'inv5', name: 'Wireless Microphone', category: 'AV Gear', total: 12 },
  { id: 'inv6', name: 'PA Sound System', category: 'AV Gear', total: 4 },
  { id: 'inv7', name: 'Stage Platform', category: 'Equipment', total: 10 },
  { id: 'inv8', name: 'LED Uplighting', category: 'Equipment', total: 40 },
];

function ResourceAssignmentTab({ events, onUpdateBooking }: { events: any[], onUpdateBooking: (old: any, updated: any) => boolean }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingEvents = events.filter(e => new Date(e.start) >= new Date()).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const selectedEvent = events.find(e => e.id === selectedEventId);

  const handleUpdateResource = (invId: string, delta: number) => {
    if (!selectedEvent) return;
    const currentResources = selectedEvent.resources || {};
    const currentQty = currentResources[invId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    const updatedBooking = {
      ...selectedEvent,
      resources: {
        ...currentResources,
        [invId]: newQty
      }
    };
    onUpdateBooking(selectedEvent, updatedBooking);
  };

  const filteredInventory = INVENTORY.filter(inv => inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || inv.category.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group by category
  const groupedInventory = filteredInventory.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof INVENTORY>);

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3 flex flex-col border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-slate-700">
          Upcoming Events
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {upcomingEvents.length === 0 && <div className="p-4 text-center text-slate-500 text-sm">No upcoming events.</div>}
          {upcomingEvents.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedEventId === event.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}`}
            >
              <div className="font-bold text-sm text-slate-800 truncate">{event.title}</div>
              <div className="text-xs text-slate-500 mt-1 flex justify-between">
                <span>{new Date(event.start).toLocaleDateString()}</span>
                <span>{event.hall || 'Unassigned'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white">
        {selectedEvent ? (
          <>
            <div className="bg-slate-50 p-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg">{selectedEvent.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Assign resources for {new Date(selectedEvent.start).toLocaleString()}</p>
            </div>
            <div className="p-3 border-b border-slate-100 flex items-center bg-white">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {Object.entries(groupedInventory).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {items.map(item => {
                      const assignedQty = (selectedEvent.resources || {})[item.id] || 0;
                      return (
                        <div key={item.id} className="border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:border-slate-300 transition-colors">
                          <div>
                            <div className="font-semibold text-sm text-slate-800">{item.name}</div>
                            <div className="text-[10px] text-slate-500">Total Available: {item.total}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleUpdateResource(item.id, -1)}
                              disabled={assignedQty === 0}
                              className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm w-6 text-center">{assignedQty}</span>
                            <button 
                              onClick={() => handleUpdateResource(item.id, 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Package size={48} className="mb-4 opacity-20" />
            <p>Select an event from the list to assign resources.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HallCalendar({ events, onUpdateBooking }: { events: any[], onUpdateBooking: (old: any, updated: any) => boolean }) {
  const [viewMode, setViewMode] = useState<'events' | 'capacity' | 'resources'>('events');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showColorSettings, setShowColorSettings] = useState(false);

  // Separate Advance Payment Entry Form States
  const [newAdvAmount, setNewAdvAmount] = useState<string>('');
  const [newAdvMode, setNewAdvMode] = useState<string>('UPI / QR Code');
  const [newAdvDate, setNewAdvDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [newAdvReceipt, setNewAdvReceipt] = useState<string>('');
  const [newAdvTxnRef, setNewAdvTxnRef] = useState<string>('');
  const [newAdvRemarks, setNewAdvRemarks] = useState<string>('');
  const [conflictAlert, setConflictAlert] = useState<{
    movedBooking: any;
    conflictingBooking: any;
    attemptedStart: string;
    attemptedEnd?: string;
    hallName: string;
  } | null>(null);
  const [typeColors, setTypeColors] = useState<Record<string, string>>({
    'Wedding': '#ec4899',
    'Corporate': '#3b82f6',
    'Birthday': '#eab308',
    'Conference': '#8b5cf6',
    'Other': '#64748b'
  });

  // Capacity Heatmap and Sales Planning config state
  const [maxDailyCapacity, setMaxDailyCapacity] = useState<number>(1000);
  const [premiumTriggerPct, setPremiumTriggerPct] = useState<number>(75);
  const [selectedPitch, setSelectedPitch] = useState<{ date: string; dayName: string } | null>(null);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);

  // Dynamic Vacant Weekends in next 60 days
  const vacantWeekends = useMemo(() => {
    const list: { date: string; dayName: string }[] = [];
    const today = new Date();
    for (let i = 1; i <= 60; i++) {
      const nextDate = new Date(today.getTime() + i * 24 * 3600 * 1000);
      const dayOfWeek = nextDate.getDay(); // 0 = Sun, 6 = Sat
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const dayEvents = events.filter(e => e.start && e.start.startsWith(dateStr) && e.status !== 'Cancelled');
        if (dayEvents.length === 0) {
          list.push({
            date: dateStr,
            dayName: dayOfWeek === 6 ? 'Saturday' : 'Sunday'
          });
        }
      }
    }
    return list.slice(0, 5);
  }, [events]);

  // High occupancy premium dates
  const highOccupancyDates = useMemo(() => {
    const datesMap: Record<string, number> = {};
    events.forEach(e => {
      if (!e.start || e.status === 'Cancelled') return;
      const dateStr = e.start.slice(0, 10);
      datesMap[dateStr] = (datesMap[dateStr] || 0) + (e.pax || 0);
    });

    return Object.entries(datesMap)
      .map(([date, pax]) => ({
        date,
        pax,
        pct: (pax / maxDailyCapacity) * 100
      }))
      .filter(d => d.pct >= premiumTriggerPct)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events, maxDailyCapacity, premiumTriggerPct]);

  const coloredEvents = events.map(e => {
    const parts = e.title.split(' - ');
    const rawType = parts.length > 1 ? parts[parts.length - 1].trim().replace(/\s*\(\d+\/\d+\)$/, '') : 'Other';
    const eventType = Object.keys(typeColors).find(t => rawType.toLowerCase().includes(t.toLowerCase())) || 'Other';
    const color = typeColors[eventType] || typeColors['Other'];
    const bookingStatus = e.status || (e.checkedIn ? 'Completed' : 'Confirmed');
    const isCancelled = bookingStatus === 'Cancelled';
    
    return { 
      ...e, 
      backgroundColor: isCancelled ? '#64748b' : color, 
      borderColor: isCancelled ? '#475569' : color,
      extendedProps: {
        ...e,
        status: bookingStatus
      }
    };
  });

  const TOTAL_CAPACITY = 1000; // Mock maximum capacity

  const handlePrint = () => {
    if (!selectedEvent) return;
    
    const bookingId = selectedEvent.id || Math.random().toString(36).substr(2, 9).toUpperCase();
    const date = new Date(selectedEvent.start).toLocaleDateString();
    
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return;
    
    const qrElement = document.getElementById('booking-qr-code');
    const qrSvg = qrElement ? qrElement.innerHTML : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Booking Confirmation - ${selectedEvent.title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 24px; font-weight: 800; margin: 0; }
            .badge { background: #f8fafc; border: 1px solid #cbd5e1; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; }
            .title { font-size: 32px; font-weight: 800; margin: 0 0 10px 0; }
            .detail-group { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; }
            .detail-row { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
            .detail-label { font-size: 14px; font-weight: 600; color: #64748b; }
            .detail-val { font-size: 16px; font-weight: 700; text-align: right; }
            .qr-section { text-align: center; margin-top: 40px; padding: 30px; background: #f8fafc; border-radius: 12px; }
            .qr-svg-wrapper svg { width: 150px; height: 150px; margin: 0 auto; }
            .qr-text { margin-top: 15px; font-size: 14px; color: #64748b; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <p class="logo">Grand Horizon Banquets</p>
            </div>
            <div class="badge">Booking ID: ${bookingId}</div>
          </div>
          
          <h1 class="title">${selectedEvent.title}</h1>
          
          <div class="detail-group">
            <div class="detail-row">
              <span class="detail-label">Event Date</span>
              <span class="detail-val">${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Assigned Hall</span>
              <span class="detail-val">${selectedEvent.hall || 'Unassigned'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guaranteed Pax</span>
              <span class="detail-val">${selectedEvent.pax || 'N/A'} Guests</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in Status</span>
              <span class="detail-val">${selectedEvent.checkedIn ? '✓ Verified' : 'Pending Verification'}</span>
            </div>
          </div>
          
          <div class="qr-section">
            <div class="qr-svg-wrapper">${qrSvg}</div>
            <div class="qr-text">Scan at entrance for fast-track verification</div>
          </div>
          
          <div class="footer">
            This is a system generated confirmation slip. Please present this at the venue.<br/>
            Printed on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrintAdvanceReceipt = (adv: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Advance Payment Receipt - ${adv.receiptNo}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: 0 auto; line-height: 1.5; }
              .receipt-card { border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; background: #fff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
              .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
              .logo { font-size: 20px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
              .subtitle { font-size: 11px; color: #64748b; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
              .title { font-size: 14px; font-weight: 700; color: #475569; background: #f1f5f9; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-top: 12px; text-transform: uppercase; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; font-size: 13px; }
              .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; display: block; margin-bottom: 2px; }
              .value { font-weight: 600; color: #334155; }
              .amount-box { text-align: center; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 24px 0; }
              .amount-val { font-size: 24px; font-weight: 800; color: #15803d; }
              .amount-words { font-size: 11px; color: #166534; font-weight: 600; margin-top: 4px; text-transform: uppercase; }
              .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; }
              .sig-line { border-top: 1px solid #94a3b8; width: 140px; margin-top: 35px; text-align: center; padding-top: 5px; font-weight: 700; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="receipt-card">
              <div class="header">
                <div class="logo">Grand Horizon Banquets</div>
                <div class="subtitle">Official Payment Receipt / Credit Voucher</div>
                <div class="title">Advance Deposit Voucher</div>
              </div>
              <div class="grid">
                <div>
                  <span class="label">Receipt Number</span>
                  <span class="value">${adv.receiptNo}</span>
                </div>
                <div>
                  <span class="label">Payment Date</span>
                  <span class="value">${new Date(adv.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div>
                  <span class="label">Booking / Event</span>
                  <span class="value">${selectedEvent.title}</span>
                </div>
                <div>
                  <span class="label">Allocated Hall</span>
                  <span class="value">${selectedEvent.hall || 'Main Banquet Hall'}</span>
                </div>
                <div>
                  <span class="label">Payment Mode</span>
                  <span class="value">${adv.paymentMode}</span>
                </div>
                <div>
                  <span class="label">Reference / TXN ID</span>
                  <span class="value font-mono">${adv.txnRef || 'N/A'}</span>
                </div>
              </div>
              <div class="amount-box">
                <span class="label" style="color: #166534">Amount Paid</span>
                <div class="amount-val">₹${parseFloat(adv.amount).toLocaleString('en-IN')}</div>
                <div class="amount-words">Remarks: ${adv.remarks || 'Initial Deposit'}</div>
              </div>
              <div class="footer">
                <div>
                  <p>Received with thanks by:</p>
                  <p class="value" style="margin-top: 4px;">${adv.receivedBy || 'Authorized Agent'}</p>
                </div>
                <div>
                  <div class="sig-line">Authorized Signatory</div>
                </div>
              </div>
            </div>
            <script>
              window.print();
              setTimeout(() => { window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleAddAdvance = (e: any) => {
    e.preventDefault();
    const amount = parseFloat(newAdvAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive advance amount.");
      return;
    }

    const currentAdvances = selectedEvent.advances || (selectedEvent.advance > 0 ? [{
      id: 'legacy-adv',
      date: new Date(selectedEvent.start).toISOString().slice(0, 10),
      amount: selectedEvent.advance,
      paymentMode: selectedEvent.advancePayMode || 'UPI',
      txnRef: 'LEGACY-REF',
      receiptNo: 'REC-LEGACY',
      receivedBy: 'Manager Rajan',
      status: 'Realized' as const,
      remarks: 'Initial Booking Deposit'
    }] : []);

    const newEntry = {
      id: 'adv-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000),
      date: newAdvDate || new Date().toISOString().slice(0, 10),
      amount: amount,
      paymentMode: newAdvMode,
      txnRef: newAdvTxnRef || '',
      receiptNo: newAdvReceipt || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      receivedBy: 'Manager Rajan',
      status: 'Realized' as const,
      remarks: newAdvRemarks || 'Additional advance deposit'
    };

    const updatedAdvances = [...currentAdvances, newEntry];
    const totalAdvance = updatedAdvances.reduce((sum, item) => sum + (item.status === 'Realized' ? item.amount : 0), 0);

    const updatedEvent = {
      ...selectedEvent,
      advance: totalAdvance,
      advancePayMode: newAdvMode,
      advances: updatedAdvances
    };

    setSelectedEvent(updatedEvent);
    onUpdateBooking(selectedEvent, updatedEvent);

    // Reset Form Fields
    setNewAdvAmount('');
    setNewAdvTxnRef('');
    setNewAdvReceipt('');
    setNewAdvRemarks('');
  };

  const handleDeleteAdvance = (advId: string) => {
    if (!window.confirm("Are you sure you want to void/delete this advance entry? This action is irreversible and will reduce the booking's total advance paid.")) return;

    const currentAdvances = selectedEvent.advances || (selectedEvent.advance > 0 ? [{
      id: 'legacy-adv',
      date: new Date(selectedEvent.start).toISOString().slice(0, 10),
      amount: selectedEvent.advance,
      paymentMode: selectedEvent.advancePayMode || 'UPI',
      txnRef: 'LEGACY-REF',
      receiptNo: 'REC-LEGACY',
      receivedBy: 'Manager Rajan',
      status: 'Realized' as const,
      remarks: 'Initial Booking Deposit'
    }] : []);

    const updatedAdvances = currentAdvances.filter((a: any) => a.id !== advId);
    const totalAdvance = updatedAdvances.reduce((sum: number, item: any) => sum + (item.status === 'Realized' ? item.amount : 0), 0);

    const updatedEvent = {
      ...selectedEvent,
      advance: totalAdvance,
      advances: updatedAdvances
    };

    setSelectedEvent(updatedEvent);
    onUpdateBooking(selectedEvent, updatedEvent);
  };

  // Automated Conflict Resolution Options Calculations
  const conflictResolutionOptions = useMemo(() => {
    if (!conflictAlert) return null;

    const { movedBooking, conflictingBooking, hallName } = conflictAlert;
    
    // 1. Find vacant alternative halls for MOVED booking at the SAME requested time
    const otherHalls = ['Crystal Ballroom', 'Ruby Suite', 'Garden Lawn'].filter(h => h.toLowerCase() !== hallName.toLowerCase());
    const mTime = getTimestamps(movedBooking.start, movedBooking.end);
    
    const availableAlternativeHalls = otherHalls.filter(hName => {
      const overlap = events.some(b => {
        if (b.id === movedBooking.id || b.status === 'Cancelled') return false;
        const bHalls = b.halls || (b.hall ? b.hall.split(',').map((h: string) => h.trim()) : []);
        const hasHallOverlap = bHalls.some((h: string) => h.toLowerCase() === hName.toLowerCase());
        if (!hasHallOverlap) return false;
        
        const bTime = getTimestamps(b.start, b.end);
        return mTime.start < bTime.end && mTime.end > bTime.start;
      });
      return !overlap;
    });

    // 2. Find alternative slots in the ORIGINAL requested hall (where it is vacant)
    const originalStart = new Date(movedBooking.start);
    const durationMs = mTime.end - mTime.start;
    
    const candidates = [
      { label: 'Same Day (4 hrs later)', offsetHours: 4 },
      { label: 'Same Day (4 hrs earlier)', offsetHours: -4 },
      { label: 'Next Day (Same time)', offsetDays: 1 },
      { label: 'Previous Day (Same time)', offsetDays: -1 },
      { label: 'Next Saturday (Same time)', targetDay: 6 },
      { label: 'Next Sunday (Same time)', targetDay: 0 }
    ];

    const alternativeSlots: { label: string; start: string; end: string }[] = [];

    candidates.forEach(cand => {
      let testStart = new Date(originalStart);
      if (cand.offsetHours !== undefined) {
        testStart = new Date(originalStart.getTime() + cand.offsetHours * 3600 * 1000);
      } else if (cand.offsetDays !== undefined) {
        testStart = new Date(originalStart.getTime() + cand.offsetDays * 24 * 3600 * 1000);
      } else if (cand.targetDay !== undefined) {
        testStart.setDate(originalStart.getDate() + (cand.targetDay - originalStart.getDay() + 7) % 7);
        if (testStart.toDateString() === originalStart.toDateString()) {
          testStart.setDate(testStart.getDate() + 7);
        }
      }

      const testEnd = new Date(testStart.getTime() + durationMs);
      const startStr = testStart.toISOString().slice(0, 19);
      const endStr = testEnd.toISOString().slice(0, 19);

      const overlaps = events.some(b => {
        if (b.id === movedBooking.id || b.status === 'Cancelled') return false;
        const bHalls = b.halls || (b.hall ? b.hall.split(',').map((h: string) => h.trim()) : []);
        const hasHallOverlap = bHalls.some((h: string) => h.toLowerCase() === hallName.toLowerCase());
        if (!hasHallOverlap) return false;

        const bTime = getTimestamps(b.start, b.end);
        const testStartTime = testStart.getTime();
        const testEndTime = testEnd.getTime();
        return testStartTime < bTime.end && testEndTime > bTime.start;
      });

      if (!overlaps) {
        alternativeSlots.push({
          label: cand.label,
          start: startStr,
          end: endStr
        });
      }
    });

    // 3. Find if the CONFLICTING booking can be moved to another vacant hall at the SAME time
    const cTime = getTimestamps(conflictingBooking.start, conflictingBooking.end);
    const conflictingHalls = conflictingBooking.halls || (conflictingBooking.hall ? conflictingBooking.hall.split(',').map((h: string) => h.trim()) : []);
    const otherHallsForConflicting = ['Crystal Ballroom', 'Ruby Suite', 'Garden Lawn'].filter(h => !conflictingHalls.some((ch: string) => ch.toLowerCase() === h.toLowerCase()));

    const vacantHallsForConflicting = otherHallsForConflicting.filter(hName => {
      const overlap = events.some(b => {
        if (b.id === conflictingBooking.id || b.id === movedBooking.id || b.status === 'Cancelled') return false;
        
        const bHalls = b.halls || (b.hall ? b.hall.split(',').map((h: string) => h.trim()) : []);
        const hasHallOverlap = bHalls.some((h: string) => h.toLowerCase() === hName.toLowerCase());
        if (!hasHallOverlap) return false;

        const bTime = getTimestamps(b.start, b.end);
        return cTime.start < bTime.end && cTime.end > bTime.start;
      });
      return !overlap;
    });

    return {
      availableAlternativeHalls,
      alternativeSlots: alternativeSlots.slice(0, 3),
      vacantHallsForConflicting
    };
  }, [conflictAlert, events]);

  const handleRelocateMovedBooking = (targetHall: string) => {
    if (!conflictAlert) return;
    const { movedBooking } = conflictAlert;
    const oldBooking = events.find(e => e.id === movedBooking.id || (e.title === movedBooking.title && e.start === movedBooking.start));
    if (!oldBooking) return;

    const updated = {
      ...movedBooking,
      hall: targetHall,
      halls: [targetHall]
    };

    const success = onUpdateBooking(oldBooking, updated);
    if (success) {
      setConflictAlert(null);
    }
  };

  const handleRescheduleMovedBooking = (startStr: string, endStr: string) => {
    if (!conflictAlert) return;
    const { movedBooking } = conflictAlert;
    const oldBooking = events.find(e => e.id === movedBooking.id || (e.title === movedBooking.title && e.start === movedBooking.start));
    if (!oldBooking) return;

    const updated = {
      ...movedBooking,
      start: startStr,
      end: endStr
    };

    const success = onUpdateBooking(oldBooking, updated);
    if (success) {
      setConflictAlert(null);
    }
  };

  const handleRelocateConflictingBooking = (targetHall: string) => {
    if (!conflictAlert) return;
    const { movedBooking, conflictingBooking } = conflictAlert;
    
    const oldConflicting = events.find(e => e.id === conflictingBooking.id);
    const oldMoved = events.find(e => e.id === movedBooking.id || (e.title === movedBooking.title && e.start === movedBooking.start));
    
    if (!oldConflicting || !oldMoved) return;

    const updatedConflicting = {
      ...oldConflicting,
      hall: targetHall,
      halls: [targetHall]
    };

    const updatedMoved = {
      ...movedBooking
    };

    // Use our enhanced atomic updateBooking with array signature!
    const success = onUpdateBooking([oldConflicting, oldMoved], [updatedConflicting, updatedMoved]);
    if (success) {
      setConflictAlert(null);
    }
  };

  const getTimestamps = (startStr: string, endStr?: string | null) => {
    const start = new Date(startStr).getTime();
    let end = endStr ? new Date(endStr).getTime() : NaN;
    if (isNaN(end) || end <= start) {
      const isFullDay = !startStr.includes('T');
      end = start + (isFullDay ? 24 * 3600 * 1000 : 4 * 3600 * 1000);
    }
    return { start, end };
  };

  const findConflict = (movedBooking: any, oldBooking: any) => {
    const movedHalls = movedBooking.halls || (movedBooking.hall ? movedBooking.hall.split(',').map((h: string) => h.trim()) : []);
    const movedTime = getTimestamps(movedBooking.start, movedBooking.end);

    return events.find(b => {
      // Exclude the booking being moved
      const isSameBooking = (b.id && oldBooking?.id && b.id === oldBooking.id) || 
        (b.title === oldBooking?.title && b.start === oldBooking?.start);
      if (isSameBooking) return false;

      // Ignore cancelled bookings
      if (b.status === 'Cancelled') return false;

      // Hall Overlap Check
      const existingHalls = b.halls || (b.hall ? b.hall.split(',').map((h: string) => h.trim()) : []);
      
      let hasHallOverlap = true;
      if (movedHalls.length > 0 && existingHalls.length > 0) {
        hasHallOverlap = movedHalls.some((h: string) => existingHalls.includes(h));
      } else if (movedBooking.hall && b.hall) {
        hasHallOverlap = movedBooking.hall.trim().toLowerCase() === b.hall.trim().toLowerCase();
      }

      if (!hasHallOverlap) return false;

      // Time Overlap Check
      const bTime = getTimestamps(b.start, b.end);
      return movedTime.start < bTime.end && movedTime.end > bTime.start;
    });
  };

  const handleEventMoveOrResize = (info: any) => {
    const { oldEvent, event } = info;
    const oldBooking = events.find(e => 
      (e.id && oldEvent.id && e.id === oldEvent.id) || 
      (e.title === oldEvent.title && e.start === oldEvent.startStr.slice(0, 19))
    ) || { title: oldEvent.title, start: oldEvent.startStr, hall: oldEvent.extendedProps?.hall };

    const updatedBooking = {
      ...oldBooking,
      title: event.title,
      start: event.startStr.slice(0, 19),
      end: event.endStr ? event.endStr.slice(0, 19) : null,
      hall: event.extendedProps?.hall || oldBooking.hall
    };

    const conflict = findConflict(updatedBooking, oldBooking);

    if (conflict) {
      info.revert();
      setConflictAlert({
        movedBooking: updatedBooking,
        conflictingBooking: conflict,
        attemptedStart: event.startStr,
        attemptedEnd: event.endStr || event.startStr,
        hallName: updatedBooking.hall || conflict.hall || 'Specified Hall'
      });
      return;
    }

    const success = onUpdateBooking(oldBooking, updatedBooking);
    if (!success) {
      info.revert();
    }
  };

  const getEnergyEfficiencySuggestion = async () => {
    setIsAiLoading(true);
    setShowAiModal(true);
    try {
      // Get the upcoming events to analyze
      const upcomingEvents = events.filter(e => new Date(e.start) >= new Date()).slice(0, 10);
      
      const res = await fetch('/api/energy-efficiency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: upcomingEvents }),
      });
      
      if (!res.ok) throw new Error('Failed to fetch AI suggestions');
      
      const data = await res.json();
      setAiSuggestion(data);
    } catch (error) {
      console.error(error);
      setAiSuggestion({ error: "Failed to generate suggestions. Please try again later." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDayCellClassNames = (arg: any) => {
    if (viewMode !== 'capacity') return '';

    const d = arg.date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayEvents = events.filter(e => {
      if (!e.start || e.status === 'Cancelled') return false;
      return e.start.startsWith(dateStr);
    });

    if (dayEvents.length === 0) {
      return '!bg-emerald-50/15 hover:!bg-emerald-50/35 transition-colors cursor-pointer';
    }

    const totalPax = dayEvents.reduce((sum, e) => sum + (e.pax || 0), 0);
    const pct = (totalPax / maxDailyCapacity) * 100;

    if (pct >= premiumTriggerPct) {
      return '!bg-rose-100 hover:!bg-rose-200 transition-colors cursor-pointer';
    } else if (pct > 50) {
      return '!bg-amber-100 hover:!bg-amber-200/80 transition-colors cursor-pointer';
    } else if (pct > 30) {
      return '!bg-orange-100/60 hover:!bg-orange-100 transition-colors cursor-pointer';
    } else {
      return '!bg-emerald-100 hover:!bg-emerald-200/80 transition-colors cursor-pointer';
    }
  };

  const renderDayCellContent = (cellInfo: any) => {
    if (viewMode === 'events') {
      return <span>{cellInfo.dayNumberText}</span>;
    }

    const d = cellInfo.date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayEvents = events.filter(e => {
      if (!e.start || e.status === 'Cancelled') return false;
      return e.start.startsWith(dateStr);
    });
    const totalPax = dayEvents.reduce((sum, e) => sum + (e.pax || 0), 0);
    const capacityPercentage = (totalPax / maxDailyCapacity) * 100;
    
    let statusClass = 'bg-slate-100 text-slate-600 border border-slate-200';
    if (dayEvents.length > 0) {
      if (capacityPercentage >= premiumTriggerPct) {
        statusClass = 'bg-rose-500 text-white font-extrabold border border-rose-600 shadow-2xs';
      } else if (capacityPercentage > 50) {
        statusClass = 'bg-amber-500 text-amber-950 font-extrabold border border-amber-600 shadow-2xs';
      } else if (capacityPercentage > 30) {
        statusClass = 'bg-orange-400 text-orange-950 font-bold border border-orange-500';
      } else {
        statusClass = 'bg-emerald-500 text-white font-extrabold border border-emerald-600 shadow-2xs';
      }
    }

    return (
      <div className="w-full flex flex-col items-center py-1">
        <span className={`text-xs font-bold ${dayEvents.length > 0 && viewMode === 'capacity' ? 'text-slate-900 scale-105 font-black' : 'text-slate-500'}`}>
          {cellInfo.dayNumberText}
        </span>
        {viewMode === 'capacity' && (
          <div className={`mt-1.5 text-[9px] py-1 px-1.5 rounded-lg w-[92%] text-center truncate ${statusClass}`}>
            {dayEvents.length > 0 ? (
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold">{totalPax} Pax</span>
                <span className="text-[8px] opacity-90">({Math.round(capacityPercentage)}%)</span>
              </div>
            ) : (
              <span className="text-[8px] font-black uppercase opacity-70">VACANT</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={getEnergyEfficiencySuggestion}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Lightbulb size={16} /> AI Energy Optimizer
          </button>
          <button
            onClick={() => setShowColorSettings(true)}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Palette size={16} /> Color Labels
          </button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('events')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'events' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CalendarIcon size={14} /> Events
          </button>
          <button
            onClick={() => setViewMode('capacity')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'capacity' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={14} /> Capacity
          </button>
          <button
            onClick={() => setViewMode('resources')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'resources' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Package size={14} /> Resources
          </button>
        </div>
      </div>

      {/* Status Legend Bar */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 mb-3 flex-wrap">
        <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400 mr-1">Status Indicators:</span>
        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> ✓ Confirmed
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full text-[10px] border border-amber-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> ⏳ Provisional
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-purple-900 bg-purple-100/90 px-2 py-0.5 rounded-full text-[10px] border border-purple-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> ? Inquiry
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-full text-[10px] border border-rose-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> ✕ Cancelled
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full text-[10px] border border-blue-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> ✓ Completed
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-h-0 relative">
          {viewMode === 'resources' ? (
            <ResourceAssignmentTab events={events} onUpdateBooking={onUpdateBooking} />
          ) : (
            /* @ts-ignore */
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              nowIndicator={true}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
              }}
              events={viewMode === 'events' ? coloredEvents : []}
              height="100%"
              editable={true}
              selectable={true}
              eventDrop={handleEventMoveOrResize}
              eventResize={handleEventMoveOrResize}
              eventContent={(eventInfo) => {
                const isCheckedIn = eventInfo.event.extendedProps.checkedIn;
                const status = eventInfo.event.extendedProps.status || (isCheckedIn ? 'Completed' : 'Confirmed');

                const statusBadgeMap: Record<string, { bg: string, text: string, icon: string }> = {
                  'Confirmed': { bg: 'bg-emerald-600 text-white', text: 'Confirmed', icon: '✓' },
                  'Provisional': { bg: 'bg-amber-400 text-amber-950 font-black', text: 'Prov', icon: '⏳' },
                  'Inquiry': { bg: 'bg-purple-600 text-white', text: 'Inquiry', icon: '?' },
                  'Cancelled': { bg: 'bg-rose-600 text-white', text: 'Cancelled', icon: '✕' },
                  'Completed': { bg: 'bg-sky-600 text-white', text: 'Done', icon: '✓' }
                };

                const badge = statusBadgeMap[status] || statusBadgeMap['Confirmed'];
                const isCancelled = status === 'Cancelled';

                return (
                  <div className="flex items-center justify-between gap-1 overflow-hidden w-full px-1.5 py-0.5 text-xs">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      {isCheckedIn && (
                        <span className="bg-emerald-400 text-emerald-950 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-black flex-shrink-0" title="Checked In">✓</span>
                      )}
                      <span className={`truncate font-semibold ${isCancelled ? 'line-through opacity-80' : ''}`}>
                        {eventInfo.event.title}
                      </span>
                    </div>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase flex-shrink-0 shadow-sm flex items-center gap-0.5 border border-white/20 ${badge.bg}`}>
                      <span>{badge.icon}</span>
                      <span className="hidden sm:inline">{badge.text}</span>
                    </span>
                  </div>
                );
              }}
              eventClick={(info) => {
                const clickedEvent = events.find(e => e.title === info.event.title && e.start === info.event.startStr.slice(0, 19));
                if (clickedEvent) {
                  setSelectedEvent(clickedEvent);
                }
              }}
              dayCellContent={renderDayCellContent}
              dayCellClassNames={handleDayCellClassNames}
            />
          )}
        </div>

          {viewMode === 'capacity' && (
            <div className="w-full lg:w-80 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col overflow-y-auto shrink-0 max-h-full space-y-4 shadow-2xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Flame size={16} className="text-rose-500 animate-pulse" /> Heatmap Intelligence
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
                  Utilize color-intensity capacity thresholds to optimize scheduling, quote premiums, and target empty dates.
                </p>
              </div>

              {/* Threshold Sliders */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-3.5 shadow-3xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 pb-1.5">Capacity Settings</span>
                
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                    <span className="flex items-center gap-1"><Users size={12} className="text-slate-400" /> Max Daily Pax</span>
                    <span className="text-slate-800 font-mono">{maxDailyCapacity} Pax</span>
                  </div>
                  <input 
                    type="range"
                    min="200"
                    max="2000"
                    step="50"
                    value={maxDailyCapacity}
                    onChange={(e) => setMaxDailyCapacity(Number((e.target as HTMLInputElement).value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-850"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                    <span className="flex items-center gap-1"><Percent size={12} className="text-rose-400" /> Premium Peak Limit</span>
                    <span className="text-rose-700 font-mono">{premiumTriggerPct}%+</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={premiumTriggerPct}
                    onChange={(e) => setPremiumTriggerPct(Number((e.target as HTMLInputElement).value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-850"
                  />
                </div>
              </div>

              {/* Heatmap Color Legend */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 shadow-3xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 pb-1.5">Intensity Scale</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-5 h-5 rounded-md border border-emerald-200/40 bg-emerald-50/15 flex shrink-0"></span>
                    <span className="text-slate-600 flex-1 text-[11px]">0% (Vacant - High Sales Push)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-5 h-5 rounded-md border border-emerald-300 bg-emerald-100 flex shrink-0"></span>
                    <span className="text-slate-600 flex-1 text-[11px]">1% - 30% (Low Occupancy)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-5 h-5 rounded-md border border-orange-300 bg-orange-100 flex shrink-0"></span>
                    <span className="text-slate-600 flex-1 text-[11px]">31% - 50% (Moderate Occupancy)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-5 h-5 rounded-md border border-amber-300 bg-amber-100 flex shrink-0"></span>
                    <span className="text-slate-600 flex-1 text-[11px]">51% - {premiumTriggerPct-1}% (High Occupancy)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-5 h-5 rounded-md border border-rose-300 bg-rose-100 flex shrink-0"></span>
                    <span className="text-slate-600 flex-1 text-[11px]">{premiumTriggerPct}%+ (Fully Booked - Peak Rates)</span>
                  </div>
                </div>
              </div>

              {/* Sales Hot Deals / Opportunities (Vacant Weekends) */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5 shadow-3xs flex-1 min-h-[160px] flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1 border-b border-slate-100 pb-1.5 shrink-0 font-extrabold">
                  <Sparkles size={11} className="text-emerald-500 shrink-0" /> Target Hot Deals (0% Booked)
                </span>
                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                  {vacantWeekends.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-4">No empty weekends in the next 60 days.</p>
                  ) : (
                    vacantWeekends.map((slot) => (
                      <div key={slot.date} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-700 truncate">{new Date(slot.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[9px] text-slate-400 font-bold block leading-none">{slot.dayName}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedPitch(slot);
                            setCopiedPitch(false);
                          }}
                          className="text-[9.5px] font-extrabold text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded transition-colors shrink-0 cursor-pointer"
                        >
                          Pitch Idea
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Premium Upgrades (High Occupancy Dates) */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5 shadow-3xs shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-extrabold">
                  <TrendingUp size={11} className="text-rose-500 shrink-0" /> Quote Peak Premium ({premiumTriggerPct}%+)
                </span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                  {highOccupancyDates.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-2">No dates exceed peak trigger threshold.</p>
                  ) : (
                    highOccupancyDates.map((item) => (
                      <div key={item.date} className="flex items-center justify-between p-2 rounded bg-rose-50/50 border border-rose-100 text-[11px]">
                        <div>
                          <span className="font-bold text-slate-800">{new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[9px] text-rose-600 font-bold block">{item.pax} Pax Booked</span>
                        </div>
                        <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                          +{Math.round(item.pct)}% Load
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
      </div>

      {selectedEvent && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
            <div className="bg-slate-800 p-4 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <QrCode size={18} /> Booking Check-In
              </h3>
              <button onClick={() => setSelectedEvent(null)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center relative">
              {selectedEvent.checkedIn && (
                <div className="absolute top-4 right-4 bg-green-100 border border-green-200 text-green-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  ✓ Checked In
                </div>
              )}
              <div id="booking-qr-code" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 mt-4">
                <QRCodeSVG 
                  value={JSON.stringify({ 
                    id: selectedEvent.id || Math.random().toString(36).substr(2, 9), 
                    title: selectedEvent.title,
                    date: selectedEvent.start,
                    hall: selectedEvent.hall
                  })} 
                  size={200} 
                  level="H" 
                  includeMargin={true}
                />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1 text-center">{selectedEvent.title}</h4>
              <p className="text-sm text-slate-500 mb-2">Hall: <span className="font-semibold text-slate-700">{selectedEvent.hall || 'Unassigned'}</span></p>
              <div className="flex gap-4 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-lg w-full justify-center border border-slate-100 mb-4">
                <span>Pax: {selectedEvent.pax || 'N/A'}</span>
                <span>•</span>
                <span>{new Date(selectedEvent.start).toLocaleDateString()}</span>
              </div>

              {/* Status Update Control */}
              <div className="w-full mb-5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Update Booking Status</label>
                <select 
                  value={selectedEvent.status || (selectedEvent.checkedIn ? 'Completed' : 'Confirmed')}
                  onChange={(e: any) => {
                    const newStatus = e.target.value;
                    const updated = { ...selectedEvent, status: newStatus };
                    setSelectedEvent(updated);
                    onUpdateBooking(selectedEvent, updated);
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="Confirmed">✓ Confirmed</option>
                  <option value="Provisional">⏳ Provisional</option>
                  <option value="Inquiry">? Inquiry</option>
                  <option value="Completed">✓ Completed</option>
                  <option value="Cancelled">✕ Cancelled</option>
                </select>
              </div>

              {/* Status Timeline */}
              <div className="w-full mb-8 mt-2 px-2">
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute left-4 right-4 top-2 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
                  
                  <div className="flex items-start justify-between relative z-10">
                    {['Inquiry', 'Confirmed', 'Deposited', 'Completed'].map((status, index) => {
                      const currentStatus = selectedEvent.status || (selectedEvent.checkedIn ? 'Completed' : 'Confirmed');
                      const statuses = ['Inquiry', 'Confirmed', 'Deposited', 'Completed'];
                      const currentIndex = statuses.indexOf(currentStatus) >= 0 ? statuses.indexOf(currentStatus) : 1;
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      
                      return (
                        <div key={status} className="flex flex-col items-center gap-2 w-16">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors bg-white ${
                            isCompleted 
                              ? 'border-blue-600 bg-blue-600' 
                              : 'border-slate-300'
                          }`}>
                            {isCompleted && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider text-center ${
                            isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                          }`}>
                            {status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">Scan this code at the entrance to verify the booking and check-in attendees.</p>
              
              <button 
                onClick={handlePrint}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-lg text-sm font-bold transition-colors shadow-md"
              >
                <Printer size={16} /> Print Confirmation Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {showAiModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Lightbulb size={18} /> AI Energy Efficiency Plan
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[70vh]">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Loader2 size={32} className="animate-spin mb-4 text-indigo-500" />
                  <p>Analyzing upcoming events and calculating optimal HVAC/Lighting zones...</p>
                </div>
              ) : aiSuggestion?.error ? (
                <div className="text-red-500 bg-red-50 p-4 rounded-lg text-sm border border-red-100">
                  {aiSuggestion.error}
                </div>
              ) : aiSuggestion ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Hall Recommendations</h4>
                    <div className="space-y-3">
                      {aiSuggestion.recommendations?.map((rec: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                          <h5 className="font-bold text-slate-800 text-sm mb-1">{rec.hall}</h5>
                          <p className="text-slate-600 text-sm leading-relaxed">{rec.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {aiSuggestion.estimatedSavings && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3">
                      <div className="text-green-600 font-bold text-xl mt-1">🌱</div>
                      <div>
                        <h4 className="text-sm font-bold text-green-800 mb-1">Estimated Impact</h4>
                        <p className="text-green-700 text-sm">{aiSuggestion.estimatedSavings}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showColorSettings && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
            <div className="bg-slate-800 p-4 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Palette size={18} /> Color Labels
              </h3>
              <button onClick={() => setShowColorSettings(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">{type}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={color as string} 
                      onChange={(e: any) => setTypeColors({ ...typeColors, [type]: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowColorSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME CONFLICT WARNING MODAL */}
      {conflictAlert && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col border border-red-200 animate-in zoom-in-95 duration-150">
            {/* Warning Header */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <AlertTriangle size={22} className="text-amber-200 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight leading-tight">Booking Conflict Alert!</h3>
                  <p className="text-[11px] text-red-100 font-medium">Schedule Double-Booking Protection Warning</p>
                </div>
              </div>
              <button 
                onClick={() => setConflictAlert(null)} 
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Alert Description Box */}
              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Slot Occupied:</span> Cannot reschedule{' '}
                  <strong className="text-red-950 font-extrabold">{conflictAlert.movedBooking.title}</strong> to the slot in{' '}
                  <strong className="text-red-950 font-extrabold">{conflictAlert.hallName}</strong> because it overlaps with an existing reservation!
                </div>
              </div>

              {/* Attempted Slot Info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" /> Attempted Move Location & Time
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{conflictAlert.movedBooking.title}</span>
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    {conflictAlert.hallName}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  Requested Slot: {new Date(conflictAlert.attemptedStart).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>

              {/* Conflicting Booking Highlight Box with Direct Link */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-red-50/60 p-4 rounded-xl border-2 border-amber-300 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Building size={14} className="text-amber-600" /> Conflicting Booking Details
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    conflictAlert.conflictingBooking.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {conflictAlert.conflictingBooking.status || 'Confirmed'}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {conflictAlert.conflictingBooking.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="bg-white/90 p-2 rounded-lg border border-amber-200/80">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Hall / Venue</span>
                      <span className="font-bold text-slate-800">{conflictAlert.conflictingBooking.hall || conflictAlert.hallName}</span>
                    </div>
                    <div className="bg-white/90 p-2 rounded-lg border border-amber-200/80">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Guaranteed Pax</span>
                      <span className="font-bold text-slate-800">{conflictAlert.conflictingBooking.pax || 'N/A'} Guests</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-white/90 p-2 rounded-lg border border-amber-200/80 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Reserved Time Window</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {new Date(conflictAlert.conflictingBooking.start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      {conflictAlert.conflictingBooking.end && ` - ${new Date(conflictAlert.conflictingBooking.end).toLocaleTimeString([], { timeStyle: 'short' })}`}
                    </span>
                  </div>
                </div>

                {/* Direct Link Button */}
                <button
                  type="button"
                  onClick={() => {
                    const targetBooking = conflictAlert.conflictingBooking;
                    setConflictAlert(null);
                    setSelectedEvent(targetBooking);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ExternalLink size={14} className="group-hover:scale-110 transition-transform text-amber-400" />
                  View & Inspect Conflicting Booking Details
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* AUTOMATED CONFLICT RESOLUTION CENTRE */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Sparkles size={16} className="text-blue-600 font-bold" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    ⚡ Automated Conflict Resolution Options
                  </span>
                </div>

                {/* OPTION 1: Alternative Halls (Relocate Current Booking) */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Option A: Shift your booking to another free hall at the same time
                  </div>
                  {conflictResolutionOptions?.availableAlternativeHalls && conflictResolutionOptions.availableAlternativeHalls.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {conflictResolutionOptions.availableAlternativeHalls.map(hall => {
                        const isUpgrade = hall === 'Crystal Ballroom';
                        return (
                          <div key={hall} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                              <Building2 size={13} className="text-slate-400" />
                              {hall}
                              {isUpgrade && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-amber-300">
                                  ⭐ Premium Upgrade
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRelocateMovedBooking(hall)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] px-2.5 py-1.5 rounded-md border border-blue-200 transition-colors cursor-pointer"
                            >
                              Relocate to This Hall
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic pl-1">No other halls are free during this time window.</div>
                  )}
                </div>

                {/* OPTION 2: Relocate Conflicting Booking (Free-Up original slot) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Option B: Free up original slot by moving the conflicting event
                  </div>
                  {conflictResolutionOptions?.vacantHallsForConflicting && conflictResolutionOptions.vacantHallsForConflicting.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {conflictResolutionOptions.vacantHallsForConflicting.map(hall => (
                        <div key={hall} className="bg-amber-50/40 p-3 rounded-lg border border-amber-200 space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-slate-800">
                                Move <span className="font-bold text-amber-950">{conflictAlert.conflictingBooking.title}</span>
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Shift it to <span className="font-semibold text-slate-700">{hall}</span> (which is completely vacant at the same time)
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRelocateConflictingBooking(hall)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Shuffle size={12} />
                            Move Conflicting Booking & Claim Original Slot
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic pl-1">Conflicting booking cannot be moved to any other hall (all alternative halls are occupied during this time).</div>
                  )}
                </div>

                {/* OPTION 3: Suggest Alternative Times (Reschedule Current Booking) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Option C: Reschedule your booking to a vacant slot in this hall
                  </div>
                  {conflictResolutionOptions?.alternativeSlots && conflictResolutionOptions.alternativeSlots.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {conflictResolutionOptions.alternativeSlots.map(slot => {
                        const slotDate = new Date(slot.start);
                        return (
                          <div key={slot.label} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">{slot.label}</span>
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                                {slotDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} @ {slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRescheduleMovedBooking(slot.start, slot.end)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] px-2.5 py-1.5 rounded-md border border-slate-300 transition-colors cursor-pointer"
                            >
                              Reschedule to This Slot
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic pl-1">No other vacant slots found on surrounding days.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setConflictAlert(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Dismiss Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMPAIGN PITCH MODAL */}
      {selectedPitch && (
        <div className="absolute inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-emerald-100 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-800 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400 font-extrabold animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight leading-none">Weekend Hot Deal Pitch</h3>
                  <p className="text-[10px] text-slate-300 font-semibold mt-1">High-Converting Sales Outreach Copy</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPitch(null)} 
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800">
                <p className="font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Vacancy Date Targeted: {new Date(selectedPitch.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ({selectedPitch.dayName})
                </p>
                <p className="mt-1 opacity-90 leading-relaxed">
                  Weekend banquet slots are highly valuable. Send this tailored deal pitch to inquiries, wedding portals, or mailing lists to book this specific date!
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Message Template</span>
                <div className="relative">
                  <textarea
                    readOnly
                    rows={6}
                    value={`Dear Customer,

Are you planning a grand celebration or wedding soon? We have a rare weekend opening on *${new Date(selectedPitch.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}* at Grand Horizon Banquets!

Book this specific date this week to unlock an exclusive *15% discount on venue rental* and a *complimentary premium LED Uplighting & Decors package upgrade*.

Perfect for gatherings of 150-1000 guests. Let's make your special day magnificent! Reply directly to this message to receive our gourmet menu packages & arrange a VIP site tour.

Warm regards,
Banquet Sales Team`}
                    className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Dear Customer,

Are you planning a grand celebration or wedding soon? We have a rare weekend opening on ${new Date(selectedPitch.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at Grand Horizon Banquets!

Book this specific date this week to unlock an exclusive 15% discount on venue rental and a complimentary premium LED Uplighting & Decors package upgrade.

Perfect for gatherings of 150-1000 guests. Let's make your special day magnificent! Reply directly to this message to receive our gourmet menu packages & arrange a VIP site tour.

Warm regards,
Banquet Sales Team`);
                      setCopiedPitch(true);
                      setTimeout(() => setCopiedPitch(false), 2000);
                    }}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    {copiedPitch ? (
                      <>
                        <Check size={12} className="text-emerald-400 font-extrabold animate-in fade-in" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy text
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedPitch(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
