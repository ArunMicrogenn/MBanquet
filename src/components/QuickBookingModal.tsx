import { useState, FormEvent, useMemo } from 'react';
import { X, Sparkles, Loader2, Mic, Calendar, Repeat, Check } from 'lucide-react';
import { mockFoodPlans } from './MenuManagement';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBookingAdd: (booking: any) => boolean;
}

const DAYS_OF_WEEK = [
  { label: 'S', full: 'Sun', value: 0 },
  { label: 'M', full: 'Mon', value: 1 },
  { label: 'T', full: 'Tue', value: 2 },
  { label: 'W', full: 'Wed', value: 3 },
  { label: 'T', full: 'Thu', value: 4 },
  { label: 'F', full: 'Fri', value: 5 },
  { label: 'S', full: 'Sat', value: 6 },
];

export default function QuickBookingModal({ isOpen, onClose, onBookingAdd }: Props) {
  const [customerName, setCustomerName] = useState('');
  const [halls, setHalls] = useState<string[]>(['Crystal Ballroom']);
  const [eventType, setEventType] = useState('Wedding');
  const [status, setStatus] = useState<'Confirmed' | 'Provisional' | 'Inquiry' | 'Cancelled'>('Confirmed');
  const [pax, setPax] = useState(50);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Recurrence Pattern State
  const [recurrence, setRecurrence] = useState<'None' | 'Daily' | 'Weekly' | 'Monthly'>('None');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([1]); // Default Monday
  const [monthlyPattern, setMonthlyPattern] = useState<'same_day' | 'nth_weekday'>('same_day');
  const [endType, setEndType] = useState<'occurrences' | 'until_date'>('occurrences');
  const [recurrenceCount, setRecurrenceCount] = useState(4);
  const [untilDate, setUntilDate] = useState('');
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionReason, setSuggestionReason] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Separate Advance Payment Entry States
  const [advancePaidAmount, setAdvancePaidAmount] = useState<number>(0);
  const [advancePaymentMode, setAdvancePaymentMode] = useState<string>('Cash / UPI');
  const [advanceTxnRef, setAdvanceTxnRef] = useState<string>('');
  const [advanceReceiptNo, setAdvanceReceiptNo] = useState<string>('');

  // Compute generated dates preview
  const generatedSchedule = useMemo(() => {
    const startBase = startDate ? new Date(startDate + 'T10:00:00') : new Date('2026-08-27T10:00:00');
    const endBase = endDate ? new Date(endDate + 'T14:00:00') : new Date('2026-08-27T14:00:00');
    const durationMs = endBase.getTime() - startBase.getTime();

    if (recurrence === 'None') {
      return [{
        start: startBase,
        end: endBase,
        formattedDate: startBase.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      }];
    }

    const maxCount = endType === 'occurrences' ? Math.min(Math.max(1, recurrenceCount), 52) : 52;
    const untilMs = endType === 'until_date' && untilDate ? new Date(untilDate + 'T23:59:59').getTime() : Infinity;

    const schedule: { start: Date; end: Date; formattedDate: string }[] = [];

    if (recurrence === 'Daily') {
      let current = new Date(startBase);
      while (schedule.length < maxCount && current.getTime() <= untilMs) {
        const s = new Date(current);
        const e = new Date(current.getTime() + durationMs);
        schedule.push({
          start: s,
          end: e,
          formattedDate: s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
        current.setDate(current.getDate() + recurrenceInterval);
      }
    } else if (recurrence === 'Weekly') {
      let currentWeekStart = new Date(startBase);
      // Align to start of week (Sunday)
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

      let daysToUse = selectedDaysOfWeek.length > 0 ? [...selectedDaysOfWeek].sort((a,b) => a-b) : [startBase.getDay()];

      let weekOffset = 0;
      let iterations = 0;
      while (schedule.length < maxCount && iterations < 200) {
        iterations++;
        for (const dayOfWeek of daysToUse) {
          const candidate = new Date(currentWeekStart);
          candidate.setDate(candidate.getDate() + (weekOffset * 7) + dayOfWeek);
          candidate.setHours(startBase.getHours(), startBase.getMinutes(), 0, 0);

          if (candidate >= startBase && candidate.getTime() <= untilMs && schedule.length < maxCount) {
            const e = new Date(candidate.getTime() + durationMs);
            schedule.push({
              start: candidate,
              end: e,
              formattedDate: candidate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            });
          }
        }
        weekOffset += recurrenceInterval;
      }
    } else if (recurrence === 'Monthly') {
      let currentMonth = new Date(startBase);
      let monthIndex = 0;
      while (schedule.length < maxCount && monthIndex < 60) {
        const candidate = new Date(startBase);
        candidate.setMonth(startBase.getMonth() + (monthIndex * recurrenceInterval));

        if (monthlyPattern === 'nth_weekday') {
          // Calculate nth weekday of month
          const origDayOfWeek = startBase.getDay();
          const nthWeek = Math.ceil(startBase.getDate() / 7);
          
          candidate.setDate(1);
          let countOfWeekday = 0;
          while (candidate.getMonth() === (startBase.getMonth() + monthIndex * recurrenceInterval) % 12) {
            if (candidate.getDay() === origDayOfWeek) {
              countOfWeekday++;
              if (countOfWeekday === nthWeek) break;
            }
            candidate.setDate(candidate.getDate() + 1);
          }
        }

        candidate.setHours(startBase.getHours(), startBase.getMinutes(), 0, 0);

        if (candidate >= startBase && candidate.getTime() <= untilMs && schedule.length < maxCount) {
          const e = new Date(candidate.getTime() + durationMs);
          schedule.push({
            start: candidate,
            end: e,
            formattedDate: candidate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          });
        }
        monthIndex++;
      }
    }

    return schedule;
  }, [startDate, endDate, recurrence, recurrenceInterval, selectedDaysOfWeek, monthlyPattern, endType, recurrenceCount, untilDate]);

  if (!isOpen) return null;

  const toggleDayOfWeek = (dayVal: number) => {
    setSelectedDaysOfWeek(prev => 
      prev.includes(dayVal) 
        ? (prev.length > 1 ? prev.filter(d => d !== dayVal) : prev) 
        : [...prev, dayVal]
    );
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try using Chrome.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      await parseVoiceTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const parseVoiceTranscript = async (transcript: string) => {
    setIsParsing(true);
    try {
      const res = await fetch('/api/parse-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      
      if (data.customerName) setCustomerName(data.customerName);
      if (data.eventType) setEventType(data.eventType);
      if (data.pax) setPax(Number(data.pax));
      if (data.halls && Array.isArray(data.halls) && data.halls.length > 0) setHalls(data.halls);
      if (data.startDate) setStartDate(data.startDate);
      if (data.endDate) setEndDate(data.endDate);
      
    } catch (err) {
      console.error(err);
      alert("Failed to parse voice input.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSuggestHall = async () => {
    setIsSuggesting(true);
    setSuggestionReason('');
    try {
      const res = await fetch('/api/suggest-hall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pax, eventType })
      });
      const data = await res.json();
      if (data.recommendedHall) {
        setHalls([data.recommendedHall]);
        setSuggestionReason(data.reason);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleHallToggle = (hallName: string) => {
    setHalls(prev => 
      prev.includes(hallName) 
        ? prev.filter(h => h !== hallName) 
        : [...prev, hallName]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (halls.length === 0) {
      alert("Please select at least one hall.");
      return;
    }

    const initialAdvances = [];
    if (advancePaidAmount > 0) {
      initialAdvances.push({
        id: 'adv-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000),
        date: new Date().toISOString().slice(0, 10),
        amount: advancePaidAmount,
        paymentMode: advancePaymentMode,
        txnRef: advanceTxnRef || '',
        receiptNo: advanceReceiptNo || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        receivedBy: 'Manager Rajan',
        status: 'Realized' as const,
        remarks: 'Initial deposit paid on registration'
      });
    }
    
    const bookingsToAdd = generatedSchedule.map((item, i) => ({
      id: 'B-' + Math.floor(1000 + Math.random() * 9000) + '-' + i,
      title: `${customerName || 'New Booking'} - ${eventType}${recurrence !== 'None' ? ` (${i+1}/${generatedSchedule.length})` : ''}`,
      customerName: customerName || 'New Booking',
      eventType,
      start: item.start.toISOString().slice(0, 16),
      end: item.end.toISOString().slice(0, 16),
      halls,
      hall: halls.join(', '),
      pax,
      status,
      advance: advancePaidAmount,
      advancePayMode: advancePaymentMode,
      advances: initialAdvances,
      recurrencePattern: recurrence !== 'None' ? `${recurrence} (${recurrenceInterval})` : undefined
    }));

    onBookingAdd(bookingsToAdd);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">New Booking & Recurrence</h2>
            <button 
              type="button"
              onClick={startVoiceInput}
              className={`p-1.5 rounded-full transition-colors flex items-center gap-1 text-[10px] font-bold ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : isParsing ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title="Voice Input"
            >
              {isParsing ? <Loader2 size={12} className="animate-spin" /> : <Mic size={12} />}
              {isRecording ? 'Listening...' : isParsing ? 'Parsing...' : 'Voice'}
            </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Customer / Organization Name</label>
            <input type="text" placeholder="e.g. Acme Corp / John Doe" value={customerName} onChange={(e: any) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Event Type</label>
              <select value={eventType} onChange={(e: any) => setEventType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Corporate Meeting</option>
                <option>Conference</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Seminar / Training</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Booking Status</label>
              <select value={status} onChange={(e: any) => setStatus(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800">
                <option value="Confirmed">✓ Confirmed</option>
                <option value="Provisional">⏳ Provisional</option>
                <option value="Inquiry">? Inquiry</option>
                <option value="Cancelled">✕ Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">No. of Pax</label>
              <input type="number" min="1" value={pax} onChange={(e: any) => setPax(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-blue-800 uppercase mb-2">Hall Assignment (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {['Crystal Ballroom', 'Ruby Suite', 'Garden Lawn'].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHallToggle(h)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        halls.includes(h) 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleSuggestHall} 
                disabled={isSuggesting}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 h-[34px]"
              >
                {isSuggesting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Auto-Suggest
              </button>
            </div>
            {suggestionReason && (
              <p className="text-xs text-blue-700 mt-2 flex items-start gap-1">
                <Sparkles size={12} className="mt-0.5 flex-shrink-0" /> 
                {suggestionReason}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Start Date</label>
              <input type="date" value={startDate} onChange={(e: any) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">End Date</label>
              <input type="date" value={endDate} onChange={(e: any) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* RECURRENCE PATTERN SELECTOR SECTION */}
          <div className="border border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <Repeat size={14} className="text-indigo-600" /> Recurrence Pattern
              </label>
              {recurrence !== 'None' && (
                <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                  {recurrence} Event
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Repeat Frequency</label>
                <select 
                  value={recurrence} 
                  onChange={(e: any) => setRecurrence(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 bg-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="None">Does not repeat (One-time)</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly (e.g. Corporate meetings)</option>
                  <option value="Monthly">Monthly (e.g. Board meetings)</option>
                </select>
              </div>

              {recurrence !== 'None' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Repeat Every</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="number" 
                      min="1" 
                      max="12" 
                      value={recurrenceInterval} 
                      onChange={(e: any) => setRecurrenceInterval(Math.max(1, parseInt(e.target.value) || 1))} 
                      className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-bold"
                    />
                    <span className="text-xs font-medium text-slate-600">
                      {recurrence === 'Daily' ? 'day(s)' : recurrence === 'Weekly' ? 'week(s)' : 'month(s)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Weekly Days Selector */}
            {recurrence === 'Weekly' && (
              <div className="pt-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Repeat On Days</label>
                <div className="flex gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDaysOfWeek.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDayOfWeek(day.value)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                        }`}
                        title={day.full}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly Pattern Selector */}
            {recurrence === 'Monthly' && (
              <div className="pt-1 space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Monthly Repeat Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMonthlyPattern('same_day')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                      monthlyPattern === 'same_day' 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    Same day of month
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthlyPattern('nth_weekday')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                      monthlyPattern === 'nth_weekday' 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    Same week & day
                  </button>
                </div>
              </div>
            )}

            {/* End Condition Options */}
            {recurrence !== 'None' && (
              <div className="pt-2 border-t border-indigo-100/80 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Ends</label>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="end-occurrences" 
                      name="endType" 
                      checked={endType === 'occurrences'} 
                      onChange={() => setEndType('occurrences')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="end-occurrences" className="text-xs font-medium text-slate-700">After</label>
                    <input 
                      type="number" 
                      min="2" 
                      max="52" 
                      disabled={endType !== 'occurrences'}
                      value={recurrenceCount} 
                      onChange={(e: any) => setRecurrenceCount(parseInt(e.target.value) || 2)} 
                      className={`w-16 px-2 py-1 border rounded text-xs font-bold ${endType === 'occurrences' ? 'bg-white border-slate-300' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
                    />
                    <span className="text-xs text-slate-500">events</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="end-until" 
                      name="endType" 
                      checked={endType === 'until_date'} 
                      onChange={() => setEndType('until_date')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="end-until" className="text-xs font-medium text-slate-700">On date</label>
                    <input 
                      type="date" 
                      disabled={endType !== 'until_date'}
                      value={untilDate} 
                      onChange={(e: any) => setUntilDate(e.target.value)} 
                      className={`flex-1 px-2 py-1 border rounded text-xs ${endType === 'until_date' ? 'bg-white border-slate-300' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Live Generated Schedule Summary Box */}
            {recurrence !== 'None' && generatedSchedule.length > 0 && (
              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm mt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                    <Calendar size={13} className="text-indigo-600" />
                    Generated Schedule ({generatedSchedule.length} session{generatedSchedule.length > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {generatedSchedule.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                      <Check size={10} className="text-indigo-500" />
                      {item.formattedDate}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Seating Type</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Boardroom / Conference</option>
                <option>Theater</option>
                <option>Classroom</option>
                <option>U-Shape</option>
                <option>Banquet</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Session</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Full Day (9AM-5PM)</option>
                <option>Morning (8AM-12PM)</option>
                <option>Afternoon (1PM-5PM)</option>
                <option>Evening (6PM-10PM)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Food Plan</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none">
                {mockFoodPlans.map(plan => (
                  <option key={plan.id}>{plan.name} (₹{plan.price})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Advance Paid (₹)</label>
              <input 
                type="number" 
                min="0" 
                value={advancePaidAmount || ''} 
                onChange={(e) => setAdvancePaidAmount(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Payment Mode</label>
              <select 
                value={advancePaymentMode} 
                onChange={(e) => setAdvancePaymentMode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
              >
                <option value="Cash / UPI">Cash / UPI</option>
                <option value="UPI / QR Code">UPI / QR Code</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Corporate Invoice">Corporate Invoice</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Receipt / Voucher No.</label>
              <input 
                type="text" 
                placeholder="e.g. REC-5521" 
                value={advanceReceiptNo} 
                onChange={(e) => setAdvanceReceiptNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          {advancePaidAmount > 0 && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Transaction ID / Reference No.</label>
              <input 
                type="text" 
                placeholder="e.g. UPI-99882211" 
                value={advanceTxnRef} 
                onChange={(e) => setAdvanceTxnRef(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs" 
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold mt-4 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Confirm {generatedSchedule.length > 1 ? `${generatedSchedule.length} Recurring Bookings` : 'Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

