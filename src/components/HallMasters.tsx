import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  total: number;
  inUse: number;
}

interface Hall {
  id: string;
  name: string;
  inventory: InventoryItem[];
}

export default function HallMasters() {
  const [halls, setHalls] = useState<Hall[]>([
    { id: '1', name: 'Crystal Ballroom', inventory: [{ id: 'i1', name: 'Chairs', total: 500, inUse: 100 }, { id: 'i2', name: 'Tables', total: 50, inUse: 10 }] },
    { id: '2', name: 'Ruby Suite', inventory: [{ id: 'i3', name: 'AV Screen', total: 2, inUse: 1 }] },
  ]);
  const [selectedHallId, setSelectedHallId] = useState<string>(halls[0]?.id || '');

  const selectedHall = halls.find(h => h.id === selectedHallId);

  return (
    <div className="p-4 grid grid-cols-3 gap-6 h-full">
      <div className="col-span-1 border border-slate-100 rounded-lg p-4 bg-white">
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-4">Halls</h3>
        <div className="space-y-2">
          {halls.map(hall => (
            <button
              key={hall.id}
              onClick={() => setSelectedHallId(hall.id)}
              className={`w-full text-left text-sm p-2 rounded ${selectedHallId === hall.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {hall.name}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-2 border border-slate-100 rounded-lg p-4 bg-white">
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-4">
          Inventory: {selectedHall?.name}
        </h3>
        {selectedHall && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-[10px] uppercase">
                <th className="pb-2">Item</th>
                <th className="pb-2 text-right">Total</th>
                <th className="pb-2 text-right">In-Use</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedHall.inventory.map(item => (
                <tr key={item.id}>
                  <td className="py-2 flex items-center gap-2">
                    <Package size={14} className="text-slate-400" />
                    {item.name}
                  </td>
                  <td className="py-2 text-right">{item.total}</td>
                  <td className="py-2 text-right text-blue-600 font-bold">{item.inUse}</td>
                  <td className="py-2 text-right">
                    <button className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
