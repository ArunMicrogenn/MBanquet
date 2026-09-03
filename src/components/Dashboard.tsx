import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';

import RevenueChart from './RevenueChart';
import RecentActivities from './RecentActivities';
import BookingForecastChart from './BookingForecastChart';
import TaskBoard from './TaskBoard';

function SortableWidget({ id, children, className }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${className}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-700 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur rounded shadow-sm border border-slate-200"
      >
        <GripHorizontal size={16} />
      </div>
      {children}
    </div>
  );
}

export default function Dashboard({ 
  setFilter, 
  dateRange, 
  selectedProperty, 
  filter, 
  handleBulkImport 
}: any) {
  const defaultItems = [
    'stat-occupancy',
    'stat-revenue',
    'stat-inquiries',
    'stat-dues',
    'chart-revenue',
    'recent-activities',
    'chart-forecast',
    'task-board',
    'import-csv'
  ];

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('dashboard-layout');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultItems;
      }
    }
    return defaultItems;
  });

  useEffect(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(items));
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items: any) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'stat-occupancy':
        return (
          <SortableWidget id={id} className="col-span-1 row-span-1 bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs text-left hover:border-amber-400 hover:shadow-xs transition-all">
            <button onClick={() => setFilter(null)} className="w-full h-full text-left flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Today's Occupancy</div>
                <div className="text-2xl font-black text-slate-900 mt-1">84.2%</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-extrabold uppercase mt-2">
                <span className="px-1.5 py-0.2 bg-emerald-100 rounded-full text-emerald-800">↑ 4.2%</span> vs Last Week
              </div>
            </button>
          </SortableWidget>
        );
      case 'stat-revenue':
        return (
          <SortableWidget id={id} className="col-span-1 row-span-1 bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs text-left hover:border-amber-400 hover:shadow-xs transition-all">
            <button onClick={() => setFilter('payment')} className="w-full h-full text-left flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Monthly Revenue</div>
                <div className="text-2xl font-black text-slate-900 mt-1">₹42,85,200</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-extrabold uppercase mt-2">
                <span className="px-1.5 py-0.2 bg-amber-100 rounded-full text-amber-800">• Target</span> ₹50,00,000
              </div>
            </button>
          </SortableWidget>
        );
      case 'stat-inquiries':
        return (
          <SortableWidget id={id} className="col-span-1 row-span-1 bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs text-left hover:border-amber-400 hover:shadow-xs transition-all">
            <button onClick={() => setFilter('booking')} className="w-full h-full text-left flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pending Inquiries</div>
                <div className="text-2xl font-black text-slate-900 mt-1">18</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-extrabold uppercase mt-2">
                <span className="px-1.5 py-0.2 bg-amber-100 rounded-full text-amber-800">! 6 Urgent</span> Follow-ups
              </div>
            </button>
          </SortableWidget>
        );
      case 'stat-dues':
        return (
          <SortableWidget id={id} className="col-span-1 row-span-1 bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs text-left hover:border-amber-400 hover:shadow-xs transition-all">
            <button onClick={() => setFilter('payment')} className="w-full h-full text-left flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Outstanding Dues</div>
                <div className="text-2xl font-black text-slate-900 mt-1">₹8,12,000</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-rose-700 font-extrabold uppercase mt-2">
                <span className="px-1.5 py-0.2 bg-rose-100 rounded-full text-rose-800">↓ Overdue</span> ₹2.4L
              </div>
            </button>
          </SortableWidget>
        );
      case 'chart-revenue':
        return (
          <SortableWidget id={id} className="col-span-4 lg:col-span-3 row-span-2 flex h-full min-h-[300px]">
            <RevenueChart dateRange={dateRange} property={selectedProperty} />
          </SortableWidget>
        );
      case 'recent-activities':
        return (
          <SortableWidget id={id} className="col-span-4 lg:col-span-1 row-span-2 flex h-full min-h-[300px]">
            <RecentActivities dateRange={dateRange} property={selectedProperty} filter={filter} />
          </SortableWidget>
        );
      case 'chart-forecast':
        return (
          <SortableWidget id={id} className="col-span-4 lg:col-span-2 row-span-2 flex h-full min-h-[300px]">
            <BookingForecastChart />
          </SortableWidget>
        );
      case 'task-board':
        return (
          <SortableWidget id={id} className="col-span-4 lg:col-span-2 row-span-2 flex h-full min-h-[300px]">
            <TaskBoard />
          </SortableWidget>
        );
      case 'import-csv':
        return (
          <SortableWidget id={id} className="col-span-4 lg:col-span-1 row-span-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center items-center shadow-sm">
            <label className="text-sm font-bold text-slate-800 mb-2 cursor-pointer bg-slate-100 px-4 py-2 rounded hover:bg-slate-200">
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleBulkImport} />
            </label>
            <div className="text-[10px] text-slate-500">Upload CSV template</div>
          </SortableWidget>
        );
      default:
        return null;
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-4 grid-auto-rows gap-2 auto-rows-max h-full p-2">
          {items.map(id => (
            <React.Fragment key={id}>
              {renderWidget(id)}
            </React.Fragment>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
