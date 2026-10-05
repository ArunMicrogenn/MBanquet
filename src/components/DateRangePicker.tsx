import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CalendarDays, 
  ChevronRight, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onGenerateAudit?: () => void;
  disabled?: boolean;
}

export default function DateRangePicker({
  value,
  onChange,
  onGenerateAudit,
  disabled = false,
}: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<string>('today');

  // Format today as YYYY-MM-DD
  const getTodayStr = () => new Date().toISOString().slice(0, 10);

  const getDaysAgoStr = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  };

  const getStartOfMonthStr = () => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  };

  const getStartOfWeekStr = () => {
    const d = new Date();
    const day = d.getDay(); // 0 is Sunday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  };

  // Calculate day count
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays(value.startDate, value.endDate);

  const handlePresetSelect = (preset: string) => {
    setActivePreset(preset);
    const today = getTodayStr();

    let newRange: DateRange = { startDate: today, endDate: today };

    switch (preset) {
      case 'today':
        newRange = { startDate: today, endDate: today };
        break;
      case 'yesterday': {
        const yesterday = getDaysAgoStr(1);
        newRange = { startDate: yesterday, endDate: yesterday };
        break;
      }
      case 'last7':
        newRange = { startDate: getDaysAgoStr(6), endDate: today };
        break;
      case 'thisWeek':
        newRange = { startDate: getStartOfWeekStr(), endDate: today };
        break;
      case 'thisMonth':
        newRange = { startDate: getStartOfMonthStr(), endDate: today };
        break;
      case 'last30':
        newRange = { startDate: getDaysAgoStr(29), endDate: today };
        break;
      default:
        break;
    }

    onChange(newRange);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setActivePreset('custom');
    if (newStart > value.endDate) {
      onChange({ startDate: newStart, endDate: newStart });
    } else {
      onChange({ ...value, startDate: newStart });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setActivePreset('custom');
    if (newEnd < value.startDate) {
      onChange({ startDate: newEnd, endDate: newEnd });
    } else {
      onChange({ ...value, endDate: newEnd });
    }
  };

  const presets = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last7', label: 'Last 7 Days' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'thisMonth', label: 'This Month (MTD)' },
    { id: 'last30', label: 'Last 30 Days' },
  ];

  return (
    <div className="w-full">
      {/* Print-only period banner */}
      <div className="hidden print:block mb-2 text-xs font-bold text-slate-800 border-b border-slate-200 pb-1">
        <span>Audit Period: </span>
        <span className="font-extrabold text-slate-900">{value.startDate}</span>
        {value.startDate !== value.endDate && (
          <span> to <span className="font-extrabold text-slate-900">{value.endDate}</span></span>
        )}
        <span className="text-slate-500 font-medium"> ({daysCount} {daysCount === 1 ? 'day' : 'days'})</span>
      </div>

      {/* Interactive Picker Container */}
      <div className="print-hide bg-slate-50/70 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
        {/* Top bar with presets */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
            <CalendarDays size={15} className="text-indigo-600" />
            <span>Audit Date Range</span>
            <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700">
              {daysCount} {daysCount === 1 ? 'Day' : 'Days Selected'}
            </span>
          </div>

          {/* Presets buttons */}
          <div className="flex flex-wrap items-center gap-1">
            {presets.map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetSelect(p.id)}
                  disabled={disabled}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Inputs & Summary Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/60">
          <div className="flex flex-wrap items-center gap-2">
            {/* Start Date */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-3xs focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From:</span>
              <input
                type="date"
                value={value.startDate}
                onChange={handleStartDateChange}
                disabled={disabled}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            <ArrowRight size={14} className="text-slate-400 shrink-0 hidden sm:block" />

            {/* End Date */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-3xs focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To:</span>
              <input
                type="date"
                value={value.endDate}
                min={value.startDate}
                onChange={handleEndDateChange}
                disabled={disabled}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Quick Info & Action button if provided */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[11px] font-semibold text-slate-500">
              {value.startDate === value.endDate ? (
                <>Single Day: <strong className="text-slate-800">{value.startDate}</strong></>
              ) : (
                <>Period: <strong className="text-slate-800">{value.startDate}</strong> → <strong className="text-slate-800">{value.endDate}</strong></>
              )}
            </span>

            {onGenerateAudit && (
              <button
                type="button"
                onClick={onGenerateAudit}
                disabled={disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={13} />
                Generate Audit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
