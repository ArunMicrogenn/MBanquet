import { useState } from 'react';
import { FileText, CalendarDays, Building } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import HallUtilizationHeatmap from './HallUtilizationHeatmap';
import WeeklyDensityHeatmap from './WeeklyDensityHeatmap';

const mockData = [
  { month: 'Jan', utilization: 65, revenue: 450000 },
  { month: 'Feb', utilization: 72, revenue: 520000 },
  { month: 'Mar', utilization: 85, revenue: 680000 },
  { month: 'Apr', utilization: 78, revenue: 600000 },
  { month: 'May', utilization: 90, revenue: 750000 },
  { month: 'Jun', utilization: 88, revenue: 720000 },
];

export default function HallInsights() {
  const downloadProspectus = () => {
    alert('Function prospectus downloaded.');
  };

  return (
    <div className="h-full w-full bg-slate-50 p-6 flex flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Hall Insights</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Analytics and resource allocation overview</p>
        </div>
        <button 
          onClick={downloadProspectus}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors"
        >
          <FileText size={16} /> Function Prospectus
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* New Weekly Density Heatmap */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays size={16} className="text-orange-500" />
              Weekly Booking Density
            </h3>
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-full">Peak Hours</span>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">Density of bookings across days and time slots to aid staff scheduling.</p>
          <WeeklyDensityHeatmap />
        </div>

        {/* Existing Hall vs Time Heatmap */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building size={16} className="text-blue-500" />
              Hall Utilization by Hour
            </h3>
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-full">Past 30 Days</span>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">Average booking concentration by specific event halls.</p>
          <HallUtilizationHeatmap />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Utilization Rates (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
              <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="utilization" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Revenue Trend (₹)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
