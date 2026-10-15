import fs from 'fs';
import path from 'path';

// Vercel Serverless Function: /api/products
// Persistent file storage with fallback memory cache
function getDatabase() {
  try {
    const dbPath = path.resolve(process.cwd(), 'backend', 'database.json');
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read backend/database.json, falling back to memory:', err);
  }
  return { products: [] };
}

function saveDatabase(db) {
  try {
    const dbPath = path.resolve(process.cwd(), 'backend', 'database.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write backend/database.json:', err);
  }
}

let memoryProducts = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDatabase();
  if (!memoryProducts || memoryProducts.length === 0) {
    memoryProducts = Array.isArray(db.products) && db.products.length > 0 ? db.products : [];
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
      db.products = memoryProducts;
      saveDatabase(db);
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
      db.products = memoryProducts;
      saveDatabase(db);
      return res.status(200).json({ success: true, products: memoryProducts });
    }

    if (Array.isArray(body)) {
      memoryProducts = body;
      db.products = memoryProducts;
      saveDatabase(db);
      return res.status(200).json({ success: true, products: memoryProducts });
    }

    return res.status(200).json({ success: true, products: memoryProducts });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (id) {
      memoryProducts = memoryProducts.filter((p) => p.id !== id);
      db.products = memoryProducts;
      saveDatabase(db);
    }
    return res.status(200).json({ success: true, products: memoryProducts });
  }

  return res.status(200).json(memoryProducts);
}
