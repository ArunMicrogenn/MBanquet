import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Maximize, Save, Users, Calendar } from 'lucide-react';

interface Table {
  id: string;
  type: 'round' | 'rect' | 'square';
  pax: number;
  x: number;
  y: number;
}

interface Props {
  seatingTypes: string[];
  bookings: any[];
}

export default function VenueMapping({ seatingTypes, bookings }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [targetPax, setTargetPax] = useState<number>(100);
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [selectedSeatingType, setSelectedSeatingType] = useState<string>(seatingTypes[0] || '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBooking) {
      const booking = bookings.find(b => b.id === selectedBooking);
      if (booking && booking.pax) {
        setTargetPax(booking.pax);
      }
    }
  }, [selectedBooking, bookings]);

  const addTable = (type: 'round' | 'rect' | 'square', pax: number) => {
    const newTable: Table = {
      id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      pax,
      x: 0,
      y: 0,
    };
    setTables([...tables, newTable]);
  };

  const removeTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
  };

  const clearLayout = () => {
    setTables([]);
  };

  const currentPax = tables.reduce((sum, table) => sum + table.pax, 0);
  const paxPercentage = Math.min((currentPax / (targetPax || 1)) * 100, 100);

  return (
    <div className="h-full w-full bg-slate-50 flex overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col z-10">
        <div className="p-4 border-b border-slate-100 bg-slate-800 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Maximize size={18} className="text-blue-400" />
            Venue Mapping
          </h2>
          <p className="text-xs text-slate-400 mt-1">Design layouts based on seating masters.</p>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          <div className="mb-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2 flex items-center gap-1"><Calendar size={12}/> Link Booking</label>
              <select 
                value={selectedBooking} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedBooking(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              >
                <option value="">-- Select Booking --</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({new Date(b.start).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2 flex items-center gap-1"><Users size={12}/> Seating Type (Master)</label>
              <select 
                value={selectedSeatingType} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSeatingType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              >
                {seatingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Target Pax</label>
              <input 
                type="number" 
                min="1" 
                value={targetPax} 
                onChange={(e: any) => setTargetPax(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Capacity</span>
              <span className={`text-lg font-black ${currentPax >= targetPax ? 'text-green-600' : 'text-blue-600'}`}>
                {currentPax} <span className="text-sm text-slate-400 font-bold">/ {targetPax}</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-1 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${currentPax >= targetPax ? 'bg-green-500' : 'bg-blue-500'}`} 
                style={{ width: `${paxPercentage}%` }}
              ></div>
            </div>
            {currentPax >= targetPax && (
              <p className="text-[10px] text-green-600 font-bold mt-1 text-right">Target Reached!</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Add Tables</label>
            <button 
              onClick={() => addTable('round', 8)}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500">8</div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-700">Round Table</div>
                  <div className="text-xs text-slate-500">8 Pax</div>
                </div>
              </div>
              <Plus size={16} className="text-slate-400 group-hover:text-blue-500" />
            </button>

            <button 
              onClick={() => addTable('rect', 6)}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500">6</div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-700">Rectangular</div>
                  <div className="text-xs text-slate-500">6 Pax</div>
                </div>
              </div>
              <Plus size={16} className="text-slate-400 group-hover:text-blue-500" />
            </button>

            <button 
              onClick={() => addTable('square', 4)}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500">4</div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-700">Square Table</div>
                  <div className="text-xs text-slate-500">4 Pax</div>
                </div>
              </div>
              <Plus size={16} className="text-slate-400 group-hover:text-blue-500" />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={clearLayout}
            className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Clear Layout
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6 relative overflow-hidden bg-slate-100">
        <div 
          ref={containerRef}
          className="w-full h-full bg-white rounded-xl shadow-inner border-2 border-dashed border-slate-300 relative overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
          {tables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-400 font-medium bg-white px-4 py-2 rounded-full shadow-sm">
                Drag and drop tables here from the sidebar
              </p>
            </div>
          )}

          {tables.map(table => (
            <motion.div
              key={table.id}
              drag
              dragMomentum={false}
              dragConstraints={containerRef}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing flex items-center justify-center shadow-md bg-white border-2 hover:border-blue-500 group
                ${table.type === 'round' ? 'w-20 h-20 rounded-full border-slate-400' : 
                  table.type === 'rect' ? 'w-24 h-14 rounded-sm border-slate-400' : 
                  'w-16 h-16 rounded-sm border-slate-400'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            >
              <span className="text-sm font-bold text-slate-700 pointer-events-none">{table.pax}</span>
              <button 
                onClick={() => removeTable(table.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove Table"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
