import React, { useState } from 'react';
import { Download, FileText, PieChart, Landmark, DollarSign, Calculator, BookOpen, ShieldAlert } from 'lucide-react';
import CashierReport from './CashierReport';
import GSTReport from './GSTReport';
import SalesDayBook from './SalesDayBook';
import CancelResettleReport from './CancelResettleReport';

export default function Reports() {
  const [reportType, setReportType] = useState<'sales_day_book' | 'tax' | 'cashier' | 'revenue' | 'cancel_resettle'>('sales_day_book');

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Hall,Revenue\nCrystal Ballroom,500000\nRuby Suite,300000\nSapphire Lawn,250000";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2">
        <button 
          onClick={() => setReportType('sales_day_book')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            reportType === 'sales_day_book' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={15} className={reportType === 'sales_day_book' ? 'text-amber-400' : 'text-slate-500'} />
          Sales Day Book Report
        </button>

        <button 
          onClick={() => setReportType('tax')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            reportType === 'tax' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calculator size={15} className={reportType === 'tax' ? 'text-amber-400' : 'text-slate-500'} />
          Detailed GST & Tax Audit Report
        </button>

        <button 
          onClick={() => setReportType('cashier')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            reportType === 'cashier' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Landmark size={15} className={reportType === 'cashier' ? 'text-blue-400' : 'text-slate-500'} />
          Cashier & Shift Closing Report
        </button>

        <button 
          onClick={() => setReportType('revenue')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            reportType === 'revenue' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <PieChart size={15} className={reportType === 'revenue' ? 'text-emerald-400' : 'text-slate-500'} />
          Revenue Grouped by Hall
        </button>

        <button 
          onClick={() => setReportType('cancel_resettle')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            reportType === 'cancel_resettle' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert size={15} className={reportType === 'cancel_resettle' ? 'text-red-400' : 'text-slate-500'} />
          Checkout Cancel & Resettlement Report
        </button>
      </div>

      {/* REPORT CONTENT BODY */}
      {reportType === 'sales_day_book' && (
        <SalesDayBook />
      )}

      {reportType === 'tax' && (
        <GSTReport />
      )}

      {reportType === 'cashier' && (
        <CashierReport />
      )}

      {reportType === 'cancel_resettle' && (
        <CancelResettleReport />
      )}

      {reportType === 'revenue' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Revenue Grouped by Banquet Hall
            </h3>
            <p className="text-xs text-slate-500">
              Showing total revenue generated across all halls for the selected operational period.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Grand Crystal Ballroom</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹5,00,000</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Royal Emerald Suite</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">₹3,00,000</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Sapphire Garden Lawn</div>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">₹2,50,000</div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
              <Download size={15} /> Export CSV Statement
            </button>
            <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
              <FileText size={15} /> Export PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


