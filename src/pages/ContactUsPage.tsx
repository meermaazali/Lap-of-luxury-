import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

export const ContactUsPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setForm({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113]">Contact & Store Details</span>
        </nav>

        <div className="border-b border-[#E8DEC8] pb-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
            Customer Support & Store
          </span>
          <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
            Contact LAP OF LUXURY
          </h1>
          <p className="text-xs text-[#7A6C58] mt-1">
            Experience Premium in Every Touch. Our styling team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Store Information */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-sm uppercase tracking-wider text-[#111113] border-b border-[#E8DEC8] pb-3">
              Store Information
            </h2>

            <div className="space-y-4 text-xs text-[#4A4033]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#111113]">Fashion Store Address:</p>
                  <p className="text-[#6C604F] leading-relaxed mt-0.5">
                    D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, beside Prashant Residency, Mahbubnagar, Telangana 509001.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#111113]">Store Timings:</p>
                  <p className="text-[#6C604F] mt-0.5">9:30 AM – 10:00 PM (Monday to Sunday)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#111113]">Phone & Support:</p>
                  <a
                    href="tel:+917578887888"
                    className="text-[#8A671A] hover:underline block mt-0.5"
                  >
                    +91 75 7888 7888
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#111113]">Email Assistance:</p>
                  <a
                    href="mailto:lapofluxurypremium@gmail.com"
                    className="text-[#8A671A] hover:underline block mt-0.5"
                  >
                    lapofluxurypremium@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#111113]">Official Instagram:</p>
                  <a
                    href="https://www.instagram.com/_lapofluxury_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8A671A] hover:underline block mt-0.5"
                  >
                    @_lapofluxury_
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-sm uppercase tracking-wider text-[#111113] border-b border-[#E8DEC8] pb-3">
              Send an Inquiry or Styling Request
            </h2>

            {sent && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you. Your message has been sent to our store team.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#4A4033] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-3 py-2.5 text-xs border border-[#D5C7B0] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#4A4033] mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 Phone Number"
                    className="w-full px-3 py-2.5 text-xs border border-[#D5C7B0] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#4A4033] mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 text-xs border border-[#D5C7B0] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#4A4033] mb-1">Inquiry Details *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How may our team assist you with sizes, orders, or styling?"
                  className="w-full px-3 py-2.5 text-xs border border-[#D5C7B0] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Send Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
