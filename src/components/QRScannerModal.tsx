import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    
    // Slight delay to ensure DOM element is ready
    const timer = setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
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
          // ignore scan errors (they happen every frame a QR isn't found)
        }
      );
      
      return () => {
        if (!cleared) {
          cleared = true;
          scanner.clear().catch(console.error);
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col">
        <div className="p-4 bg-slate-800 flex justify-between items-center">
          <h3 className="text-white font-bold">Scan Booking QR</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 bg-black min-h-[300px] flex items-center justify-center">
          <div id="qr-reader" className="w-full bg-white rounded-lg overflow-hidden border-0"></div>
        </div>
        <div className="p-4 text-center text-sm font-medium text-slate-500 bg-slate-50 border-t border-slate-100">
          Point your camera at the attendee's QR code.
        </div>
      </div>
    </div>
  );
}
