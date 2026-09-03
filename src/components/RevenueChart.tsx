import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 50000) + 20000,
}));

export default function RevenueChart({ dateRange, property }: { dateRange: string, property: string }) {
  return (
    <div className="h-full w-full bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Revenue Trend ({dateRange} | {property})</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ fontSize: '10px', padding: '4px' }}
            itemStyle={{ fontSize: '10px' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
