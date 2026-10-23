import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Sparkles,
  MessageSquare,
  Clock,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerEnquirySection: React.FC = () => {
  const { submitEnquiry } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    categoryInterest: "Men's Fashion & Sartorial",
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your full name.';
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Please provide your message or inquiry (at least 5 characters).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setErrorMessage('Please resolve the errors highlighted below.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const cleanPhone = formData.phone.trim().replace(/\D/g, '');
      const created = await submitEnquiry({
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        categoryInterest: formData.categoryInterest,
        message: formData.message.trim(),
        source: 'Homepage Concierge Enquiry Form',
      });

      setSubmittedEnquiryId(created.id);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        categoryInterest: "Men's Fashion & Sartorial",
        message: '',
      });
    } catch (err: unknown) {
      console.error('Failed to submit enquiry:', err);
      setErrorMessage(
        'Unable to transmit enquiry at this moment. Please call our store concierge directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry-section" className="w-full bg-[#FAF8F5] py-14 sm:py-20 border-t border-[#E8DEC8]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Brand Story & Atelier Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D4AF37]/50 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#B8860B] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#8C6D1F]">
                BESPOKE CLIENT ASSISTANCE
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-[#111113] leading-tight">
                CONCIERGE &amp; CLIENT ENQUIRIES
              </h2>
              <p className="text-xs sm:text-sm text-[#6A5E4E] leading-relaxed">
                Connect directly with our master stylists and concierge team. Whether inquiring about custom fits, private perfume blends, exclusive timepieces, or doorstep orders — we are delighted to assist you.
              </p>
            </div>

            {/* Store Contact Details */}
            <div className="space-y-3.5 pt-2 border-t border-[#E8DEC8]">
              <div className="flex items-start gap-3 text-xs text-[#4A4033]">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D5C7B0] flex items-center justify-center shrink-0 text-[#B8860B] mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#111113] block">Phone &amp; WhatsApp Concierge</span>
                  <a href="tel:+917578887888" className="hover:text-[#B8860B] transition-colors font-medium">
                    +91 75 7888 7888 / +91 9848263939
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#4A4033]">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D5C7B0] flex items-center justify-center shrink-0 text-[#B8860B] mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#111113] block">Email Support</span>
                  <a href="mailto:lapofluxurypremium@gmail.com" className="hover:text-[#B8860B] transition-colors font-medium">
                    lapofluxurypremium@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#4A4033]">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#D5C7B0] flex items-center justify-center shrink-0 text-[#B8860B] mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#111113] block">Mahbubnagar Store</span>
                  <span className="text-[#6A5E4E]">Telangana, India · Nationwide &amp; Express Doorstep Dispatch</span>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee Pill */}
            <div className="p-3 bg-white rounded-xl border border-[#D4AF37]/40 text-xs text-[#625544] flex items-center gap-2.5 shadow-2xs">
              <Clock className="w-4 h-4 text-[#B8860B] shrink-0" />
              <span>Prompt concierge review: All inquiries answered within <strong>2 to 4 business hours</strong>.</span>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl p-6 sm:p-9 relative overflow-hidden">
              {/* Subtle Ambient Gold Glow */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

              {submittedEnquiryId ? (
                /* Success Confirmation State */
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-[#FAF3E6] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#B8860B] shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#8C6D1F] block">
                      ENQUIRY RECORDED SUCCESSFULLY
                    </span>
                    <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-[#111113]">
                      Thank You for Contacting Us
                    </h3>
                    <p className="text-xs text-[#6A5E4E] max-w-md mx-auto">
                      Your enquiry reference ID is{' '}
                      <strong className="font-mono text-[#111113]">#{submittedEnquiryId.slice(-6).toUpperCase()}</strong>.
                      Our store concierge will review your message and reach out via phone/WhatsApp promptly.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedEnquiryId(null)}
                      className="px-6 py-2.5 rounded-xl border border-[#D5C7B0] hover:bg-[#FAF8F5] text-[#111113] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Send Another Enquiry
                    </button>
                    <a
                      href="https://wa.me/917578887888?text=Hello%20LAP%20OF%20LUXURY,%20I%20have%20an%20enquiry%20regarding%20your%20collection."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Instant WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Main Active Form */
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="border-b border-[#F0EAE1] pb-3">
                    <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-[#111113]">
                      Send an Enquiry to LAP OF LUXURY
                    </h3>
                    <p className="text-xs text-[#7A6C58] mt-0.5">
                      Please enter your details below. We save your request permanently to ensure personalized assistance.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                          fieldErrors.name
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[#D5C7B0] focus:border-[#B8860B]'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-[10px] text-red-600 mt-1">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                        Mobile Number (10 Digits) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C58] font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className={`w-full pl-12 pr-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                            fieldErrors.phone
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-[#D5C7B0] focus:border-[#B8860B]'
                          }`}
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="text-[10px] text-red-600 mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Category Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="client@example.com"
                        className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                          fieldErrors.email
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[#D5C7B0] focus:border-[#B8860B]'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-[10px] text-red-600 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                        Area of Interest
                      </label>
                      <select
                        name="categoryInterest"
                        value={formData.categoryInterest}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl focus:outline-none focus:bg-white focus:border-[#B8860B] text-[#111113] transition-colors cursor-pointer"
                      >
                        <option value="Men's Fashion & Sartorial">Men's Sartorial &amp; Shirts</option>
                        <option value="Footwear & Shoes">Luxury Footwear &amp; Sneakers</option>
                        <option value="Bags & Leather Collection">Designer Bags &amp; Luggage</option>
                        <option value="Royal Perfumes">Royal Oud &amp; French Perfumes</option>
                        <option value="Watches & Horology">Precision Watches &amp; Timepieces</option>
                        <option value="Jeans & Luxury Denim">Jeans &amp; Luxury Denim</option>
                        <option value="Bespoke Order / Custom Fit">Bespoke Fitting &amp; Sizing</option>
                        <option value="General Store Inquiry">General Store Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                      Your Message or Inquiry <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share details about the size, product, or styling assistance you require..."
                      className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors resize-none ${
                        fieldErrors.message
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#D5C7B0] focus:border-[#B8860B]'
                      }`}
                    />
                    {fieldErrors.message && (
                      <p className="text-[10px] text-red-600 mt-1">{fieldErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4 text-[#111113]" />
                      <span>{isSubmitting ? 'TRANSMITTING ENQUIRY TO CONCIERGE...' : 'SUBMIT ENQUIRY NOW'}</span>
                    </button>
                  </div>

                  <p className="text-[10.5px] text-[#7A6C58] text-center pt-1">
                    Your details are securely saved in Firebase and routed directly to our store management team.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
