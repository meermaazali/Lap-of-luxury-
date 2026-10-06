import React from 'react';
import { X, MapPin, Phone, Clock, MessageSquare, ExternalLink, Mail, CheckCircle } from 'lucide-react';

interface StoreLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MAPS_URL = "https://maps.google.com/?q=D/6,+Kota+Complex,+Telangana+Chowrasta,+2-2-2/2,+Boyapalle+Rural,+Mahbubnagar,+Telangana 509001";
export const STORE_ADDRESS = "D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, Boyapalle Rural, Mahbubnagar, Telangana 509001";
export const SUPPORT_EMAIL = "lapofluxurypremium@gmail.com";
export const STORE_PHONE = "75 7888 7888";

export const StoreLocationModal: React.FC<StoreLocationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden relative my-6">
        {/* Header with Back button */}
        <div className="px-5 sm:px-6 py-4 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <span className="font-editorial text-[11px] italic tracking-[0.2em] uppercase text-[#8C6D1F] font-bold">
                Store Location
              </span>
              <h3 className="font-bodoni text-base sm:text-lg font-bold tracking-wider text-[#111111] uppercase">
                MAHBUBNAGAR STORE
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-[#F2EDE2] flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-[#4A4033]">
          {/* Visual Storefront Card */}
          <div className="rounded-xl overflow-hidden border border-[#E5DAC8] relative bg-[#FAF8F5]">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
              alt="Lap of Luxury Mahbubnagar Store"
              className="w-full h-44 object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="bg-[#B89758] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                OPEN DAILY · 10:00 AM - 9:30 PM
              </span>
              <p className="font-bodoni font-bold text-base sm:text-lg mt-1">
                LAP OF LUXURY · MAHBUBNAGAR
              </p>
            </div>
          </div>

          {/* Details list with direct user address */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8DC]">
              <MapPin className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="block text-[#111111] font-bold text-xs uppercase tracking-wider">
                  Store Address:
                </strong>
                <p className="text-xs text-[#2A241D] font-medium leading-relaxed mt-0.5">
                  {STORE_ADDRESS}
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E22] hover:bg-[#35353C] text-[#F3E7D5] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Open Directly in Google Maps →</span>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8DC]">
              <Clock className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#111111] font-bold text-xs uppercase tracking-wider">
                  Store Timings:
                </strong>
                <p className="text-xs text-[#5C5040] mt-0.5">
                  Monday – Sunday: <strong>10:00 AM – 9:30 PM</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8DC]">
              <Mail className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#111111] font-bold text-xs uppercase tracking-wider">
                  VIP Support Email:
                </strong>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-xs text-[#111111] font-bold hover:text-[#B89758] hover:underline mt-0.5 block"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE8DC]">
              <Phone className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#111111] font-bold text-xs uppercase tracking-wider">
                  Direct Line:
                </strong>
                <p className="text-xs text-[#111111] font-bold mt-0.5">
                  CELL : {STORE_PHONE} <span className="font-normal text-[#6B5F50]">/ +91 98765 43210</span>
                </p>
              </div>
            </div>
          </div>

          {/* Direct Actions: Call, WhatsApp, Google Maps */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`}
              className="py-2.5 px-3 bg-[#111111] hover:bg-[#2A2A2E] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B89758]" />
              <span>Call Store Now</span>
            </a>

            <a
              href={`https://wa.me/917578887888?text=Hello%20Lap%20of%20Luxury%20Mahbubnagar%2C%20I%20am%20inquiring%20about%20your%20collection.`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20BA59] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
