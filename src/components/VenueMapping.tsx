import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Maximize, Save, Users, Calendar, Copy, RotateCcw, Sparkles, Check, Info, FileText } from 'lucide-react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Table {
  id: string;
  type: 'round' | 'rect' | 'square';
  pax: number;
  x: number;
  y: number;
}

interface MasterTemplate {
  id: string;
  name: string;
  seatingType: string;
  targetPax: number;
  tables: Table[];
  createdAt: string;
}

interface Props {
  seatingTypes: string[];
  bookings: any[];
}

export default function VenueMapping({ seatingTypes, bookings }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [targetPax, setTargetPax] = useState<number>(100);
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [selectedSeatingType, setSelectedSeatingType] = useState<string>(seatingTypes[0] || 'Banquet');
  const [masterTemplates, setMasterTemplates] = useState<MasterTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss status messages after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Load Master Layout Templates from Firestore & localStorage fallback
  const loadTemplates = async () => {
    try {
      const snap = await getDocs(collection(db, 'venue_layout_templates'));
      const list: MasterTemplate[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as MasterTemplate);
      });
      
      // Merge with localStorage templates to be fully safe
      const local = localStorage.getItem('venue_layout_templates');
      const localList: MasterTemplate[] = local ? JSON.parse(local) : [];
      
      const mergedMap = new Map<string, MasterTemplate>();
      localList.forEach(t => mergedMap.set(t.id, t));
      list.forEach(t => mergedMap.set(t.id, t));
      
      const finalTemplates = Array.from(mergedMap.values());
      setMasterTemplates(finalTemplates);
      localStorage.setItem('venue_layout_templates', JSON.stringify(finalTemplates));
    } catch (error) {
      console.warn("Firestore template load failed, reading from localStorage fallback:", error);
      const local = localStorage.getItem('venue_layout_templates');
      if (local) {
        setMasterTemplates(JSON.parse(local));
      }
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // On selecting a Booking, try to load its specific saved layout
  useEffect(() => {
    if (selectedBooking) {
      const booking = bookings.find(b => b.id === selectedBooking);
      if (booking) {
        if (booking.pax) setTargetPax(booking.pax);
        
        // Check if custom layout is saved for this booking
        const fetchBookingLayout = async () => {
          try {
            const docSnap = await getDoc(doc(db, 'booking_layouts', selectedBooking));
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.tables) setTables(data.tables);
              if (data.seatingType) setSelectedSeatingType(data.seatingType);
              setStatusMessage({ text: `Loaded custom layout for booking "${booking.title}"`, type: 'info' });
              return;
            }
          } catch (err) {
            console.warn("Firestore booking layout fetch failed, checking localStorage fallback");
          }

          // Fallback to localStorage
          const localLayout = localStorage.getItem(`venue_layout_booking_${selectedBooking}`);
          if (localLayout) {
            const parsed = JSON.parse(localLayout);
            if (parsed.tables) setTables(parsed.tables);
            if (parsed.seatingType) setSelectedSeatingType(parsed.seatingType);
            setStatusMessage({ text: `Loaded local layout for booking "${booking.title}"`, type: 'info' });
          } else {
            // Default to blank or a structured clean canvas
            setTables([]);
          }
        };

        fetchBookingLayout();
      }
    } else {
      setTables([]);
    }
  }, [selectedBooking, bookings]);

  // Handle Drag End securely mapping table's position relative to canvas
  const handleDragEnd = (id: string, event: any, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Relative coordinates
    const x = Math.max(20, Math.min(rect.width - 20, info.point.x - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, info.point.y - rect.top));
    
    setTables(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  };

  // Add standard sized tables staggered cleanly
  const addTable = (type: 'round' | 'rect' | 'square', pax: number) => {
    const count = tables.length;
    const row = Math.floor(count / 4);
    const col = count % 4;
    
    // Staggered layout start coords
    const x = 70 + col * 140;
    const y = 70 + row * 120;

    const newTable: Table = {
      id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      pax,
      x,
      y,
    };
    setTables([...tables, newTable]);
  };

  const removeTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
  };

  const clearLayout = () => {
    setTables([]);
    setStatusMessage({ text: "Canvas cleared", type: 'info' });
  };

  // Save the custom designed layout to the selected booking
  const saveBookingLayout = async () => {
    if (!selectedBooking) {
      setStatusMessage({ text: "Please select a booking to link and save this layout.", type: 'error' });
      return;
    }
    
    setIsSaving(true);
    const layoutData = {
      bookingId: selectedBooking,
      seatingType: selectedSeatingType,
      targetPax,
      tables,
      updatedAt: new Date().toISOString()
    };

    try {
      // Persist to Cloud Firestore
      await setDoc(doc(db, 'booking_layouts', selectedBooking), layoutData);
      // Persist to localStorage
      localStorage.setItem(`venue_layout_booking_${selectedBooking}`, JSON.stringify(layoutData));
      
      setStatusMessage({ text: "Success! Booking layout saved and synced to the cloud.", type: 'success' });
    } catch (error) {
      console.warn("Firestore sync failed, saving to localStorage only:", error);
      localStorage.setItem(`venue_layout_booking_${selectedBooking}`, JSON.stringify(layoutData));
      setStatusMessage({ text: "Saved layout locally (offline fallback mode active).", type: 'success' });
    } finally {
      setIsSaving(false);
    }
  };

  // Save current design as a new Master Template
  const saveAsMasterTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) {
      setStatusMessage({ text: "Please enter a valid template name.", type: 'error' });
      return;
    }
    if (tables.length === 0) {
      setStatusMessage({ text: "Cannot save an empty layout as a template.", type: 'error' });
      return;
    }

    setIsSavingTemplate(true);
    const templateId = `tpl-${Date.now()}`;
    const newTemplate: MasterTemplate = {
      id: templateId,
      name: newTemplateName.trim(),
      seatingType: selectedSeatingType,
      targetPax,
      tables,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'venue_layout_templates', templateId), newTemplate);
      
      const updatedList = [newTemplate, ...masterTemplates];
      setMasterTemplates(updatedList);
      localStorage.setItem('venue_layout_templates', JSON.stringify(updatedList));
      
      setNewTemplateName('');
      setStatusMessage({ text: `Master layout template "${newTemplate.name}" created!`, type: 'success' });
    } catch (error) {
      console.warn("Firestore template creation failed, saving locally:", error);
      const updatedList = [newTemplate, ...masterTemplates];
      setMasterTemplates(updatedList);
      localStorage.setItem('venue_layout_templates', JSON.stringify(updatedList));
      setNewTemplateName('');
      setStatusMessage({ text: `Created local template "${newTemplate.name}" (Offline).`, type: 'success' });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Load a Master Template configuration onto the current canvas
  const applyMasterTemplate = (template: MasterTemplate) => {
    setTables(template.tables);
    setSelectedSeatingType(template.seatingType);
    setTargetPax(template.targetPax);
    setStatusMessage({ text: `Loaded template: "${template.name}"`, type: 'success' });
  };

  // Delete a Master Template
  const deleteMasterTemplate = async (templateId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" layout template?`)) return;
    
    try {
      await deleteDoc(doc(db, 'venue_layout_templates', templateId));
    } catch (error) {
      console.warn("Firestore template deletion failed, applying local delete:", error);
    }

    const updated = masterTemplates.filter(t => t.id !== templateId);
    setMasterTemplates(updated);
    localStorage.setItem('venue_layout_templates', JSON.stringify(updated));
    setStatusMessage({ text: `Template "${name}" deleted.`, type: 'info' });
  };

  const currentPax = tables.reduce((sum, table) => sum + table.pax, 0);
  const paxPercentage = Math.min((currentPax / (targetPax || 1)) * 100, 100);

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Toast Alert Feed */}
      {statusMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-xs font-bold shadow-lg border flex items-center gap-2 animate-fade-in ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          statusMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
          'bg-indigo-50 text-indigo-800 border-indigo-200'
        }`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col shrink-0 z-10 h-auto md:h-full overflow-y-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Maximize size={16} />
              Layout Master Builder
            </h2>
            <span className="bg-slate-800 text-[9px] text-slate-300 font-bold px-2 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Design and map layout templates with precise seat counting.</p>
        </div>
        
        {/* Navigation & Control Panels */}
        <div className="p-4 space-y-5 flex-1">
          
          {/* Linked Booking Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={12} className="text-indigo-600" /> 
              Link to Booking
            </label>
            <select 
              value={selectedBooking} 
              onChange={(e: any) => setSelectedBooking(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-800 cursor-pointer"
            >
              <option value="">-- Workspace Sandbox --</option>
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} ({new Date(b.start).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Seating Type Setup */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Users size={12} className="text-indigo-600" /> 
              Seating Setup (Master)
            </label>
            <select 
              value={selectedSeatingType} 
              onChange={(e: any) => setSelectedSeatingType(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-800 cursor-pointer"
            >
              {seatingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Target Capacity Form */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Target Capacity (Pax)
            </label>
            <input 
              type="number" 
              min="1" 
              value={targetPax} 
              onChange={(e: any) => setTargetPax(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 outline-none" 
            />
          </div>

          {/* Live Pax Progress Card */}
          <div className="bg-slate-55 border border-slate-200/60 rounded-2xl p-3.5 shadow-xs">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Pax Efficiency</span>
              <span className={`text-base font-black ${currentPax >= targetPax ? 'text-emerald-600' : 'text-indigo-600'}`}>
                {currentPax} <span className="text-xs text-slate-400 font-bold">/ {targetPax}</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-1.5 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${currentPax >= targetPax ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                style={{ width: `${paxPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="text-slate-400">Tables Placed: {tables.length}</span>
              {currentPax >= targetPax ? (
                <span className="text-emerald-600 flex items-center gap-0.5">✓ Target Fully Met</span>
              ) : (
                <span className="text-indigo-600">Need {targetPax - currentPax} more seats</span>
              )}
            </div>
          </div>

          {/* Add Interactive Table Builders */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-indigo-950 uppercase tracking-widest mb-1">
              Add Tables to Canvas
            </label>
            
            <button 
              onClick={() => addTable('round', 8)}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-extrabold text-slate-600">
                  8
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-800">Round Banquet Table</div>
                  <div className="text-[9px] font-semibold text-slate-400">Stander: 8 Guests</div>
                </div>
              </div>
              <Plus size={14} className="text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button 
              onClick={() => addTable('rect', 6)}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-6 border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-extrabold text-slate-600 rounded-sm">
                  6
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-800">Rectangular Long Table</div>
                  <div className="text-[9px] font-semibold text-slate-400">Stander: 6 Guests</div>
                </div>
              </div>
              <Plus size={14} className="text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button 
              onClick={() => addTable('square', 4)}
              className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-extrabold text-slate-600 rounded-sm">
                  4
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-800">Square Dining Table</div>
                  <div className="text-[9px] font-semibold text-slate-400">Stander: 4 Guests</div>
                </div>
              </div>
              <Plus size={14} className="text-slate-400 group-hover:text-indigo-600" />
            </button>
          </div>

          {/* Master Template Presets List */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <label className="block text-[10px] font-extrabold text-indigo-950 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              Saved Layout Masters
            </label>
            
            {masterTemplates.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No master templates saved yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {masterTemplates.map(tpl => (
                  <div key={tpl.id} className="flex items-center justify-between bg-slate-50 border border-slate-200/50 hover:border-indigo-200 rounded-xl p-2 transition-all">
                    <button
                      type="button"
                      onClick={() => applyMasterTemplate(tpl)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="text-[11px] font-bold text-slate-800 truncate">{tpl.name}</div>
                      <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <span>{tpl.seatingType}</span>
                        <span>•</span>
                        <span>{tpl.tables.length} tables ({tpl.targetPax} Pax)</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMasterTemplate(tpl.id, tpl.name)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Delete Preset"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Layout Template Preset */}
          <form onSubmit={saveAsMasterTemplate} className="border-t border-slate-100 pt-3 space-y-1.5">
            <label className="block text-[10px] font-extrabold text-indigo-950 uppercase tracking-widest">
              Save current as template
            </label>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="e.g. Wedding 200 Setup"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={isSavingTemplate || tables.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                {isSavingTemplate ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>

        </div>
        
        {/* Dynamic Action Persistence Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2 shrink-0 bg-slate-50">
          <button 
            type="button"
            onClick={saveBookingLayout}
            disabled={isSaving || !selectedBooking}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer border border-indigo-500/20"
          >
            <Save size={13} />
            <span>{isSaving ? 'Syncing Layout...' : 'Save Layout to Booking'}</span>
          </button>
          
          <button 
            type="button"
            onClick={clearLayout}
            className="w-full py-1.5 bg-white text-slate-500 border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} /> 
            <span>Reset Canvas</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4 md:p-6 relative flex flex-col min-w-0 h-full">
        
        {/* Status bar inside canvas */}
        <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Mode: {selectedBooking ? `Booking customiser` : `Template Designer`}
            </span>
            {selectedBooking && (
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-full">
                Linked booking: {bookings.find(b => b.id === selectedBooking)?.title}
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <Info size={11} /> Draggable grid active. Outer border is layout perimeter.
          </div>
        </div>

        {/* The Grid Canvas Grid */}
        <div 
          ref={containerRef}
          className="flex-1 bg-white rounded-2xl shadow-inner border-2 border-dashed border-slate-200 relative overflow-hidden h-full min-h-[400px]"
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}
        >
          {tables.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-xs mb-3 text-slate-400">
                <FileText size={28} />
              </div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Workspace Empty</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed font-semibold">
                Click table buttons on the sidebar to add layouts, or load a master preset template to begin mapping.
              </p>
            </div>
          )}

          {/* Draggable Tables */}
          {tables.map(table => {
            const isRound = table.type === 'round';
            const isRect = table.type === 'rect';
            return (
              <motion.div
                key={table.id}
                drag
                dragMomentum={false}
                dragConstraints={containerRef}
                onDragEnd={(event, info) => handleDragEnd(table.id, event, info)}
                style={{
                  x: table.x,
                  y: table.y,
                  position: 'absolute',
                  left: 0,
                  top: 0
                }}
                className="cursor-grab active:cursor-grabbing group z-20"
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 50 }}
              >
                {/* Visual table component */}
                <div className={`relative flex flex-col items-center justify-center shadow-md bg-white border-2 border-slate-400/80 hover:border-indigo-600 transition-colors
                  ${isRound ? 'w-20 h-20 rounded-full' : 
                    isRect ? 'w-24 h-14 rounded-lg' : 
                    'w-16 h-16 rounded-lg'
                  }
                `}>
                  {/* Miniature Table chairs dots for aesthetics */}
                  {isRound && (
                    <div className="absolute inset-1 rounded-full border border-dashed border-slate-200 pointer-events-none flex items-center justify-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Round</span>
                    </div>
                  )}

                  <span className="text-xs font-black text-slate-700 select-none z-10">{table.pax} Pax</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase select-none">Table</span>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeTable(table.id)}
                    className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md z-30 cursor-pointer"
                    title="Remove Table"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Header/Summary Stats Bar at bottom */}
        <div className="mt-3 bg-white border border-slate-200/60 rounded-xl p-3 flex justify-between items-center text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <span>Layout Seating: <span className="font-extrabold text-indigo-700">{selectedSeatingType}</span></span>
            <span>•</span>
            <span>Total Tables Placed: <span className="font-extrabold text-slate-800">{tables.length}</span></span>
          </div>
          <div>
            <span>Total Layout Pax Capacity: <span className="font-extrabold text-emerald-600">{currentPax} Guests</span></span>
          </div>
        </div>

      </div>
    </div>
  );
}
