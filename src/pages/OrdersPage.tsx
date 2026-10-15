import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

export const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();

  const selectedOrder = id ? orders.find((o) => o.id === id || o.transactionRef === id) : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/account" className="hover:text-[#B8860B] transition-colors">
            Account
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113]">{id ? `Order ${id}` : 'Order History'}</span>
        </nav>

        <div className="border-b border-[#E8DEC8] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
              Purchases & Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
              {id ? `Order Details: ${id}` : 'Your Orders'}
            </h1>
          </div>

          <Link
            to="/track-order"
            className="text-xs text-[#8A671A] hover:text-[#111113] flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track by Order ID</span>
          </Link>
        </div>

        {selectedOrder ? (
          // Single Order Details View
          <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-5">
              <div>
                <span className="text-xs text-[#7A6C58] block">Order Identifier</span>
                <span className="text-lg font-mono text-[#111113]">{selectedOrder.id}</span>
                <span className="text-[11px] text-[#A09382] block">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedOrder.status}</span>
                </span>
                <span className="px-3 py-1 bg-[#FAF6FF] text-[#5f259f] text-xs rounded-full border border-[#5f259f]/30">
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Delivery & Customer details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#554D42]">
              <div className="space-y-1.5 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DEC8]">
                <h3 className="uppercase tracking-wider text-[#111113] pb-1 border-b border-[#E8DEC8]">
                  Delivery Address
                </h3>
                <p><strong>Recipient:</strong> {selectedOrder.customer?.name || selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer?.phone || selectedOrder.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.customer?.address || selectedOrder.address}</p>
              </div>

              <div className="space-y-1.5 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DEC8]">
                <h3 className="uppercase tracking-wider text-[#111113] pb-1 border-b border-[#E8DEC8]">
                  Payment Summary
                </h3>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod || 'PhonePe'}</p>
                <p><strong>Transaction Ref:</strong> {selectedOrder.transactionRef || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{selectedOrder.total.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-[#111113]">
                Purchased Items ({selectedOrder.items.length})
              </h3>
              <div className="divide-y divide-[#F0EAE1] border border-[#E8DEC8] rounded-xl overflow-hidden bg-white">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <a
                        href={`/product/${item.product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#111113] hover:text-[#B8860B] transition-colors block"
                      >
                        {item.product.name}
                      </a>
                      <span className="text-[10px] text-[#7A6C58]">
                        Size: {item.selectedSize || item.size || 'Standard'} · Quantity: {item.quantity}
                      </span>
                    </div>
                    <span className="tabular-nums text-[#111113]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/orders"
                className="text-xs text-[#8A671A] hover:underline"
              >
                ← Back to All Orders
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8DEC8] p-8 space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-[#B8860B] mx-auto stroke-1" />
            <h2 className="text-lg text-[#111113]">No Orders Found</h2>
            <p className="text-xs text-[#7A6C58]">
              You haven't placed any orders with LAP OF LUXURY yet.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#E8DEC8] p-5 sm:p-6 space-y-4 shadow-2xs hover:border-[#B8860B] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE1] pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A671A] block">
                      Order ID: {order.id}
                    </span>
                    <span className="text-xs text-[#7A6C58]">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] rounded-full border border-emerald-200">
                      {order.status}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#FAF6FF] text-[#5f259f] text-[11px] rounded-full border border-[#5f259f]/20">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[#554D42]">
                      <span>
                        {item.product.name} (Qty: {item.quantity}, Size: {item.selectedSize || item.size || 'Standard'})
                      </span>
                      <span className="tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-[10px] text-[#A09382]">
                      + {order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#7A6C58]">Total Amount: </span>
                    <span className="text-sm text-[#111113] tabular-nums">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-1.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
