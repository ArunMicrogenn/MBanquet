import { useState, ChangeEvent } from 'react';
import { Calendar, MessageSquare, CreditCard, ArrowLeft, Download } from 'lucide-react';

// Mock data
const mockCustomers = [
  { id: 1, name: 'Suresh Kumar', email: 'suresh@example.com', phone: '+91 98765 43210', bookingCount: 2, status: 'active', leadSource: 'Referral', notes: 'Last contacted: Aug 25', totalRevenue: 150000, history: [{id: 1, date: '2026-01-10', event: 'Wedding', amount: 80000}, {id: 2, date: '2026-06-15', event: 'Birthday', amount: 70000}], interactions: [{id: 1, date: '2026-08-25', note: 'Sent proposal'}] },
  { id: 2, name: 'TCS Corp Events', email: 'events@tcs.com', phone: '+91 44 2432 1000', bookingCount: 5, status: 'prospective', leadSource: 'Web', notes: 'Last contacted: Aug 20', totalRevenue: 500000, history: [{id: 3, date: '2026-02-01', event: 'Corporate Workshop', amount: 100000}, {id: 4, date: '2026-03-10', event: 'Team Building', amount: 150000}, {id: 5, date: '2026-07-20', event: 'Annual Meet', amount: 250000}], interactions: [{id: 2, date: '2026-08-20', note: 'Confirmed venue'}] },
  { id: 3, name: 'Anita Sharma', email: 'anita.s@example.com', phone: '+91 99988 77766', bookingCount: 1, status: 'inactive', leadSource: 'Social', notes: 'Last contacted: Aug 15', totalRevenue: 40000, history: [{id: 6, date: '2025-11-05', event: 'Engagement', amount: 40000}], interactions: [{id: 3, date: '2026-08-15', note: 'Follow-up'}] },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'inactive': return 'bg-slate-400';
    case 'prospective': return 'bg-orange-400';
    default: return 'bg-slate-300';
  }
};

const getLoyaltyTier = (revenue: number) => {
  if (revenue > 300000) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  if (revenue >= 100000) return { name: 'Silver', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  return { name: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-200' };
};

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'history' | 'revenue' | 'interactions'>('timeline');

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimelineEvents = (customer: any) => {
    const events: any[] = [];
    
    // Add bookings
    customer.history.forEach((h: any) => {
      events.push({
        id: `booking-${h.id}`,
        date: h.date,
        type: 'booking',
        title: `Booked: ${h.event}`,
        description: `Booking confirmed for ${h.event}. Total amount: ₹${h.amount.toLocaleString()}`,
        icon: <Calendar size={14} className="text-white" />,
        color: 'bg-blue-500'
      });
      // Add a mock billing event 2 days after booking
      const billDate = new Date(new Date(h.date).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      events.push({
        id: `billing-${h.id}`,
        date: billDate,
        type: 'billing',
        title: 'Payment Received',
        description: `Payment of ₹${h.amount.toLocaleString()} settled for ${h.event}.`,
        icon: <CreditCard size={14} className="text-white" />,
        color: 'bg-orange-500'
      });
    });

    // Add interactions
    customer.interactions.forEach((i: any) => {
      events.push({
        id: `interaction-${i.id}`,
        date: i.date,
        type: 'interaction',
        title: 'Interaction',
        description: i.note,
        icon: <MessageSquare size={14} className="text-white" />,
        color: 'bg-green-500'
      });
    });

    // Sort descending by date
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Bookings', 'Status', 'Lead Source', 'Total Revenue', 'Loyalty Tier'];
    const rows = filteredCustomers.map(c => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      c.bookingCount.toString(),
      `"${c.status}"`,
      `"${c.leadSource}"`,
      c.totalRevenue.toString(),
      `"${getLoyaltyTier(c.totalRevenue).name}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers_directory.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedCustomer) {
    const timelineEvents = getTimelineEvents(selectedCustomer);

    return (
      <div className="h-full w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-xs font-bold mb-4 w-max">
          <ArrowLeft size={14} /> Back to Directory
        </button>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getLoyaltyTier(selectedCustomer.totalRevenue).color}`}>
              {getLoyaltyTier(selectedCustomer.totalRevenue).name} Tier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCustomer.status)}`}></div>
            <span className="capitalize text-slate-600 text-sm font-medium">{selectedCustomer.status}</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-6">{selectedCustomer.email} • {selectedCustomer.phone}</p>
        
        <div className="flex border-b border-slate-200 mb-4 gap-4">
          {(['timeline', 'history', 'revenue', 'interactions'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`pb-2 capitalize text-sm font-bold transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto pr-2">
          {activeTab === 'timeline' && (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ${event.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-slate-200`}>
                    {event.icon}
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-500">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'history' && <table className="w-full text-sm"><thead><tr className="text-left text-slate-500 uppercase text-[10px]"><th>Date</th><th>Event</th><th className="text-right">Amount</th></tr></thead><tbody className="divide-y">{selectedCustomer.history.map((h: any) => <tr key={h.id}><td className="py-2">{h.date}</td><td>{h.event}</td><td className="text-right">₹{h.amount.toLocaleString()}</td></tr>)}</tbody></table>}
          {activeTab === 'revenue' && <div className="text-2xl font-bold text-slate-900">Total Revenue: ₹{selectedCustomer.totalRevenue.toLocaleString()}</div>}
          {activeTab === 'interactions' && <div className="space-y-2">{selectedCustomer.interactions.map((i: any) => <div key={i.id} className="p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 font-medium text-slate-700"><span className="text-xs text-slate-500 font-bold block mb-1">{i.date}</span>{i.note}</div>)}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white p-2 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-2 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Customer Directory</h2>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] w-48"
          />
          <button 
            onClick={handleExportCSV}
            title="Export to CSV"
            className="flex items-center gap-1.5 bg-blue-600 text-white px-2 py-1 rounded text-[11px] font-bold hover:bg-blue-700 transition-colors"
          >
            <Download size={14} /> Export to CSV
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0">
            <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
              <th className="p-2">Name</th>
              <th className="p-2">Contact Details</th>
              <th className="p-2">Status</th>
              <th className="p-2">Lead Source</th>
              <th className="p-2">Notes</th>
              <th className="p-2 text-right">Booking History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} className="even:bg-slate-50/50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <td className="p-2 font-medium text-slate-900">
                  <div className="flex flex-col items-start gap-1">
                    {customer.name}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${getLoyaltyTier(customer.totalRevenue).color}`}>
                      {getLoyaltyTier(customer.totalRevenue).name}
                    </span>
                  </div>
                </td>
                <td className="p-2 text-slate-600">{customer.email} <br/> {customer.phone}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(customer.status)}`}></div>
                    <span className="capitalize text-slate-600">{customer.status}</span>
                  </div>
                </td>
                <td className="p-2 text-slate-600">{customer.leadSource}</td>
                <td className="p-2 text-slate-600">{customer.notes}</td>
                <td className="p-2 text-right text-blue-600 font-bold">{customer.bookingCount} bookings</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
