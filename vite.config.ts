import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

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

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', () => {
          let body: Record<string, unknown> = {};
          try {
            if (bodyStr) body = JSON.parse(bodyStr);
          } catch {}

          if (req.url === '/api/payments/verify' && req.method === 'POST') {
            const utr = typeof body.utrNumber === 'string' ? body.utrNumber.trim() : '';
            const hasValidUTR = /^\d{12}$/.test(utr);

            // If a valid UTR is submitted or gateway key is configured
            if (hasValidUTR) {
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
                status: 'Pending',
                message:
                  'Payment verification is pending bank confirmation. If you completed the transfer, please input your 12-digit UTR reference or try verifying again in a moment.',
              })
            );
          }

          if (req.url === '/api/payments/config') {
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                upiId: '9848263939@ybl',
                payeeName: 'KODIGANTI DINESH',
                phone: '+919848263939',
                merchantVpa: '9848263939@ybl',
                enableUPI: true,
              })
            );
          }

          if (req.url === '/api/orders' && req.method === 'POST') {
            res.statusCode = 201;
            return res.end(
              JSON.stringify({
                id: body.id || `order-${Date.now()}`,
                trackingNumber: `LOL-${Math.floor(1000 + Math.random() * 9000)}`,
                ...body,
                status: 'Pending',
                paymentStatus: body.paymentStatus || 'Pending',
              })
            );
          }

          if (req.url === '/api/products/inventory' && req.method === 'POST') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, deductions: body.deductions }));
          }

          if (req.url === '/api/orders' && req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify([]));
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
