import { useState } from 'react';
import MasterSection from './MasterSection';

export default function FunctionTypeMasters() {
  const [functionTypes, setFunctionTypes] = useState(['Wedding', 'Conference', 'Meeting']);
  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Function Type Masters</h2>
      <MasterSection title="Function Types" items={functionTypes} setItems={setFunctionTypes} />
    </div>
  );
}
