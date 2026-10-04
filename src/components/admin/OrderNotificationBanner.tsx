import React from 'react';
import { Bell, ArrowRight, X, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderNotificationBanner: React.FC = () => {
  const { latestNotification, dismissNotification, setIsAdminMode } = useStore();

  if (!latestNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#1E1E22] text-white rounded-2xl border-2 border-[#B89758] shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#B89758] flex items-center justify-center text-[#1E1E22] shrink-0 animate-bounce">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#E5C07B] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> NEW ORDER RECEIVED
            </span>
            <p className="text-xs font-bold text-white">
              {latestNotification.customerName}
            </p>
          </div>
        </div>

        <button
          onClick={dismissNotification}
          className="text-[#998E7E] hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#33333A] text-xs text-[#D5C7B0] flex justify-between items-center">
        <div>
          <span className="font-mono font-semibold text-white">
            #{latestNotification.trackingNumber}
          </span>
          <span className="text-[11px] block text-[#9E907D]">
            {latestNotification.items.length} items · {latestNotification.city}
          </span>
        </div>
        <span className="font-bold text-sm text-[#E5C07B] tabular-nums">
          ₹{latestNotification.total.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            setIsAdminMode(true);
            window.location.hash = 'admin';
            dismissNotification();
          }}
          className="flex-1 py-1.5 bg-[#B89758] hover:bg-[#A58448] text-[#1E1E22] font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1 transition-colors"
        >
          <span>Open Order Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
