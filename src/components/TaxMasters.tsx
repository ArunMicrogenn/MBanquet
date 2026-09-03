import { useState } from 'react';
import MasterSection from './MasterSection';

export default function TaxMasters() {
  const [taxes, setTaxes] = useState(['GST (18%)']);
  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Tax Setup Masters</h2>
      <MasterSection title="Tax Setup" items={taxes} setItems={setTaxes} />
    </div>
  );
}
