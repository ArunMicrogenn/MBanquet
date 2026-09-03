import React from 'react';
import MasterSection from './MasterSection';

interface Props {
  seatingTypes: string[];
  setSeatingTypes: (types: string[]) => void;
}

export default function SeatingTypeMasters({ seatingTypes, setSeatingTypes }: Props) {
  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Seating Type Masters</h2>
      <MasterSection title="Seating Types" items={seatingTypes} setItems={setSeatingTypes} />
    </div>
  );
}
