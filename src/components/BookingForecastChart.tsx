import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'W1', bookings: 12 },
  { week: 'W2', bookings: 18 },
  { week: 'W3', bookings: 10 },
  { week: 'W4', bookings: 25 },
];

export default function BookingForecastChart() {
  return (
    <div className="h-full w-full bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Booking Forecast</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="week" hide />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ fontSize: '10px', padding: '4px' }}
            itemStyle={{ fontSize: '10px' }}
          />
          <Bar dataKey="bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
