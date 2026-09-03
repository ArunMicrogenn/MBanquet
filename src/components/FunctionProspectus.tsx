import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  Utensils, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  Send, 
  ClipboardList, 
  Building2, 
  ChevronRight, 
  X, 
  Layers, 
  BadgeCheck, 
  Flame, 
  Wine,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  LayoutGrid,
  Calculator,
  DollarSign,
  Receipt,
  PlusCircle,
  Trash2,
  Percent,
  Coins
} from 'lucide-react';

export interface TimelineItem {
  id: string;
  time: string;
  activity: string;
  department: 'Banquet Service' | 'Kitchen / Catering' | 'AV & Technical' | 'Decoration' | 'Host / MC' | 'Housekeeping';
  notes: string;
}

export interface MenuSection {
  category: string;
  items: string[];
  specialInstructions?: string;
}

export interface ExtraServiceItem {
  id: string;
  name: string;
  category: 'AV & Technical' | 'Decoration & Floral' | 'Stage & Furniture' | 'Manpower & Security' | 'Utilities & Genset';
  amount: number;
}

export interface BeveragePackage {
  id: string;
  name: string;
  type: string;
  priceType: 'per_pax' | 'flat_fee';
  rate: number;
  description: string;
  includedItems: string[];
}

export const PREDEFINED_BEVERAGE_PACKAGES: BeveragePackage[] = [
  {
    id: 'bev-none',
    name: 'Standard Welcome Drinks (Included in Catering)',
    type: 'Non-Alcoholic Soft Bar',
    priceType: 'per_pax',
    rate: 0,
    description: 'Basic mineral water bottles & 2 seasonal welcome mocktails included with catering package.',
    includedItems: ['Packaged Mineral Water Bottles', 'Fresh Mango Mint Cooler', 'Blue Lagoon Mocktail']
  },
  {
    id: 'bev-soft-unlimited',
    name: 'Unlimited Soft Drinks, Juices & Artisan Mocktails',
    type: 'Non-Alcoholic Premium Bar',
    priceType: 'per_pax',
    rate: 150,
    description: 'Continuous unlimited service of branded soft drinks, canned fruit juices, and fresh artisan mocktails.',
    includedItems: ['Coke / Pepsi / Sprite / Fanta', 'Canned Real Fruit Juices', 'Fresh Watermelon & Mint Coolers', 'Packaged Mineral Water']
  },
  {
    id: 'bev-domestic-bar',
    name: 'Standard Domestic Beer & Wine Bar Package',
    type: 'Domestic Alcoholic Bar',
    priceType: 'per_pax',
    rate: 550,
    description: 'Premium Indian draft & bottled beers, domestic red & white wines, mixers, sodas, and ice setup.',
    includedItems: ['Kingfisher Ultra / Bira 91 / Tuborg', 'Sula Red & White Wines', 'Soda, Tonic Water & Soft Drinks', 'Ice & Crystal Glassware Setup']
  },
  {
    id: 'bev-premium-spirits',
    name: 'Royal Premium Spirits, Cocktails & Craft Beer Bar',
    type: 'Imported & Premium Bar',
    priceType: 'per_pax',
    rate: 950,
    description: 'Imported Scotch whiskies, single malts, premium vodka, gin, craft beers, signature cocktails, and live mixologist.',
    includedItems: ['Black Label / Chivas Regal (12 Yrs)', 'Grey Goose / Absolut Vodka', 'Tanqueray Gin & Craft Beers', '4 Signature Cocktails (Live Bartender)']
  },
  {
    id: 'bev-corkage-flat',
    name: 'Outside Liquor Corkage Permit & Bartender Charter',
    type: 'Corkage & Service Charter',
    priceType: 'flat_fee',
    rate: 35000,
    description: 'Client brings own alcoholic beverages. Includes venue excise corkage permit, bar setups, ice, lemons, mixers, and 3 bartenders.',
    includedItems: ['Excise Corkage Permit Fee', '3 Professional Mixologists', 'Unlimited Soda, Ice, Lemons & Fruit Garnishes', 'Crystal Glassware & Barware Setup']
  }
];

export interface ProspectusRecord {
  id: string;
  prospectusNo: string;
  bookingRef: string;
  eventTitle: string;
  eventType: string;
  hostName: string;
  hostCompany?: string;
  hostPhone: string;
  hostEmail: string;
  eventDate: string;
  setupTime: string;
  startTime: string;
  endTime: string;
  hallName: string;
  expectedPax: number;
  guaranteedPax: number;
  bufferPax: number;
  foodPlanName: string;
  serviceStyle: 'Buffet Service' | 'Plated Silver Service' | 'Cocktail Snacks & Drinks' | 'Pre-plated Thali';
  seatingSetup: 'Round Tables (Cluster of 8)' | 'Theater Style' | 'U-Shape Executive' | 'Cocktail High-Tables' | 'Banquet Long Tables';
  stageSetup: string;
  avSetup: string;
  decorationTheme: string;
  acTemperature: string;
  specialNotes: string;
  timeline: TimelineItem[];
  menu: MenuSection[];
  perPaxRate: number;
  hallRentalFee: number;
  beveragePackageId?: string;
  beveragePackageName?: string;
  beverageRate?: number;
  beveragePriceType?: 'per_pax' | 'flat_fee';
  extraServices: ExtraServiceItem[];
  gstRate: number;
  serviceChargeRate: number;
  advancePaid: number;
  departmentSignoffs: {
    banquetManager: { signed: boolean; name: string; time?: string };
    executiveChef: { signed: boolean; name: string; time?: string };
    avTechnician: { signed: boolean; name: string; time?: string };
    housekeeping: { signed: boolean; name: string; time?: string };
    clientHost: { signed: boolean; name: string; time?: string };
  };
}

const mockProspectuses: ProspectusRecord[] = [
  {
    id: 'fp-101',
    prospectusNo: 'BEO-2026-0891',
    bookingRef: 'BK-2026-901',
    eventTitle: 'TechCorp Annual Innovation Summit & Gala Dinner',
    eventType: 'Corporate Annual Gala',
    hostName: 'Mr. Rajesh Varma',
    hostCompany: 'TechCorp Solutions India Pvt Ltd',
    hostPhone: '+91 98200 12345',
    hostEmail: 'events@techcorp.in',
    eventDate: '2026-09-05',
    setupTime: '15:00',
    startTime: '18:30',
    endTime: '23:00',
    hallName: 'Grand Crystal Ballroom',
    expectedPax: 350,
    guaranteedPax: 320,
    bufferPax: 35,
    foodPlanName: 'Platinum Corporate Feast Plan',
    serviceStyle: 'Buffet Service',
    seatingSetup: 'Round Tables (Cluster of 8)',
    stageSetup: '32ft x 16ft Raised Wooden Stage with Black Velvet Backdrop & Acrylic Lectern',
    avSetup: 'Dual 16x9ft LED Walls, 4 Handheld Wireless Mics, 2 Lapel Mics, Studio Stage Lights, 125 KVA Generator Backup',
    decorationTheme: 'Royal Blue & Gold Corporate Lighting with Fresh Orchid Centerpieces',
    acTemperature: '21°C Constant',
    specialNotes: 'VIP Table #1 reserved for Board Directors. Ensure Jain Food counter is clearly labeled. High-speed 500Mbps WiFi dedicated SSID: TechCorp2026.',
    perPaxRate: 1250,
    hallRentalFee: 120000,
    beveragePackageId: 'bev-soft-unlimited',
    beveragePackageName: 'Unlimited Soft Drinks, Juices & Artisan Mocktails',
    beverageRate: 150,
    beveragePriceType: 'per_pax',
    extraServices: [
      { id: 'ex-1', name: 'Dual 16x9ft LED Walls & Live Camera Mix', category: 'AV & Technical', amount: 35000 },
      { id: 'ex-2', name: 'Royal Blue & Gold Floral & Lighting Setup', category: 'Decoration & Floral', amount: 25000 },
      { id: 'ex-3', name: '125 KVA Genset Diesel Backup Fuel Charge', category: 'Utilities & Genset', amount: 10000 },
      { id: 'ex-4', name: 'Dedicated High-Speed 500Mbps WiFi SSID', category: 'AV & Technical', amount: 5000 }
    ],
    gstRate: 18,
    serviceChargeRate: 5,
    advancePaid: 200000,
    timeline: [
      { id: 't1', time: '15:00', activity: 'Hall Handover & AV/LED Wall Testing', department: 'AV & Technical', notes: 'Test presentation slides & wireless mics' },
      { id: 't2', time: '17:30', activity: 'Kitchen Buffet Setup & Live Counters Fired', department: 'Kitchen / Catering', notes: 'Welcome drinks chilled to 4°C' },
      { id: 't3', time: '18:30', activity: 'Guest Registration & Welcome Drinks Service', department: 'Banquet Service', notes: 'Serve Mango Mint Cooler & Blue Lagoon' },
      { id: 't4', time: '19:15', activity: 'Keynote Address & Product Launch on Stage', department: 'Host / MC', notes: 'Dim hall lights by 40%' },
      { id: 't5', time: '20:30', activity: 'Main Dinner Buffet Unveiling', department: 'Banquet Service', notes: 'Announce dinner opening on PA system' },
      { id: 't6', time: '22:15', activity: 'Award Ceremony & DJ Dance Floor Open', department: 'AV & Technical', notes: 'Switch sound console to DJ Mode' },
      { id: 't7', time: '23:00', activity: 'Event Concludes & Hall Teardown', department: 'Banquet Service', notes: 'Secure left-over gifts and AV equipment' }
    ],
    menu: [
      {
        category: 'Welcome Drinks & Mocktails',
        items: ['Fresh Mango Mint Cooler', 'Blue Hawaiian Mocktail', 'Spiced Guava Punch', 'Mineral Water Glass Bottles']
      },
      {
        category: 'Pass-Around Hors d\'oeuvres / Starters',
        items: ['Paneer Tikka Angara (Live Tandoor)', 'Crispy Lotus Stem in Honey Chilli', 'Galouti Kebab on Mini Paratha', 'Chicken Malai Tikka', 'Golden Fried Butterfly Prawns'],
        specialInstructions: 'Serve starters continuously between 18:30 and 20:15.'
      },
      {
        category: 'Main Course Buffet',
        items: ['Paneer Butter Masala (Rich Cashew Gravy)', 'Dal Makhani Overnight Slow-Cooked', 'Subz Diwani Handi', 'Kashmiri Mutton Rogan Josh', 'Murgh Dum Biryani with Burani Raita', 'Assorted Indian Bread Basket (Butter Naan, Tandoori Roti, Laccha Paratha)', 'Jeera Steam Rice'],
        specialInstructions: 'Separate Jain Counter for Dal Tadka and Paneer Tikka Masala without onion/garlic.'
      },
      {
        category: 'Desserts & Live Counter',
        items: ['Live Hot Jalebi with Rabdi', 'Warm Shahi Tukda', 'Classic Vanilla Bean Ice Cream', 'Fresh Seasonal Fruit Platter']
      }
    ],
    departmentSignoffs: {
      banquetManager: { signed: true, name: 'Vikram Sethi (Banquet Manager)', time: '02 Sep 2026, 11:30 AM' },
      executiveChef: { signed: true, name: 'Chef Sanjeev Kapoor (Exec Chef)', time: '02 Sep 2026, 12:15 PM' },
      avTechnician: { signed: true, name: 'Rohan Sharma (Lead AV)', time: '02 Sep 2026, 01:00 PM' },
      housekeeping: { signed: false, name: 'Pending Supervisor Sign-off' },
      clientHost: { signed: true, name: 'Rajesh Varma (Host Representative)', time: '02 Sep 2026, 03:45 PM' }
    }
  },
  {
    id: 'fp-102',
    prospectusNo: 'BEO-2026-0892',
    bookingRef: 'BK-2026-904',
    eventTitle: 'Priya & Rahul Wedding Reception & Sangeet',
    eventType: 'Wedding Reception',
    hostName: 'Dr. Suresh Deshmukh',
    hostCompany: 'Deshmukh Family',
    hostPhone: '+91 98900 67890',
    hostEmail: 'deshmukh.wedding@gmail.com',
    eventDate: '2026-09-10',
    setupTime: '12:00',
    startTime: '19:00',
    endTime: '00:30',
    hallName: 'Royal Emerald Suite & Sapphire Lawn',
    expectedPax: 600,
    guaranteedPax: 550,
    bufferPax: 60,
    foodPlanName: 'Royal Maharashtrian & North Indian Fusion Plan',
    serviceStyle: 'Buffet Service',
    seatingSetup: 'Banquet Long Tables',
    stageSetup: '40ft Floral Mandap Stage with Royal Sofas & Groom/Bride Backdrop',
    avSetup: 'High-power Line Array Sound, Intelligent Moving Head Lights, Smoke Machine, 300 inch Projection Screen',
    decorationTheme: 'Marigold & Mogra Floral Theme with Brass Lamps & Warm Amber Wash',
    acTemperature: '20°C Constant',
    specialNotes: 'Baraat procession arriving at main gate at 18:30. Provide Dhol walas clearance and welcome drinks at porch.',
    perPaxRate: 1450,
    hallRentalFee: 180000,
    beveragePackageId: 'bev-premium-spirits',
    beveragePackageName: 'Royal Premium Spirits, Cocktails & Craft Beer Bar',
    beverageRate: 950,
    beveragePriceType: 'per_pax',
    extraServices: [
      { id: 'ex-10', name: '40ft Floral Mandap & Entry Arch Decoration', category: 'Decoration & Floral', amount: 65000 },
      { id: 'ex-11', name: 'High-Power Line Array Sound & DJ Console', category: 'AV & Technical', amount: 40000 },
      { id: 'ex-12', name: 'Cold Pyros & Fog Effects for Varmala', category: 'Stage & Furniture', amount: 15000 },
      { id: 'ex-13', name: 'Valet Parking & Security Personnel (10 Staff)', category: 'Manpower & Security', amount: 12000 }
    ],
    gstRate: 18,
    serviceChargeRate: 5,
    advancePaid: 350000,
    timeline: [
      { id: 't10', time: '12:00', activity: 'Floral Mandap & Stage Decoration Entry', department: 'Decoration', notes: 'Fresh Mogra flower garlands' },
      { id: 't11', time: '18:30', activity: 'Baraat Arrival & Gate Reception', department: 'Banquet Service', notes: 'Serve Rose Sherbet at entrance' },
      { id: 't12', time: '19:30', activity: 'Couple Entrance & Stage Varmala Ceremony', department: 'Host / MC', notes: 'Cold pyros on stage during Varmala' },
      { id: 't13', time: '20:30', activity: 'Grand Buffet Open with Live Chaat & Tawa Counters', department: 'Kitchen / Catering', notes: 'Ensure 4 parallel buffet lines' },
      { id: 't14', time: '22:00', activity: 'Sangeet Dance Performances & DJ Music', department: 'AV & Technical', notes: 'Monitor sound decibel levels' }
    ],
    menu: [
      {
        category: 'Entrance Welcome Drinks',
        items: ['Rose Badam Sherbet', 'Kesar Pista Thandai', 'Fresh Coconut Water']
      },
      {
        category: 'Live Street Chaat Stations',
        items: ['Pani Puri (3 Flavored Waters)', 'Dahi Bhalla Papdi Chaat', 'Hot Aloo Tikki Ragda', 'Pav Bhaji Counter']
      },
      {
        category: 'Royal Wedding Main Buffet',
        items: ['Kaju Katli Paneer Curry', 'Veg Kolhapuri', 'Puran Poli with Shrikhand', 'Lucknowi Subz Biryani', 'Butter Naan & Rumali Roti'],
        specialInstructions: 'Pure Vegetarian Preparation. 100% Nut-free options for allergic guests.'
      }
    ],
    departmentSignoffs: {
      banquetManager: { signed: true, name: 'Vikram Sethi (Banquet Manager)', time: '01 Sep 2026' },
      executiveChef: { signed: true, name: 'Chef Sanjeev Kapoor', time: '01 Sep 2026' },
      avTechnician: { signed: false, name: 'Pending AV Sign-off' },
      housekeeping: { signed: true, name: 'Sunita Rao (HK Head)', time: '01 Sep 2026' },
      clientHost: { signed: true, name: 'Dr. Suresh Deshmukh', time: '01 Sep 2026' }
    }
  }
];

export default function FunctionProspectus() {
  const [prospectuses, setProspectuses] = useState<ProspectusRecord[]>(mockProspectuses);
  const [selectedProspectusId, setSelectedProspectusId] = useState<string>(mockProspectuses[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'menu' | 'setup' | 'cost' | 'signoffs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Extra Service input state
  const [newExtraService, setNewExtraService] = useState<{ name: string; category: ExtraServiceItem['category']; amount: number }>({
    name: '',
    category: 'AV & Technical',
    amount: 0
  });

  // New Prospectus Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProspectus, setNewProspectus] = useState<Partial<ProspectusRecord>>({
    eventTitle: '',
    eventType: 'Corporate Event',
    hostName: '',
    hostCompany: '',
    hostPhone: '',
    hostEmail: '',
    eventDate: new Date().toISOString().split('T')[0],
    setupTime: '15:00',
    startTime: '18:00',
    endTime: '22:00',
    hallName: 'Grand Crystal Ballroom',
    expectedPax: 200,
    guaranteedPax: 180,
    bufferPax: 20,
    foodPlanName: 'Standard Banquet Feast',
    serviceStyle: 'Buffet Service',
    seatingSetup: 'Round Tables (Cluster of 8)',
    stageSetup: 'Standard 24x12ft Stage',
    avSetup: 'Sound System + 2 Wireless Mics + Projector',
    decorationTheme: 'Classic Elegant Amber Theme',
    acTemperature: '21°C',
    specialNotes: '',
    perPaxRate: 1100,
    hallRentalFee: 100000,
    beveragePackageId: 'bev-soft-unlimited',
    beveragePackageName: 'Unlimited Soft Drinks, Juices & Artisan Mocktails',
    beverageRate: 150,
    beveragePriceType: 'per_pax',
    gstRate: 18,
    serviceChargeRate: 5,
    advancePaid: 50000
  });

  const selectedProspectus = useMemo(() => {
    return prospectuses.find(p => p.id === selectedProspectusId) || prospectuses[0];
  }, [prospectuses, selectedProspectusId]);

  // Automated Cost Calculation Logic
  const costCalculation = useMemo(() => {
    const p = selectedProspectus;
    const paxCount = p.guaranteedPax || p.expectedPax || 0;
    const perPaxRate = p.perPaxRate || 0;
    const menuCateringSubtotal = paxCount * perPaxRate;
    const hallRentalSubtotal = p.hallRentalFee || 0;

    // Beverage Package Calculation
    const beveragePkg = PREDEFINED_BEVERAGE_PACKAGES.find(b => b.id === (p.beveragePackageId || 'bev-none')) || PREDEFINED_BEVERAGE_PACKAGES[0];
    const beverageName = p.beveragePackageName || beveragePkg.name;
    const beverageRate = p.beverageRate !== undefined ? p.beverageRate : beveragePkg.rate;
    const beveragePriceType = p.beveragePriceType || beveragePkg.priceType;
    const beverageSubtotal = beveragePriceType === 'per_pax' ? (paxCount * beverageRate) : beverageRate;

    const extraServicesList = p.extraServices || [];
    const extraServicesSubtotal = extraServicesList.reduce((sum, item) => sum + (item.amount || 0), 0);
    const grossSubtotal = menuCateringSubtotal + hallRentalSubtotal + beverageSubtotal + extraServicesSubtotal;
    const serviceChargeRate = p.serviceChargeRate || 0;
    const serviceChargeAmount = Math.round(grossSubtotal * (serviceChargeRate / 100));
    const taxableValue = grossSubtotal + serviceChargeAmount;
    const gstRate = p.gstRate || 0;
    const cgstRate = gstRate / 2;
    const sgstRate = gstRate / 2;
    const gstAmount = Math.round(taxableValue * (gstRate / 100));
    const cgstAmount = Math.round(taxableValue * (cgstRate / 100));
    const sgstAmount = Math.round(taxableValue * (sgstRate / 100));
    const totalEstimatedCost = taxableValue + gstAmount;
    const advancePaid = p.advancePaid || 0;
    const balanceDue = totalEstimatedCost - advancePaid;

    return {
      paxCount,
      perPaxRate,
      menuCateringSubtotal,
      hallRentalSubtotal,
      beveragePkg,
      beverageName,
      beverageRate,
      beveragePriceType,
      beverageSubtotal,
      extraServicesList,
      extraServicesSubtotal,
      grossSubtotal,
      serviceChargeRate,
      serviceChargeAmount,
      taxableValue,
      gstRate,
      cgstRate,
      sgstRate,
      gstAmount,
      cgstAmount,
      sgstAmount,
      totalEstimatedCost,
      advancePaid,
      balanceDue
    };
  }, [selectedProspectus]);

  // Handlers for modifying pricing/services
  const handleUpdateProspectusCostField = (field: keyof ProspectusRecord, value: number) => {
    setProspectuses(prev => prev.map(p => p.id === selectedProspectus.id ? { ...p, [field]: value } : p));
  };

  const handleSelectBeveragePackage = (packageId: string) => {
    const pkg = PREDEFINED_BEVERAGE_PACKAGES.find(b => b.id === packageId);
    if (!pkg) return;
    setProspectuses(prev => prev.map(p => p.id === selectedProspectus.id ? {
      ...p,
      beveragePackageId: pkg.id,
      beveragePackageName: pkg.name,
      beverageRate: pkg.rate,
      beveragePriceType: pkg.priceType
    } : p));
    setToastMessage(`Beverage Package updated to: ${pkg.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddExtraService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraService.name || newExtraService.amount <= 0) return;
    const newItem: ExtraServiceItem = {
      id: `ex-${Date.now()}`,
      name: newExtraService.name,
      category: newExtraService.category,
      amount: Number(newExtraService.amount)
    };
    setProspectuses(prev => prev.map(p => {
      if (p.id === selectedProspectus.id) {
        return {
          ...p,
          extraServices: [...(p.extraServices || []), newItem]
        };
      }
      return p;
    }));
    setNewExtraService({ name: '', category: 'AV & Technical', amount: 0 });
    setToastMessage(`Extra service "${newItem.name}" added to cost calculation!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveExtraService = (serviceId: string) => {
    setProspectuses(prev => prev.map(p => {
      if (p.id === selectedProspectus.id) {
        return {
          ...p,
          extraServices: (p.extraServices || []).filter(item => item.id !== serviceId)
        };
      }
      return p;
    }));
  };

  const filteredProspectuses = useMemo(() => {
    return prospectuses.filter(p => {
      const q = searchQuery.toLowerCase();
      return p.eventTitle.toLowerCase().includes(q) ||
        p.prospectusNo.toLowerCase().includes(q) ||
        p.hostName.toLowerCase().includes(q) ||
        p.hallName.toLowerCase().includes(q);
    });
  }, [prospectuses, searchQuery]);

  // Print Modal & Options
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printTargetMode, setPrintTargetMode] = useState<'master' | 'kitchen' | 'setup'>('master');

  // Handle Printable BEO / Prospectus Document
  const handlePrintBEO = (targetMode: 'master' | 'kitchen' | 'setup' = 'master') => {
    const printWin = window.open('', '_blank', 'width=1000,height=1150');
    if (!printWin) return;

    const p = selectedProspectus;
    const isKitchen = targetMode === 'kitchen';
    const isSetup = targetMode === 'setup';

    const documentTitle = isKitchen 
      ? `Kitchen & Culinary BEO - ${p.prospectusNo}`
      : isSetup 
      ? `Event Setup & Technical BEO - ${p.prospectusNo}`
      : `Master Function Prospectus BEO - ${p.prospectusNo}`;

    const modeBadgeText = isKitchen
      ? 'KITCHEN & CULINARY PREPARATION BEO'
      : isSetup
      ? 'EVENT OPERATIONS & SETUP BEO'
      : 'MASTER BANQUET EVENT ORDER (BEO)';

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${documentTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 12mm 12mm 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              padding: 0;
              margin: 0;
              color: #0f172a;
              background: #ffffff;
              line-height: 1.35;
              font-size: 11px;
            }
            .beo-wrapper {
              max-width: 850px;
              margin: 0 auto;
              padding: 10px;
            }
            .header-bar {
              border-bottom: 2.5px solid #0f172a;
              padding-bottom: 10px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .hotel-name {
              font-size: 20px;
              font-weight: 900;
              color: #0f172a;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .hotel-sub {
              font-size: 10px;
              color: #475569;
              margin-top: 2px;
              font-weight: 500;
            }
            .beo-title-badge {
              background: #0f172a;
              color: #ffffff;
              font-weight: 800;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              text-align: right;
            }
            .beo-ref-num {
              font-size: 12px;
              font-weight: 800;
              color: #0284c7;
              margin-top: 3px;
              text-align: right;
            }
            .confidential-tag {
              font-size: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              text-align: right;
              margin-top: 2px;
              font-weight: bold;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              background: #f8fafc;
              padding: 10px 12px;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              margin-bottom: 12px;
            }
            .meta-item label {
              font-size: 8.5px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 800;
              display: block;
              letter-spacing: 0.3px;
            }
            .meta-item val {
              font-size: 11.5px;
              color: #0f172a;
              font-weight: 800;
              display: block;
            }
            .pax-summary-box {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              margin-bottom: 14px;
              text-align: center;
            }
            .pax-card {
              border: 1px solid #94a3b8;
              padding: 8px;
              border-radius: 6px;
              background: #f1f5f9;
            }
            .pax-card.highlight {
              background: #e0f2fe;
              border-color: #0284c7;
            }
            .pax-card.buffer {
              background: #dcfce7;
              border-color: #16a34a;
            }
            .pax-label {
              font-size: 8.5px;
              text-transform: uppercase;
              font-weight: 800;
              color: #475569;
            }
            .pax-val {
              font-size: 18px;
              font-weight: 900;
              color: #0f172a;
              margin-top: 2px;
            }
            .section-title {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              background: #f1f5f9;
              padding: 6px 10px;
              border-left: 4px solid #0f172a;
              margin: 14px 0 8px 0;
              border-top: 1px solid #cbd5e1;
              border-right: 1px solid #cbd5e1;
              border-bottom: 1px solid #cbd5e1;
              letter-spacing: 0.5px;
              page-break-after: avoid;
              break-after: avoid;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              font-size: 10px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            th {
              background: #f1f5f9;
              padding: 6px 8px;
              text-align: left;
              font-weight: 800;
              border: 1px solid #cbd5e1;
              font-size: 9px;
              text-transform: uppercase;
              color: #334155;
            }
            td {
              padding: 6px 8px;
              border: 1px solid #e2e8f0;
              vertical-align: top;
            }
            .special-box {
              background: #fffbeb;
              border: 1.5px solid #f59e0b;
              border-radius: 6px;
              padding: 8px 12px;
              margin-bottom: 12px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .special-box-header {
              font-size: 9.5px;
              font-weight: 800;
              text-transform: uppercase;
              color: #b45309;
              margin-bottom: 3px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .special-box-content {
              font-size: 10.5px;
              font-weight: 700;
              color: #78350f;
            }
            .menu-course-card {
              border: 1px solid #cbd5e1;
              border-radius: 5px;
              padding: 8px 10px;
              margin-bottom: 8px;
              background: #ffffff;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .menu-course-title {
              font-size: 11px;
              font-weight: 800;
              color: #0f172a;
              text-transform: uppercase;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-bottom: 6px;
              display: flex;
              justify-content: space-between;
            }
            .menu-item-list {
              padding-left: 0;
              list-style: none;
              margin: 0;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 4px;
            }
            .menu-item-list li {
              font-size: 10.5px;
              font-weight: 600;
              color: #1e293b;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .checkbox-box {
              display: inline-block;
              width: 11px;
              height: 11px;
              border: 1.5px solid #475569;
              border-radius: 2px;
              margin-right: 4px;
              vertical-align: middle;
            }
            .signatures-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-top: 30px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .sig-box {
              border-top: 1.5px solid #0f172a;
              text-align: center;
              padding-top: 6px;
              font-size: 9.5px;
              font-weight: 700;
            }
            .sig-status {
              font-size: 8.5px;
              margin-top: 2px;
              font-weight: 800;
            }
            .status-signed { color: #15803d; }
            .status-pending { color: #b45309; }
            .footer-notes {
              margin-top: 20px;
              border-top: 1px solid #cbd5e1;
              padding-top: 8px;
              font-size: 8.5px;
              color: #64748b;
              display: flex;
              justify-content: space-between;
              font-weight: 600;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="beo-wrapper">
            <!-- HEADER BAR -->
            <div class="header-bar">
              <div>
                <div class="hotel-name">Grand Horizon Banquet & Convention</div>
                <div class="hotel-sub">Grand Royal Hospitality Group • 124 Convention Blvd • Phone: +91 22 5555 8800</div>
              </div>
              <div>
                <div class="beo-title-badge">${modeBadgeText}</div>
                <div class="beo-ref-num">BEO NO: ${p.prospectusNo}</div>
                <div class="confidential-tag">Booking Ref: ${p.bookingRef} | Printed: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <!-- EVENT METRICS GRID -->
            <div class="meta-grid">
              <div class="meta-item">
                <label>Event Title & Function</label>
                <val style="font-size: 13px; color: #0f172a;">${p.eventTitle}</val>
                <span style="font-size: 9.5px; color: #475569; font-weight: bold;">Type: ${p.eventType}</span>
              </div>
              <div class="meta-item">
                <label>Host Client & Contact</label>
                <val>${p.hostName}</val>
                <span style="font-size: 9.5px; color: #475569; font-weight: bold;">${p.hostCompany ? `${p.hostCompany} | ` : ''}${p.hostPhone}</span>
              </div>
              <div class="meta-item">
                <label>Event Date & Venue Hall</label>
                <val style="color: #0284c7;">${p.eventDate}</val>
                <span style="font-size: 10px; font-weight: 800; color: #0f172a;">Hall: ${p.hallName}</span>
              </div>
            </div>

            <div class="meta-grid" style="grid-template-columns: repeat(4, 1fr);">
              <div class="meta-item">
                <label>Hall Setup Time</label>
                <val style="color: #0284c7;">${p.setupTime} HRS</val>
              </div>
              <div class="meta-item">
                <label>Function Start Time</label>
                <val style="color: #16a34a;">${p.startTime} HRS</val>
              </div>
              <div class="meta-item">
                <label>Function End Time</label>
                <val style="color: #dc2626;">${p.endTime} HRS</val>
              </div>
              <div class="meta-item">
                <label>Service Style</label>
                <val style="font-size: 10.5px;">${p.serviceStyle}</val>
              </div>
            </div>

            <!-- PAX BREAKDOWN CARDS -->
            <div class="pax-summary-box">
              <div class="pax-card">
                <div class="pax-label">Expected Pax</div>
                <div class="pax-val">${p.expectedPax} Guests</div>
              </div>
              <div class="pax-card highlight">
                <div class="pax-label">Guaranteed Minimum Pax</div>
                <div class="pax-val" style="color: #0284c7;">${p.guaranteedPax} Guests</div>
              </div>
              <div class="pax-card buffer">
                <div class="pax-label">Buffer Kitchen Prep</div>
                <div class="pax-val" style="color: #16a34a;">+${p.bufferPax} Plates</div>
              </div>
            </div>

            ${p.specialNotes ? `
              <div class="special-box">
                <div class="special-box-header">⚠️ CRITICAL INSTRUCTIONS & DIETARY / HOST DIRECTIVES</div>
                <div class="special-box-content">${p.specialNotes}</div>
              </div>
            ` : ''}

            ${!isSetup ? `
              <!-- KITCHEN & CULINARY PROSPECTUS -->
              <div class="section-title">1. Food & Beverage Prospectus (${p.foodPlanName})</div>
              ${p.menu.map(m => `
                <div class="menu-course-card">
                  <div class="menu-course-title">
                    <span>• ${m.category}</span>
                    <span style="font-size: 9px; font-weight: normal; text-transform: none; color: #475569;">${isKitchen ? 'Kitchen Prep Checklist' : ''}</span>
                  </div>
                  <ul class="menu-item-list">
                    ${m.items.map(item => `
                      <li><span class="checkbox-box"></span> ${item}</li>
                    `).join('')}
                  </ul>
                  ${m.specialInstructions ? `
                    <div style="margin-top: 6px; font-size: 9.5px; font-weight: bold; color: #b45309; background: #fffbeb; padding: 4px 8px; border-radius: 4px;">
                      Kitchen Note: ${m.specialInstructions}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            ` : ''}

            ${!isKitchen ? `
              <!-- HALL LAYOUT, STAGE & TECHNICAL SPECS -->
              <div class="section-title">2. Hall Layout, AV & Technical Specifications</div>
              <table>
                <tr>
                  <td style="width: 160px; font-weight: bold; background: #f8fafc;">Seating Arrangement</td>
                  <td style="font-weight: 700;">${p.seatingSetup}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; background: #f8fafc;">Stage & Mandap Specs</td>
                  <td>${p.stageSetup}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; background: #f8fafc;">AV & Sound Equipment</td>
                  <td>${p.avSetup}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; background: #f8fafc;">Decoration Theme</td>
                  <td>${p.decorationTheme}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; background: #f8fafc;">Climate Control Target</td>
                  <td style="font-weight: 800; color: #0284c7;">${p.acTemperature}</td>
                </tr>
              </table>
            ` : ''}

            <!-- TIMELINE & RUN OF SHOW -->
            <div class="section-title">3. Minute-by-Minute Run of Show & Event Agenda</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 65px;">Time</th>
                  <th style="width: 210px;">Activity / Agenda</th>
                  <th style="width: 130px;">Responsible Dept</th>
                  <th>Operational Instructions & Staff Notes</th>
                </tr>
              </thead>
              <tbody>
                ${p.timeline.map(t => `
                  <tr>
                    <td><strong>${t.time}</strong></td>
                    <td><strong>${t.activity}</strong></td>
                    <td><span style="background: #f1f5f9; padding: 2px 5px; border-radius: 3px; font-weight: bold;">${t.department}</span></td>
                    <td>${t.notes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- AUTOMATED COST CALCULATION SUMMARY -->
            <div class="section-title">4. Financial Cost Calculation & Settlement Summary</div>
            <table>
              <thead>
                <tr>
                  <th>Cost Particulars</th>
                  <th>Basis / Qty</th>
                  <th>Unit Rate (₹)</th>
                  <th style="text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Food & Beverage Menu Catering</strong> (${p.foodPlanName})</td>
                  <td>${p.guaranteedPax} Pax (Guaranteed)</td>
                  <td>₹${p.perPaxRate} / Pax</td>
                  <td style="text-align: right; font-weight: bold;">₹${(p.guaranteedPax * p.perPaxRate).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td><strong>Beverage & Bar Package</strong> (${costCalculation.beverageName})</td>
                  <td>${costCalculation.beveragePriceType === 'per_pax' ? `${p.guaranteedPax} Pax (Guaranteed)` : 'Flat Corkage Fee'}</td>
                  <td>₹${costCalculation.beverageRate.toLocaleString('en-IN')} ${costCalculation.beveragePriceType === 'per_pax' ? '/ Pax' : 'Flat'}</td>
                  <td style="text-align: right; font-weight: bold;">₹${costCalculation.beverageSubtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td><strong>Venue Hall Rental</strong> (${p.hallName})</td>
                  <td>Fixed Charter Slot</td>
                  <td>₹${p.hallRentalFee.toLocaleString('en-IN')}</td>
                  <td style="text-align: right; font-weight: bold;">₹${p.hallRentalFee.toLocaleString('en-IN')}</td>
                </tr>
                ${(p.extraServices || []).map(ex => `
                  <tr>
                    <td><strong>Extra Service:</strong> ${ex.name} (${ex.category})</td>
                    <td>Contracted Extra</td>
                    <td>₹${ex.amount.toLocaleString('en-IN')}</td>
                    <td style="text-align: right; font-weight: bold;">₹${ex.amount.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
                <tr style="background: #f8fafc; font-weight: bold;">
                  <td colspan="3" style="text-align: right;">Gross Operating Subtotal:</td>
                  <td style="text-align: right;">₹${costCalculation.grossSubtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right;">Service Charge (${costCalculation.serviceChargeRate}%):</td>
                  <td style="text-align: right;">₹${costCalculation.serviceChargeAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right;">GST Output Tax (${costCalculation.gstRate}%):</td>
                  <td style="text-align: right;">₹${costCalculation.gstAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="background: #0f172a; color: #ffffff; font-extrabold;">
                  <td colspan="3" style="text-align: right;">ESTIMATED TOTAL FUNCTION COST:</td>
                  <td style="text-align: right; color: #34d399; font-size: 13px;">₹${costCalculation.totalEstimatedCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right; color: #047857; font-weight: bold;">Less Advance Booking Deposit Paid:</td>
                  <td style="text-align: right; color: #047857; font-weight: bold;">- ₹${costCalculation.advancePaid.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="background: #1e293b; color: #ffffff; font-weight: bold;">
                  <td colspan="3" style="text-align: right;">ESTIMATED BALANCE PAYABLE ON EVENT DAY:</td>
                  <td style="text-align: right; color: #fbbf24; font-size: 14px;">₹${costCalculation.balanceDue.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <!-- DEPARTMENTAL SIGNOFFS -->
            <div class="section-title">5. Departmental Verification Sign-off Audit</div>
            <div class="signatures-grid">
              <div class="sig-box">
                Banquet Manager<br/>
                <div class="sig-status ${p.departmentSignoffs.banquetManager.signed ? 'status-signed' : 'status-pending'}">
                  ${p.departmentSignoffs.banquetManager.signed ? `✓ ${p.departmentSignoffs.banquetManager.name}` : '[  ] Pending Sign-off'}
                </div>
              </div>
              <div class="sig-box">
                Executive Chef<br/>
                <div class="sig-status ${p.departmentSignoffs.executiveChef.signed ? 'status-signed' : 'status-pending'}">
                  ${p.departmentSignoffs.executiveChef.signed ? `✓ ${p.departmentSignoffs.executiveChef.name}` : '[  ] Pending Sign-off'}
                </div>
              </div>
              <div class="sig-box">
                Lead AV Technician<br/>
                <div class="sig-status ${p.departmentSignoffs.avTechnician.signed ? 'status-signed' : 'status-pending'}">
                  ${p.departmentSignoffs.avTechnician.signed ? `✓ ${p.departmentSignoffs.avTechnician.name}` : '[  ] Pending Sign-off'}
                </div>
              </div>
              <div class="sig-box">
                Host Representative<br/>
                <div class="sig-status ${p.departmentSignoffs.clientHost.signed ? 'status-signed' : 'status-pending'}">
                  ${p.departmentSignoffs.clientHost.signed ? `✓ ${p.departmentSignoffs.clientHost.name}` : '[  ] Pending Sign-off'}
                </div>
              </div>
            </div>

            <!-- FOOTER BAR -->
            <div class="footer-notes">
              <div>System Generated BEO • Grand Horizon Banquet ERP Engine</div>
              <div>Page 1 of 1 • Internal Operational Document</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Dispatch Prospectus Email Notification to Staff
  const handleSendProspectusToStaff = () => {
    setToastMessage(`Function Prospectus ${selectedProspectus.prospectusNo} dispatched to Banquet Staff & Kitchen leads!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sign off a department
  const handleDepartmentSignoff = (deptKey: keyof ProspectusRecord['departmentSignoffs']) => {
    const updated = prospectuses.map(p => {
      if (p.id === selectedProspectus.id) {
        return {
          ...p,
          departmentSignoffs: {
            ...p.departmentSignoffs,
            [deptKey]: {
              signed: true,
              name: `Verified Officer (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
              time: new Date().toLocaleDateString()
            }
          }
        };
      }
      return p;
    });
    setProspectuses(updated);
    setToastMessage(`Department sign-off recorded successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save new Prospectus
  const handleCreateProspectus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProspectus.eventTitle || !newProspectus.hostName) return;

    const created: ProspectusRecord = {
      id: `fp-${Date.now()}`,
      prospectusNo: `BEO-2026-0${Math.floor(800 + Math.random() * 199)}`,
      bookingRef: `BK-2026-${Math.floor(100 + Math.random() * 899)}`,
      eventTitle: newProspectus.eventTitle || 'Untitled Banquet Function',
      eventType: newProspectus.eventType || 'General Event',
      hostName: newProspectus.hostName || 'Guest Host',
      hostCompany: newProspectus.hostCompany || '',
      hostPhone: newProspectus.hostPhone || '+91 98000 00000',
      hostEmail: newProspectus.hostEmail || 'host@example.com',
      eventDate: newProspectus.eventDate || new Date().toISOString().split('T')[0],
      setupTime: newProspectus.setupTime || '15:00',
      startTime: newProspectus.startTime || '18:00',
      endTime: newProspectus.endTime || '22:00',
      hallName: newProspectus.hallName || 'Grand Crystal Ballroom',
      expectedPax: Number(newProspectus.expectedPax) || 100,
      guaranteedPax: Number(newProspectus.guaranteedPax) || 90,
      bufferPax: Number(newProspectus.bufferPax) || 10,
      foodPlanName: newProspectus.foodPlanName || 'Deluxe Banquet Menu',
      serviceStyle: (newProspectus.serviceStyle as any) || 'Buffet Service',
      seatingSetup: (newProspectus.seatingSetup as any) || 'Round Tables (Cluster of 8)',
      stageSetup: newProspectus.stageSetup || 'Standard Stage with Podium',
      avSetup: newProspectus.avSetup || 'Standard Sound & Wireless Mics',
      decorationTheme: newProspectus.decorationTheme || 'Classic Ambient Lights',
      acTemperature: newProspectus.acTemperature || '21°C',
      specialNotes: newProspectus.specialNotes || '',
      perPaxRate: Number(newProspectus.perPaxRate) || 1100,
      hallRentalFee: Number(newProspectus.hallRentalFee) || 100000,
      extraServices: [],
      gstRate: Number(newProspectus.gstRate) || 18,
      serviceChargeRate: Number(newProspectus.serviceChargeRate) || 5,
      advancePaid: Number(newProspectus.advancePaid) || 50000,
      timeline: [
        { id: 't-new-1', time: newProspectus.setupTime || '15:00', activity: 'Hall Setup & Kitchen Preparation', department: 'Banquet Service', notes: 'Check table linens and cutlery' },
        { id: 't-new-2', time: newProspectus.startTime || '18:00', activity: 'Guest Arrival & Service Commencement', department: 'Banquet Service', notes: 'Welcome drinks on entrance' },
        { id: 't-new-3', time: newProspectus.endTime || '22:00', activity: 'Event Concludes & Hall Clearance', department: 'Housekeeping', notes: 'Security check & inventory closing' }
      ],
      menu: [
        {
          category: 'Welcome Drinks',
          items: ['Fresh Lemon Mint Mojito', 'Spiced Buttermilk']
        },
        {
          category: 'Main Course Buffet',
          items: ['Paneer Butter Masala', 'Dal Makhani', 'Jeera Rice', 'Assorted Tandoori Rotis']
        }
      ],
      departmentSignoffs: {
        banquetManager: { signed: true, name: 'Duty Banquet Manager', time: new Date().toLocaleDateString() },
        executiveChef: { signed: false, name: 'Pending Chef Sign-off' },
        avTechnician: { signed: false, name: 'Pending AV Sign-off' },
        housekeeping: { signed: false, name: 'Pending HK Sign-off' },
        clientHost: { signed: false, name: 'Pending Host Sign-off' }
      }
    };

    setProspectuses([created, ...prospectuses]);
    setSelectedProspectusId(created.id);
    setIsCreateModalOpen(false);
    setToastMessage(`New Function Prospectus (${created.prospectusNo}) generated!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200 text-xs">
          <BadgeCheck className="text-emerald-400" size={16} />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER & ACTION BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <ClipboardList size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Function Prospectus (BEO) Management</h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Banquet Event Order Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Comprehensive operational sheet, menu details, timeline, and departmental sign-offs</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Plus size={15} /> Create Prospectus
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Printer size={15} /> Print Official BEO
          </button>
          <button
            onClick={handleSendProspectusToStaff}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Send size={15} className="text-blue-600" /> Dispatch to Staff
          </button>
        </div>
      </div>

      {/* PROSPECTUS SELECTION BAR & SEARCH */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR: PROSPECTUS LIST */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search prospectus, host, hall..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-slate-400 pointer-events-none" />
          </div>

          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Active Event Prospectuses ({filteredProspectuses.length})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredProspectuses.map(p => {
              const isSelected = p.id === selectedProspectus.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProspectusId(p.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {p.prospectusNo}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{p.eventDate}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-2 leading-snug">
                    {p.eventTitle}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-medium text-slate-700 truncate max-w-[120px]">{p.hallName}</span>
                    <span className="font-bold text-slate-900">{p.expectedPax} Pax</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN PANEL: SELECTED PROSPECTUS VIEW */}
        <div className="lg:col-span-3 space-y-5">
          {/* PROSPECTUS SUMMARY HERO CARD */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono font-bold text-xs rounded border border-blue-400/30">
                    {selectedProspectus.prospectusNo}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">• Ref: {selectedProspectus.bookingRef}</span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-white mt-1">
                  {selectedProspectus.eventTitle}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Event Date</div>
                <div className="text-base font-extrabold text-amber-400">{selectedProspectus.eventDate}</div>
              </div>
            </div>

            {/* QUICK META GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9.5px] font-bold text-slate-400 block uppercase">Host Client</span>
                <span className="font-bold text-white truncate block">{selectedProspectus.hostName}</span>
                <span className="text-[10px] text-slate-400">{selectedProspectus.hostPhone}</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9.5px] font-bold text-slate-400 block uppercase">Venue Assigned</span>
                <span className="font-bold text-blue-300 truncate block">{selectedProspectus.hallName}</span>
                <span className="text-[10px] text-slate-400">{selectedProspectus.eventType}</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9.5px] font-bold text-slate-400 block uppercase">Guest Attendance</span>
                <span className="font-extrabold text-emerald-400">{selectedProspectus.expectedPax} Expected</span>
                <span className="text-[10px] text-slate-400 block">Guaranteed: {selectedProspectus.guaranteedPax}</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9.5px] font-bold text-slate-400 block uppercase">Timings</span>
                <span className="font-bold text-white block">{selectedProspectus.startTime} - {selectedProspectus.endTime}</span>
                <span className="text-[10px] text-blue-300 block">Setup: {selectedProspectus.setupTime} HRS</span>
              </div>
            </div>

            {/* QUICK PRINT ACTIONS FOR DEPARTMENTS */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <Printer size={13} className="text-blue-400" /> Print Staff Formats:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handlePrintBEO('master')}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  Master BEO
                </button>
                <button
                  onClick={() => handlePrintBEO('kitchen')}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  Kitchen BEO
                </button>
                <button
                  onClick={() => handlePrintBEO('setup')}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  Setup & AV BEO
                </button>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION FOR DETAILS */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid size={14} /> Executive Summary
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock size={14} className={activeTab === 'timeline' ? 'text-amber-400' : 'text-slate-400'} />
              Run of Show Agenda ({selectedProspectus.timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Utensils size={14} className={activeTab === 'menu' ? 'text-emerald-400' : 'text-slate-400'} />
              Food & Beverage Menu ({selectedProspectus.menu.length} Courses)
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'setup'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Volume2 size={14} className={activeTab === 'setup' ? 'text-blue-400' : 'text-slate-400'} />
              Layout, AV & Decor
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'cost'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calculator size={14} className={activeTab === 'cost' ? 'text-emerald-400' : 'text-slate-400'} />
              Automated Cost Calculation
            </button>
            <button
              onClick={() => setActiveTab('signoffs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'signoffs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck size={14} className={activeTab === 'signoffs' ? 'text-purple-400' : 'text-slate-400'} />
              Department Sign-offs
            </button>
          </div>

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Operational Overview & Pax Distribution
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Expected Attendance</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{selectedProspectus.expectedPax} Pax</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Estimated head count</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Guaranteed Billing Pax</span>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">{selectedProspectus.guaranteedPax} Pax</div>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Minimum contractual floor</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Buffer Kitchen Prep</span>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">+{selectedProspectus.bufferPax} Plates</div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">10% Emergency food cushion</p>
                </div>
              </div>

              {/* AUTOMATED COST FINANCIAL WIDGET */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-4 rounded-xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-emerald-400 flex items-center gap-1.5">
                    <Calculator size={13} /> Financial Prospectus Cost Summary
                  </div>
                  <div className="text-xl font-black text-white">
                    ₹{costCalculation.totalEstimatedCost.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-semibold text-slate-300">(Incl. GST & Service Charge)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    F&B Catering: ₹{costCalculation.menuCateringSubtotal.toLocaleString('en-IN')} • Hall Rental: ₹{costCalculation.hallRentalSubtotal.toLocaleString('en-IN')} • Extras: ₹{costCalculation.extraServicesSubtotal.toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('cost')}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-lg transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  View Cost Table & Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-1">
                <div className="text-[10px] uppercase font-extrabold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle size={14} /> Special Event Instructions & Host Directives
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {selectedProspectus.specialNotes || 'No special directives logged for this event.'}
                </p>
              </div>

              {/* SERVICE & FOOD PLAN SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Utensils size={14} className="text-emerald-600" /> Service Style & Menu Package
                  </div>
                  <div className="text-xs text-slate-700">
                    <div>Food Package: <strong>{selectedProspectus.foodPlanName}</strong></div>
                    <div>Service Type: <strong>{selectedProspectus.serviceStyle}</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 size={14} className="text-blue-600" /> Seating & Climate Setup
                  </div>
                  <div className="text-xs text-slate-700">
                    <div>Seating Style: <strong>{selectedProspectus.seatingSetup}</strong></div>
                    <div>Climate Control: <strong>{selectedProspectus.acTemperature}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE / RUN OF SHOW */}
          {activeTab === 'timeline' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Minute-by-Minute Run of Show Agenda</h3>
                  <p className="text-xs text-slate-500">Scheduled sequence of events and departmental responsibilities</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedProspectus.timeline.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-start gap-3">
                      <div className="px-2.5 py-1 bg-slate-900 text-amber-400 font-mono font-extrabold text-xs rounded-lg shrink-0">
                        {item.time}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{item.activity}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200 shrink-0">
                      {item.department}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FOOD & BEVERAGE MENU PROSPECTUS */}
          {activeTab === 'menu' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Food & Beverage Detailed Prospectus</h3>
                  <p className="text-xs text-slate-500">Course breakdown and catering instructions for kitchen and service teams</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {selectedProspectus.foodPlanName}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProspectus.menu.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-xs text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Utensils size={14} className="text-emerald-600" />
                      {sec.category}
                    </div>

                    <ul className="space-y-1.5 pl-2 text-xs text-slate-700">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-medium">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {sec.specialInstructions && (
                      <div className="mt-3 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        Instructions: {sec.specialInstructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* BEVERAGE PACKAGE SECTION IN MENU TAB */}
              <div className="mt-6 p-5 bg-gradient-to-br from-purple-900/90 to-slate-900 text-white rounded-2xl shadow-sm border border-purple-800 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-purple-700/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-400/30">
                      <Wine size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">Selected Bar & Beverage Package</div>
                      <h4 className="font-bold text-sm text-white">{costCalculation.beverageName}</h4>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-400/30 font-bold text-xs rounded-lg">
                    {costCalculation.beveragePriceType === 'per_pax' 
                      ? `₹${costCalculation.beverageRate} / Pax` 
                      : `₹${costCalculation.beverageRate.toLocaleString('en-IN')} Flat Charter`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {costCalculation.beveragePkg.description}
                </p>

                <div>
                  <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">Included Beverages & Bar Inclusions</div>
                  <div className="flex flex-wrap gap-2">
                    {costCalculation.beveragePkg.includedItems.map((drink, dIdx) => (
                      <span key={dIdx} className="px-2.5 py-1 bg-white/10 text-white text-[11px] font-semibold rounded-lg border border-white/10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full shrink-0"></span>
                        {drink}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-semibold text-purple-200 border-t border-purple-800/80">
                  <span>Beverage Subtotal: <strong className="text-emerald-400 font-bold text-sm ml-1">₹{costCalculation.beverageSubtotal.toLocaleString('en-IN')}</strong></span>
                  <button
                    onClick={() => setActiveTab('cost')}
                    className="text-xs text-purple-300 hover:text-white font-bold underline flex items-center gap-1"
                  >
                    Change Beverage Package in Cost Table <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT, AV & DECOR SPECIFICATIONS */}
          {activeTab === 'setup' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Hall Layout & Audio-Visual Technical Specifications
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Seating Arrangement</span>
                  <span className="sm:col-span-2 font-bold text-slate-900">{selectedProspectus.seatingSetup}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Stage & Mandap Specs</span>
                  <span className="sm:col-span-2 font-bold text-slate-900">{selectedProspectus.stageSetup}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">AV & Sound Console</span>
                  <span className="sm:col-span-2 font-bold text-slate-900">{selectedProspectus.avSetup}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Decoration & Lighting Theme</span>
                  <span className="sm:col-span-2 font-bold text-slate-900">{selectedProspectus.decorationTheme}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">AC Temperature Target</span>
                  <span className="sm:col-span-2 font-bold text-blue-600">{selectedProspectus.acTemperature}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATED COST CALCULATION */}
          {activeTab === 'cost' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">Automated Prospectus Cost Calculation</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-200">
                      Live Dynamic Billing
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated cost aggregation summing menu catering, room rental, and extra services based on current booking details.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Currencies:</span>
                  <span className="px-2.5 py-1 bg-slate-900 text-amber-400 font-extrabold text-xs rounded-lg">INR (₹)</span>
                </div>
              </div>

              {/* 5 SUMMARY METRIC TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                    <span>F&B Catering</span>
                    <Utensils size={13} className="text-emerald-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹{costCalculation.menuCateringSubtotal.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                    {costCalculation.paxCount} Pax @ ₹{costCalculation.perPaxRate}
                  </p>
                </div>

                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200">
                  <div className="text-[10px] uppercase font-bold text-purple-700 flex items-center justify-between">
                    <span>Beverage Bar</span>
                    <Wine size={13} className="text-purple-600" />
                  </div>
                  <div className="text-lg font-black text-purple-950 mt-1">
                    ₹{costCalculation.beverageSubtotal.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-purple-700 mt-0.5 font-medium truncate">
                    {costCalculation.beveragePriceType === 'per_pax' ? `₹${costCalculation.beverageRate}/pax` : 'Flat Fee'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                    <span>Hall Rental</span>
                    <Building2 size={13} className="text-blue-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹{costCalculation.hallRentalSubtotal.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                    {selectedProspectus.hallName}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                    <span>Extra Services</span>
                    <Sparkles size={13} className="text-amber-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹{costCalculation.extraServicesSubtotal.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                    {costCalculation.extraServicesList.length} Ancillary Items
                  </p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-between">
                    <span>Total Cost</span>
                    <Coins size={13} className="text-emerald-400" />
                  </div>
                  <div className="text-lg font-black text-white mt-1">
                    ₹{costCalculation.totalEstimatedCost.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 font-medium truncate">
                    Bal: ₹{costCalculation.balanceDue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* AUTOMATED COST BREAKDOWN TABLE */}
              <div className="space-y-4">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between uppercase tracking-wider">
                  <span>Detailed Itemized Cost Breakdown</span>
                  <span className="text-[11px] text-slate-400 font-normal lowercase">Live auto-calculation</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Cost Category & Service Item</th>
                        <th className="p-3">Calculation Basis</th>
                        <th className="p-3">Rate / Fee (₹)</th>
                        <th className="p-3 text-right">Subtotal Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                      {/* SECTION 1: FOOD & BEVERAGE CATERING */}
                      <tr className="bg-emerald-50/40">
                        <td colSpan={4} className="p-2.5 font-extrabold text-emerald-900 text-[11px] uppercase tracking-wide">
                          1. Food & Beverage Menu Catering
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{selectedProspectus.foodPlanName}</div>
                          <div className="text-[11px] text-slate-500">Service Style: {selectedProspectus.serviceStyle} ({selectedProspectus.menu.length} Courses)</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          Guaranteed {costCalculation.paxCount} Pax
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-xs">₹</span>
                            <input
                              type="number"
                              value={costCalculation.perPaxRate}
                              onChange={e => handleUpdateProspectusCostField('perPaxRate', Number(e.target.value))}
                              className="w-24 p-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-blue-500 outline-none"
                            />
                            <span className="text-[10px] text-slate-400">/pax</span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{costCalculation.menuCateringSubtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      {/* SECTION 2: BEVERAGE & BAR PACKAGE SELECTION */}
                      <tr className="bg-purple-50/50">
                        <td colSpan={4} className="p-2.5 font-extrabold text-purple-900 text-[11px] uppercase tracking-wide flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Wine size={13} className="text-purple-700" />
                            <span>2. Beverage & Bar Package Selection</span>
                          </div>
                          <span className="text-[10px] font-bold text-purple-800 lowercase">({costCalculation.beveragePkg.type})</span>
                        </td>
                      </tr>
                      <tr className="bg-purple-50/10">
                        <td className="p-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase block">Select Beverage Package</label>
                            <select
                              value={costCalculation.beveragePkg.id}
                              onChange={e => handleSelectBeveragePackage(e.target.value)}
                              className="w-full p-2 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-950 focus:border-purple-500 outline-none shadow-xs"
                            >
                              {PREDEFINED_BEVERAGE_PACKAGES.map(pkg => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} ({pkg.priceType === 'per_pax' ? `₹${pkg.rate}/pax` : `₹${pkg.rate.toLocaleString('en-IN')} Flat`})
                                </option>
                              ))}
                            </select>
                            <p className="text-[10.5px] text-slate-500 italic mt-1 leading-snug">
                              {costCalculation.beveragePkg.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {costCalculation.beveragePkg.includedItems.map((item, idx) => (
                                <span key={idx} className="text-[9.5px] px-2 py-0.5 bg-purple-100 text-purple-800 font-semibold rounded border border-purple-200">
                                  ✓ {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-700 align-top pt-4">
                          {costCalculation.beveragePriceType === 'per_pax' 
                            ? `Guaranteed ${costCalculation.paxCount} Pax` 
                            : 'Flat Charter Fee'}
                        </td>
                        <td className="p-3 align-top pt-4">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-xs">₹</span>
                            <input
                              type="number"
                              value={costCalculation.beverageRate}
                              onChange={e => handleUpdateProspectusCostField('beverageRate', Number(e.target.value))}
                              className="w-24 p-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-purple-500 outline-none"
                            />
                            <span className="text-[10px] text-slate-400">
                              {costCalculation.beveragePriceType === 'per_pax' ? '/pax' : 'flat'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-bold text-purple-900 text-sm align-top pt-4">
                          ₹{costCalculation.beverageSubtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      {/* SECTION 3: ROOM / HALL RENTAL */}
                      <tr className="bg-blue-50/40">
                        <td colSpan={4} className="p-2.5 font-extrabold text-blue-900 text-[11px] uppercase tracking-wide">
                          3. Venue Hall / Room Rental
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{selectedProspectus.hallName}</div>
                          <div className="text-[11px] text-slate-500">Event Slot: {selectedProspectus.setupTime} to {selectedProspectus.endTime} HRS</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          Fixed Hall Slot Charter
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-xs">₹</span>
                            <input
                              type="number"
                              value={costCalculation.hallRentalSubtotal}
                              onChange={e => handleUpdateProspectusCostField('hallRentalFee', Number(e.target.value))}
                              className="w-28 p-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{costCalculation.hallRentalSubtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      {/* SECTION 4: EXTRA SERVICES & ANCILLARIES */}
                      <tr className="bg-amber-50/40">
                        <td colSpan={4} className="p-2.5 font-extrabold text-amber-900 text-[11px] uppercase tracking-wide flex justify-between items-center">
                          <span>4. Extra Services & Technical Ancillaries</span>
                          <span className="text-[10px] font-bold text-amber-800 lowercase">({costCalculation.extraServicesList.length} items logged)</span>
                        </td>
                      </tr>
                      {costCalculation.extraServicesList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                            No extra services currently added. Add custom AV, decor, or manpower services below.
                          </td>
                        </tr>
                      ) : (
                        costCalculation.extraServicesList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 text-xs">Contracted Extra</td>
                            <td className="p-3 font-semibold text-slate-700">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-right font-bold text-slate-900">
                              <div className="flex items-center justify-end gap-3">
                                <span>₹{item.amount.toLocaleString('en-IN')}</span>
                                <button
                                  onClick={() => handleRemoveExtraService(item.id)}
                                  className="text-slate-400 hover:text-red-600 transition-colors"
                                  title="Remove Service"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}

                      {/* ADD EXTRA SERVICE INLINE FORM */}
                      <tr className="bg-slate-50/90">
                        <td colSpan={4} className="p-3">
                          <form onSubmit={handleAddExtraService} className="flex flex-col sm:flex-row items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase text-slate-500 shrink-0">
                              <PlusCircle size={14} className="inline mr-1 text-blue-600" /> Add Service:
                            </span>
                            <input
                              type="text"
                              placeholder="Extra Service Name (e.g. DJ Console, Fog Pyros...)"
                              required
                              value={newExtraService.name}
                              onChange={e => setNewExtraService({ ...newExtraService, name: e.target.value })}
                              className="flex-1 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:border-blue-500 outline-none"
                            />
                            <select
                              value={newExtraService.category}
                              onChange={e => setNewExtraService({ ...newExtraService, category: e.target.value as any })}
                              className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:border-blue-500 outline-none"
                            >
                              <option value="AV & Technical">AV & Technical</option>
                              <option value="Decoration & Floral">Decoration & Floral</option>
                              <option value="Stage & Furniture">Stage & Furniture</option>
                              <option value="Manpower & Security">Manpower & Security</option>
                              <option value="Utilities & Genset">Utilities & Genset</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Amount (₹)"
                              required
                              min={1}
                              value={newExtraService.amount || ''}
                              onChange={e => setNewExtraService({ ...newExtraService, amount: Number(e.target.value) })}
                              className="w-28 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:border-blue-500 outline-none"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shrink-0"
                            >
                              Add Charge
                            </button>
                          </form>
                        </td>
                      </tr>

                      {/* SECTION 4: TAXATION & SETTLEMENT SUMMARY */}
                      <tr className="bg-slate-900 text-white font-bold">
                        <td colSpan={3} className="p-3 text-right">
                          NET OPERATING SUBTOTAL (Catering + Hall + Extras):
                        </td>
                        <td className="p-3 text-right text-sm text-emerald-400 font-extrabold">
                          ₹{costCalculation.grossSubtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2} className="p-3 text-slate-700 font-semibold">
                          Service Charge ({costCalculation.serviceChargeRate}%):
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={costCalculation.serviceChargeRate}
                            onChange={e => handleUpdateProspectusCostField('serviceChargeRate', Number(e.target.value))}
                            className="w-16 p-1 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-800"
                          />
                          <span className="text-[10px] text-slate-400 ml-1">%</span>
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-800">
                          ₹{costCalculation.serviceChargeAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      <tr className="bg-slate-50">
                        <td colSpan={3} className="p-2.5 text-right font-bold text-slate-700">
                          TAXABLE BASE VALUE:
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ₹{costCalculation.taxableValue.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2} className="p-3 text-slate-700 font-semibold">
                          GST Output ({costCalculation.gstRate}% - CGST {costCalculation.cgstRate}% + SGST {costCalculation.sgstRate}%):
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={costCalculation.gstRate}
                            onChange={e => handleUpdateProspectusCostField('gstRate', Number(e.target.value))}
                            className="w-16 p-1 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-800"
                          />
                          <span className="text-[10px] text-slate-400 ml-1">%</span>
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-800">
                          ₹{costCalculation.gstAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      <tr className="bg-slate-900 text-white font-extrabold text-sm border-t-2 border-slate-950">
                        <td colSpan={3} className="p-3.5 text-right">
                          ESTIMATED GROSS FUNCTION COST:
                        </td>
                        <td className="p-3.5 text-right text-emerald-400 text-base font-black">
                          ₹{costCalculation.totalEstimatedCost.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      <tr className="bg-emerald-50">
                        <td colSpan={2} className="p-3 text-emerald-900 font-extrabold">
                          Less: Advance Booking Deposit Paid:
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-bold">₹</span>
                            <input
                              type="number"
                              value={costCalculation.advancePaid}
                              onChange={e => handleUpdateProspectusCostField('advancePaid', Number(e.target.value))}
                              className="w-28 p-1 bg-white border border-emerald-300 rounded-lg text-xs font-extrabold text-emerald-800 focus:border-emerald-500 outline-none"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-right font-extrabold text-emerald-700 text-sm">
                          - ₹{costCalculation.advancePaid.toLocaleString('en-IN')}
                        </td>
                      </tr>

                      <tr className="bg-blue-950 text-white font-extrabold text-base">
                        <td colSpan={3} className="p-4 text-right">
                          ESTIMATED BALANCE PAYABLE ON EVENT DAY:
                        </td>
                        <td className="p-4 text-right text-amber-400 font-black text-lg">
                          ₹{costCalculation.balanceDue.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEPARTMENTAL SIGNOFFS */}
          {activeTab === 'signoffs' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Departmental Verification Sign-offs</h3>
                  <p className="text-xs text-slate-500">Digital verification stamp from responsible leads before function execution</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Banquet Manager */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Banquet Operations Lead</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">
                      {selectedProspectus.departmentSignoffs.banquetManager.name}
                    </div>
                  </div>
                  {selectedProspectus.departmentSignoffs.banquetManager.signed ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                      ✓ Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDepartmentSignoff('banquetManager')}
                      className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
                    >
                      Sign Off
                    </button>
                  )}
                </div>

                {/* Executive Chef */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Executive Chef / Kitchen</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">
                      {selectedProspectus.departmentSignoffs.executiveChef.name}
                    </div>
                  </div>
                  {selectedProspectus.departmentSignoffs.executiveChef.signed ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                      ✓ Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDepartmentSignoff('executiveChef')}
                      className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
                    >
                      Sign Off
                    </button>
                  )}
                </div>

                {/* AV Technician */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Lead AV & Tech Lead</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">
                      {selectedProspectus.departmentSignoffs.avTechnician.name}
                    </div>
                  </div>
                  {selectedProspectus.departmentSignoffs.avTechnician.signed ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                      ✓ Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDepartmentSignoff('avTechnician')}
                      className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
                    >
                      Sign Off
                    </button>
                  )}
                </div>

                {/* Housekeeping */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Housekeeping & Hygiene</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">
                      {selectedProspectus.departmentSignoffs.housekeeping.name}
                    </div>
                  </div>
                  {selectedProspectus.departmentSignoffs.housekeeping.signed ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                      ✓ Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDepartmentSignoff('housekeeping')}
                      className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
                    >
                      Sign Off
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW PROSPECTUS MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-blue-400" size={20} />
                <h3 className="font-extrabold text-base">Generate Function Prospectus (BEO)</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProspectus} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Function / Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mehta Family Sangeet Gala"
                    value={newProspectus.eventTitle}
                    onChange={e => setNewProspectus({ ...newProspectus, eventTitle: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Type</label>
                  <select
                    value={newProspectus.eventType}
                    onChange={e => setNewProspectus({ ...newProspectus, eventType: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Corporate Annual Gala">Corporate Annual Gala</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Conference & Seminar">Conference & Seminar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Host Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Host Contact Person"
                    value={newProspectus.hostName}
                    onChange={e => setNewProspectus({ ...newProspectus, hostName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Host Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newProspectus.hostPhone}
                    onChange={e => setNewProspectus({ ...newProspectus, hostPhone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue Hall</label>
                  <select
                    value={newProspectus.hallName}
                    onChange={e => setNewProspectus({ ...newProspectus, hallName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  >
                    <option value="Grand Crystal Ballroom">Grand Crystal Ballroom</option>
                    <option value="Royal Emerald Suite">Royal Emerald Suite</option>
                    <option value="Sapphire Garden Lawn">Sapphire Garden Lawn</option>
                    <option value="Diamond Executive Lounge">Diamond Executive Lounge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expected Pax</label>
                  <input
                    type="number"
                    value={newProspectus.expectedPax}
                    onChange={e => setNewProspectus({ ...newProspectus, expectedPax: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guaranteed Pax</label>
                  <input
                    type="number"
                    value={newProspectus.guaranteedPax}
                    onChange={e => setNewProspectus({ ...newProspectus, guaranteedPax: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Buffer Plates</label>
                  <input
                    type="number"
                    value={newProspectus.bufferPax}
                    onChange={e => setNewProspectus({ ...newProspectus, bufferPax: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Setup Time</label>
                  <input
                    type="time"
                    value={newProspectus.setupTime}
                    onChange={e => setNewProspectus({ ...newProspectus, setupTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newProspectus.startTime}
                    onChange={e => setNewProspectus({ ...newProspectus, startTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={newProspectus.endTime}
                    onChange={e => setNewProspectus({ ...newProspectus, endTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Event Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g., VIP seating details, dietary needs, wifi setup..."
                  value={newProspectus.specialNotes}
                  onChange={e => setNewProspectus({ ...newProspectus, specialNotes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save & Generate Prospectus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT BEO SELECTION MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Printer className="text-blue-400" size={20} />
                <div>
                  <h3 className="font-extrabold text-base">Print Formal BEO Document</h3>
                  <p className="text-[11px] text-slate-400">Select document format for kitchen, event or master staff</p>
                </div>
              </div>
              <button onClick={() => setIsPrintModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Prospectus</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProspectus.eventTitle}</span>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-mono font-bold text-xs rounded-lg">
                  {selectedProspectus.prospectusNo}
                </span>
              </div>

              <div className="space-y-2.5">
                <label className="font-bold text-slate-700 block">Choose Departmental Layout:</label>

                {/* Option 1: Master BEO */}
                <button
                  onClick={() => {
                    handlePrintBEO('master');
                    setIsPrintModalOpen(false);
                  }}
                  className="w-full text-left p-3.5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-500 rounded-xl transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ClipboardList size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Master Operations BEO (Complete Document)</span>
                      <span className="text-[10px] font-bold text-blue-600">All Sections</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Full operational specification including host contact, setup, timeline, food plan, and all department sign-offs.
                    </p>
                  </div>
                </button>

                {/* Option 2: Kitchen BEO */}
                <button
                  onClick={() => {
                    handlePrintBEO('kitchen');
                    setIsPrintModalOpen(false);
                  }}
                  className="w-full text-left p-3.5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-500 rounded-xl transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Utensils size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Kitchen & Culinary BEO Order</span>
                      <span className="text-[10px] font-bold text-amber-600">Chef & Kitchen Staff</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Focuses on pax counts (Guaranteed + Buffer), dietary warnings, course breakdowns, item prep checkboxes, and live stations.
                    </p>
                  </div>
                </button>

                {/* Option 3: Event Setup BEO */}
                <button
                  onClick={() => {
                    handlePrintBEO('setup');
                    setIsPrintModalOpen(false);
                  }}
                  className="w-full text-left p-3.5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-800 rounded-xl transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
                    <Printer size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Event Setup & Technical BEO</span>
                      <span className="text-[10px] font-bold text-slate-700">Banquet, AV & HK Staff</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Focuses on seating layout, stage/mandap dimensions, sound console specs, climate control, and event agenda run of show.
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
