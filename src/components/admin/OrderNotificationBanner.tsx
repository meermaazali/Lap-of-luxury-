import React, { useEffect } from 'react';
import { Bell, ArrowRight, X, Sparkles, Volume2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderNotificationBanner: React.FC = () => {
  const {
    latestNotification,
    dismissNotification,
    setIsAdminMode,
    playOrderChime,
  } = useStore();

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!latestNotification) return;
    const timer = setTimeout(() => {
      dismissNotification();
    }, 10000);
    return () => clearTimeout(timer);
  }, [latestNotification?.id, dismissNotification]);

  if (!latestNotification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#1A1A1E] text-white rounded-2xl border-2 border-[#D4AF37] shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C59B27] via-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#111111] shrink-0 shadow-md">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest uppercase font-extrabold text-[#D4AF37] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> NEW ORDER RECEIVED
            </span>
            <p className="text-xs font-bold text-white truncate max-w-[200px]">
              {latestNotification.customerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => playOrderChime()}
            className="text-[#D4AF37] hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            title="Replay order chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={dismissNotification}
            className="text-[#998E7E] hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#33333A] text-xs text-[#D5C7B0] flex justify-between items-center">
        <div>
          <span className="font-mono font-bold text-[#F3E7D5]">
            #{latestNotification.trackingNumber}
          </span>
          <span className="text-[11px] block text-[#9E907D]">
            {latestNotification.items.length} items · {latestNotification.city}
          </span>
        </div>
        <div className="text-right">
          <span className="font-bold text-sm text-[#D4AF37] tabular-nums">
            ₹{latestNotification.total.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] block text-[#A8987E] uppercase font-semibold">
            {latestNotification.paymentMethod}
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            setIsAdminMode(true);
            window.location.hash = 'admin';
            dismissNotification();
          }}
          className="flex-1 py-1.5 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <span>Open in Admin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
