import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface PhonePeFallbackCardProps {
  amount: number;
  orderRef?: string;
  onClose?: () => void;
}

/**
 * Authentic PhonePe Merchant QR Fallback Card
 * Faithful rendition of the user's uploaded IMG-20261011-WA0001.jpg
 * Payee Name: KODIGANTI DINESH
 */
export const PhonePeFallbackCard: React.FC<PhonePeFallbackCardProps> = ({
  amount,
  orderRef = 'LOL-ORDER',
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UPI deep link payload matching KODIGANTI DINESH PhonePe merchant account
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
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Error generating PhonePe QR:', error);
        }
      );
    }
  }, [upiPayload]);

  return (
    <div className="bg-[#0B0B0E] text-white rounded-2xl p-5 sm:p-6 border border-[#2A2A35] shadow-2xl max-w-sm mx-auto text-center relative select-none">
      {/* PhonePe Header Icon + Wordmark */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#5F259F] flex items-center justify-center shadow-md">
          <span className="text-white text-base font-black">पे</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">PhonePe</span>
      </div>

      {/* ACCEPTED HERE subtitle */}
      <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#673AB7] mb-2">
        ACCEPTED HERE
      </p>

      {/* Instruction */}
      <p className="text-xs text-gray-300 mb-4 font-normal">
        Scan any QR using PhonePe App
      </p>

      {/* QR Code Container with Center Logo Overlay */}
      <div className="relative inline-block bg-white p-2.5 rounded-xl shadow-lg border-2 border-white">
        <canvas ref={canvasRef} className="rounded-lg block mx-auto" />
        {/* Center PhonePe Icon Emblem Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-[#5F259F] border-2 border-white flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-black">पे</span>
          </div>
        </div>
      </div>

      {/* Payee Name */}
      <div className="mt-4 pt-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          Merchant / Payee
        </p>
        <p className="text-sm font-bold tracking-wider text-white uppercase mt-0.5">
          KODIGANTI DINESH
        </p>
        <p className="text-[11px] text-[#A67C2E] mt-1 font-mono">
          Amount: ₹{amount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Footer copyright note */}
      <div className="mt-4 pt-3 border-t border-gray-800 text-[9px] text-gray-500">
        ©2026, All rights reserved, PhonePe Internet Pvt. Ltd.
      </div>
    </div>
  );
};
