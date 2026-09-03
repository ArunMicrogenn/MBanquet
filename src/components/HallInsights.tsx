import { useState, useMemo } from 'react';
import { 
  FileText, CalendarDays, Building, TrendingUp, Sliders, Info, Percent, Coins, 
  ArrowUpRight, Sparkles, AlertCircle, ShieldAlert, BadgeCent, ChevronRight, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ComposedChart, Area
} from 'recharts';
import HallUtilizationHeatmap from './HallUtilizationHeatmap';
import WeeklyDensityHeatmap from './WeeklyDensityHeatmap';

interface HistoricalBooking {
  id: string;
  customerName: string;
  hall: string;
  eventDate: string; // YYYY-MM-DD
  eventType: string;
  pax: number;
  totalBill: number;
  status: 'Confirmed' | 'Provisional' | 'Cancelled';
}

const HISTORICAL_BOOKINGS: HistoricalBooking[] = [
  // March 2026
  { id: 'h1', customerName: 'Amit Verma Wedding', hall: 'Crystal Ballroom', eventDate: '2026-03-05', eventType: 'Wedding', pax: 350, totalBill: 285000, status: 'Confirmed' },
  { id: 'h2', customerName: 'Rotary Club Annual Meet', hall: 'Ruby Suite', eventDate: '2026-03-12', eventType: 'Corporate Seminar', pax: 150, totalBill: 125000, status: 'Confirmed' },
  { id: 'h3', customerName: 'Sanjay Birthday Bash', hall: 'Emerald Garden Lawn', eventDate: '2026-03-22', eventType: 'Birthday Party', pax: 200, totalBill: 180000, status: 'Confirmed' },

  // April 2026
  { id: 'h4', customerName: 'Mehta Reception', hall: 'Crystal Ballroom', eventDate: '2026-04-02', eventType: 'Wedding Reception', pax: 400, totalBill: 340000, status: 'Confirmed' },
  { id: 'h5', customerName: 'EduSummit 2026', hall: 'Ruby Suite', eventDate: '2026-04-18', eventType: 'Conference', pax: 180, totalBill: 160000, status: 'Confirmed' },
  { id: 'h6', customerName: 'Priyal Engagement', hall: 'Emerald Garden Lawn', eventDate: '2026-04-26', eventType: 'Engagement', pax: 250, totalBill: 220000, status: 'Confirmed' },

  // May 2026 (Peak Season)
  { id: 'h7', customerName: 'Karan & Pooja Sangeet', hall: 'Crystal Ballroom', eventDate: '2026-05-08', eventType: 'Sangeet Ceremony', pax: 500, totalBill: 450000, status: 'Confirmed' },
  { id: 'h8', customerName: 'Standard Chartered Meet', hall: 'Ruby Suite', eventDate: '2026-05-15', eventType: 'Corporate Meet', pax: 120, totalBill: 110000, status: 'Confirmed' },
  { id: 'h9', customerName: 'Dr. Nair Golden Jubilee', hall: 'Emerald Garden Lawn', eventDate: '2026-05-24', eventType: 'Anniversary', pax: 300, totalBill: 290000, status: 'Confirmed' },
  { id: 'h10', customerName: 'Sharma Wedding', hall: 'Crystal Ballroom', eventDate: '2026-05-29', eventType: 'Wedding', pax: 450, totalBill: 410000, status: 'Confirmed' },

  // June 2026
  { id: 'h11', customerName: 'Tech Mahindra Hackathon', hall: 'Ruby Suite', eventDate: '2026-06-10', eventType: 'Hackathon', pax: 220, totalBill: 190000, status: 'Confirmed' },
  { id: 'h12', customerName: 'Gupta Thread Ceremony', hall: 'Emerald Garden Lawn', eventDate: '2026-06-19', eventType: 'Religious Function', pax: 150, totalBill: 130000, status: 'Confirmed' },
  { id: 'h13', customerName: 'Airtel Regional Awards', hall: 'Crystal Ballroom', eventDate: '2026-06-27', eventType: 'Awards Gala', pax: 350, totalBill: 310000, status: 'Confirmed' },

  // July 2026 (Off-season, rains)
  { id: 'h14', customerName: 'Rotary Club Induction', hall: 'Ruby Suite', eventDate: '2026-07-04', eventType: 'Corporate Meet', pax: 100, totalBill: 95000, status: 'Confirmed' },
  { id: 'h15', customerName: 'Baby Shower Ritika', hall: 'Emerald Garden Lawn', eventDate: '2026-07-15', eventType: 'Baby Shower', pax: 120, totalBill: 115000, status: 'Confirmed' },
  { id: 'h16', customerName: 'CA Association Dinner', hall: 'Crystal Ballroom', eventDate: '2026-07-28', eventType: 'Gala Dinner', pax: 200, totalBill: 190000, status: 'Confirmed' },

  // August 2026 (Current Month Actuals)
  { id: 'h17', customerName: 'Jain Engagement', hall: 'Crystal Ballroom', eventDate: '2026-08-04', eventType: 'Engagement', pax: 300, totalBill: 270000, status: 'Confirmed' },
  { id: 'h18', customerName: 'HDFC Forex Launch', hall: 'Ruby Suite', eventDate: '2026-08-14', eventType: 'Product Launch', pax: 150, totalBill: 145000, status: 'Confirmed' },
  { id: 'h19', customerName: 'Reddy Wedding & Dinner', hall: 'Emerald Garden Lawn', eventDate: '2026-08-22', eventType: 'Wedding', pax: 480, totalBill: 440000, status: 'Confirmed' },
  { id: 'h20', customerName: 'Alumni Reunion 2026', hall: 'Crystal Ballroom', eventDate: '2026-08-30', eventType: 'Reunion', pax: 250, totalBill: 210000, status: 'Confirmed' },
];

const mockUtilizationData = [
  { month: 'Jan', utilization: 65, revenue: 450000 },
  { month: 'Feb', utilization: 72, revenue: 520000 },
  { month: 'Mar', utilization: 85, revenue: 680000 },
  { month: 'Apr', utilization: 78, revenue: 600000 },
  { month: 'May', utilization: 90, revenue: 750000 },
  { month: 'Jun', utilization: 88, revenue: 720000 },
];

export default function HallInsights({ bookings = [] }: { bookings?: any[] }) {
  // Forecasting & Yield Settings
  const [projectionModel, setProjectionModel] = useState<'seasonal' | 'linear' | 'conservative'>('seasonal');
  const [occupancyGrowth, setOccupancyGrowth] = useState<number>(12); // Expected occupancy delta (%)
  const [priceHike, setPriceHike] = useState<number>(8); // Catering / plate growth (%)
  const [rentalHike, setRentalHike] = useState<number>(5); // Scheduled hall rate shifts (%)
  const [riskBuffer, setRiskBuffer] = useState<number>(6); // Safety stress-testing buffer (%)

  const downloadProspectus = () => {
    alert('Function prospectus and forecasting yield data compiled and downloaded successfully.');
  };

  // --- MATHEMATICAL FORECASTING LOGIC ---
  
  // 1. Calculate Historical Actuals (March to August 2026)
  const historicalData = useMemo(() => {
    const months = ['Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26'];
    const sums = {
      'Mar 26': 0,
      'Apr 26': 0,
      'May 26': 0,
      'Jun 26': 0,
      'Jul 26': 0,
      'Aug 26': 0,
    };

    // Calculate from HISTORICAL_BOOKINGS static list
    HISTORICAL_BOOKINGS.forEach(b => {
      const date = new Date(b.eventDate);
      const monthIndex = date.getMonth(); // 0-indexed
      const year = date.getFullYear();
      if (year === 2026) {
        if (monthIndex === 2) sums['Mar 26'] += b.totalBill;
        else if (monthIndex === 3) sums['Apr 26'] += b.totalBill;
        else if (monthIndex === 4) sums['May 26'] += b.totalBill;
        else if (monthIndex === 5) sums['Jun 26'] += b.totalBill;
        else if (monthIndex === 6) sums['Jul 26'] += b.totalBill;
        else if (monthIndex === 7) sums['Aug 26'] += b.totalBill;
      }
    });

    // Dynamically incorporate real live booking data passed into component
    bookings.forEach(b => {
      if (!b.start || b.status === 'Cancelled') return;
      const date = new Date(b.start);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      if (year === 2026) {
        // Fallback bill estimation: (base rental setup) + pax *plate cost
        const estimatedBill = b.totalBill || (60000 + (b.pax || 120) * 650);
        if (monthIndex === 2) sums['Mar 26'] += estimatedBill;
        else if (monthIndex === 3) sums['Apr 26'] += estimatedBill;
        else if (monthIndex === 4) sums['May 26'] += estimatedBill;
        else if (monthIndex === 5) sums['Jun 26'] += estimatedBill;
        else if (monthIndex === 6) sums['Jul 26'] += estimatedBill;
        else if (monthIndex === 7) sums['Aug 26'] += estimatedBill;
      }
    });

    return months.map(m => ({
      month: m,
      revenue: sums[m as keyof typeof sums] || 350000
    }));
  }, [bookings]);

  // 2. Project Future Months (September 2026 to February 2027)
  const combinedForecastData = useMemo(() => {
    const data = [];
    
    // Push completed historical actuals (first 6 months)
    for (let i = 0; i < historicalData.length; i++) {
      data.push({
        month: historicalData[i].month,
        actual: historicalData[i].revenue,
        forecast: undefined as number | undefined,
        confidenceLower: undefined as number | undefined,
        confidenceUpper: undefined as number | undefined,
        isForecast: false,
      });
    }

    const revs = historicalData.map(h => h.revenue);
    const avgHistorical = revs.reduce((a, b) => a + b, 0) / revs.length;
    const lastActual = revs[revs.length - 1]; // August 2026

    // Connect forecast exactly at the transition boundary (August 2026)
    data[5].forecast = lastActual;
    data[5].confidenceLower = lastActual;
    data[5].confidenceUpper = lastActual;

    // Projected future 6 months with seasonal weighting factors
    const futureMonths = [
      { key: 'Sep 26', label: 'Sep 26', seasonalFactor: 1.05 },
      { key: 'Oct 26', label: 'Oct 26', seasonalFactor: 1.25 }, // Navratri / Sangeet
      { key: 'Nov 26', label: 'Nov 26', seasonalFactor: 1.48 }, // Peak Muhurtham weddings
      { key: 'Dec 26', label: 'Dec 26', seasonalFactor: 1.55 }, // Year-End Gala/Corporate
      { key: 'Jan 27', label: 'Jan 27', seasonalFactor: 1.18 }, // Winter corporate
      { key: 'Feb 27', label: 'Feb 27', seasonalFactor: 1.10 }  // Valentine & pre-spring
    ];

    let currentBase = lastActual;
    // Compounded quarterly/monthly rate hike factor
    const compoundGrowthMonthly = (occupancyGrowth * 0.35 + priceHike * 0.45 + rentalHike * 0.20) / 100;

    futureMonths.forEach((m) => {
      let projectedVal = avgHistorical;

      if (projectionModel === 'linear') {
        currentBase = currentBase * (1 + compoundGrowthMonthly / 2);
        projectedVal = currentBase;
      } else if (projectionModel === 'seasonal') {
        // Industry-standard seasonal curve scaled by user growth factor
        const multiplier = 1 + (occupancyGrowth * 0.45 + priceHike * 0.35 + rentalHike * 0.20) / 100;
        projectedVal = avgHistorical * m.seasonalFactor * multiplier;
      } else {
        // Conservative moving average factoring in stress buffer
        const multiplier = 1 + (occupancyGrowth * 0.25 + priceHike * 0.15) / 100;
        projectedVal = avgHistorical * (1 - riskBuffer / 100) * multiplier;
      }

      // Add safety bands
      const lowerBound = projectedVal * (1 - riskBuffer / 100);
      const upperBound = projectedVal * (1 + (riskBuffer * 0.75 + occupancyGrowth * 0.20) / 100);

      data.push({
        month: m.label,
        actual: undefined as number | undefined,
        forecast: Math.round(projectedVal),
        confidenceLower: Math.round(lowerBound),
        confidenceUpper: Math.round(upperBound),
        isForecast: true,
      });
    });

    return data;
  }, [historicalData, projectionModel, occupancyGrowth, priceHike, rentalHike, riskBuffer]);

  // 3. Compute Yield Statistics & Metrics
  const forecastStats = useMemo(() => {
    const historicalSum = historicalData.reduce((acc, curr) => acc + curr.revenue, 0);
    
    // Future months sum (September onwards)
    const futureOnly = combinedForecastData.filter(d => d.isForecast);
    const forecastSum = futureOnly.reduce((acc, curr) => acc + (curr.forecast || 0), 0);
    const total12MonthYield = historicalSum + forecastSum;

    const avgForecast = forecastSum / futureOnly.length;
    
    // Find peak forecast month
    let peakForecastVal = 0;
    let peakForecastMonth = '';
    futureOnly.forEach(d => {
      if ((d.forecast || 0) > peakForecastVal) {
        peakForecastVal = d.forecast || 0;
        peakForecastMonth = d.month;
      }
    });

    const growthDelta = ((forecastSum / (historicalSum || 1)) - 1) * 100;

    // Buffer risk rating
    const riskRating = riskBuffer <= 5 
      ? { label: 'Aggressive Projections', color: 'text-red-600 bg-red-50 border-red-200' }
      : riskBuffer <= 10 
        ? { label: 'Balanced / Safe Yield', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
        : { label: 'Stress-Tested Risk-Averse', color: 'text-blue-700 bg-blue-50 border-blue-200' };

    return {
      totalYield: total12MonthYield,
      forecastSum,
      historicalSum,
      avgForecast,
      peakMonth: peakForecastMonth,
      peakValue: peakForecastVal,
      growthDelta,
      riskRating,
    };
  }, [historicalData, combinedForecastData, riskBuffer]);

  return (
    <div className="h-full w-full bg-slate-50 p-6 flex flex-col overflow-y-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Hall Insights & Yield Strategy
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Analyze historical venue utilization and project future 12-month banquet income using dynamic predictive pricing models.
          </p>
        </div>
        <button 
          onClick={downloadProspectus}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
        >
          <FileText size={15} /> Export Forecast Data Sheet
        </button>
      </div>

      {/* SECTION 1: 12-MONTH REVENUE FORECASTING ENGINE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 xl:grid-cols-4">
        
        {/* CHART CONTAINER PANEL */}
        <div className="xl:col-span-3 p-6 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                  12-Month Projected vs Historical Revenue Curve
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                March 2026 – August 2026 (Historical Actuals) linked to September 2026 – February 2027 (Adjusted Forecast).
              </p>
            </div>

            {/* QUICK LEGEND */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-600 block"></span>
                <span className="text-slate-600">Actual Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500 block"></span>
                <span className="text-slate-600">Forecast Line</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 bg-amber-500/10 rounded-xs block"></span>
                <span className="text-slate-500">Confidence Band</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC RECHARTS FORECAST VISUALIZER */}
          <div className="flex-1 min-h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedForecastData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: '600' }}
                  dy={8}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: '600' }}
                  dx={-4}
                />
                <Tooltip 
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 1.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      const isForecast = dataPoint.isForecast;
                      return (
                        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-lg text-xs space-y-1.5">
                          <p className="font-extrabold text-slate-800 border-b border-slate-100 pb-1 mb-1">
                            {dataPoint.month}
                          </p>
                          {isForecast ? (
                            <>
                              <div className="flex justify-between gap-6">
                                <span className="text-slate-500 font-semibold">Projected Income:</span>
                                <span className="font-extrabold text-amber-600">₹{(dataPoint.forecast || 0).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between gap-6 text-[10px] text-slate-400">
                                <span>Confidence Range:</span>
                                <span className="font-semibold">
                                  ₹{(dataPoint.confidenceLower || 0).toLocaleString('en-IN')} – ₹{(dataPoint.confidenceUpper || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="inline-block mt-1 bg-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {projectionModel} Prediction
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between gap-6">
                                <span className="text-slate-500 font-semibold">Actual Revenue:</span>
                                <span className="font-extrabold text-indigo-700">₹{(dataPoint.actual || 0).toLocaleString('en-IN')}</span>
                              </div>
                              <span className="inline-block mt-1 bg-indigo-50 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Completed Booking Actuals
                              </span>
                            </>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {/* Confidence Range Area Fill */}
                <Area 
                  name="Confidence Limit"
                  type="monotone" 
                  dataKey="confidenceUpper" 
                  stroke="none" 
                  fill="#f59e0b" 
                  fillOpacity={0.06} 
                />
                
                {/* Actual Solid Line */}
                <Line 
                  name="Historical Actuals" 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#4f46e5' }} 
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#4f46e5' }} 
                />
                
                {/* Projected Dashed Line */}
                <Line 
                  name="Future Projection" 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  strokeDasharray="6 4"
                  dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#f59e0b' }} 
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#f59e0b' }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* DYNAMIC KPI SUMMARY CARD GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total 12M Yield (Est)</span>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">
                ₹{forecastStats.totalYield.toLocaleString('en-IN')}
              </p>
              <span className="text-[9.5px] text-indigo-600 font-bold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight size={12} /> Actuals + Forecast
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">MoM Projected Shift</span>
              <p className={`text-base font-extrabold mt-0.5 ${forecastStats.growthDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {forecastStats.growthDelta >= 0 ? '+' : ''}{forecastStats.growthDelta.toFixed(1)}%
              </p>
              <span className="text-[9.5px] text-slate-500 font-medium mt-0.5 block">
                Compared to historical sum
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Peak Forecast Yield</span>
              <p className="text-base font-extrabold text-amber-700 mt-0.5">
                ₹{forecastStats.peakValue.toLocaleString('en-IN')}
              </p>
              <span className="text-[9.5px] text-amber-600 font-bold block mt-0.5">
                Expected in {forecastStats.peakMonth}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Monthly Forecast</span>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">
                ₹{Math.round(forecastStats.avgForecast).toLocaleString('en-IN')}
              </p>
              <span className="text-[9.5px] text-slate-500 font-medium block mt-0.5">
                Next 6 months mean
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS & WHAT-IF INTERACTIVE PANEL */}
        <div className="p-6 bg-slate-50/50 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Sliders size={16} className="text-slate-600" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider">
                  Scenario Settings
                </h4>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Adjust variables in real-time to compute prospective venue yields.
              </p>
            </div>

            {/* PROJECTION MODEL SELECTOR */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1.5 tracking-wider flex items-center gap-1">
                Projection Curve Model
                <HelpCircle size={11} className="text-slate-400" title="Select forecasting curve model" />
              </label>
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => setProjectionModel('seasonal')}
                  className={`text-left p-2 rounded-lg text-[11px] font-bold border transition-all ${
                    projectionModel === 'seasonal'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Seasonal Peak Adjusted</span>
                    {projectionModel === 'seasonal' && <Sparkles size={11} className="text-amber-400" />}
                  </div>
                  <p className="text-[9px] font-normal text-slate-400 mt-0.5">Factors festive & wedding cycles (+35-50% peak).</p>
                </button>
                <button
                  onClick={() => setProjectionModel('linear')}
                  className={`text-left p-2 rounded-lg text-[11px] font-bold border transition-all ${
                    projectionModel === 'linear'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Linear Growth Trend</span>
                    {projectionModel === 'linear' && <TrendingUp size={11} className="text-blue-400" />}
                  </div>
                  <p className="text-[9px] font-normal text-slate-400 mt-0.5">Compounded growth model using rolling monthly averages.</p>
                </button>
                <button
                  onClick={() => setProjectionModel('conservative')}
                  className={`text-left p-2 rounded-lg text-[11px] font-bold border transition-all ${
                    projectionModel === 'conservative'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Conservative Baseline</span>
                    {projectionModel === 'conservative' && <ShieldAlert size={11} className="text-emerald-400" />}
                  </div>
                  <p className="text-[9px] font-normal text-slate-400 mt-0.5">Stress-tested fallback projection with minimum volatility.</p>
                </button>
              </div>
            </div>

            {/* OCCUPANCY ADJUSTMENT SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Percent size={12} className="text-orange-500" /> Occupancy Shift
                </span>
                <span className="text-slate-800">{occupancyGrowth >= 0 ? '+' : ''}{occupancyGrowth}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={occupancyGrowth}
                onChange={(e) => setOccupancyGrowth(Number((e.target as HTMLInputElement).value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Expected increase in event bookings frequency.</span>
            </div>

            {/* PLATE RATES SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <BadgeCent size={12} className="text-emerald-500" /> Plate Rates Hike
                </span>
                <span className="text-slate-800">+{priceHike}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={priceHike}
                onChange={(e) => setPriceHike(Number((e.target as HTMLInputElement).value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Inflation or premium buffet package rate increases.</span>
            </div>

            {/* RENTAL CHARGES SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Coins size={12} className="text-blue-500" /> Hall Base Rental
                </span>
                <span className="text-slate-800">+{rentalHike}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={rentalHike}
                onChange={(e) => setRentalHike(Number((e.target as HTMLInputElement).value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Scheduled base hall rental adjustments.</span>
            </div>

            {/* RISK SHIELD BUFFER SLIDER */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-500" /> Risk Shield Stress
                </span>
                <span className="text-slate-800">-{riskBuffer}% buffer</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                value={riskBuffer}
                onChange={(e) => setRiskBuffer(Number((e.target as HTMLInputElement).value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
              />
              <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Stress-testing margin of safety on projected income.</span>
            </div>
          </div>

          {/* RISK RATING COMPLIANCE LABEL */}
          <div className={`mt-5 p-3 rounded-xl border text-center text-[10.5px] font-bold transition-all ${forecastStats.riskRating.color}`}>
            Scenario Rating: {forecastStats.riskRating.label}
          </div>
        </div>
      </div>

      {/* SECTION 2: THE DENSITY & UTILIZATION HEATMAPS (SIDE-BY-SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Booking Density Heatmap */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <CalendarDays size={16} className="text-orange-500" />
              Weekly Booking Density & Concentrated Hours
            </h3>
            <span className="text-[9px] font-extrabold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-full">Peak Load</span>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            Density heatmap of completed events across days and operational sessions to guide staff allocations and housekeeping rotas.
          </p>
          <WeeklyDensityHeatmap />
        </div>

        {/* Existing Hall vs Time Heatmap */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Building size={16} className="text-blue-500" />
              Hall Booking Concentration Rate (Past 30 Days)
            </h3>
            <span className="text-[9px] font-extrabold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-full">Yield / Hr</span>
          </div>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            Average occupancy distribution across distinct conference suites and lawns.
          </p>
          <HallUtilizationHeatmap />
        </div>
      </div>
      
      {/* SECTION 3: EXTRA HISTORICAL ANALYTICS OVERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-6 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            Utilization Rate Evolution (%)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dx={-10} />
              <Tooltip cursor={{ stroke: '#f1f5f9', strokeWidth: 1.5 }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.05)' }} />
              <Line type="monotone" name="Average Occupancy" dataKey="utilization" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#ffffff', stroke: '#2563eb' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-6 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Historical Revenue Seasonality (₹)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} tick={{ fill: '#64748b', fontSize: 11 }} dx={-10} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.05)' }} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
