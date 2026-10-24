import { CustomerEnquiry } from '../types';

/**
 * Dispatches an instant administrator notification when a new customer enquiry is submitted.
 * Supports:
 * 1. Webhook endpoint / Formspree / Email Gateway (configured in environment or admin settings)
 * 2. Pre-formatted mailto trigger for direct store notifications
 */
export async function sendEnquiryNotification(enquiry: CustomerEnquiry): Promise<boolean> {
  const storeOwnerEmail =
    (typeof window !== 'undefined' && localStorage.getItem('lol_owner_email')) ||
    'lapofluxurypremium@gmail.com';

  const webhookUrl =
    (typeof window !== 'undefined' &&
      (localStorage.getItem('lol_enquiry_email_webhook') ||
        localStorage.getItem('lol_order_email_webhook'))) ||
    (typeof process !== 'undefined' &&
      (process.env?.VITE_ENQUIRY_WEBHOOK || process.env?.VITE_ORDER_EMAIL_WEBHOOK));

  const enquirySubject = `✨ New Customer Enquiry from ${enquiry.name} [LAP OF LUXURY]`;
  const emailBody = `
NEW CUSTOMER ENQUIRY — LAP OF LUXURY
===================================================
Enquiry ID: #${enquiry.id.slice(-6).toUpperCase()}
Date & Time: ${new Date(enquiry.createdAt).toLocaleString('en-IN')}

CUSTOMER DETAILS:
- Name: ${enquiry.name}
- Phone: +91 ${enquiry.phone}
- Email: ${enquiry.email}
- Interest: ${enquiry.categoryInterest || 'General Luxury Store Enquiry'}

MESSAGE:
"${enquiry.message}"

DIRECT ACTIONS:
- Call Customer: tel:+91${enquiry.phone.replace(/\D/g, '')}
- WhatsApp Customer: https://wa.me/91${enquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enquiry.name}, thank you for contacting LAP OF LUXURY. Regarding your enquiry: "${enquiry.message}"`)}
- Email Customer: mailto:${enquiry.email}
===================================================
`;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: storeOwnerEmail,
          subject: enquirySubject,
          enquiryId: enquiry.id,
          customerName: enquiry.name,
          phone: enquiry.phone,
          email: enquiry.email,
          message: enquiry.message,
          categoryInterest: enquiry.categoryInterest,
          date: enquiry.createdAt,
          fullBody: emailBody,
        }),
      });

      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.warn('Enquiry webhook dispatch warning:', err);
    }
  }

  return false;
}

/**
 * Pre-formatted mailto URL to notify the store admin
 */
export function getEnquiryMailtoUrl(
  enquiry: CustomerEnquiry,
  recipientEmail: string = 'lapofluxurypremium@gmail.com'
): string {
  const subject = encodeURIComponent(
    `✨ New Customer Enquiry: ${enquiry.name} (+91 ${enquiry.phone})`
  );
  const body = encodeURIComponent(`
Customer Enquiry Details:
- Name: ${enquiry.name}
- Phone: +91 ${enquiry.phone}
- Email: ${enquiry.email}
- Category: ${enquiry.categoryInterest || 'General'}
- Date: ${new Date(enquiry.createdAt).toLocaleString('en-IN')}

Message:
"${enquiry.message}"
`);
  return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}
