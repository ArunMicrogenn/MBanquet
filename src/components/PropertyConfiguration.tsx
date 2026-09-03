import React, { useState, ChangeEvent, FormEvent } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Upload, 
  Users, 
  Check, 
  Star, 
  Settings,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  FileText
} from 'lucide-react';
import RolesPermissions from './RolesPermissions';

export interface Property {
  id: string;
  code: string;
  name: string;
  chainGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  taxId: string;
  totalHalls: number;
  totalCapacity: number;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  managerInCharge: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  imageUrl?: string;
}

export interface SeatingStyle {
  id: number;
  name: string;
  multiplier: number;
}

export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    code: 'GR-HYD',
    name: 'Grand Royal Banquet & Convention Center',
    chainGroup: 'Grand Royal Hospitality Group',
    address: '123 Jubilee Hills Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    phone: '+91 40 2355 8800',
    email: 'jubileehills@grandroyalbanquets.com',
    taxId: '36AABCG1234H1Z5',
    totalHalls: 4,
    totalCapacity: 1800,
    status: 'Active',
    managerInCharge: 'Mr. Rajesh Varma',
    currency: 'INR (₹)',
    checkInTime: '08:00 AM',
    checkOutTime: '11:00 PM',
    amenities: ['Valet Parking', 'Centralized AC', 'Dedicated Kitchens', 'VIP Green Rooms', '100% Power Backup', '500Mbps WiFi'],
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prop-2',
    code: 'IP-BNJ',
    name: 'Imperial Palace Luxury Suites & Halls',
    chainGroup: 'Grand Royal Hospitality Group',
    address: '45 Banjara Hills Avenue, Near City Center',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    phone: '+91 40 4455 9900',
    email: 'banjarahills@grandroyalbanquets.com',
    taxId: '36AABCG5678I1Z2',
    totalHalls: 3,
    totalCapacity: 1200,
    status: 'Active',
    managerInCharge: 'Ms. Anita Deshmukh',
    currency: 'INR (₹)',
    checkInTime: '07:00 AM',
    checkOutTime: '11:30 PM',
    amenities: ['Rooftop Lawn', 'Valet Parking', 'Live Barbeque Setup', 'Heli-Pad Access'],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prop-3',
    code: 'CC-GCB',
    name: 'Crystal Convention Center & Arena',
    chainGroup: 'Grand Royal Hospitality Group',
    address: '88 Financial District, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    phone: '+91 40 6677 1122',
    email: 'gachibowli@grandroyalbanquets.com',
    taxId: '36AABCG9012J1Z8',
    totalHalls: 6,
    totalCapacity: 3500,
    status: 'Active',
    managerInCharge: 'Sanjeev Kapoor',
    currency: 'INR (₹)',
    checkInTime: '06:00 AM',
    checkOutTime: '01:00 AM',
    amenities: ['Exhibition Arena', 'Underground Parking (500 Cars)', 'Acoustic Soundproofing', 'In-house AV Crew'],
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prop-4',
    code: 'EP-CHE',
    name: 'Emerald Palms Oceanfront Resort & Lawns',
    chainGroup: 'Grand Royal Hospitality Group',
    address: 'Mile 14, ECR Coastal Expressway',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600119',
    phone: '+91 44 2811 4400',
    email: 'chennai@grandroyalbanquets.com',
    taxId: '33AABCG3456K1Z1',
    totalHalls: 3,
    totalCapacity: 2000,
    status: 'Under Maintenance',
    managerInCharge: 'Ramesh Sundaram',
    currency: 'INR (₹)',
    checkInTime: '08:00 AM',
    checkOutTime: '11:00 PM',
    amenities: ['Beachfront Garden', 'Swimming Pool', 'Cottages (24 Rooms)', 'Bridal Suites'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  }
];

interface PropertyConfigurationProps {
  currentActivePropertyId?: string;
  onSelectActiveProperty?: (propId: string, propName: string) => void;
}

export default function PropertyConfiguration({
  currentActivePropertyId = 'prop-1',
  onSelectActiveProperty
}: PropertyConfigurationProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [activePropertyId, setActivePropertyId] = useState<string>(currentActivePropertyId);
  const [mainTab, setMainTab] = useState<'chain' | 'details' | 'seating' | 'roles'>('chain');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Under Maintenance'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Property for detail editing
  const selectedProperty = properties.find(p => p.id === activePropertyId) || properties[0];

  // Form states for details tab
  const [editForm, setEditForm] = useState<Property>({ ...selectedProperty });

  // Seating styles state
  const [seatingStyles, setSeatingStyles] = useState<SeatingStyle[]>([
    { id: 1, name: 'Theatre Style', multiplier: 1.0 },
    { id: 2, name: 'U-Shape Executive', multiplier: 0.6 },
    { id: 3, name: 'Cluster of 8 (Banquet Round)', multiplier: 0.8 },
    { id: 4, name: 'Classroom Row', multiplier: 0.7 },
    { id: 5, name: 'Cocktail High-Tables', multiplier: 1.2 }
  ]);
  const [newStyleName, setNewStyleName] = useState('');
  const [newStyleMultiplier, setNewStyleMultiplier] = useState('');

  // New Property Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProp, setNewProp] = useState<Partial<Property>>({
    code: '',
    name: '',
    chainGroup: 'Grand Royal Hospitality Group',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    phone: '',
    email: '',
    taxId: '',
    totalHalls: 2,
    totalCapacity: 500,
    status: 'Active',
    managerInCharge: '',
    currency: 'INR (₹)',
    checkInTime: '08:00 AM',
    checkOutTime: '11:00 PM',
    amenities: ['Valet Parking', 'Central AC', 'Power Backup']
  });

  const handleSwitchActive = (prop: Property) => {
    setActivePropertyId(prop.id);
    setEditForm({ ...prop });
    if (onSelectActiveProperty) {
      onSelectActiveProperty(prop.id, prop.name);
    }
    setToastMessage(`Switched active location to "${prop.name}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveDetails = (e: FormEvent) => {
    e.preventDefault();
    setProperties(properties.map(p => p.id === editForm.id ? editForm : p));
    setToastMessage(`Property configurations for "${editForm.name}" updated successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddStyle = (e: FormEvent) => {
    e.preventDefault();
    if (newStyleName && newStyleMultiplier) {
      setSeatingStyles([
        ...seatingStyles, 
        { id: Date.now(), name: newStyleName, multiplier: parseFloat(newStyleMultiplier) }
      ]);
      setNewStyleName('');
      setNewStyleMultiplier('');
      setToastMessage(`Added seating style "${newStyleName}"`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleCreateProperty = (e: FormEvent) => {
    e.preventDefault();
    if (!newProp.name || !newProp.code) return;

    const created: Property = {
      id: `prop-${Date.now()}`,
      code: newProp.code.toUpperCase(),
      name: newProp.name,
      chainGroup: newProp.chainGroup || 'Grand Royal Hospitality Group',
      address: newProp.address || 'Address Line 1',
      city: newProp.city || 'City',
      state: newProp.state || 'State',
      pincode: newProp.pincode || '000000',
      phone: newProp.phone || '+91 00000 00000',
      email: newProp.email || 'property@example.com',
      taxId: newProp.taxId || 'GSTIN-PENDING',
      totalHalls: Number(newProp.totalHalls) || 2,
      totalCapacity: Number(newProp.totalCapacity) || 500,
      status: (newProp.status as any) || 'Active',
      managerInCharge: newProp.managerInCharge || 'Property Manager',
      currency: newProp.currency || 'INR (₹)',
      checkInTime: newProp.checkInTime || '08:00 AM',
      checkOutTime: newProp.checkOutTime || '11:00 PM',
      amenities: newProp.amenities || ['Valet Parking', 'Central AC'],
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'
    };

    setProperties([created, ...properties]);
    setIsAddModalOpen(false);
    handleSwitchActive(created);
    setToastMessage(`New Property "${created.name}" created and set as active!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredProperties = properties.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = p.name.toLowerCase().includes(q) || 
      p.code.toLowerCase().includes(q) || 
      p.city.toLowerCase().includes(q) ||
      p.managerInCharge.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalHallsCount = properties.reduce((acc, p) => acc + p.totalHalls, 0);
  const totalCapacityCount = properties.reduce((acc, p) => acc + p.totalCapacity, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200 text-xs">
          <CheckCircle className="text-emerald-400" size={16} />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Multi-Property Management Engine</h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Chain Location Switcher
              </span>
            </div>
            <p className="text-xs text-slate-500">Manage multiple banquet properties, venues, seating styles, and role permissions across locations</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Plus size={15} /> Add New Property
          </button>
        </div>
      </div>

      {/* CHAIN METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Properties in Chain</div>
            <div className="text-xl font-extrabold text-slate-900">{properties.length} Locations</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Banquet Halls</div>
            <div className="text-xl font-extrabold text-emerald-600">{totalHallsCount} Halls & Lawns</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Chain Capacity Floor</div>
            <div className="text-xl font-extrabold text-purple-600">{totalCapacityCount.toLocaleString()} Guests</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Active Selected Property</div>
            <div className="text-xs font-black text-slate-900 truncate max-w-[140px]">{selectedProperty.name}</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2">
        <button
          onClick={() => setMainTab('chain')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === 'chain'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 size={14} /> Property Chain Directory ({properties.length})
        </button>
        <button
          onClick={() => setMainTab('details')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === 'details'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings size={14} /> Selected Property Configuration ({selectedProperty.code})
        </button>
        <button
          onClick={() => setMainTab('seating')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === 'seating'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers size={14} /> Seating Multipliers ({seatingStyles.length})
        </button>
        <button
          onClick={() => setMainTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mainTab === 'roles'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield size={14} /> Multi-Property Roles & Permissions
        </button>
      </div>

      {/* TAB 1: PROPERTY CHAIN DIRECTORY */}
      {mainTab === 'chain' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search property name, code, city, manager..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
              />
              <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-bold uppercase text-slate-400">Filter Status:</span>
              {(['All', 'Active', 'Under Maintenance'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* PROPERTY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredProperties.map(prop => {
              const isActive = prop.id === activePropertyId;
              return (
                <div
                  key={prop.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* CARD HERO IMAGE & BADGES */}
                    <div className="relative h-36 bg-slate-800 overflow-hidden">
                      <img
                        src={prop.imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'}
                        alt={prop.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-900/90 text-blue-300 font-mono font-extrabold text-xs rounded-lg border border-slate-700">
                          {prop.code}
                        </span>
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                          prop.status === 'Active'
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-amber-500/90 text-white'
                        }`}>
                          {prop.status}
                        </span>
                      </div>

                      {isActive && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                          <Check size={12} /> Active Location
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-black text-sm text-white tracking-tight drop-shadow-sm truncate">
                          {prop.name}
                        </h3>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-blue-400 shrink-0" />
                          {prop.city}, {prop.state}
                        </p>
                      </div>
                    </div>

                    {/* DETAILS BODY */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Halls</span>
                          <span className="font-extrabold text-xs text-slate-900">{prop.totalHalls} Venues</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Max Pax</span>
                          <span className="font-extrabold text-xs text-blue-600">{prop.totalCapacity} Guests</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Tax Registration</span>
                          <span className="font-bold text-[10px] text-slate-700 truncate block">{prop.taxId}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Address:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[200px]">{prop.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Manager in Charge:</span>
                          <span className="font-bold text-slate-900">{prop.managerInCharge}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Phone & Email:</span>
                          <span className="font-semibold text-slate-800">{prop.phone}</span>
                        </div>
                      </div>

                      {/* AMENITIES BADGES */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prop.amenities.map((am, i) => (
                          <span key={i} className="text-[9.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActivePropertyId(prop.id);
                        setEditForm({ ...prop });
                        setMainTab('details');
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Edit3 size={13} /> Edit Config
                    </button>

                    {isActive ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Currently Selected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitchActive(prop)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        Set Active Property
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SELECTED PROPERTY DETAILS FORM */}
      {mainTab === 'details' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 max-w-4xl">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-xs rounded">
                  {selectedProperty.code}
                </span>
                <h3 className="font-extrabold text-base text-slate-900">{selectedProperty.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Configure property location, tax details, contact info, and capacity parameters</p>
            </div>

            <button
              onClick={() => handleSwitchActive(selectedProperty)}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100"
            >
              <CheckCircle size={14} /> Active Property
            </button>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Property Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Property Code (Unique)</label>
                <input
                  type="text"
                  value={editForm.code}
                  onChange={e => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold font-mono text-blue-700 uppercase focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Parent Chain Group</label>
                <input
                  type="text"
                  value={editForm.chainGroup}
                  onChange={e => setEditForm({ ...editForm, chainGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Manager in Charge</label>
                <input
                  type="text"
                  value={editForm.managerInCharge}
                  onChange={e => setEditForm({ ...editForm, managerInCharge: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tax ID / GSTIN Registration</label>
                <input
                  type="text"
                  value={editForm.taxId}
                  onChange={e => setEditForm({ ...editForm, taxId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 uppercase focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Operational Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-blue-500 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State & Pincode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    value={editForm.state}
                    onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={editForm.pincode}
                    onChange={e => setEditForm({ ...editForm, pincode: e.target.value })}
                    className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Check size={16} /> Save Property Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SEATING STYLES & MULTIPLIERS */}
      {mainTab === 'seating' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Seating Styles & Capacity Multipliers</h3>
            <p className="text-xs text-slate-500">Define seating arrangements and capacity conversion factors for banquet halls</p>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <th className="pb-2">Seating Arrangement Style</th>
                <th className="pb-2">Capacity Multiplier Factor</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seatingStyles.map(style => (
                <tr key={style.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{style.name}</td>
                  <td className="py-3 font-extrabold text-blue-600">{style.multiplier}x</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSeatingStyles(seatingStyles.filter(s => s.id !== style.id))}
                      className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ADD STYLE FORM */}
          <form onSubmit={handleAddStyle} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase">Add Custom Seating Style</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Style Name (e.g. Cabaret Round)"
                value={newStyleName}
                onChange={e => setNewStyleName(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                required
              />
              <input
                type="number"
                step="0.1"
                placeholder="Multiplier Factor (e.g. 0.8)"
                value={newStyleMultiplier}
                onChange={e => setNewStyleMultiplier(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Seating Style
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ROLES & PERMISSIONS INTEGRATED */}
      {mainTab === 'roles' && (
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <RolesPermissions />
        </div>
      )}

      {/* CREATE NEW PROPERTY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Add New Property to Chain</h3>
                  <p className="text-xs text-slate-500">Register a new banquet hall location or resort venue</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Property Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Imperial Heights Convention"
                    value={newProp.name}
                    onChange={e => setNewProp({ ...newProp, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Property Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. IH-HYD"
                    value={newProp.code}
                    onChange={e => setNewProp({ ...newProp, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-blue-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={newProp.city}
                    onChange={e => setNewProp({ ...newProp, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Manager in Charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Varma"
                    value={newProp.managerInCharge}
                    onChange={e => setNewProp({ ...newProp, managerInCharge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Halls Count</label>
                  <input
                    type="number"
                    value={newProp.totalHalls}
                    onChange={e => setNewProp({ ...newProp, totalHalls: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Guest Capacity</label>
                  <input
                    type="number"
                    value={newProp.totalCapacity}
                    onChange={e => setNewProp({ ...newProp, totalCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tax ID / GSTIN</label>
                  <input
                    type="text"
                    placeholder="GSTIN Number"
                    value={newProp.taxId}
                    onChange={e => setNewProp({ ...newProp, taxId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98000 00000"
                    value={newProp.phone}
                    onChange={e => setNewProp({ ...newProp, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Plus size={15} /> Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
