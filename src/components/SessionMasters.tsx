import { useState } from 'react';
import MasterSection from './MasterSection';

export default function SessionMasters() {
  const [sessions, setSessions] = useState(['Morning (8AM-12PM)', 'Afternoon (1PM-5PM)', 'Evening (6PM-10PM)']);
  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Session Masters</h2>
      <MasterSection title="Sessions" items={sessions} setItems={setSessions} />
    </div>
  );
}
