# Lap of Luxury - Railway Backend API

This is the standalone Node.js Express backend for Lap of Luxury e-commerce.

## Deployment on Railway (100% Free):
1. Create a free account on [railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select this folder or repository.
4. Railway will automatically detect Node.js, run `npm install`, and start `server.js` using the included `Procfile`.
5. Your live API URL will look like: `https://<your-project>.up.railway.app`.

## API Endpoints:
- `GET /api/health` - Service health status
- `GET /api/orders` - Fetch all orders
- `POST /api/orders` - Place new order
- `GET /api/payments/config` - Get store UPI & payment settings
- `POST /api/payments/config` - Update store payment settings
