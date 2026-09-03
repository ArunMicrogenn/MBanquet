import React from 'react';

const auditLogs = [
  { id: 1, action: 'Updated Crystal Ballroom capacity', user: 'Admin', timestamp: '2026-08-27 09:00 AM' },
  { id: 2, action: 'Created new Session: Night (11PM-3AM)', user: 'Manager', timestamp: '2026-08-27 10:30 AM' },
  { id: 3, action: 'Changed Tax rate for GST', user: 'Admin', timestamp: '2026-08-27 11:15 AM' },
  { id: 4, action: 'Updated Ruby Suite status to Maintenance', user: 'Staff', timestamp: '2026-08-27 01:00 PM' },
];

export default function AuditTrail() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Audit Trail Log</h2>
      <div className="overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800">{log.action}</td>
                <td className="px-4 py-3 text-slate-600">{log.user}</td>
                <td className="px-4 py-3 text-slate-500">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
