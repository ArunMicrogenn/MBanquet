import React, { useState } from 'react';
import MasterSection from './MasterSection';

export default function FoodPlanMasters() {
  const [foodPlans, setFoodPlans] = useState(['Royal Grand Buffet', 'Executive Corporate Buffet', 'Curated 3-Course Fixed Menu', 'High Tea & Hors d\'oeuvres']);

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Food Plan Masters</h2>
      <MasterSection title="Food Plans" items={foodPlans} setItems={setFoodPlans} />
    </div>
  );
}
