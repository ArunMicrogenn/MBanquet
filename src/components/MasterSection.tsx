import { useState, ChangeEvent } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function MasterSection({ title, items, setItems }: { title: string, items: string[], setItems: (items: string[]) => void }) {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const saveEdit = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index] = editValue;
    setItems(updatedItems);
    setEditingIndex(null);
  };

  return (
    <div className="border border-slate-100 p-4 rounded-lg bg-white">
      <h3 className="text-xs font-bold text-slate-700 uppercase mb-4">{title}</h3>
      <ul className="space-y-2 mb-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-center justify-between text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">
            {editingIndex === i ? (
              <input 
                value={editValue}
                onChange={(e: any) => setEditValue(e.target.value)}
                className="flex-1 px-2 py-0.5 border border-blue-300 rounded text-sm"
              />
            ) : (
              <span>{item}</span>
            )}
            <div className="flex gap-1 ml-2">
              {editingIndex === i ? (
                <>
                  <button onClick={() => saveEdit(i)} className="text-green-600 hover:text-green-800"><Check size={16} /></button>
                  <button onClick={() => setEditingIndex(null)} className="text-red-600 hover:text-red-800"><X size={16} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(i)} className="text-blue-600 hover:text-blue-800"><Pencil size={16} /></button>
                  <button onClick={() => deleteItem(i)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input 
          placeholder={`Add new ${title.toLowerCase()}`}
          value={newItem}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-sm"
        />
        <button 
          onClick={() => { if(newItem) setItems([...items, newItem]); setNewItem(''); }}
          className="bg-slate-900 text-white px-3 py-1.5 rounded text-[11px] font-bold"
        >Add</button>
      </div>
    </div>
  );
}
