import React, { useState, ChangeEvent, useEffect } from 'react';
import { auth, db, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import HallCalendar from './components/HallCalendar';
import Customers from './components/Customers';
import RecentActivities from './components/RecentActivities';
import QuickBookingModal from './components/QuickBookingModal';
import RevenueChart from './components/RevenueChart';
import MenuManagement from './components/MenuManagement';
import Invoices from './components/Invoices';
import PropertyConfiguration from './components/PropertyConfiguration';
import ContractGenerator from './components/ContractGenerator';
import HallInsights from './components/HallInsights';
import HallMasters from './components/HallMasters';
import FunctionTypeMasters from './components/FunctionTypeMasters';
import FoodPlanMasters from './components/FoodPlanMasters';
import SeatingTypeMasters from './components/SeatingTypeMasters';
import TaxMasters from './components/TaxMasters';
import SessionMasters from './components/SessionMasters';
import EmailTemplates, { initialTemplates } from './components/EmailTemplates';
import AuditTrail from './components/AuditTrail';
import CheckoutSettlement from './components/CheckoutSettlement';
import Reports from './components/Reports';
import NotificationPopover from './components/NotificationPopover';
import BookingForecastChart from './components/BookingForecastChart';
import VenueMapping from './components/VenueMapping';
import TaskBoard from './components/TaskBoard';
import QRScannerModal from './components/QRScannerModal';
import AIChatAssistant from './components/AIChatAssistant';
import StaffManagement from './components/StaffManagement';
import PublicLobbyView from './components/PublicLobbyView';
import Dashboard from './components/Dashboard';
import FunctionProspectus from './components/FunctionProspectus';
import { QrCode, LogOut, Shield, ClipboardList, Building2 } from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [filter, setFilter] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'customers' | 'menu' | 'invoices' | 'property' | 'contracts' | 'insights' | 'halls_master' | 'function_types_master' | 'food_plan_master' | 'seating_type_master' | 'tax_master' | 'session_master' | 'audit_trail' | 'checkout' | 'reports' | 'email_templates' | 'staff_management' | 'function_prospectus'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [dateRange, setDateRange] = useState('This Month');
  const [selectedProperty, setSelectedProperty] = useState('All Properties');
  const [bookings, setBookings] = useState([
    { id: 'b1', title: 'Crystal Ballroom - Wedding', start: '2026-08-27T10:00:00', end: '2026-08-27T14:00:00', hall: 'Crystal Ballroom', pax: 350, checkedIn: false, status: 'Confirmed' },
    { id: 'b2', title: 'Ruby Suite - Seminar', start: '2026-08-28T14:00:00', end: '2026-08-28T18:00:00', hall: 'Ruby Suite', pax: 120, checkedIn: false, status: 'Provisional' },
    { id: 'b3', title: 'Crystal Ballroom - Gala', start: '2026-08-29T18:00:00', end: '2026-08-29T23:00:00', hall: 'Crystal Ballroom', pax: 800, checkedIn: false, status: 'Cancelled' },
  ]);
  const [seatingTypes, setSeatingTypes] = useState(['Theater', 'Classroom', 'U-Shape', 'Boardroom', 'Banquet', 'Cabaret', 'Cocktail / Reception']);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const isPublicView = new URLSearchParams(window.location.search).get('public') === 'true';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            setUserRole(role);
            // Redirect based on role if needed, e.g. staff only see calendar by default
            if (role === 'Banquet Staff') setActiveView('calendar');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredBookings = filter === 'booking' ? bookings.filter(b => b.title.includes('Booking')) : bookings;

  const handleScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      const bookingIndex = bookings.findIndex(b => b.title === data.title && b.start === data.date);
      if (bookingIndex !== -1) {
        const newBookings = [...bookings];
        newBookings[bookingIndex].checkedIn = true;
        setBookings(newBookings);
        setToast({ message: `Check-in successful for ${data.title}!`, type: 'success' });
      } else {
        setToast({ message: 'Booking not found.', type: 'error' });
      }
    } catch (e) {
      setToast({ message: 'Invalid QR Code format.', type: 'error' });
    }
    setIsScannerOpen(false);
    setTimeout(() => setToast(null), 3000);
  };

  const checkConflict = (bookingToCheck: any, excludeBooking?: any) => {
    const requestedHalls = bookingToCheck.halls || (bookingToCheck.hall ? bookingToCheck.hall.split(',').map((h: string) => h.trim()) : []);
    
    return bookings.some(b => {
      if (excludeBooking && b === excludeBooking) return false;
      const existingHalls = b.halls || (b.hall ? b.hall.split(',').map((h: string) => h.trim()) : []);
      
      const hasHallOverlap = requestedHalls.some((h: string) => existingHalls.includes(h));
      if (!hasHallOverlap) return false;

      const startToCheck = new Date(bookingToCheck.start).getTime();
      const endToCheck = new Date(bookingToCheck.end).getTime();
      const existingStart = new Date(b.start).getTime();
      const existingEnd = new Date(b.end).getTime();
      
      return startToCheck < existingEnd && endToCheck > existingStart;
    });
  };

  const updateBooking = (oldBooking: any, updatedBooking: any) => {
    if (checkConflict(updatedBooking, oldBooking)) {
      setToast({ message: 'Conflict detected across selected halls!', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return false;
    }

    setBookings(bookings.map(b => b === oldBooking ? updatedBooking : b));
    setToast({ message: 'Booking rescheduled successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    return true;
  };

  const addBooking = (newBookings: any | any[]) => {
    const bookingsToAdd = Array.isArray(newBookings) ? newBookings : [newBookings];

    const hasConflict = bookingsToAdd.some(b => checkConflict(b));
    if (hasConflict) {
      setToast({ message: 'Conflict detected across selected halls or dates!', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return false;
    }
    
    const finalBookings = bookingsToAdd.map(newBooking => {
      const hallsArray = newBooking.halls || (newBooking.hall ? newBooking.hall.split(',').map((h: string) => h.trim()) : []);
      return { 
        ...newBooking, 
        halls: hallsArray, 
        hall: hallsArray.join(', ') 
      };
    });
    
    setBookings([...bookings, ...finalBookings]);
    return true;
  };

  const handleManualBooking = (newBooking: any) => {
    const success = addBooking(newBooking);
    if (success) {
      setToast({ message: 'Booking confirmed!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
      setIsModalOpen(false);

      // Send Staff Notification Email
      const staffTemplate = initialTemplates.find(t => t.name === 'Staff Notification');
      if (staffTemplate) {
        // Use the first booking of the batch for details if it's an array
        const bookingDetails = Array.isArray(newBooking) ? newBooking[0] : newBooking;
        const customer = bookingDetails.title?.split('-')[0]?.trim() || 'Unknown';
        const event = bookingDetails.title?.split('-')[1]?.trim() || 'Event';
        const date = new Date(bookingDetails.start).toLocaleDateString();

        const formattedSubject = staffTemplate.subject.replace('{event}', event);
        const formattedBody = staffTemplate.body
          .replace('{customer}', customer)
          .replace('{event}', event)
          .replace('{date}', date)
          .replace('{hall}', bookingDetails.hall || '')
          .replace('{pax}', bookingDetails.pax?.toString() || '');

        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateName: staffTemplate.name,
            recipient: 'staff@banquethall.com',
            subject: formattedSubject,
            body: formattedBody
          })
        }).catch(err => console.error('Failed to send staff email', err));
      }
    }
    return success;
  };

  const handleBulkImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').slice(1); // skip header
      const newBookings = rows.map(row => {
        const [title, start, end, hall] = row.split(',');
        return { title: title?.trim(), start: start?.trim(), end: end?.trim(), hall: hall?.trim() };
      }).filter(b => b.title && b.start && b.end && b.hall);

      let addedCount = 0;
      newBookings.forEach(b => {
        if (addBooking(b)) addedCount++;
      });
      
      setToast({ message: `Imported ${addedCount} bookings!`, type: 'success' });
      setTimeout(() => setToast(null), 3000);
    };
    reader.readAsText(file);
  };

  if (isPublicView) {
    return <PublicLobbyView bookings={bookings} />;
  }

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        // Ignored
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">Loading App...</div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070D1B] p-4 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center font-black text-slate-950 text-2xl mb-4 shadow-lg shadow-amber-500/20">GH</div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-white">Grand Horizon <span className="text-amber-400">ERP</span></h1>
          <p className="text-slate-400 text-xs mb-8 text-center font-medium">Enterprise Banquet & Convention Center Management System</p>
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className={`w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2.5 hover:bg-slate-100 ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
            {isLoggingIn ? 'Authenticating...' : 'Sign in with Google SSO'}
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = userRole === 'Admin';
  const isManager = userRole === 'Manager';
  const isStaff = userRole === 'Banquet Staff';

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden relative">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold text-white flex items-center gap-2 border ${toast.type === 'error' ? 'bg-red-600 border-red-500' : 'bg-emerald-600 border-emerald-500'}`}>
          {toast.message}
        </div>
      )}
      <QuickBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBookingAdd={handleManualBooking} />
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleScanSuccess} />
      <AIChatAssistant contextData={{
        bookings,
        dashboardMetrics: {
          todayOccupancy: '84.2%',
          monthlyRevenue: '₹42,85,200',
          pendingInquiries: 18,
          outstandingDues: '₹8,12,000'
        }
      }} />
      {/* Sidebar - Executive Deep Navy & Gold Accent Palette */}
      <aside className="w-64 bg-[#080E1E] border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-3.5 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm shadow-xs">GH</div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight block leading-none">Grand Horizon</span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mt-0.5">Banquet ERP</span>
            </div>
          </div>
        </div>
        
        {/* User Profile Area */}
        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Avatar" className="w-8 h-8 rounded-full border border-amber-500/40" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
              <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">{userRole || 'Pending Role'}</div>
            </div>
          </div>
          <button onClick={logout} className="text-[11px] font-bold flex items-center justify-center gap-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 py-1 rounded-lg transition-colors mt-1">
            <LogOut size={12} /> Sign Out
          </button>
        </div>

        <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto text-xs">
          <div className="text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold px-3 py-1.5 mt-1">Main Operations</div>
          
          {(isAdmin || isManager) && (
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'dashboard' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'dashboard' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Dashboard
            </button>
          )}

          <button 
            onClick={() => setActiveView('calendar')}
            className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'calendar' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'calendar' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Hall Calendar
          </button>

          {(isAdmin || isManager) && (
            <button 
              onClick={() => setActiveView('customers')}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'customers' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'customers' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> CRM / Customers
            </button>
          )}

          <div className="text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold px-3 py-1.5 mt-3">Event Execution</div>
          
          <button 
            onClick={() => window.open('?public=true', '_blank')}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          >
            <div className="w-3.5 h-3.5 rounded-xs border-2 border-slate-600"></div> Public Lobby Display
          </button>

          <button 
            onClick={() => setActiveView('venue-mapping')}
            className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'venue-mapping' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'venue-mapping' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Venue Mapping
          </button>

          <button 
            onClick={() => setActiveView('menu')}
            className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'menu' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'menu' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Menu & Catering
          </button>

          <button 
            onClick={() => setActiveView('function_prospectus')}
            className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'function_prospectus' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            <ClipboardList size={15} className={activeView === 'function_prospectus' ? 'text-amber-400' : 'text-slate-500'} /> Function Prospectus (BEO)
          </button>

          {(isAdmin || isManager) && (
            <button 
              onClick={() => setActiveView('invoices')}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'invoices' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'invoices' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Invoices & Billing
            </button>
          )}

          {(isAdmin || isManager) && (
            <button 
              onClick={() => setActiveView('property')}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'property' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'property' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Property Config
            </button>
          )}

          {(isAdmin || isManager) && (
            <button 
              onClick={() => setActiveView('contracts')}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'contracts' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'contracts' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Contracts & Terms
            </button>
          )}

          {(isAdmin || isManager) && (
            <button 
              onClick={() => setActiveView('insights')}
              className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'insights' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'insights' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Hall Insights & Yield
            </button>
          )}

          {isAdmin && (
            <>
              <div className="text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold px-3 py-1.5 mt-3">Master Configurations</div>
              <button 
                onClick={() => setActiveView('halls_master')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'halls_master' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'halls_master' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Hall Master
              </button>
              <button 
                onClick={() => setActiveView('function_types_master')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'function_types_master' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'function_types_master' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Function Types
              </button>
              <button 
                onClick={() => setActiveView('food_plan_master')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'food_plan_master' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'food_plan_master' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Food Plan Packages
              </button>
              <button 
                onClick={() => setActiveView('seating_type_master')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'seating_type_master' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'seating_type_master' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Seating Setups
              </button>
              <button 
                onClick={() => setActiveView('tax_master')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'tax_master' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'tax_master' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Tax & GST Setup
              </button>
              <button 
                onClick={() => setActiveView('session_master')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'session_master' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'session_master' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Event Sessions
              </button>
              <button 
                onClick={() => setActiveView('email_templates')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'email_templates' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'email_templates' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Email Templates
              </button>
            </>
          )}
          {(isAdmin || isManager) && (
            <>
              <div className="text-[9.5px] uppercase tracking-widest text-slate-500 font-extrabold px-3 py-1.5 mt-3">Governance & Audit</div>
              
              {isAdmin && (
                <button 
                  onClick={() => setActiveView('staff_management')}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'staff_management' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <Shield size={15} className={activeView === 'staff_management' ? 'text-amber-400' : 'text-slate-500'} /> Staff & Personnel
                </button>
              )}

              <button 
                onClick={() => setActiveView('reports')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'reports' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'reports' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Financial Reports
              </button>
              <button 
                onClick={() => setActiveView('checkout')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'checkout' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'checkout' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Checkout Settlement
              </button>
              <button 
                onClick={() => setActiveView('audit_trail')}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeView === 'audit_trail' ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-extrabold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-xs border-2 ${activeView === 'audit_trail' ? 'border-amber-400 bg-amber-400/20' : 'border-slate-600'}`}></div> Audit Trail
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-12 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 flex-shrink-0 shadow-2xs">
          <h1 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {activeView === 'dashboard' ? 'Property & Operational Overview' : activeView === 'calendar' ? 'Hall Availability Calendar' : activeView === 'customers' ? 'CRM & Customer Directory' : activeView === 'menu' ? 'Menu & Catering Plans' : activeView === 'venue-mapping' ? 'Venue Mapping Layouts' : activeView === 'function_prospectus' ? 'Function Prospectus (BEO)' : activeView === 'invoices' ? 'Invoices & Billing' : activeView === 'property' ? 'Property Configuration' : activeView === 'contracts' ? 'Contract Generator' : activeView === 'insights' ? 'Hall Yield Insights' : activeView === 'halls_master' ? 'Hall Masters' : activeView === 'function_types_master' ? 'Function Type Masters' : activeView === 'food_plan_master' ? 'Food Plan Masters' : activeView === 'seating_type_master' ? 'Seating Setups' : activeView === 'tax_master' ? 'Tax Setup Masters' : activeView === 'session_master' ? 'Session Masters' : activeView === 'email_templates' ? 'Email Templates' : activeView === 'checkout' ? 'Checkout Settlement' : activeView === 'reports' ? 'Financial & Operations Reports' : activeView === 'staff_management' ? 'Staff & Personnel Directory' : 'Audit Trail'}
          </h1>
          <div className="flex items-center gap-2.5">
            {/* Global Multi-Property Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-xl transition-colors">
              <Building2 size={14} className="text-amber-600 shrink-0" />
              <select 
                value={selectedProperty} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProperty(e.target.value)}
                className="text-[11px] font-extrabold text-slate-800 uppercase bg-transparent outline-none cursor-pointer"
              >
                <option value="All Properties">All Properties (Chain View)</option>
                <option value="Grand Royal Banquet & Convention">Grand Royal Jubilee Hills (GR-HYD)</option>
                <option value="Imperial Palace Luxury Suites & Halls">Imperial Palace Banjara Hills (IP-BNJ)</option>
                <option value="Crystal Convention Center & Arena">Crystal Convention Gachibowli (CC-GCB)</option>
                <option value="Emerald Palms Oceanfront Resort & Lawns">Emerald Palms ECR (EP-CHE)</option>
              </select>
            </div>

            <button 
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 text-amber-300 hover:bg-slate-800 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs border border-slate-700"
            >
              <QrCode size={14} className="text-amber-400" /> Scan Pass
            </button>
            <NotificationPopover />
            {activeView === 'dashboard' && (
              <select 
                value={dateRange} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
                className="text-xs font-bold text-slate-700 uppercase bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 focus:outline-none focus:border-amber-500"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Custom</option>
              </select>
            )}
          </div>
        </header>
        <div className="p-3 flex-1 overflow-auto bg-slate-50">
          {activeView === 'dashboard' ? (
            <div className="relative h-full">
              <Dashboard 
                setFilter={setFilter}
                dateRange={dateRange}
                selectedProperty={selectedProperty}
                filter={filter}
                handleBulkImport={handleBulkImport}
              />
              <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-slate-900 text-amber-400 border border-amber-500/30 hover:bg-slate-800 px-5 py-3 rounded-2xl shadow-xl font-extrabold text-xs transition-all hover:scale-105 flex items-center gap-2 z-50 tracking-wide"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                + Quick Booking
              </button>
            </div>
          ) : activeView === 'calendar' ? (

            <HallCalendar events={filteredBookings} onUpdateBooking={updateBooking} />
          ) : activeView === 'customers' ? (
            <Customers />
          ) : activeView === 'menu' ? (
            <MenuManagement bookings={bookings} />
          ) : activeView === 'function_prospectus' ? (
            <FunctionProspectus />
          ) : activeView === 'venue-mapping' ? (
            <VenueMapping bookings={bookings} seatingTypes={seatingTypes} />
          ) : activeView === 'invoices' ? (
            <Invoices />
          ) : activeView === 'property' ? (
            <PropertyConfiguration 
              currentActivePropertyId={
                selectedProperty.includes('Jubilee') || selectedProperty.includes('Grand') ? 'prop-1' :
                selectedProperty.includes('Imperial') || selectedProperty.includes('Banjara') ? 'prop-2' :
                selectedProperty.includes('Crystal') || selectedProperty.includes('Gachibowli') ? 'prop-3' :
                selectedProperty.includes('Emerald') || selectedProperty.includes('ECR') ? 'prop-4' : 'prop-1'
              }
              onSelectActiveProperty={(propId, propName) => setSelectedProperty(propName)}
            />
          ) : activeView === 'contracts' ? (
            <ContractGenerator />
          ) : activeView === 'halls_master' ? (
            <HallMasters />
          ) : activeView === 'function_types_master' ? (
            <FunctionTypeMasters />
          ) : activeView === 'food_plan_master' ? (
            <FoodPlanMasters />
          ) : activeView === 'seating_type_master' ? (
            <SeatingTypeMasters seatingTypes={seatingTypes} setSeatingTypes={setSeatingTypes} />
          ) : activeView === 'tax_master' ? (
            <TaxMasters />
          ) : activeView === 'session_master' ? (
            <SessionMasters />
          ) : activeView === 'email_templates' ? (
            <EmailTemplates />
          ) : activeView === 'checkout' ? (
            <CheckoutSettlement />
          ) : activeView === 'reports' ? (
            <Reports />
          ) : activeView === 'staff_management' ? (
            <StaffManagement />
          ) : (
            <AuditTrail />
          )}
        </div>
      </main>
    </div>
  );
}

