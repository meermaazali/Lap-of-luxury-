import React, { useState } from 'react';
import { Lock, KeyRound, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { UploadedLogoMark } from '../UploadedLogoMark';

interface AdminAuthGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '7878') {
      sessionStorage.setItem('lol_admin_authed', 'true');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setErrorMsg('Incorrect passcode. Please enter the authorized PIN.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#111113] text-white flex flex-col items-center justify-center p-4">
      {/* Decorative Golden Ambient Glow */}
      <div className="absolute w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#1A1A1E] rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Monogram and Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#111113] border border-[#D4AF37] flex items-center justify-center mb-3 p-3">
            <UploadedLogoMark className="w-full h-full" color="#D4AF37" />
          </div>

          <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#D4AF37] mb-1">
            ADMIN CONSOLE GATE
          </span>

          <h2 className="font-bodoni text-2xl font-black tracking-[0.16em] uppercase text-white">
            LAP OF LUXURY
          </h2>

          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Store management, inventory control, banner editor & real-time orders.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/80 rounded-xl flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Passcode Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              ENTER ADMIN PASSCODE (PIN):
            </label>

            <input
              type="password"
              autoFocus
              required
              maxLength={8}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN (e.g. 7878)"
              className="w-full px-4 py-3 bg-[#111113] border-2 border-[#D4AF37]/50 rounded-xl text-center text-lg sm:text-xl tracking-[0.3em] font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-[#111111] text-xs font-black tracking-[0.18em] uppercase rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>AUTHENTICATE & ENTER</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-800 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Secured Store Administration · Mahabubnagar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
