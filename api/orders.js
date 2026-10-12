// Vercel Serverless Function: /api/orders
let memoryOrders = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(memoryOrders);
  }

  if (req.method === 'POST') {
    const orderId = req.body.id || `order-${Date.now()}`;
    const existing = memoryOrders.find((o) => o.id === orderId);
    if (existing) {
      return res.status(200).json(existing);
    }

    const newOrder = {
      id: orderId,
      trackingNumber: `LOL-${Math.floor(1000 + Math.random() * 9000)}`,
      ...req.body,
      createdAt: req.body.createdAt || new Date().toISOString(),
      status: req.body.status || 'Pending',
      paymentStatus: req.body.paymentStatus || 'Pending',
      isRead: false,
    };

    memoryOrders.unshift(newOrder);
    return res.status(201).json(newOrder);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
