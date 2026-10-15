import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Search, CheckCircle2, Package, MapPin, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.id.toLowerCase().includes(clean) ||
        (o.phone || o.customer?.phone || '').replace(/\D/g, '').includes(clean) ||
        o.transactionRef?.toLowerCase() === clean
    );
    setMatchedOrder(found || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
            Shipment Dispatch Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
            Track Your Order
          </h1>
          <p className="text-xs text-[#7A6C58]">
            Enter your Order ID (e.g. LOL-1234) or your 10-digit mobile number to view live shipment progress.
          </p>
        </div>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="bg-white p-5 rounded-3xl border border-[#E8DEC8] shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (e.g. LOL-4521) or 10-digit Phone"
              className="w-full px-4 py-3 pl-10 text-xs border border-[#D5C7B0] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#B8860B]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            Track Status
          </button>
        </form>

        {searched && (
          <div>
            {matchedOrder ? (
              <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4">
                  <div>
                    <span className="text-xs text-[#7A6C58]">Tracking Order</span>
                    <p className="text-lg font-mono text-[#111113]">{matchedOrder.id}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-full border border-emerald-200">
                    {matchedOrder.status || 'Confirmed & Dispatched'}
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-wider text-[#111113]">
                    Delivery Timeline
                  </h3>

                  <div className="relative pl-6 space-y-6 border-l-2 border-[#D4AF37]/50 ml-2">
                    <div className="relative">
                      <div className="w-3.5 h-3.5 bg-emerald-600 rounded-full absolute -left-[31px] top-0.5 border-2 border-white ring-2 ring-emerald-600/30" />
                      <p className="text-xs text-[#111113]">Order Confirmed & Payment Verified</p>
                      <p className="text-[11px] text-[#7A6C58]">
                        Processed via PhonePe secure gateway
                      </p>
                    </div>

                    <div className="relative">
                      <div className="w-3.5 h-3.5 bg-emerald-600 rounded-full absolute -left-[31px] top-0.5 border-2 border-white ring-2 ring-emerald-600/30" />
                      <p className="text-xs text-[#111113]">Quality Inspected & Luxury Packaging</p>
                      <p className="text-[11px] text-[#7A6C58]">
                        Hand-packaged with authenticity certification
                      </p>
                    </div>

                    <div className="relative">
                      <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded-full absolute -left-[31px] top-0.5 border-2 border-white ring-2 ring-[#D4AF37]/40" />
                      <p className="text-xs text-[#111113]">In Transit via Express Courier</p>
                      <p className="text-[11px] text-[#7A6C58]">
                        Delivering to: {matchedOrder.customer.address}
                      </p>
                    </div>

                    <div className="relative opacity-60">
                      <div className="w-3.5 h-3.5 bg-gray-300 rounded-full absolute -left-[31px] top-0.5 border-2 border-white" />
                      <p className="text-xs text-[#111113]">Delivered to Recipient</p>
                      <p className="text-[11px] text-[#7A6C58]">
                        Expected within 2-4 business days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between text-xs text-[#7A6C58]">
                  <span>Recipient: {matchedOrder.customer.name}</span>
                  <Link
                    to={`/orders/${matchedOrder.id}`}
                    className="text-[#8A671A] hover:underline"
                  >
                    View Full Order Invoice →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-3xl border border-[#E8DEC8] text-center space-y-3">
                <p className="text-sm text-[#7A6C58]">
                  No order found matching "{query}".
                </p>
                <p className="text-xs text-[#A09382]">
                  Please ensure you have entered the exact Order ID sent in your confirmation.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
