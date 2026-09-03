import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, Laptop, Check, QrCode } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  bookings: any[];
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess, bookings }: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'simulator'>('camera');
  const [selectedSimBookingId, setSelectedSimBookingId] = useState<string>('');

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') return;
    
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 220, height: 220 } },
        false
      );

      let cleared = false;
      scanner.render(
        (decodedText) => {
          if (!cleared) {
            cleared = true;
            scanner.clear().catch(console.error);
            onScanSuccess(decodedText);
          }
        },
        (error) => {
          // ignore scan errors
        }
      );
      
      return () => {
        if (!cleared) {
          cleared = true;
          scanner.clear().catch(console.error);
        }
      };
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab, onScanSuccess]);

  if (!isOpen) return null;

  // Filter pending/active bookings that are not checked in yet to show in the simulator
  const pendingBookingsForSim = bookings.filter(b => !b.checkedIn && b.status !== 'Cancelled');

  const handleSimulateScan = () => {
    const target = bookings.find(b => b.id === selectedSimBookingId);
    if (!target) return;

    // Build the expected JSON payload
    const simPayload = JSON.stringify({
      id: target.id,
      title: target.title,
      date: target.start,
      hall: target.hall
    });

    onScanSuccess(simPayload);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col border border-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">Pass Verification Center</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'camera' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Camera size={13} />
            <span>Live Camera Feed</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'simulator' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Laptop size={13} />
            <span>Digital Pass Simulator</span>
          </button>
        </div>

        {/* Dynamic Content Views */}
        <div className="p-4 flex-1">
          {activeTab === 'camera' ? (
            <div className="space-y-4">
              <div className="bg-black rounded-xl overflow-hidden border border-slate-200 min-h-[260px] flex items-center justify-center relative">
                <div id="qr-reader" className="w-full bg-white border-0"></div>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800 leading-relaxed font-semibold">
                💡 **Iframe Notice**: If your browser denies camera access inside the embedded AI Studio frame, please use the **Digital Pass Simulator** tab to fully verify the automatic checkout and check-in flow!
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
                  <Laptop size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Test the Check-In Workflow</h4>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  No camera needed. Select an existing booking from the directory to simulate scanning its entry pass QR code.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Select Guest Booking</label>
                  {pendingBookingsForSim.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-500 font-medium">
                      All bookings are already checked-in! Add a new booking to simulate.
                    </div>
                  ) : (
                    <select
                      value={selectedSimBookingId}
                      onChange={(e: any) => setSelectedSimBookingId(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium cursor-pointer text-slate-700"
                    >
                      <option value="">-- Choose Booking --</option>
                      {pendingBookingsForSim.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.title} ({new Date(b.start).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={!selectedSimBookingId}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300/20"
                >
                  <Check size={14} />
                  <span>Simulate QR Pass Scan</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-semibold text-slate-500">
          {activeTab === 'camera' 
            ? 'Position the attendee pass code clearly inside the square target.' 
            : 'Simulating secure gate-keeper credentials.'}
        </div>
      </div>
    </div>
  );
}
