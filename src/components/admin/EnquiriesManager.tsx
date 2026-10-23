import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  Bell,
  Sparkles,
  AlertCircle,
  Download,
  Settings,
  Send,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerEnquiry } from '../../types';

export const EnquiriesManager: React.FC = () => {
  const {
    enquiries,
    updateEnquiryStatus,
    markEnquiryRead,
    deleteEnquiry,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Webhook settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('lol_owner_email')) || 'lapofluxurypremium@gmail.com';
  });
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('lol_enquiry_email_webhook')) || '';
  });
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      const matchesStatus = statusFilter === 'all' || enq.status === statusFilter;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        enq.name.toLowerCase().includes(term) ||
        enq.phone.includes(term) ||
        enq.email.toLowerCase().includes(term) ||
        enq.message.toLowerCase().includes(term) ||
        (enq.categoryInterest && enq.categoryInterest.toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, searchTerm]);

  const unreadCount = enquiries.filter((e) => !e.isRead).length;

  const handleStatusChange = async (enquiryId: string, newStatus: CustomerEnquiry['status']) => {
    try {
      await updateEnquiryStatus(enquiryId, newStatus);
      showToast(`Enquiry status updated to ${newStatus.toUpperCase()}`);
    } catch {
      showToast('Failed to update status');
    }
  };

  const handleMarkAsRead = async (enquiryId: string) => {
    try {
      await markEnquiryRead(enquiryId);
      showToast('Enquiry marked as read');
    } catch {
      showToast('Failed to mark read');
    }
  };

  const handleDelete = async (enquiryId: string) => {
    try {
      await deleteEnquiry(enquiryId);
      setDeleteConfirmId(null);
      if (selectedEnquiry?.id === enquiryId) setSelectedEnquiry(null);
      showToast('Enquiry deleted successfully');
    } catch {
      showToast('Failed to delete enquiry');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('lol_owner_email', adminEmail.trim());
      localStorage.setItem('lol_enquiry_email_webhook', webhookUrl.trim());
      showToast('Admin notification endpoints saved successfully');
      setIsSettingsOpen(false);
    } catch {
      showToast('Could not save settings locally');
    }
  };

  const handleTestNotification = async () => {
    if (!webhookUrl.trim()) {
      setTestStatus('Please enter a webhook URL first.');
      return;
    }
    setTestStatus('Testing webhook connection...');
    try {
      const res = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          to: adminEmail,
          subject: '👑 LAP OF LUXURY — Test Admin Notification Ping',
          message: 'This is a live test notification from your LAP OF LUXURY Admin Portal.',
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setTestStatus('✓ Success: Webhook received the test notification payload!');
      } else {
        setTestStatus(`Response received with status: ${res.status}`);
      }
    } catch (err: unknown) {
      setTestStatus('Connection failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      showToast('No enquiries to export');
      return;
    }

    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Interest', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${new Date(e.createdAt).toLocaleString('en-IN')}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email}"`,
      `"${(e.categoryInterest || '').replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lap_of_luxury_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111113] text-[#D4AF37] px-4 py-2.5 rounded-xl border border-[#D4AF37] shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Banner and Summary Stats */}
      <div className="bg-white rounded-2xl border-2 border-[#D4AF37]/50 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#8C6D1F]">
              REAL-TIME CLIENT LEADS
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#111113]">
            Customer Enquiries &amp; Client Requests
          </h2>
          <p className="text-xs text-[#7A6C58] mt-0.5">
            Every submission made on the homepage enquiry form is saved permanently in Cloud Firestore and displayed here instantly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white border border-[#D5C7B0] hover:bg-[#FAF8F5] text-[#111113] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 bg-[#111113] hover:bg-[#252528] text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Notification Settings</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DEC8] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone number, email, or message..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs text-[#111113] focus:outline-none focus:bg-white focus:border-[#B8860B]"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'new', 'contacted', 'resolved'] as const).map((status) => {
            const count =
              status === 'all'
                ? enquiries.length
                : enquiries.filter((e) => e.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  statusFilter === status
                    ? 'bg-[#111113] text-[#D4AF37]'
                    : 'bg-[#FAF8F5] text-[#5C5040] hover:bg-[#EFE7D8]'
                }`}
              >
                <span>{status}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries Grid / Cards */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-12 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-[#B8860B] mx-auto stroke-1" />
          <h3 className="font-serif text-lg font-bold text-[#111113] uppercase tracking-wider">
            No Customer Enquiries Found
          </h3>
          <p className="text-xs text-[#7A6C58] max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'No enquiries match your current filters. Try resetting search.'
              : 'New enquiries submitted by customers via the homepage form will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEnquiries.map((enq) => {
            const dateStr = new Date(enq.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const cleanPhone = enq.phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
              `Hello ${enq.name}, greetings from LAP OF LUXURY. We received your enquiry regarding "${enq.message.slice(0, 80)}...". How may we assist you?`
            )}`;

            return (
              <div
                key={enq.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-3 flex flex-col justify-between ${
                  !enq.isRead ? 'border-[#D4AF37] bg-[#FFFDF9]' : 'border-[#E8DEC8]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-[#111113]">
                        {enq.name}
                      </h4>
                      {!enq.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A6C58] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-[#B8860B]" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={enq.status || 'new'}
                    onChange={(e) =>
                      handleStatusChange(enq.id, e.target.value as CustomerEnquiry['status'])
                    }
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:outline-none cursor-pointer uppercase tracking-wider ${
                      enq.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : enq.status === 'contacted'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                {/* Contact Coordinates */}
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6152]">Mobile:</span>
                    <a
                      href={`tel:+91${cleanPhone}`}
                      className="font-bold text-[#111113] hover:text-[#B8860B] flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3 h-3 text-[#B8860B]" />
                      <span>+91 {enq.phone}</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6152]">Email:</span>
                    <a
                      href={`mailto:${enq.email}`}
                      className="font-medium text-[#111113] hover:text-[#B8860B] truncate max-w-[200px]"
                    >
                      {enq.email}
                    </a>
                  </div>

                  {enq.categoryInterest && (
                    <div className="flex items-center justify-between pt-1 border-t border-[#EAE0D0]">
                      <span className="text-[#6E6152]">Interest:</span>
                      <span className="font-semibold text-[#8C6D1F]">
                        {enq.categoryInterest}
                      </span>
                    </div>
                  )}
                </div>

                {/* Customer Message */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D1F] block">
                    Message from Client:
                  </span>
                  <p className="text-xs text-[#2A241E] leading-relaxed bg-[#FAF6EE] p-3 rounded-xl border border-[#EFE8DD] whitespace-pre-wrap">
                    "{enq.message}"
                  </p>
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:+91${cleanPhone}`}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D5C7B0] hover:bg-[#FAF8F5] text-xs font-semibold text-[#111113] flex items-center gap-1"
                      title="Direct Call"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Call</span>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                      title="WhatsApp Chat"
                    >
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    {!enq.isRead ? (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(enq.id)}
                        className="p-1.5 rounded-lg hover:bg-[#FAF6EE] text-[#8C6D1F] text-xs font-semibold cursor-pointer"
                        title="Mark as Read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    ) : null}

                    {deleteConfirmId === enq.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(enq.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-gray-200 text-black rounded text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(enq.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Endpoint Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border-2 border-[#D4AF37] p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#B8860B]" />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-[#111113]">
                  Admin Notification Channels
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                  Store Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="lapofluxurypremium@gmail.com"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg focus:outline-none focus:bg-white focus:border-[#B8860B]"
                />
                <p className="text-[10px] text-[#7A6C58] mt-1">
                  Primary store concierge inbox for client leads and orders.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                  Webhook / Formspree Endpoint (Optional)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://formspree.io/f/your_form_id"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg focus:outline-none focus:bg-white focus:border-[#B8860B]"
                />
                <p className="text-[10px] text-[#7A6C58] mt-1">
                  Configure an external webhook URL (e.g. Formspree, Zapier, Discord) to receive instant notifications on mobile/email.
                </p>
              </div>

              {testStatus && (
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-[#333]">
                  {testStatus}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="px-3.5 py-2 rounded-lg border border-[#B8860B] text-[#8C6D1F] hover:bg-[#FAF6EE] font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  Test Webhook Ping
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold uppercase text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#111113] text-[#D4AF37] font-bold uppercase text-[11px] shadow-sm hover:bg-black"
                  >
                    Save Endpoints
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
