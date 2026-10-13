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
  Printer,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { getOrderMailtoUrl, sendOrderEmailNotification } from '../../utils/orderNotification';

export const OrdersManager: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    markOrderRead,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string>(() => {
    return localStorage.getItem('lol_owner_email') || 'lapofluxurypremium@gmail.com';
  });
  const [emailWebhook, setEmailWebhook] = useState<string>(() => {
    return localStorage.getItem('lol_order_email_webhook') || '';
  });
  const [showEmailConfig, setShowEmailConfig] = useState<boolean>(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('lol_owner_email', ownerEmail.trim());
    localStorage.setItem('lol_order_email_webhook', emailWebhook.trim());
    setEmailStatusMsg('✓ Saved email notifications settings!');
    setTimeout(() => setEmailStatusMsg(null), 3500);
  };

  const handleSendEmailNow = async (order: Order) => {
    if (emailWebhook.trim()) {
      await sendOrderEmailNotification(order);
    }
    const mailto = getOrderMailtoUrl(order, ownerEmail);
    window.open(mailto, '_blank');
  };

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/orders').catch(() => null);
    } catch {
      // offline
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleVerifyOrderPayment = async (order: Order) => {
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'Paid', status: 'Confirmed' }),
      }).catch(() => null);
    } catch {
      // offline
    }

    order.paymentStatus = 'Paid';
    updateOrderStatus(order.id, 'Confirmed');
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  const handleExecuteClearOrders = () => {
    try {
      localStorage.setItem('lol_orders', JSON.stringify([]));
    } catch {}
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#B89758]" />
            ORDER MANAGEMENT (SILENT NOTIFICATIONS)
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Silent incoming orders, verified UPI payment status, customer details & dispatch controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefreshOrders}
            disabled={isRefreshing}
            className="px-3 py-1.5 border border-[#D5C7B0] hover:bg-[#FAF8F5] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>

          <button
            onClick={() => setShowEmailConfig(!showEmailConfig)}
            className="px-3 py-1.5 border border-[#B89758] text-[#8C6D1F] hover:bg-[#FAF6EE] text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Configure Order Email Notifications"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Alerts ({ownerEmail})</span>
          </button>

          {orders.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
            >
              Clear Orders
            </button>
          )}
        </div>
      </div>

      {/* Email Alerts Configuration Panel */}
      {showEmailConfig && (
        <form onSubmit={handleSaveEmailConfig} className="bg-white p-5 rounded-xl border-2 border-[#D4AF37]/60 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#B89758]" />
              <h3 className="font-bold text-sm text-[#1E1E22] uppercase tracking-wider">
                Store Owner Order Email Notifications
              </h3>
            </div>
            {emailStatusMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {emailStatusMsg}
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A4F41] leading-relaxed">
            Every customer order automatically triggers notifications to your email. You can receive them via instant <strong>1-Click Email Dispatch</strong> or via a free <strong>Formspree / Webhook</strong> endpoint.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A4033] uppercase mb-1">
                Your Email Address (For Order Receipts) *
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="lapofluxurypremium@gmail.com"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs font-mono focus:border-[#B89758] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A4033] uppercase mb-1">
                Optional: Formspree / Webhook Endpoint
              </label>
              <input
                type="url"
                value={emailWebhook}
                onChange={(e) => setEmailWebhook(e.target.value)}
                placeholder="e.g. https://formspree.io/f/your_form_id"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs font-mono focus:border-[#B89758] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowEmailConfig(false)}
              className="px-3 py-1.5 border border-[#D5C7B0] text-xs font-bold uppercase rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#B89758] text-white text-xs font-bold uppercase rounded-lg shadow-sm hover:brightness-105"
            >
              Save Email Settings
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Modal for Clearing Orders */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full space-y-4 border border-red-300 shadow-xl">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Reset All Orders</span>
            </div>
            <p className="text-xs text-[#554D42]">
              Are you sure you want to permanently clear the orders list? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D5C7B0]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteClearOrders}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-[#E0D5C3] bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              statusFilter === st
                ? 'border-[#B89758] text-[#1E1E22]'
                : 'border-transparent text-[#7A6C58] hover:text-[#1E1E22]'
            }`}
          >
            {st} (
            {st === 'All'
              ? orders.length
              : orders.filter((o) => o.status === st).length}
            )
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E0D5C3] p-12 text-center text-[#7A6C58] space-y-2">
          <Package className="w-8 h-8 mx-auto text-[#D5C7B0]" />
          <p className="font-semibold text-sm">No orders found in "{statusFilter}".</p>
          <p className="text-xs">Incoming customer orders appear here silently with verified payment status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUnread = !order.isRead;
            const isVerified = order.paymentStatus === 'Verified';

            return (
              <div
                key={order.id}
                onClick={() => markOrderRead(order.id)}
                className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-xs space-y-3 ${
                  isUnread
                    ? 'border-[#B89758] bg-[#FAF8F5] ring-1 ring-[#B89758]/30'
                    : 'border-[#E0D5C3]'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE0] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#111113]">
                      #{order.trackingNumber}
                    </span>
                    {isUnread && (
                      <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        NEW ORDER
                      </span>
                    )}

                    {/* Verified vs Pending Badge */}
                    {isVerified ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border border-emerald-300">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>Payment Verified</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border border-amber-300">
                        <AlertCircle className="w-3 h-3 text-amber-700" />
                        <span>Payment Pending</span>
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

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!isVerified && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyOrderPayment(order);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Verify incoming payment"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify & Confirm Payment</span>
                      </button>
                    )}

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
                      onClick={() => handleSendEmailNow(order)}
                      className="px-2.5 py-1 rounded-lg border border-[#B89758] hover:bg-[#FAF6EE] text-[#8C6D1F] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Send Order Email Receipt"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#B89758]" />
                      <span className="hidden sm:inline">Email Order</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="p-1.5 rounded-lg border border-[#D5C7B0] hover:bg-[#FAF6EE] text-[#5A4F41] cursor-pointer"
                      title="Print Invoice / Packing Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
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
                <div className="mt-2 pt-2 border-t border-[#F0EAE0] flex flex-wrap items-center gap-3">
                  <span className="text-[11px] font-bold text-[#7A6C58] uppercase">
                    Items ({order.items.length}):
                  </span>
                  {order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E5DAC8] px-2.5 py-1 rounded text-xs"
                    >
                      <span className="font-semibold text-[#111113]">{it.product.name}</span>
                      <span className="text-[10px] text-[#7A6C58]">
                        ({it.selectedSize}) × {it.quantity}
                      </span>
                      <span className="text-[#8A671A] font-bold">
                        ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Customer Payment Screenshot Preview if uploaded on desktop */}
                {order.paymentScreenshot && (
                  <div className="mt-2 p-2.5 bg-[#FAF6EE] rounded-xl border border-[#D4AF37] flex items-center gap-3">
                    <img
                      src={order.paymentScreenshot}
                      alt="Customer Payment Screenshot"
                      className="w-14 h-14 object-cover rounded-lg border border-[#D4AF37] cursor-pointer hover:opacity-85 transition-opacity"
                      onClick={() => setPreviewScreenshotUrl(order.paymentScreenshot || null)}
                    />
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-[#8A671A] block uppercase tracking-wider">
                        Customer Payment Screenshot Attached
                      </span>
                      <p className="text-[10px] text-[#554D42]">
                        Uploaded from desktop during checkout. Click to inspect full image for bank UTR & time.
                      </p>
                      <button
                        type="button"
                        onClick={() => setPreviewScreenshotUrl(order.paymentScreenshot || null)}
                        className="text-[11px] text-[#B8860B] font-bold hover:underline inline-block mt-0.5 cursor-pointer"
                      >
                        View Full Screenshot ↗
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal Preview */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-[#111113] uppercase tracking-wider">
                  LAP OF LUXURY · TAX INVOICE
                </h3>
                <p className="text-[11px] text-[#7A6C58]">
                  D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, Beside prashant residency, Mahbubnagar, Telangana 509001
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span>Invoice / Order:</span>
                <strong className="font-mono">#{selectedOrderForInvoice.trackingNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Customer Name:</span>
                <strong>{selectedOrderForInvoice.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Contact Phone:</span>
                <strong>{selectedOrderForInvoice.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Method / Status:</span>
                <strong>{selectedOrderForInvoice.paymentMethod} ({selectedOrderForInvoice.paymentStatus || 'Verified'})</strong>
              </div>
            </div>

            <table className="w-full text-xs border border-gray-200 mt-3">
              <thead className="bg-[#FAF8F5] border-b">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Size</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedOrderForInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium">{it.product.name}</td>
                    <td className="p-2 text-center">{it.selectedSize}</td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2 text-right font-semibold">
                      ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between pt-2 font-bold text-sm border-t">
              <span>Total Payable Amount:</span>
              <span>₹{selectedOrderForInvoice.total.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#111113] text-white rounded-lg text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Size Customer Payment Screenshot Lightbox Modal */}
      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 space-y-3 border-2 border-[#D4AF37] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2.5">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111113]">
                  Customer Payment Screenshot
                </h4>
                <p className="text-[10px] text-[#7A6C58]">
                  Verified UPI receipt uploaded by customer during checkout
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewScreenshotUrl(null)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-black hover:bg-gray-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-[#FAF8F5] rounded-xl p-2 border border-gray-200">
              <img
                src={previewScreenshotUrl}
                alt="Payment Screenshot Full"
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreviewScreenshotUrl(null)}
                className="px-4 py-1.5 bg-[#111113] hover:bg-black text-[#F4E09E] text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
