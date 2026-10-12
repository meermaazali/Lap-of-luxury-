// Vercel Serverless Function: /api/products
let memoryProducts = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(memoryProducts);
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    
    // Check if this is an inventory deduction
    if (body.deductions && Array.isArray(body.deductions)) {
      body.deductions.forEach(({ productId, quantity }) => {
        const p = memoryProducts.find((item) => item.id === productId);
        if (p) {
          p.stockCount = Math.max(0, (p.stockCount || 0) - quantity);
          p.inStock = p.stockCount > 0;
        }
      });
      return res.status(200).json({ success: true, products: memoryProducts });
    }

    // Single product or product list upsert
    if (body.name) {
      const idx = memoryProducts.findIndex((p) => p.id === body.id);
      if (idx !== -1) {
        memoryProducts[idx] = { ...memoryProducts[idx], ...body };
      } else {
        memoryProducts.push({
          id: body.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ...body,
        });
      }
      return res.status(200).json({ success: true, products: memoryProducts });
    }

    if (Array.isArray(body)) {
      memoryProducts = body;
      return res.status(200).json({ success: true, products: memoryProducts });
    }

    return res.status(200).json({ success: true, products: memoryProducts });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (id) {
      memoryProducts = memoryProducts.filter((p) => p.id !== id);
    }
    return res.status(200).json({ success: true, products: memoryProducts });
  }

  return res.status(200).json(memoryProducts);
}
