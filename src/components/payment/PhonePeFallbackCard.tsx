import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ShieldCheck, QrCode } from 'lucide-react';

interface PhonePeFallbackCardProps {
  amount: number;
  orderRef?: string;
  onClose?: () => void;
}

/**
 * Luxury UPI Merchant QR Payment Card
 * Uses verified UPI payee account: KODIGANTI DINESH (7578887888@ybl)
 * Compatible with all Indian UPI applications (GPay, Paytm, PhonePe, BHIM, etc.)
 */
export const PhonePeFallbackCard: React.FC<PhonePeFallbackCardProps> = ({
  amount,
  orderRef = 'LOL-ORDER',
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UPI deep link payload matching merchant account
  const upiPayload = `upi://pay?pa=7578887888@ybl&pn=KODIGANTI%20DINESH&am=${amount}&cu=INR&tn=Lap%20of%20Luxury%20${orderRef}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        upiPayload,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#111113',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Error generating UPI QR:', error);
        }
      );
    }
  }, [upiPayload]);

  return (
    <div className="bg-[#111113] text-white rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/50 shadow-2xl max-w-sm mx-auto text-center relative select-none">
      {/* Luxury Brand & UPI Header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B8860B] to-[#F3E5AB] flex items-center justify-center text-[#111113] shadow-md">
          <QrCode className="w-4 h-4 text-[#111113]" />
        </div>
        <span className="font-bodoni text-lg font-black tracking-widest text-[#F3E5AB] uppercase">
          LAP OF LUXURY
        </span>
      </div>

      {/* Subtitle */}
      <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#D4AF37] mb-1">
        INSTANT UPI PAYMENT
      </p>

      {/* Instruction */}
      <p className="text-xs text-gray-300 mb-4 font-normal">
        Scan with Any UPI App (GPay, Paytm, BHIM, PhonePe, Cred)
      </p>

      {/* QR Code Container */}
      <div className="relative inline-block bg-white p-3 rounded-xl shadow-lg border-2 border-[#D4AF37]/40">
        <canvas ref={canvasRef} className="rounded-lg block mx-auto" />
      </div>

      {/* Payee Name & Amount */}
      <div className="mt-4 pt-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          Payee / Merchant
        </p>
        <p className="text-sm font-bold tracking-wider text-white uppercase mt-0.5">
          KODIGANTI DINESH
        </p>
        <p className="text-xs text-[#E5C07B] mt-1 font-mono font-semibold">
          Amount to Pay: ₹{amount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Footer security note */}
      <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>100% Encrypted &amp; NPCI-Verified UPI Payment</span>
      </div>
    </div>
  );
};
