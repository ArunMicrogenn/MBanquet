import { useState, FormEvent, useMemo } from 'react';
import { X, Sparkles, Loader2, Mic, Calendar, Repeat, Check } from 'lucide-react';
import { mockFoodPlans } from './MenuManagement';
import { DateClosure } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBookingAdd: (booking: any) => boolean;
  dateClosures?: DateClosure[];
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

export default function QuickBookingModal({ isOpen, onClose, onBookingAdd, dateClosures = [] }: Props) {
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
  const [lastTranscript, setLastTranscript] = useState('');
  const [voiceTextPrompt, setVoiceTextPrompt] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [voiceSuccessFields, setVoiceSuccessFields] = useState<string[]>([]);

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

  const dateClosureConflict = useMemo(() => {
    if (!startDate || halls.length === 0) return null;

    for (const session of generatedSchedule) {
      const sessionDateStr = session.start.toISOString().slice(0, 10);
      const sessionDate = new Date(sessionDateStr);
      sessionDate.setHours(12, 0, 0, 0);

      for (const closure of dateClosures) {
        const closureStart = new Date(closure.date);
        const closureEnd = new Date(closure.endDate || closure.date);
        closureStart.setHours(0, 0, 0, 0);
        closureEnd.setHours(23, 59, 59, 999);

        if (sessionDate >= closureStart && sessionDate <= closureEnd) {
          if (closure.hallId === 'all' || halls.includes(closure.hallId)) {
            return {
              sessionDate: session.formattedDate,
              reason: closure.reason,
              hallName: closure.hallId === 'all' ? 'Entire Property (All Halls)' : closure.hallId
            };
          }
        }
      }
    }
    return null;
  }, [startDate, halls, generatedSchedule, dateClosures]);

  if (!isOpen) return null;

  const toggleDayOfWeek = (dayVal: number) => {
    setSelectedDaysOfWeek(prev => 
      prev.includes(dayVal) 
        ? (prev.length > 1 ? prev.filter(d => d !== dayVal) : prev) 
        : [...prev, dayVal]
    );
  };

  const startVoiceInput = () => {
    setVoiceError('');
    setVoiceSuccessFields([]);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Speech recognition is not supported in this browser. Try Chrome.");
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
      setLastTranscript(transcript);
      await parseVoiceTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      setVoiceError(`Microphone error: ${event.error}. Ensure microphone access is permitted.`);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (err: any) {
      setVoiceError(err.message || "Failed to start microphone.");
    }
  };

  const parseVoiceTranscript = async (transcript: string) => {
    setIsParsing(true);
    setVoiceError('');
    setVoiceSuccessFields([]);
    try {
      const res = await fetch('/api/parse-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      
      const fields: string[] = [];
      if (data.customerName) {
        setCustomerName(data.customerName);
        fields.push(`Customer: ${data.customerName}`);
      }
      if (data.eventType) {
        setEventType(data.eventType);
        fields.push(`Event: ${data.eventType}`);
      }
      if (data.pax) {
        setPax(Number(data.pax));
        fields.push(`Guests: ${data.pax}`);
      }
      if (data.halls && Array.isArray(data.halls) && data.halls.length > 0) {
        setHalls(data.halls);
        fields.push(`Hall(s): ${data.halls.join(', ')}`);
      }
      if (data.startDate) {
        setStartDate(data.startDate);
        fields.push(`Start: ${data.startDate}`);
      }
      if (data.endDate) {
        setEndDate(data.endDate);
        fields.push(`End: ${data.endDate}`);
      }
      
      setVoiceSuccessFields(fields);
    } catch (err) {
      console.error(err);
      setVoiceError("Failed to parse details. Please try again with clear speech or a typing prompt.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleTextPromptSubmit = async (e: any) => {
    e.preventDefault();
    if (!voiceTextPrompt.trim()) return;
    setLastTranscript(voiceTextPrompt);
    await parseVoiceTranscript(voiceTextPrompt);
    setVoiceTextPrompt('');
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
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={18} />
          </button>
        </div>

        {/* VOICE & NATURAL LANGUAGE AI ASSISTANT CENTRE */}
        <div className="mb-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          {/* Audio Wave Animations Keyframes */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes voiceWave {
              0%, 100% { height: 6px; }
              50% { height: 22px; }
            }
            .animate-wave-1 { animation: voiceWave 0.7s ease-in-out infinite; }
            .animate-wave-2 { animation: voiceWave 0.7s ease-in-out infinite 0.12s; }
            .animate-wave-3 { animation: voiceWave 0.7s ease-in-out infinite 0.24s; }
            .animate-wave-4 { animation: voiceWave 0.7s ease-in-out infinite 0.36s; }
            .animate-wave-5 { animation: voiceWave 0.7s ease-in-out infinite 0.48s; }
          `}} />

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white shadow-md relative shrink-0">
              {isRecording ? (
                <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-60"></span>
              ) : null}
              <Mic size={16} className={isRecording ? 'text-red-100' : ''} />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                AI Voice Booking Assistant
                <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest scale-95 origin-left">
                  Gemini-3.8
                </span>
              </h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                Hold/click mic to dictate details, or type natural sentences below. AI will intelligently extract and auto-fill the whole booking.
              </p>
            </div>
          </div>

          {/* Assistant Interactive Area */}
          <div className="mt-3.5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startVoiceInput}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' 
                    : isParsing 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
                }`}
              >
                {isRecording ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span>Listening... Click to stop</span>
                  </>
                ) : isParsing ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-blue-600" />
                    <span>Gemini is parsing...</span>
                  </>
                ) : (
                  <>
                    <Mic size={13} className="text-indigo-600" />
                    <span>Tap to Speak Booking</span>
                  </>
                )}
              </button>

              {/* Animated wave showing only when listening */}
              {isRecording && (
                <div className="flex items-center gap-1 bg-white border border-red-200 rounded-xl px-2.5 h-[34px]">
                  <div className="w-1 bg-red-500 rounded-full animate-wave-1"></div>
                  <div className="w-1 bg-orange-500 rounded-full animate-wave-2"></div>
                  <div className="w-1 bg-amber-500 rounded-full animate-wave-3"></div>
                  <div className="w-1 bg-yellow-500 rounded-full animate-wave-4"></div>
                  <div className="w-1 bg-red-400 rounded-full animate-wave-5"></div>
                </div>
              )}
            </div>

            {/* Alternating Text Prompt Input */}
            <form onSubmit={handleTextPromptSubmit} className="flex gap-1.5">
              <input
                type="text"
                placeholder="e.g. Booking for John Doe, 120 pax, Ruby Suite on Sept 15"
                value={voiceTextPrompt}
                onChange={(e: any) => setVoiceTextPrompt(e.target.value)}
                disabled={isParsing || isRecording}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
              />
              <button
                type="submit"
                disabled={isParsing || isRecording || !voiceTextPrompt.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Analyze
              </button>
            </form>
          </div>

          {/* Transcribed text feedback bubble */}
          {lastTranscript && (
            <div className="mt-2.5 bg-white/80 rounded-xl p-2.5 border border-slate-100 text-[11px] font-medium text-slate-600 italic flex items-start gap-1.5 leading-relaxed">
              <span className="text-slate-400 shrink-0 font-bold">Speech:</span>
              <span>"{lastTranscript}"</span>
            </div>
          )}

          {/* Voice success list */}
          {voiceSuccessFields.length > 0 && (
            <div className="mt-2.5 space-y-1">
              <div className="text-[9px] font-extrabold text-indigo-900 uppercase tracking-wider">
                ✓ Auto-Populated Booking Fields
              </div>
              <div className="flex flex-wrap gap-1">
                {voiceSuccessFields.map((field, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {voiceError && (
            <div className="mt-2.5 bg-red-50 text-red-800 rounded-xl p-2.5 border border-red-200 text-xs leading-relaxed font-semibold">
              ⚠️ {voiceError}
            </div>
          )}

          {/* Voice Prompt Presets */}
          <div className="mt-3 border-t border-indigo-100/60 pt-2.5">
            <span className="text-[9px] font-extrabold text-indigo-900 uppercase tracking-widest block mb-1.5">
              💡 Try speaking or clicking a demo preset:
            </span>
            <div className="flex flex-col gap-1">
              {[
                "Book Crystal Ballroom for Ramesh Wedding with 400 pax on September 12 to 14",
                "Corporate Conference for TechCorp in Ruby Suite on September 20, 120 guests"
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLastTranscript(p);
                    parseVoiceTranscript(p);
                  }}
                  className="w-full text-left text-[10px] text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-100/40 bg-white transition-all truncate"
                >
                  👉 "{p}"
                </button>
              ))}
            </div>
          </div>
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
                onChange={(e: any) => setAdvancePaidAmount(parseFloat(e.target.value) || 0)}
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
                onChange={(e: any) => setAdvancePaymentMode(e.target.value)}
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
                onChange={(e: any) => setAdvanceReceiptNo(e.target.value)}
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
                onChange={(e: any) => setAdvanceTxnRef(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs" 
              />
            </div>
          )}

          {dateClosureConflict && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex flex-col gap-1 mt-4">
              <div className="font-extrabold flex items-center gap-1.5 text-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                DATE CLOSED/BLOCKED
              </div>
              <div>
                The date <span className="font-bold">{dateClosureConflict.sessionDate}</span> is marked as <span className="font-bold uppercase">Closed</span> for <span className="font-bold">{dateClosureConflict.hallName}</span>.
              </div>
              <div className="text-red-600 italic">
                Reason: "{dateClosureConflict.reason}"
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!!dateClosureConflict}
            className={`w-full py-2.5 rounded-lg text-sm font-bold mt-4 transition-colors shadow-sm flex items-center justify-center gap-2 ${dateClosureConflict ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            Confirm {generatedSchedule.length > 1 ? `${generatedSchedule.length} Recurring Bookings` : 'Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

