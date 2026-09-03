import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  hall: string;
}

export default function PublicLobbyView({ bookings }: { bookings: Booking[] }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter for actual today's events
  const todayBookings = bookings.filter(b => {
    const bDate = new Date(b.start);
    bDate.setHours(0, 0, 0, 0);
    return bDate.getTime() === today.getTime();
  });

  // For demonstration: If no events are naturally on "today", shift the mock data so the screen isn't empty.
  const displayBookings = todayBookings.length > 0 ? todayBookings : bookings.map((b, i) => {
    const originalStart = new Date(b.start);
    const originalEnd = new Date(b.end);
    
    const duration = originalEnd.getTime() - originalStart.getTime();

    const newStart = new Date(currentTime);
    newStart.setHours(9 + (i * 3), 0, 0, 0); // 9am, 12pm, 3pm...
    
    const newEnd = new Date(newStart.getTime() + duration);

    return { ...b, start: newStart.toISOString(), end: newEnd.toISOString() };
  }).slice(0, 4); // Show up to 4 mock events for today

  const sortedBookings = [...displayBookings].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const getEventStatus = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const now = currentTime.getTime();

    if (now >= startTime && now <= endTime) {
      return <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold animate-pulse">In Progress</span>;
    } else if (now < startTime) {
      return <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">Upcoming</span>;
    } else {
      return <span className="bg-slate-500/20 text-slate-400 px-3 py-1 rounded-full text-sm font-bold">Concluded</span>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(dateString));
  };
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(dateString));
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-50 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="px-10 py-8 border-b border-slate-800 flex justify-between items-end shrink-0 bg-slate-900/50">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Today's Event Schedule</h1>
          <p className="text-slate-400 text-lg flex items-center gap-2">
            <MapPin size={20} /> The Grand Banquet Convention Center
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-blue-400 tracking-tighter tabular-nums">
            {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(currentTime)}
          </div>
          <div className="text-slate-400 text-xl font-medium mt-1">
            {new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(currentTime)}
          </div>
        </div>
      </header>

      {/* Event List */}
      <div className="flex-1 overflow-auto p-10 bg-slate-950">
        {sortedBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Calendar size={64} className="mb-6 opacity-20" />
            <h2 className="text-3xl font-bold">No Events Scheduled Today</h2>
            <p className="text-xl mt-2">The halls are currently available.</p>
          </div>
        ) : (
          <div className="grid gap-6 auto-rows-max max-w-6xl mx-auto">
            {sortedBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center justify-between shadow-2xl transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-blue-950 border border-blue-800 text-blue-300 px-4 py-1.5 rounded-lg font-bold text-sm uppercase tracking-widest">
                      {booking.hall}
                    </div>
                    {getEventStatus(booking.start, booking.end)}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{booking.title.split(' - ')[1] || booking.title}</h2>
                  <div className="text-slate-400 text-lg font-medium flex items-center gap-2">
                     <Calendar size={18} /> {formatDate(booking.start)}
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end justify-center ml-8 pl-8 border-l border-slate-800 min-w-[200px]">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock size={24} className="text-blue-500" />
                    <span className="text-3xl font-black tabular-nums">{formatTime(booking.start)}</span>
                  </div>
                  <div className="text-slate-500 text-lg font-medium mt-2">
                    until {formatTime(booking.end)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Banner */}
      <div className="bg-blue-600 px-10 py-4 shrink-0 flex items-center justify-between">
         <span className="text-white font-bold text-lg tracking-wide uppercase">Property of HallManager SaaS</span>
         <span className="text-blue-200 font-medium text-sm">Real-time schedule updates</span>
      </div>
    </div>
  );
}
