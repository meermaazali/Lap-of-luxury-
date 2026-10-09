import { Order } from '../types';

/**
 * Dispatches an instant email notification when an order is placed.
 * Supports:
 * 1. Formspree / Webhook endpoint (configured in Vercel environment variables or local storage)
 * 2. Pre-formatted Email link fallback (mailto:) for 1-click notification to taherab375@gmail.com
 */
export async function sendOrderEmailNotification(order: Order): Promise<boolean> {
  const storeOwnerEmail =
    (typeof window !== 'undefined' && localStorage.getItem('lol_owner_email')) ||
    'taherab375@gmail.com';

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${(
          item.product.price * item.quantity
        ).toLocaleString('en-IN')}`
    )
    .join('\n');

  const emailBody = `
NEW ORDER RECEIVED — LAP OF LUXURY
===================================================
Order ID: #${order.id.slice(-6).toUpperCase()}
Tracking Number: ${order.trackingNumber}
Date: ${new Date(order.createdAt).toLocaleString('en-IN')}

CUSTOMER DETAILS:
- Name: ${order.customerName}
- Phone: ${order.phone}
- Email: ${order.email || 'Not provided'}

DELIVERY ADDRESS:
${order.address}
${order.city} - ${order.pincode}

ORDER ITEMS:
${itemsList}

SUMMARY:
- Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
- Discount: ₹${order.discount.toLocaleString('en-IN')}
- Shipping: ₹${order.shipping.toLocaleString('en-IN')}
- Total Amount: ₹${order.total.toLocaleString('en-IN')}
- Payment Method: ${order.paymentMethod}
- Status: ${order.status.toUpperCase()}
===================================================
`;

  // 1. If an email webhook or Formspree endpoint is configured
  const webhookUrl =
    (typeof window !== 'undefined' && localStorage.getItem('lol_order_email_webhook')) ||
    (typeof process !== 'undefined' && process.env?.VITE_ORDER_EMAIL_WEBHOOK);

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: storeOwnerEmail,
          subject: `👑 New Order #${order.id.slice(-6).toUpperCase()} - ₹${order.total.toLocaleString('en-IN')}`,
          orderId: order.id,
          trackingNumber: order.trackingNumber,
          customerName: order.customerName,
          phone: order.phone,
          total: order.total,
          items: order.items,
          message: emailBody,
        }),
      });
      if (response.ok) {
        return true;
      }
    } catch (e) {
      console.warn('Webhook email notification error:', e);
    }
  }

  return false;
}

/**
 * Generates a pre-filled mailto link for sending order receipt/dispatch alert via standard email client.
 */
export function getOrderMailtoUrl(order: Order, recipientEmail: string = 'taherab375@gmail.com'): string {
  const subject = encodeURIComponent(`👑 New Order #${order.id.slice(-6).toUpperCase()} - ₹${order.total.toLocaleString('en-IN')} [Lap of Luxury]`);
  const body = encodeURIComponent(`
Order #${order.id.slice(-6).toUpperCase()} Details:
Customer: ${order.customerName}
Phone: ${order.phone}
Email: ${order.email || 'N/A'}
Delivery Address: ${order.address}, ${order.city} - ${order.pincode}

Items:
${order.items.map((i) => `• ${i.product.name} (${i.selectedSize}) x ${i.quantity} = ₹${(i.product.price * i.quantity).toLocaleString('en-IN')}`).join('\n')}

Total: ₹${order.total.toLocaleString('en-IN')}
Payment: ${order.paymentMethod} (${order.paymentStatus || 'Pending'})
Tracking: ${order.trackingNumber}
`);
  return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}

