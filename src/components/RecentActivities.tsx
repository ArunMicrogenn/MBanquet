import { Clock, CheckCircle, CreditCard, Calendar } from 'lucide-react';

const activities = [
  { id: 1, type: 'booking', message: 'New booking for Crystal Ballroom', time: '10 mins ago', icon: Calendar },
  { id: 2, type: 'payment', message: 'Payment received from Suresh Kumar', time: '1 hr ago', icon: CreditCard },
  { id: 3, type: 'status', message: 'Booking BK-002 status updated to Confirmed', time: '3 hrs ago', icon: CheckCircle },
  { id: 4, type: 'booking', message: 'New booking for Ruby Suite', time: '5 hrs ago', icon: Calendar },
];

export default function RecentActivities({ dateRange, property, filter }: { dateRange: string, property: string, filter: string | null }) {
  const filteredActivities = filter ? activities.filter(a => a.type === filter) : activities;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Activities ({dateRange} | {property})</h2>
      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-full mt-0.5">
                <Icon size={14} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-800 font-medium">{activity.message}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
