import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const mockBookings = [
  { id: 'BK-001', customer: 'Suresh Kumar', event: 'Wedding', date: '2026-08-27', hall: 'Crystal Ballroom', pax: 150, status: 'Confirmed' },
  { id: 'BK-002', customer: 'TCS Corp Events', event: 'Conference', date: '2026-08-28', hall: 'Ruby Suite', pax: 50, status: 'Pending' },
];

export default function ContractGenerator() {
  const generatePDF = async (booking: typeof mockBookings[0]) => {
    const element = document.getElementById(`contract-${booking.id}`);
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 0);
      pdf.save(`Contract_${booking.id}.pdf`);
    }
  };

  return (
    <div className="h-full w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Contract Generator</h2>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 text-[10px] uppercase">
            <th className="pb-3">Booking ID</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">Event</th>
            <th className="pb-3">Hall</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mockBookings.map(booking => (
            <tr key={booking.id}>
              <td className="py-3 font-medium">{booking.id}</td>
              <td className="py-3">{booking.customer}</td>
              <td className="py-3">{booking.event}</td>
              <td className="py-3">{booking.hall}</td>
              <td className="py-3 text-right">
                <button 
                  onClick={() => generatePDF(booking)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-bold"
                >
                  <Download size={14} /> Generate PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hidden template for PDF generation */}
      {mockBookings.map(booking => (
        <div key={booking.id} id={`contract-${booking.id}`} className="hidden p-8 font-sans">
          <h1 className="text-2xl font-bold mb-4">Event Agreement</h1>
          <p className="mb-2"><strong>Booking ID:</strong> {booking.id}</p>
          <p className="mb-2"><strong>Customer:</strong> {booking.customer}</p>
          <p className="mb-2"><strong>Event:</strong> {booking.event}</p>
          <p className="mb-2"><strong>Hall:</strong> {booking.hall}</p>
          <p className="mb-2"><strong>No. of Pax:</strong> {booking.pax}</p>
          <p className="mt-8 text-sm">This is a standard agreement for the booked event...</p>
        </div>
      ))}
    </div>
  );
}
