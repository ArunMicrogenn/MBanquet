import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

const initialRoles = [
  { id: 1, name: 'Banquet Manager', permissions: ['Calendar', 'Bookings', 'Reports'] },
  { id: 2, name: 'Accountant', permissions: ['Invoices', 'Reports'] },
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState(initialRoles);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase">Custom Roles</h3>
        <button className="flex items-center gap-1 text-blue-600 text-sm font-bold">
          <Plus size={16} /> Add Role
        </button>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800">{role.name}</h4>
              <button className="text-slate-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <span key={perm} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-500" />
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
