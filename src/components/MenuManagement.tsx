import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Package, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  ShoppingCart, 
  Filter, 
  Search, 
  UtensilsCrossed, 
  Boxes, 
  Layers,
  X,
  TrendingDown,
  Sparkles,
  Calendar,
  Gauge,
  Edit3,
  ShieldAlert,
  Bell,
  Sliders,
  Check
} from 'lucide-react';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  type: 'Veg' | 'Non-Veg';
  price: number;
  minGuests: number;
}

export interface FoodPlan {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Food Supplies' | 'Equipment & Tableware';
  unit: string;
  inStock: number;
  minThreshold: number;
  consumptionPer100Pax: number;
  estimatedCostPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

const initialMenuItems: MenuItem[] = [
  { id: 1, name: 'Paneer Tikka', category: 'Appetizers', type: 'Veg', price: 250, minGuests: 50 },
  { id: 2, name: 'Chicken Kebabs', category: 'Appetizers', type: 'Non-Veg', price: 350, minGuests: 50 },
  { id: 3, name: 'Crispy Corn & Pepper', category: 'Appetizers', type: 'Veg', price: 220, minGuests: 30 },
  { id: 4, name: 'Dal Makhani', category: 'Main Course', type: 'Veg', price: 200, minGuests: 100 },
  { id: 5, name: 'Hyderabadi Dum Biryani', category: 'Main Course', type: 'Non-Veg', price: 400, minGuests: 100 },
  { id: 6, name: 'Shahi Paneer', category: 'Main Course', type: 'Veg', price: 280, minGuests: 80 },
  { id: 7, name: 'Gulab Jamun with Rabri', category: 'Desserts', type: 'Veg', price: 180, minGuests: 50 },
  { id: 8, name: 'Assorted Mocktails', category: 'Beverages', type: 'Veg', price: 150, minGuests: 40 },
];

export const mockFoodPlans: FoodPlan[] = [
  { id: 1, name: 'Royal Grand Buffet', price: 1200, description: '4 Starters, 5 Main Courses, 3 Rice/Breads, 4 Desserts & Live Mocktail Bar.' },
  { id: 2, name: 'Executive Corporate Buffet', price: 800, description: 'Unlimited selection of 2 starters, 3 mains, salads, bread and 2 desserts.' },
  { id: 3, name: 'Curated 3-Course Fixed Menu', price: 600, description: 'Plated starter, choice of main entree with accompaniments, and artisanal dessert.' },
  { id: 4, name: 'High Tea & Hors d\'oeuvres', price: 400, description: 'Gourmet tea, artisan coffee, finger sandwiches, pastries, and savory mini bites.' },
];

const initialInventory: InventoryItem[] = [
  // Food Ingredients
  {
    id: 'inv-1',
    name: 'Fresh Paneer / Cottage Cheese',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 45,
    minThreshold: 50,
    consumptionPer100Pax: 15,
    estimatedCostPerUnit: 380,
    supplier: 'DairyFresh Foods Ltd.',
    lastRestocked: '2026-08-25'
  },
  {
    id: 'inv-2',
    name: 'Tandoori Cut Fresh Chicken',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 80,
    minThreshold: 90,
    consumptionPer100Pax: 22,
    estimatedCostPerUnit: 260,
    supplier: 'Apex Premium Poultry',
    lastRestocked: '2026-08-26'
  },
  {
    id: 'inv-3',
    name: 'Royal Basmati Rice (Aged)',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 250,
    minThreshold: 120,
    consumptionPer100Pax: 14,
    estimatedCostPerUnit: 140,
    supplier: 'Heritage Agro Grains',
    lastRestocked: '2026-08-20'
  },
  {
    id: 'inv-4',
    name: 'Pure Desi Ghee & Cooking Oil',
    category: 'Food Supplies',
    unit: 'Liters',
    inStock: 35,
    minThreshold: 60,
    consumptionPer100Pax: 8,
    estimatedCostPerUnit: 520,
    supplier: 'Golden Harvest Oils',
    lastRestocked: '2026-08-18'
  },
  {
    id: 'inv-5',
    name: 'Heavy Cooking Cream & Butter',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 28,
    minThreshold: 40,
    consumptionPer100Pax: 6,
    estimatedCostPerUnit: 420,
    supplier: 'DairyFresh Foods Ltd.',
    lastRestocked: '2026-08-27'
  },
  {
    id: 'inv-6',
    name: 'Gourmet Whole Spice & Masala Blend',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 18,
    minThreshold: 20,
    consumptionPer100Pax: 3.5,
    estimatedCostPerUnit: 750,
    supplier: 'Malabar Spices Co.',
    lastRestocked: '2026-08-15'
  },
  {
    id: 'inv-7',
    name: 'Artisan Coffee Beans & Tea Leaves',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 22,
    minThreshold: 15,
    consumptionPer100Pax: 2,
    estimatedCostPerUnit: 680,
    supplier: 'RoastMasters Guild',
    lastRestocked: '2026-08-22'
  },
  // Equipment & Tableware
  {
    id: 'inv-8',
    name: 'Stainless Steel Chafing Dishes',
    category: 'Equipment & Tableware',
    unit: 'Units',
    inStock: 32,
    minThreshold: 35,
    consumptionPer100Pax: 6,
    estimatedCostPerUnit: 2500,
    supplier: 'Crown Hospitality Gear',
    lastRestocked: '2026-08-10'
  },
  {
    id: 'inv-9',
    name: 'Porcelain Dinner Plates (11")',
    category: 'Equipment & Tableware',
    unit: 'Pieces',
    inStock: 950,
    minThreshold: 1000,
    consumptionPer100Pax: 110,
    estimatedCostPerUnit: 180,
    supplier: 'Luxe Tableware Corp',
    lastRestocked: '2026-07-30'
  },
  {
    id: 'inv-10',
    name: 'Premium Cutlery Sets (Fork, Knife, Spoon)',
    category: 'Equipment & Tableware',
    unit: 'Sets',
    inStock: 1100,
    minThreshold: 1000,
    consumptionPer100Pax: 110,
    estimatedCostPerUnit: 120,
    supplier: 'Luxe Tableware Corp',
    lastRestocked: '2026-08-05'
  },
  {
    id: 'inv-11',
    name: 'Crystal Water & Beverage Goblets',
    category: 'Equipment & Tableware',
    unit: 'Pieces',
    inStock: 800,
    minThreshold: 900,
    consumptionPer100Pax: 120,
    estimatedCostPerUnit: 150,
    supplier: 'ClearView Glassworks',
    lastRestocked: '2026-08-12'
  },
  {
    id: 'inv-12',
    name: 'Satin Banquet Table Cloths (Round)',
    category: 'Equipment & Tableware',
    unit: 'Pieces',
    inStock: 65,
    minThreshold: 80,
    consumptionPer100Pax: 12,
    estimatedCostPerUnit: 650,
    supplier: 'Velvet Drapes & Linens',
    lastRestocked: '2026-08-14'
  },
  {
    id: 'inv-13',
    name: 'Buffet Chafer Fuel Gel Cans',
    category: 'Equipment & Tableware',
    unit: 'Cans',
    inStock: 40,
    minThreshold: 80,
    consumptionPer100Pax: 14,
    estimatedCostPerUnit: 95,
    supplier: 'Crown Hospitality Gear',
    lastRestocked: '2026-08-20'
  }
];

const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];

interface MenuManagementProps {
  bookings?: Array<{
    id?: string;
    title: string;
    start: string;
    end?: string;
    hall?: string;
    pax?: number;
  }>;
}

export default function MenuManagement({ bookings = [] }: MenuManagementProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'plans' | 'inventory'>('inventory');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [items] = useState<MenuItem[]>(initialMenuItems);
  const [plans] = useState<FoodPlan[]>(mockFoodPlans);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  
  // Inventory Filtering & States
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'below_threshold' | 'critical' | 'low' | 'food' | 'equipment'>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedBookingScope, setSelectedBookingScope] = useState<string>('all'); // 'all' or specific booking title
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(50);
  const [thresholdModalItem, setThresholdModalItem] = useState<InventoryItem | null>(null);
  const [thresholdInputVal, setThresholdInputVal] = useState<number>(50);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isProcurementSheetOpen, setIsProcurementSheetOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Food Supplies',
    unit: 'kg',
    inStock: 50,
    minThreshold: 40,
    consumptionPer100Pax: 10,
    estimatedCostPerUnit: 200,
    supplier: '',
  });

  // Calculate upcoming events and total Pax
  const effectiveBookings = bookings.length > 0 ? bookings : [
    { id: 'b1', title: 'Crystal Ballroom - Wedding', start: '2026-08-27T10:00:00', hall: 'Crystal Ballroom', pax: 350 },
    { id: 'b2', title: 'Ruby Suite - Seminar', start: '2026-08-28T14:00:00', hall: 'Ruby Suite', pax: 120 },
    { id: 'b3', title: 'Crystal Ballroom - Gala', start: '2026-08-29T18:00:00', hall: 'Crystal Ballroom', pax: 800 },
  ];

  const totalUpcomingPax = useMemo(() => {
    return effectiveBookings.reduce((sum, b) => sum + (b.pax || 0), 0);
  }, [effectiveBookings]);

  // Selected Scope Pax
  const activePaxForCalculation = useMemo(() => {
    if (selectedBookingScope === 'all') {
      return totalUpcomingPax;
    }
    const found = effectiveBookings.find(b => b.title === selectedBookingScope);
    return found?.pax || totalUpcomingPax;
  }, [selectedBookingScope, totalUpcomingPax, effectiveBookings]);

  // Calculated Inventory Items with Demand & Threshold Monitor Metrics
  const inventoryWithCalculations = useMemo(() => {
    return inventory.map(item => {
      const requiredQty = Math.ceil((activePaxForCalculation / 100) * item.consumptionPer100Pax);
      const projectedBalance = item.inStock - requiredQty;
      
      // Threshold Monitor Calculation
      const isBelowThreshold = item.inStock <= item.minThreshold;
      const thresholdDeficit = isBelowThreshold ? item.minThreshold - item.inStock : 0;
      const thresholdRatio = Math.min(100, Math.round((item.inStock / (item.minThreshold || 1)) * 100));

      const isCriticalDeficit = projectedBalance < 0;
      const isLowStock = !isCriticalDeficit && (isBelowThreshold || projectedBalance <= (item.minThreshold * 0.5));
      const shortageQty = isCriticalDeficit ? Math.abs(projectedBalance) : 0;
      const suggestedReorderQty = isCriticalDeficit 
        ? shortageQty + item.minThreshold 
        : (isLowStock ? Math.max(item.minThreshold - item.inStock, 20) : 0);

      return {
        ...item,
        requiredQty,
        projectedBalance,
        isBelowThreshold,
        thresholdDeficit,
        thresholdRatio,
        isCriticalDeficit,
        isLowStock,
        isAdequate: !isCriticalDeficit && !isLowStock,
        shortageQty,
        suggestedReorderQty,
        reorderCostEstimate: suggestedReorderQty * item.estimatedCostPerUnit
      };
    });
  }, [inventory, activePaxForCalculation]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventoryWithCalculations.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.supplier.toLowerCase().includes(inventorySearch.toLowerCase());
      
      if (!matchesSearch) return false;

      if (inventoryFilter === 'below_threshold') return item.isBelowThreshold;
      if (inventoryFilter === 'critical') return item.isCriticalDeficit;
      if (inventoryFilter === 'low') return item.isLowStock;
      if (inventoryFilter === 'food') return item.category === 'Food Supplies';
      if (inventoryFilter === 'equipment') return item.category === 'Equipment & Tableware';
      return true;
    });
  }, [inventoryWithCalculations, inventorySearch, inventoryFilter]);

  // Summary Metrics
  const belowThresholdCount = inventoryWithCalculations.filter(i => i.isBelowThreshold).length;
  const criticalCount = inventoryWithCalculations.filter(i => i.isCriticalDeficit).length;
  const lowStockCount = inventoryWithCalculations.filter(i => i.isLowStock).length;
  const totalReorderEstimate = inventoryWithCalculations.reduce((sum, i) => sum + (i.reorderCostEstimate || 0), 0);

  const handleUpdateThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thresholdModalItem) return;

    setInventory(prev => prev.map(item => {
      if (item.id === thresholdModalItem.id) {
        return {
          ...item,
          minThreshold: Number(thresholdInputVal)
        };
      }
      return item;
    }));

    setSuccessToast(`Updated safety threshold for ${thresholdModalItem.name} to ${thresholdInputVal} ${thresholdModalItem.unit}!`);
    setTimeout(() => setSuccessToast(null), 3500);
    setThresholdModalItem(null);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem) return;

    setInventory(prev => prev.map(inv => {
      if (inv.id === restockModalItem.id) {
        return {
          ...inv,
          inStock: inv.inStock + Number(restockAmount),
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));

    setSuccessToast(`Successfully added ${restockAmount} ${restockModalItem.unit} to ${restockModalItem.name}!`);
    setTimeout(() => setSuccessToast(null), 3500);
    setRestockModalItem(null);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.supplier) return;

    const created: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: (newItem.category as 'Food Supplies' | 'Equipment & Tableware') || 'Food Supplies',
      unit: newItem.unit || 'kg',
      inStock: Number(newItem.inStock) || 0,
      minThreshold: Number(newItem.minThreshold) || 10,
      consumptionPer100Pax: Number(newItem.consumptionPer100Pax) || 5,
      estimatedCostPerUnit: Number(newItem.estimatedCostPerUnit) || 100,
      supplier: newItem.supplier || 'General Supplier',
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setInventory(prev => [created, ...prev]);
    setIsAddItemModalOpen(false);
    setNewItem({
      name: '',
      category: 'Food Supplies',
      unit: 'kg',
      inStock: 50,
      minThreshold: 40,
      consumptionPer100Pax: 10,
      estimatedCostPerUnit: 200,
      supplier: '',
    });
    setSuccessToast(`Added ${created.name} to inventory tracking!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="h-full w-full bg-slate-50 p-3 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
      {/* Toast Notification */}
      {successToast && (
        <div className="absolute top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          {successToast}
        </div>
      )}

      {/* Top Header & Tab Navigation */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 mb-3 flex flex-wrap justify-between items-center gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <UtensilsCrossed size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Menu, Catering & Inventory Hub</h2>
            <p className="text-[11px] text-slate-500">Live demand forecasting & supplies management linked to banquet schedules</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'inventory' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes size={14} />
            <span>Inventory & Forecasting</span>
            {(belowThresholdCount > 0 || criticalCount > 0) && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                criticalCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-white'
              }`}>
                <ShieldAlert size={11} />
                {belowThresholdCount} Below Threshold
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'menu' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>Menu Items</span>
            {belowThresholdCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'plans' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package size={14} />
            <span>Food Packages & Plans</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: INVENTORY & FORECASTING */}
      {activeTab === 'inventory' && (
        <div className="flex-1 flex flex-col min-h-0 gap-3 overflow-hidden">
          {/* Top Alerts & Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 shrink-0">
            {/* Threshold Monitor Card */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              belowThresholdCount > 0 
                ? 'bg-gradient-to-br from-amber-50 to-orange-50/80 border-amber-300 text-amber-900 shadow-2xs' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                  <Gauge size={12} className={belowThresholdCount > 0 ? 'text-amber-600' : 'text-slate-400'} />
                  Threshold Monitor
                </div>
                <div className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
                  {belowThresholdCount}
                  <span className="text-xs font-normal text-slate-500">below set level</span>
                </div>
                <div className={`text-[10px] font-bold ${belowThresholdCount > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>
                  {belowThresholdCount > 0 ? `⚠️ ${belowThresholdCount} items require restocking` : '✓ All items above set thresholds'}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${belowThresholdCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'}`}>
                <ShieldAlert size={20} className={belowThresholdCount > 0 ? 'animate-bounce' : ''} />
              </div>
            </div>

            {/* Critical Shortage Card */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              criticalCount > 0 
                ? 'bg-red-50/80 border-red-200 text-red-900' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                  <AlertTriangle size={12} className={criticalCount > 0 ? 'text-red-500' : 'text-slate-400'} />
                  Event Shortages
                </div>
                <div className="text-xl font-extrabold text-slate-900">{criticalCount} <span className="text-xs font-normal text-slate-500">items</span></div>
                <div className="text-[10px] text-red-600 font-semibold">
                  {criticalCount > 0 ? 'Deficit for upcoming events' : 'All items meet event demand'}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${criticalCount > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                <TrendingDown size={20} />
              </div>
            </div>

            {/* Active Demand Scope Card */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                  <Calendar size={12} className="text-blue-500" />
                  Demand Calculation Base
                </div>
                <div className="text-xl font-extrabold text-blue-600">{activePaxForCalculation} <span className="text-xs font-normal text-slate-500">Total Pax</span></div>
                <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                  {selectedBookingScope === 'all' ? `${effectiveBookings.length} Scheduled Events` : selectedBookingScope}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <UtensilsCrossed size={20} />
              </div>
            </div>

            {/* Procurement Reorder Card */}
            <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1">
                  <ShoppingCart size={12} className="text-emerald-400" />
                  Procurement Summary
                </div>
                <div className="text-lg font-extrabold text-emerald-400">₹{totalReorderEstimate.toLocaleString('en-IN')}</div>
                <button
                  onClick={() => setIsProcurementSheetOpen(true)}
                  className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded font-bold transition-colors"
                >
                  Generate PO Sheet →
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 text-emerald-300">
                <Sparkles size={20} />
              </div>
            </div>
          </div>

          {/* Threshold Alert Notification Banner */}
          {belowThresholdCount > 0 && (
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-between shrink-0 shadow-sm border border-amber-400/30">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bell size={18} className="text-amber-200 animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span>⚠️ THRESHOLD MONITOR WARNING:</span>
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[10px] font-extrabold">
                      {belowThresholdCount} {belowThresholdCount === 1 ? 'item' : 'items'} below set limit
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-100">
                    Stock levels have fallen below safety thresholds. Restock items or adjust threshold levels to maintain banquet readiness.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInventoryFilter('below_threshold')}
                  className="bg-white text-amber-900 hover:bg-amber-50 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors shadow-xs"
                >
                  Filter Below Threshold ({belowThresholdCount})
                </button>
                <button
                  onClick={() => setIsProcurementSheetOpen(true)}
                  className="bg-amber-900/60 hover:bg-amber-900 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors border border-amber-300/30"
                >
                  Quick Reorder List
                </button>
              </div>
            </div>
          )}

          {/* Controls Bar: Filter, Search, Scope Selector, Add Button */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            {/* Category/Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Filter size={12} /> Filter:
              </span>
              <button
                onClick={() => setInventoryFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  inventoryFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Items ({inventory.length})
              </button>
              <button
                onClick={() => setInventoryFilter('below_threshold')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 ${
                  inventoryFilter === 'below_threshold' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <ShieldAlert size={12} /> Below Threshold ({belowThresholdCount})
              </button>
              <button
                onClick={() => setInventoryFilter('critical')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 ${
                  inventoryFilter === 'critical' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                🔴 Event Deficits ({criticalCount})
              </button>
              <button
                onClick={() => setInventoryFilter('food')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  inventoryFilter === 'food' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Food Supplies
              </button>
              <button
                onClick={() => setInventoryFilter('equipment')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  inventoryFilter === 'equipment' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                Equipment & Crockery
              </button>
            </div>

            {/* Right Side: Scope Selector + Search + Add */}
            <div className="flex items-center gap-2">
              {/* Event Forecast Scope Selector */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Demand Scope:</span>
                <select
                  value={selectedBookingScope}
                  onChange={(e) => setSelectedBookingScope(e.target.value)}
                  className="text-xs font-semibold text-slate-800 bg-transparent border-0 outline-none cursor-pointer"
                >
                  <option value="all">All Upcoming Events ({totalUpcomingPax} Pax)</option>
                  {effectiveBookings.map((b, idx) => (
                    <option key={idx} value={b.title}>
                      {b.title} ({b.pax || 0} Pax)
                    </option>
                  ))}
                </select>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item or supplier..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-44 focus:w-56 transition-all focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              {/* Add New Item Button */}
              <button
                onClick={() => setIsAddItemModalOpen(true)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          {/* Main Inventory Table */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Item & Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Safety Par Threshold</th>
                  <th className="p-3 bg-blue-50/50 text-blue-900">Required ({activePaxForCalculation} Pax)</th>
                  <th className="p-3">Forecast Balance</th>
                  <th className="p-3">Threshold & Status Warning</th>
                  <th className="p-3">Supplier & Last Restocked</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <Package size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="font-semibold">No inventory items match the selected filter or search query.</p>
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map(item => {
                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors hover:bg-slate-50/80 ${
                          item.isCriticalDeficit 
                            ? 'bg-red-50/40' 
                            : item.isBelowThreshold 
                              ? 'bg-amber-50/40' 
                              : ''
                        }`}
                      >
                        {/* Name & Category */}
                        <td className="p-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {item.name}
                            {item.isBelowThreshold && (
                              <span className="text-amber-600" title="Item is below configured safety threshold level">
                                ⚠️
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                              item.category === 'Food Supplies' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Usage: {item.consumptionPer100Pax} {item.unit} / 100 Pax
                            </span>
                          </div>
                        </td>

                        {/* Current Stock with Visual Level Meter */}
                        <td className="p-3">
                          <div className="flex items-baseline gap-1">
                            <span className={`font-extrabold text-sm ${item.isBelowThreshold ? 'text-amber-700' : 'text-slate-900'}`}>
                              {item.inStock}
                            </span>
                            <span className="text-[11px] text-slate-500">{item.unit}</span>
                          </div>
                          {/* Visual Stock Level Progress Bar vs Threshold */}
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-200">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                item.thresholdRatio <= 50 
                                  ? 'bg-red-500' 
                                  : item.thresholdRatio <= 100 
                                    ? 'bg-amber-500' 
                                    : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, item.thresholdRatio)}%` }}
                            />
                          </div>
                          <span className="text-[9.5px] font-bold text-slate-400">
                            {item.thresholdRatio}% of threshold
                          </span>
                        </td>

                        {/* Minimum Par Threshold with Quick Edit Trigger */}
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                              {item.minThreshold} {item.unit}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setThresholdModalItem(item);
                                setThresholdInputVal(item.minThreshold);
                              }}
                              className="text-slate-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="Set / Modify Threshold Level"
                            >
                              <Sliders size={13} />
                            </button>
                          </div>
                        </td>

                        {/* Required Demand */}
                        <td className="p-3 bg-blue-50/30 font-bold text-blue-900">
                          {item.requiredQty} {item.unit}
                        </td>

                        {/* Projected Balance */}
                        <td className="p-3">
                          <div className={`font-bold flex items-center gap-1 ${
                            item.projectedBalance < 0 
                              ? 'text-red-600' 
                              : item.projectedBalance <= item.minThreshold 
                                ? 'text-amber-600' 
                                : 'text-emerald-700'
                          }`}>
                            {item.projectedBalance < 0 ? (
                              <>
                                <TrendingDown size={14} />
                                <span>{item.projectedBalance} {item.unit}</span>
                              </>
                            ) : (
                              <span>+{item.projectedBalance} {item.unit}</span>
                            )}
                          </div>
                          {item.projectedBalance < 0 && (
                            <div className="text-[10px] font-semibold text-red-600">
                              Short by {Math.abs(item.projectedBalance)} {item.unit}
                            </div>
                          )}
                        </td>

                        {/* Status Warning Badges */}
                        <td className="p-3">
                          {item.isCriticalDeficit ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 bg-red-100 border border-red-300 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                                EVENT DEFICIT ALERT
                              </span>
                              <div className="text-[10px] text-red-600 font-bold">
                                Needs +{item.shortageQty} {item.unit}
                              </div>
                            </div>
                          ) : item.isBelowThreshold ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                                ⚠️ BELOW THRESHOLD (-{item.thresholdDeficit} {item.unit})
                              </span>
                              <div className="text-[9.5px] text-amber-700 font-semibold">
                                Stock is below {item.minThreshold} {item.unit} par
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              SUFFICIENT STOCK
                            </span>
                          )}
                        </td>

                        {/* Supplier info */}
                        <td className="p-3">
                          <div className="text-slate-700 font-medium">{item.supplier}</div>
                          <div className="text-[10px] text-slate-400">Last: {item.lastRestocked}</div>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setThresholdModalItem(item);
                                setThresholdInputVal(item.minThreshold);
                              }}
                              className="px-2 py-1 rounded text-[11px] font-bold transition-colors inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200"
                              title="Set Safety Threshold Level"
                            >
                              <Sliders size={12} />
                              Threshold
                            </button>

                            <button
                              onClick={() => {
                                setRestockModalItem(item);
                                setRestockAmount(item.suggestedReorderQty > 0 ? item.suggestedReorderQty : 50);
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                                item.isCriticalDeficit
                                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                                  : item.isBelowThreshold
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <RefreshCw size={12} />
                              Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MENU ITEMS */}
      {activeTab === 'menu' && (
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Dish Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Per-Plate Price (₹)</th>
                  <th className="p-3 text-right">Min Guests Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.filter(cat => cat !== 'All').filter(cat => activeCategory === 'All' || activeCategory === cat).map(categoryName => {
                  const catItems = items.filter(item => item.category === categoryName);
                  if (catItems.length === 0) return null;
                  
                  return (
                    <React.Fragment key={categoryName}>
                      <tr className="bg-slate-100/50">
                        <td colSpan={5} className="p-2.5 font-extrabold text-slate-700 uppercase tracking-widest text-[11px] border-y border-slate-200">
                          {categoryName}
                        </td>
                      </tr>
                      {catItems.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-900">{item.name}</td>
                          <td className="p-3 text-slate-600">{item.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.type === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="p-3 text-right font-extrabold text-slate-900">₹{item.price}</td>
                          <td className="p-3 text-right text-slate-600 font-semibold">{item.minGuests} Pax</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FOOD PLANS */}
      {activeTab === 'plans' && (
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Catering Packages & Food Plans</h3>
            <span className="text-xs text-slate-500 font-medium">{plans.length} Custom Plans Configured</span>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                      <span className="text-blue-600 font-extrabold text-base">₹{plan.price} <span className="text-[10px] text-slate-500 font-normal">/ pax</span></span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{plan.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Includes live counter setup</span>
                    <span className="text-blue-600 font-bold cursor-pointer hover:underline">Customize Plan →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK RESTOCK */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-blue-400" />
                <h3 className="font-bold text-sm">Quick Restock Inventory</h3>
              </div>
              <button 
                onClick={() => setRestockModalItem(null)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Item Details</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">{restockModalItem.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Current Stock: <span className="font-bold text-slate-800">{restockModalItem.inStock} {restockModalItem.unit}</span> | Safety Par: <span className="font-bold text-slate-800">{restockModalItem.minThreshold} {restockModalItem.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Primary Supplier: <span className="font-semibold text-slate-700">{restockModalItem.supplier}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Restock Quantity to Add ({restockModalItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  New stock level will be: <strong className="text-slate-800">{restockModalItem.inStock + Number(restockAmount)} {restockModalItem.unit}</strong>
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 flex justify-between items-center">
                <span>Estimated Invoicing Cost:</span>
                <span className="font-bold text-sm">₹{(restockAmount * restockModalItem.estimatedCostPerUnit).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Confirm & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURE SAFETY THRESHOLD LEVEL */}
      {thresholdModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Configure Threshold Monitor</h3>
                  <p className="text-[10px] text-slate-400">Set safety par level for visual warning triggers</p>
                </div>
              </div>
              <button 
                onClick={() => setThresholdModalItem(null)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateThreshold} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Item</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{thresholdModalItem.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Current In-Stock: <strong className="text-slate-800">{thresholdModalItem.inStock} {thresholdModalItem.unit}</strong>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    thresholdModalItem.inStock <= thresholdModalItem.minThreshold
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {thresholdModalItem.inStock <= thresholdModalItem.minThreshold ? '⚠️ Currently Below Threshold' : '✓ Stock Healthy'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Minimum Par Threshold Level ({thresholdModalItem.unit})
                  </label>
                  <span className="text-xs font-extrabold text-blue-600">
                    {thresholdInputVal} {thresholdModalItem.unit}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={thresholdInputVal}
                  onChange={(e) => setThresholdInputVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                
                {/* Preset Buttons */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Presets:</span>
                  {[20, 50, 100, 200].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setThresholdInputVal(val)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                        thresholdInputVal === val 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {val} {thresholdModalItem.unit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Bell size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Threshold Monitor Alert Rule</div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    If stock falls at or below <strong>{thresholdInputVal} {thresholdModalItem.unit}</strong>, visual warning badges and high-priority alert banners will trigger automatically in Menu Management.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setThresholdModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <ShieldAlert size={14} />
                  Save Safety Threshold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW INVENTORY ITEM */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-blue-400" />
                <h3 className="font-bold text-sm">Add New Supply / Equipment Item</h3>
              </div>
              <button 
                onClick={() => setIsAddItemModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Item / Ingredient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saffron / Kesar, Extra Wine Glasses..."
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Food Supplies">Food Supplies</option>
                    <option value="Equipment & Tableware">Equipment & Tableware</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Measurement Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, Liters, Units, Sets, Cans..."
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current In-Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newItem.inStock}
                    onChange={(e) => setNewItem({ ...newItem, inStock: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Safety Par Threshold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItem.minThreshold}
                    onChange={(e) => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Consumption Rate (per 100 Pax)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={newItem.consumptionPer100Pax}
                    onChange={(e) => setNewItem({ ...newItem, consumptionPer100Pax: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Est. Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItem.estimatedCostPerUnit}
                    onChange={(e) => setNewItem({ ...newItem, estimatedCostPerUnit: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Supplier / Vendor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Dairy Foods, City Tableware Rentals"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROCUREMENT REORDER PURCHASE SHEET */}
      {isProcurementSheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">Generated Procurement Reorder Sheet</h3>
                  <p className="text-[10px] text-slate-400">Automated purchase list calculated for {activePaxForCalculation} upcoming event Pax</p>
                </div>
              </div>
              <button 
                onClick={() => setIsProcurementSheetOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-emerald-900">Total Purchase Order Estimate:</span>
                  <p className="text-[11px] text-emerald-700">Covers critical shortages + safety par buffers for scheduled events.</p>
                </div>
                <div className="text-xl font-extrabold text-emerald-800">
                  ₹{totalReorderEstimate.toLocaleString('en-IN')}
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Item & Supplier</th>
                    <th className="p-2.5">Current Stock</th>
                    <th className="p-2.5">Required Demand</th>
                    <th className="p-2.5 text-red-600 font-extrabold">Deficit</th>
                    <th className="p-2.5 bg-emerald-50 text-emerald-900">Suggested Order</th>
                    <th className="p-2.5 text-right">Est. Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryWithCalculations
                    .filter(i => i.isCriticalDeficit || i.isLowStock)
                    .map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.supplier}</div>
                        </td>
                        <td className="p-2.5 text-slate-600">{item.inStock} {item.unit}</td>
                        <td className="p-2.5 font-bold text-slate-800">{item.requiredQty} {item.unit}</td>
                        <td className="p-2.5 font-extrabold text-red-600">
                          {item.shortageQty > 0 ? `-${item.shortageQty} ${item.unit}` : '0'}
                        </td>
                        <td className="p-2.5 bg-emerald-50/60 font-bold text-emerald-900">
                          {item.suggestedReorderQty} {item.unit}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ₹{item.reorderCostEstimate.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  // Simulate bulk restock
                  setInventory(prev => prev.map(item => {
                    const found = inventoryWithCalculations.find(c => c.id === item.id);
                    if (found && found.suggestedReorderQty > 0) {
                      return {
                        ...item,
                        inStock: item.inStock + found.suggestedReorderQty,
                        lastRestocked: new Date().toISOString().split('T')[0]
                      };
                    }
                    return item;
                  }));
                  setIsProcurementSheetOpen(false);
                  setSuccessToast('All reorder quantities have been successfully received and stocked!');
                  setTimeout(() => setSuccessToast(null), 3500);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                ✓ Mark All Orders as Received & Restocked
              </button>
              <button
                onClick={() => setIsProcurementSheetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
