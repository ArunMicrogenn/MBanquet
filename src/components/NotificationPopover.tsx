import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

const notifications = [
  { id: 1, text: 'Payment due: Crystal Ballroom (Aug 29)', type: 'warning' },
  { id: 2, text: 'Expiring booking: Ruby Suite (Aug 30)', type: 'alert' },
  { id: 3, text: 'Low inventory: Floral Decor (Remaining: 5)', type: 'info' },
];

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 relative"
      >
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
          <div className="flex justify-between items-center p-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <div className="py-2">
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-2 hover:bg-slate-50 text-sm flex items-start gap-3">
                <div className={`w-2 h-2 mt-1.5 rounded-full ${n.type === 'warning' ? 'bg-yellow-500' : n.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <p className="text-slate-700">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
