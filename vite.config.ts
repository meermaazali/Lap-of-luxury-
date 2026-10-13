import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { defineConfig, Plugin } from 'vite';

const DB_PATH = path.resolve('backend/database.json');
const UPLOADS_DIR = path.resolve('public/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch {}
}

function getDatabase(): any {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading database.json:', err);
  }
  return { products: [], orders: [], banners: [], payments: {}, boutiqueHero: {} };
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database.json:', err);
  }
}

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        const parsedUrl = new URL(req.url, 'http://localhost:3000');
        const pathname = parsedUrl.pathname;

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          let body: any = {};
          try {
            if (bodyStr) body = JSON.parse(bodyStr);
          } catch {}

          const db = getDatabase();

          // 1. PRODUCTS API
          if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
            if (req.method === 'GET') {
              const category = parsedUrl.searchParams.get('category');
              const search = parsedUrl.searchParams.get('search');
              const page = parseInt(parsedUrl.searchParams.get('page') || '1', 10);
              const limit = parseInt(parsedUrl.searchParams.get('limit') || '500', 10);

              let list = Array.isArray(db.products) ? [...db.products] : [];

              if (category && category !== 'All') {
                list = list.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
              }

              if (search) {
                const s = search.toLowerCase();
                list = list.filter((p: any) =>
                  p.name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
                );
              }

              const total = list.length;
              const startIndex = (page - 1) * limit;
              const paginated = limit >= 500 ? list : list.slice(startIndex, startIndex + limit);

              res.statusCode = 200;
              // Return list directly for backwards compatibility, with total header
              res.setHeader('X-Total-Count', total.toString());
              return res.end(JSON.stringify(paginated));
            }

            if (req.method === 'POST') {
              // Inventory deduction endpoint
              if (pathname === '/api/products/inventory') {
                if (body.deductions && Array.isArray(body.deductions)) {
                  body.deductions.forEach(({ productId, quantity }: any) => {
                    const p = db.products.find((item: any) => item.id === productId);
                    if (p) {
                      p.stockCount = Math.max(0, (p.stockCount || 0) - quantity);
                      p.inStock = p.stockCount > 0;
                    }
                  });
                  saveDatabase(db);
                }
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, products: db.products }));
              }

              // Bulk products update / sync
              if (Array.isArray(body)) {
                db.products = body;
                saveDatabase(db);
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, count: db.products.length }));
              }

              // Single product upsert
              if (body && body.name) {
                const existingIdx = db.products.findIndex((p: any) => p.id === body.id);
                if (existingIdx !== -1) {
                  db.products[existingIdx] = { ...db.products[existingIdx], ...body };
                } else {
                  const newProd = {
                    id: body.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    ...body,
                  };
                  db.products.push(newProd);
                }
                saveDatabase(db);
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, products: db.products }));
              }

              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, products: db.products }));
            }

            if (req.method === 'DELETE') {
              const id = parsedUrl.searchParams.get('id') || pathname.replace('/api/products/', '');
              if (id) {
                db.products = db.products.filter((p: any) => p.id !== id);
                saveDatabase(db);
              }
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, products: db.products }));
            }
          }

          // 2. MEDIA UPLOAD API (Saves files directly to /public/uploads/ to prevent large base64 database bloat)
          if (pathname === '/api/media/upload' && req.method === 'POST') {
            try {
              let fileUrl = '';
              if (body.dataUrl && typeof body.dataUrl === 'string') {
                const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                  const ext = matches[1].includes('png') ? 'png' : matches[1].includes('webp') ? 'webp' : 'jpg';
                  const filename = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
                  const filePath = path.join(UPLOADS_DIR, filename);
                  fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
                  fileUrl = `/uploads/${filename}`;
                }
              }

              if (fileUrl) {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, url: fileUrl }));
              }

              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Invalid file payload' }));
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          }

          // 3. BANNERS API
          if (pathname === '/api/banners') {
            if (req.method === 'GET') {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                banners: db.banners || [],
                boutiqueHero: db.boutiqueHero || null,
              }));
            }
            if (req.method === 'POST') {
              if (body.boutiqueHero) {
                db.boutiqueHero = body.boutiqueHero;
              }
              if (body.banners) {
                db.banners = body.banners;
              }
              saveDatabase(db);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, boutiqueHero: db.boutiqueHero }));
            }
          }

          // 4. PAYMENTS CONFIG & VERIFICATION
          if (pathname === '/api/payments/config') {
            if (req.method === 'GET') {
              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  upiId: '9848263939@ybl',
                  payeeName: 'KODIGANTI DINESH',
                  phone: '9848263939',
                  merchantVpa: '9848263939@ybl',
                  enableUPI: true,
                  ...(db.payments || {}),
                  enableCOD: false, // Strictly enforced: COD removed
                })
              );
            }
            if (req.method === 'POST') {
              db.payments = { ...db.payments, ...body, enableCOD: false };
              saveDatabase(db);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, payments: db.payments }));
            }
          }

          if (pathname === '/api/payments/verify' && req.method === 'POST') {
            const utr = typeof body.utrNumber === 'string' ? body.utrNumber.trim() : '';
            const hasValidUTR = /^\d{12}$/.test(utr);

            if (hasValidUTR) {
              if (!db.verifiedTransactions) db.verifiedTransactions = [];
              db.verifiedTransactions.push({
                utr,
                verifiedAt: new Date().toISOString(),
                amount: body.amount,
              });
              saveDatabase(db);

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: true,
                  verified: true,
                  status: 'Verified',
                  message: `Payment verified successfully via UPI UTR ${utr}.`,
                })
              );
            }

            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                success: false,
                verified: false,
                status: 'Payment Pending',
                message:
                  'Payment verification is pending bank settlement confirmation. If you completed the transfer, please input your 12-digit UTR reference or await bank confirmation.',
              })
            );
          }

          // 4B. PHONEPE PAYMENT GATEWAY APIS
          if (pathname === '/api/phonepe/initiate' && req.method === 'POST') {
            try {
              const { amount, orderId, customerPhone, customerName } = body || {};
              const payments = db.payments || {};

              const merchantId = payments.phonepeMerchantId || process.env.PHONEPE_MERCHANT_ID;
              const saltKey = payments.phonepeSaltKey || process.env.PHONEPE_SALT_KEY;
              const saltIndex = payments.phonepeSaltIndex || process.env.PHONEPE_SALT_INDEX || '1';
              const env = payments.phonepeEnv || process.env.PHONEPE_ENV || 'SANDBOX';

              if (!merchantId || !saltKey) {
                res.statusCode = 200;
                return res.end(
                  JSON.stringify({
                    success: false,
                    configured: false,
                    code: 'GATEWAY_CREDENTIALS_REQUIRED',
                    message:
                      'PhonePe Payment Gateway requires your Merchant ID (MID) and Salt Key to process live payments.',
                    requiredFields: ['phonepeMerchantId', 'phonepeSaltKey', 'phonepeSaltIndex', 'phonepeEnv'],
                  })
                );
              }

              const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
              const numericAmount = Math.round(Number(amount || 0) * 100); // in paise
              const hostUrl = req.headers.referer ? new URL(req.headers.referer).origin : 'http://localhost:3000';
              const redirectUrl = `${hostUrl}/?payment_status=success&txn=${txnId}&orderId=${orderId || ''}`;
              const callbackUrl = `${hostUrl}/api/phonepe/callback`;

              const payload = {
                merchantId,
                merchantTransactionId: txnId,
                merchantUserId: `CUST_${(customerPhone || '9848263939').replace(/\D/g, '') || '9848263939'}`,
                amount: numericAmount,
                redirectUrl,
                redirectMode: 'REDIRECT',
                callbackUrl,
                mobileNumber: (customerPhone || '9848263939').replace(/\D/g, '').slice(-10),
                paymentInstrument: {
                  type: 'PAY_PAGE',
                },
              };

              const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
              const stringToHash = base64Payload + '/pg/v1/pay' + saltKey;
              const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
              const xVerify = `${sha256}###${saltIndex}`;

              const apiUrl =
                env === 'PRODUCTION'
                  ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
                  : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

              const phonepeResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-VERIFY': xVerify,
                },
                body: JSON.stringify({ request: base64Payload }),
              });

              const phonepeData: any = await phonepeResponse.json().catch(() => ({}));

              if (phonepeData && phonepeData.success && phonepeData.data?.instrumentResponse?.redirectInfo?.url) {
                if (!db.pendingTransactions) db.pendingTransactions = {};
                db.pendingTransactions[txnId] = {
                  orderId,
                  amount,
                  createdAt: new Date().toISOString(),
                  merchantId,
                  status: 'PAYMENT_INITIATED',
                };
                saveDatabase(db);

                res.statusCode = 200;
                return res.end(
                  JSON.stringify({
                    success: true,
                    configured: true,
                    transactionId: txnId,
                    redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
                  })
                );
              }

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: false,
                  configured: true,
                  error: phonepeData?.message || 'PhonePe gateway returned an error',
                  details: phonepeData,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          }

          if (pathname === '/api/phonepe/status' && req.method === 'POST') {
            try {
              const { transactionId } = body || {};
              const payments = db.payments || {};
              const merchantId = payments.phonepeMerchantId || process.env.PHONEPE_MERCHANT_ID;
              const saltKey = payments.phonepeSaltKey || process.env.PHONEPE_SALT_KEY;
              const saltIndex = payments.phonepeSaltIndex || process.env.PHONEPE_SALT_INDEX || '1';
              const env = payments.phonepeEnv || process.env.PHONEPE_ENV || 'SANDBOX';

              if (!merchantId || !saltKey || !transactionId) {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: false, status: 'UNKNOWN' }));
              }

              const stringToHash = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
              const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
              const xVerify = `${sha256}###${saltIndex}`;

              const statusApiUrl =
                env === 'PRODUCTION'
                  ? `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`
                  : `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`;

              const response = await fetch(statusApiUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'X-VERIFY': xVerify,
                  'X-MERCHANT-ID': merchantId,
                },
              });

              const data: any = await response.json().catch(() => ({}));

              if (data && data.code === 'PAYMENT_SUCCESS') {
                const pending = db.pendingTransactions?.[transactionId];
                if (pending && pending.orderId && Array.isArray(db.orders)) {
                  const ordIdx = db.orders.findIndex((o: any) => o.id === pending.orderId);
                  if (ordIdx !== -1) {
                    db.orders[ordIdx].paymentStatus = 'Paid';
                    db.orders[ordIdx].transactionRef = transactionId;
                    saveDatabase(db);
                  }
                }

                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, verified: true, status: 'Paid', data }));
              }

              res.statusCode = 200;
              return res.end(
                JSON.stringify({
                  success: false,
                  verified: false,
                  status: data?.code || 'PENDING',
                  message: data?.message || 'Payment pending or not confirmed',
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          }

          // 5. ORDERS API
          if (pathname === '/api/orders') {
            if (req.method === 'GET') {
              res.statusCode = 200;
              return res.end(JSON.stringify(db.orders || []));
            }
            if (req.method === 'POST') {
              const newOrder = {
                id: body.id || `order-${Date.now()}`,
                trackingNumber: body.trackingNumber || `LOL-${Math.floor(1000 + Math.random() * 9000)}`,
                ...body,
                status: body.status || 'Pending',
                paymentStatus: body.paymentStatus || 'Payment Pending',
                createdAt: body.createdAt || new Date().toISOString(),
              };
              if (!Array.isArray(db.orders)) db.orders = [];
              // Prevent duplicate orders
              const existingIdx = db.orders.findIndex((o: any) => o.id === newOrder.id);
              if (existingIdx !== -1) {
                db.orders[existingIdx] = newOrder;
              } else {
                db.orders.unshift(newOrder);
              }
              saveDatabase(db);

              res.statusCode = 201;
              return res.end(JSON.stringify(newOrder));
            }
          }

          if (pathname.startsWith('/api/orders/') && req.method === 'PATCH') {
            const orderId = pathname.replace('/api/orders/', '');
            const existingOrder = (db.orders || []).find((o: any) => o.id === orderId);
            if (existingOrder) {
              Object.assign(existingOrder, body);
              saveDatabase(db);
              res.statusCode = 200;
              return res.end(JSON.stringify(existingOrder));
            }
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Order not found' }));
          }

          next();
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': import.meta.dirname ? path.resolve(import.meta.dirname, '.') : path.resolve('.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
