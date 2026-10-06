import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const OrdersManager: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    markOrderRead,
    placeOrder,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  const handleExecuteClearOrders = () => {
    try {
      localStorage.setItem('lol_orders', JSON.stringify([]));
    } catch {
      // ignore
    }
    window.location.reload();
  };

  // Helper to trigger a simulated customer order to test live notification & chime
  const handleSimulateOrder = () => {
    const randomNames = ['Arjun Varma', 'Sneha Kulkarni', 'Mohammed Asif', 'Ramesh Goud', 'Ananya Sharma'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomMethods: Array<'COD' | 'UPI' | 'Card'> = ['COD', 'UPI', 'Card'];
    const randomMethod = randomMethods[Math.floor(Math.random() * randomMethods.length)];

    placeOrder({
      name: randomName,
      phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
      address: `Shop #${Math.floor(10 + Math.random() * 80)}, Station Road, Gandhi Nagar`,
      city: 'Mahabubnagar',
      pincode: '509001',
      paymentMethod: randomMethod,
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#B89758]" />
            ORDER NOTIFICATIONS & DISPATCH
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Real-time incoming orders with customer phone, address & status controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
            >
              Clear Orders
            </button>
          )}

          <button
            onClick={handleSimulateOrder}
            className="px-3.5 py-2 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            title="Create a sample order to test real-time notification chime"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Live Notification Sound</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
              statusFilter === st
                ? 'bg-[#1E1E22] text-[#F3E7D5] shadow-xs'
                : 'bg-white border border-[#E0D5C3] text-[#5C5040] hover:bg-[#FAF6EE]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E0D5C3] p-12 text-center">
          <Package className="w-12 h-12 text-[#C5B39E] mx-auto mb-2" />
          <h3 className="font-display font-bold text-base text-[#1E1E22] uppercase tracking-wider">
            NO ORDERS FOUND
          </h3>
          <p className="text-xs text-[#7A6C58] mt-1">
            No orders match the selected filter. Click "Test Live Notification Sound" to simulate one!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUnread = !order.isRead;

            return (
              <div
                key={order.id}
                onClick={() => markOrderRead(order.id)}
                className={`bg-white rounded-xl border p-5 transition-all shadow-xs ${
                  isUnread
                    ? 'border-[#B89758] ring-1 ring-[#B89758]/50 bg-[#FFFCF7]'
                    : 'border-[#E0D5C3]'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE8DD]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#1E1E22]">
                      #{order.trackingNumber}
                    </span>
                    {isUnread && (
                      <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        NEW ORDER
                      </span>
                    )}
                    <span className="text-xs text-[#7A6C58] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  {/* Order Status Select */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#5A4F41]">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as Order['status'])
                      }
                      className="px-3 py-1 text-xs font-bold rounded-lg border border-[#D5C7B0] bg-[#FAF8F5] focus:outline-none focus:border-[#B89758]"
                    >
                      <option value="Pending">Pending (Processing)</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="p-1.5 rounded-lg border border-[#D5C7B0] hover:bg-[#FAF6EE] text-[#5A4F41]"
                      title="Print Invoice / Packing Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <p className="font-bold text-[#1E1E22] text-sm">
                      {order.customerName}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#5C5040]">
                      <Phone className="w-3.5 h-3.5 text-[#B89758]" />
                      <a href={`tel:${order.phone}`} className="hover:underline font-medium">
                        {order.phone}
                      </a>
                    </p>
                    {order.email && (
                      <p className="text-[#7A6C58] truncate">{order.email}</p>
                    )}
                  </div>

                  {/* Delivery Location */}
                  <div className="space-y-1">
                    <p className="font-bold text-[#4A4033] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B89758]" />
                      Shipping Address:
                    </p>
                    <p className="text-[#5C5040] leading-relaxed">
                      {order.address}, {order.city} - {order.pincode}
                    </p>
                  </div>

                  {/* Payment & Amount */}
                  <div className="space-y-1 md:text-right">
                    <p className="text-[#7A6C58]">
                      Method: <strong className="text-[#1E1E22]">{order.paymentMethod}</strong>
                    </p>
                    <p className="text-base sm:text-lg font-bold font-sans text-[#1E1E22] tabular-nums">
                      Total: ₹{order.total.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Shipping: {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                    </span>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="mt-3 pt-3 border-t border-[#F0EAE0] flex flex-wrap items-center gap-3">
                  <span className="text-[11px] font-bold text-[#7A6C58] uppercase">
                    Items ({order.items.length}):
                  </span>
                  {order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E5DAC8] px-2.5 py-1 rounded text-xs"
                    >
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="w-6 h-6 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-semibold text-[#1E1E22]">
                        {it.product.name}
                      </span>
                      <span className="text-[#8C7D6B]">({it.selectedSize})</span>
                      <span className="font-bold text-[#B89758]">×{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 sm:p-8 border shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center pb-4 border-b border-gray-200">
              <h2 className="font-display text-xl font-bold tracking-[0.2em] text-[#1E1E22]">
                LAP OF LUXURY
              </h2>
              <p className="text-xs text-[#7A6C58] uppercase tracking-wider">
                Store · Mahbubnagar, Telangana
              </p>
              <p className="text-[11px] text-[#7A6C58]">D/6, Kota Complex, Telangana Chowrasta, Boyapalle Rural, Mahbubnagar 509001</p>
              <p className="text-[11px] text-[#7A6C58]">Cell: 75 7888 7888 · Support: lapofluxurypremium@gmail.com</p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Invoice / Tracking:</span>
                <span className="font-mono font-bold">#{selectedOrderForInvoice.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold">{selectedOrderForInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{selectedOrderForInvoice.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="text-right max-w-xs">{selectedOrderForInvoice.address}, {selectedOrderForInvoice.city}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold">{selectedOrderForInvoice.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-3 space-y-2">
              {selectedOrderForInvoice.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{it.product.name} ({it.selectedSize}) × {it.quantity}</span>
                  <span className="font-bold tabular-nums">₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 text-right">
              <p className="text-sm font-bold text-[#1E1E22]">
                Total Amount: ₹{selectedOrderForInvoice.total.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#1E1E22] text-white text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
      {/* In-App Clear Orders Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-red-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#111111]">Clear All Orders?</h3>
                <p className="text-xs text-[#7A6C58]">
                  This will reset the incoming order history to start fresh with a clean list.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteClearOrders}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
