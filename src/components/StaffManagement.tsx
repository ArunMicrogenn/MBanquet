import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  UserPlus, 
  Mail, 
  Trash2, 
  Edit, 
  Search, 
  Phone, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  UserX, 
  X, 
  Plus, 
  Filter,
  Users,
  AlertCircle
} from 'lucide-react';
import { collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  property: string;
  status: 'Active' | 'Inactive';
  shift: string;
  notes?: string;
  createdAt?: string;
}

const ROLES = [
  'Admin', 
  'Manager', 
  'Banquet Staff', 
  'Head Chef', 
  'Event Coordinator', 
  'Billing Executive'
];

const PROPERTIES = [
  'All Properties',
  'Grand Royal Jubilee Hills',
  'Imperial Palace Banjara Hills',
  'Crystal Convention Gachibowli',
  'Emerald Palms ECR'
];

const SHIFTS = [
  'General (09:00 - 18:00)',
  'Morning (07:00 - 15:00)',
  'Evening (15:00 - 23:00)',
  'Night (23:00 - 07:00)',
  'Flexible / Event Based'
];

const DEFAULT_STAFF: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@grandhorizon.com',
    phone: '+91 98765 43210',
    role: 'Admin',
    property: 'All Properties',
    status: 'Active',
    shift: 'General (09:00 - 18:00)',
    notes: 'System Super Admin & General Manager',
    createdAt: '2025-01-15'
  },
  {
    id: 'staff-2',
    name: 'Priya Nair',
    email: 'priya.nair@grandhorizon.com',
    phone: '+91 98123 45678',
    role: 'Manager',
    property: 'Grand Royal Jubilee Hills',
    status: 'Active',
    shift: 'Morning (07:00 - 15:00)',
    notes: 'Senior Banquet Operations Manager',
    createdAt: '2025-02-01'
  },
  {
    id: 'staff-3',
    name: 'Rajesh Kumar',
    email: 'rajesh.chef@grandhorizon.com',
    phone: '+91 97654 32109',
    role: 'Head Chef',
    property: 'Imperial Palace Banjara Hills',
    status: 'Active',
    shift: 'Flexible / Event Based',
    notes: 'Executive Master Chef & Menu Curator',
    createdAt: '2025-02-10'
  },
  {
    id: 'staff-4',
    name: 'Vikram Malhotra',
    email: 'vikram.m@grandhorizon.com',
    phone: '+91 99887 76655',
    role: 'Banquet Staff',
    property: 'Crystal Convention Gachibowli',
    status: 'Active',
    shift: 'Evening (15:00 - 23:00)',
    notes: 'Floor Supervisor & AV Setup Lead',
    createdAt: '2025-03-05'
  },
  {
    id: 'staff-5',
    name: 'Ananya Roy',
    email: 'ananya.roy@grandhorizon.com',
    phone: '+91 96543 21098',
    role: 'Event Coordinator',
    property: 'Emerald Palms ECR',
    status: 'Active',
    shift: 'Morning (07:00 - 15:00)',
    notes: 'Client Liaison & Prospectus BEO Coordinator',
    createdAt: '2025-03-12'
  },
  {
    id: 'staff-6',
    name: 'Suresh Verma',
    email: 'suresh.verma@grandhorizon.com',
    phone: '+91 95432 10987',
    role: 'Billing Executive',
    property: 'Grand Royal Jubilee Hills',
    status: 'Inactive',
    shift: 'General (09:00 - 18:00)',
    notes: 'On extended leave / Inactive account',
    createdAt: '2025-01-20'
  }
];

export default function StaffManagement() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [propertyFilter, setPropertyFilter] = useState<string>('All');

  // Modal States for Add / Amend
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'amend'>('add');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<StaffUser, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: 'Banquet Staff',
    property: 'Grand Royal Jubilee Hills',
    status: 'Active',
    shift: 'Morning (07:00 - 15:00)',
    notes: ''
  });

  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData: StaffUser[] = [];
      usersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        usersData.push({
          id: docSnap.id,
          name: data.name || 'Unnamed Staff',
          email: data.email || 'no-email@domain.com',
          phone: data.phone || '+91 90000 00000',
          role: data.role || 'Banquet Staff',
          property: data.property || 'Grand Royal Jubilee Hills',
          status: data.status === 'Inactive' ? 'Inactive' : 'Active',
          shift: data.shift || 'General (09:00 - 18:00)',
          notes: data.notes || '',
          createdAt: data.createdAt || new Date().toISOString().split('T')[0]
        });
      });

      if (usersData.length === 0) {
        setUsers(DEFAULT_STAFF);
      } else {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users from Firestore, using default dataset:', error);
      setUsers(DEFAULT_STAFF);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Users List
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesProperty = propertyFilter === 'All' || user.property === propertyFilter || user.property === 'All Properties';

    return matchesSearch && matchesStatus && matchesRole && matchesProperty;
  });

  // Open Modal for Adding Staff
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingStaffId(null);
    setFormData({
      name: '',
      email: '',
      phone: '+91 ',
      role: 'Banquet Staff',
      property: 'Grand Royal Jubilee Hills',
      status: 'Active',
      shift: 'Morning (07:00 - 15:00)',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Open Modal for Amending Staff
  const handleOpenAmendModal = (staff: StaffUser) => {
    setModalMode('amend');
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      property: staff.property,
      status: staff.status,
      shift: staff.shift,
      notes: staff.notes || ''
    });
    setIsModalOpen(true);
  };

  // Save (Add or Amend) Staff
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in required fields: Staff Name and Email.');
      return;
    }

    if (modalMode === 'add') {
      const newId = `staff-${Date.now()}`;
      const newStaff: StaffUser = {
        id: newId,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };

      try {
        await setDoc(doc(db, 'users', newId), newStaff);
      } catch (err) {
        console.warn('Firestore write warning, saved locally:', err);
      }

      setUsers((prev) => [newStaff, ...prev]);
    } else if (modalMode === 'amend' && editingStaffId) {
      const updatedStaff: StaffUser = {
        id: editingStaffId,
        ...formData
      };

      try {
        await updateDoc(doc(db, 'users', editingStaffId), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          property: formData.property,
          status: formData.status,
          shift: formData.shift,
          notes: formData.notes
        });
      } catch (err) {
        console.warn('Firestore update warning, updated locally:', err);
      }

      setUsers((prev) => prev.map((u) => (u.id === editingStaffId ? updatedStaff : u)));
    }

    setIsModalOpen(false);
  };

  // Toggle Inactive / Active Status
  const handleToggleStatus = async (staff: StaffUser) => {
    const newStatus: 'Active' | 'Inactive' = staff.status === 'Active' ? 'Inactive' : 'Active';

    try {
      await updateDoc(doc(db, 'users', staff.id), { status: newStatus });
    } catch (err) {
      console.warn('Firestore status toggle warning, updated locally:', err);
    }

    setUsers((prev) => prev.map((u) => (u.id === staff.id ? { ...u, status: newStatus } : u)));
  };

  // Delete Staff Record
  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete staff member "${userName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.warn('Firestore delete warning, deleted locally:', error);
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Metrics
  const totalStaff = users.length;
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const inactiveCount = users.filter((u) => u.status === 'Inactive').length;

  return (
    <div className="h-full w-full bg-slate-50 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield size={26} className="text-indigo-600" />
            Staff & Personnel Management
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Add new staff, amend profiles, manage shift assignments, and set active/inactive status.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          <UserPlus size={18} /> Add New Staff Member
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Total Registered
            </span>
            <span className="text-xl font-extrabold text-slate-900">{totalStaff} Staff</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Active Operational
            </span>
            <span className="text-xl font-extrabold text-emerald-700">{activeCount} Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Inactive / On Leave
            </span>
            <span className="text-xl font-extrabold text-slate-600">{inactiveCount} Inactive</span>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name, email, phone, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* STATUS TABS */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Active', 'Inactive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'All' ? 'All Staff' : st}
                {st === 'Active' && <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">{activeCount}</span>}
                {st === 'Inactive' && <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">{inactiveCount}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* DROPDOWN FILTERS */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <Filter size={14} /> Filter By:
          </div>

          {/* ROLE DROPDOWN */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* PROPERTY DROPDOWN */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium">Property:</span>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {PROPERTIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {(roleFilter !== 'All' || propertyFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setRoleFilter('All');
                setPropertyFilter('All');
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* STAFF DATA TABLE */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-bold">Loading staff directory...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Users size={24} />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">No staff members found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No records matched your search parameters. Try adjusting filters or click below to add a new staff member.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5"
          >
            <Plus size={15} /> Add Staff Member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Role & Access</th>
                  <th className="p-4">Assigned Location</th>
                  <th className="p-4">Work Shift</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions (Amend / Toggle)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((user) => {
                  const isActive = user.status === 'Active';

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${!isActive ? 'bg-slate-50/40 opacity-80' : ''}`}
                    >
                      {/* MEMBER NAME & AVATAR */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-2xs ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            user.role === 'Head Chef' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            user.role === 'Event Coordinator' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              {user.name}
                              {!isActive && (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.2 rounded">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                              <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {user.email}</span>
                              <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ROLE BADGE */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          user.role === 'Manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          user.role === 'Head Chef' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          user.role === 'Event Coordinator' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          <Shield size={12} />
                          {user.role}
                        </span>
                      </td>

                      {/* PROPERTY */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <Building2 size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{user.property}</span>
                        </div>
                      </td>

                      {/* SHIFT */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span>{user.shift}</span>
                        </div>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          title="Click to toggle Active / Inactive status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-500'}`}></span>
                          {user.status}
                        </button>
                      </td>

                      {/* ACTIONS: AMEND, INACTIVE, DELETE */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* AMEND / EDIT */}
                          <button
                            onClick={() => handleOpenAmendModal(user)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                            title="Amend Staff Details"
                          >
                            <Edit size={14} /> Amend
                          </button>

                          {/* TOGGLE ACTIVE / INACTIVE */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg font-bold transition-colors ${
                              isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={isActive ? 'Set Staff Inactive' : 'Re-activate Staff'}
                          >
                            {isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Staff Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROLE PERMISSIONS GUIDE */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2">
          <ShieldAlert size={18} className="text-indigo-400" /> Operational Access & Security Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-purple-300 block mb-1">Admin Access</span>
            <p className="text-slate-300">Full system access: Staff add/amend, financial audits, venue mapping & master configs.</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-blue-300 block mb-1">Manager Access</span>
            <p className="text-slate-300">Calendar scheduling, booking approvals, prospectus creation & invoice settlements.</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-amber-300 block mb-1">Head Chef</span>
            <p className="text-slate-300">Food plan masters, kitchen BEO prospectus orders, dietary alerts & live station prep.</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-emerald-300 block mb-1">Banquet Staff</span>
            <p className="text-slate-300">Read-only calendar, venue hall setup check, seating arrangements & event agenda notes.</p>
          </div>
        </div>
      </div>

      {/* ADD / AMEND STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh]">
            {/* MODAL HEADER */}
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  {modalMode === 'add' ? <UserPlus size={20} /> : <Edit size={20} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {modalMode === 'add' ? 'Add New Staff Member' : 'Amend Staff Profile'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {modalMode === 'add'
                      ? 'Register new staff, assign role and venue location'
                      : 'Update role, contact details, work shift, or status'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSaveStaff} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* STAFF NAME */}
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* EMAIL & PHONE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. staff@grandhorizon.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* ROLE & PROPERTY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Role & Access Level
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Assigned Property Location
                  </label>
                  <select
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {PROPERTIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SHIFT & OPERATIONAL STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Shift Schedule
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {SHIFTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Operational Status
                  </label>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Active' })}
                      className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                        formData.status === 'Active'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 size={15} /> Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                      className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                        formData.status === 'Inactive'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle size={15} /> Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* SPECIAL NOTES */}
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Operational Notes & Access Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Senior banquet coordinator, licensed food safety inspector..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
                />
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {modalMode === 'add' ? <UserPlus size={15} /> : <Edit size={15} />}
                  {modalMode === 'add' ? 'Save New Staff' : 'Update Staff Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

