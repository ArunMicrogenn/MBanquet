import React, { useState } from 'react';
import { Mail, Plus, Edit2, Trash2 } from 'lucide-react';

export const initialTemplates = [
  { id: 1, name: 'Booking Confirmation', subject: 'Your Booking Confirmation - {hall}', body: 'Dear {customer},\n\nYour booking for {event} on {date} at {hall} is confirmed.\n\nBest regards,\nManagement' },
  { id: 2, name: 'Invoice', subject: 'Invoice for your event', body: 'Dear {customer},\n\nPlease find the invoice attached for your event on {date}.\n\nBest regards,\nManagement' },
  { id: 3, name: 'Staff Notification', subject: 'New Booking Alert: {event}', body: 'Hello Team,\n\nA new booking has been confirmed.\n\nCustomer: {customer}\nEvent: {event}\nDate: {date}\nHall: {hall}\nPax: {pax}\n\nPlease prepare accordingly.\n\n- Automated System' },
];

export default function EmailTemplates() {
  const [templates, setTemplates] = useState(initialTemplates);

  return (
    <div className="h-full w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Email Templates</h3>
        <button className="flex items-center gap-1 text-blue-600 text-sm font-bold">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800">{template.name}</h4>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-blue-500">
                  <Edit2 size={16} />
                </button>
                <button className="text-slate-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-mono mb-2">Subject: {template.subject}</p>
            <div className="bg-white p-2 rounded text-xs text-slate-700 whitespace-pre-line border border-slate-200 h-24 overflow-auto">
              {template.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
