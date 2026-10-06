const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File Database
const DB_FILE = path.join(__dirname, 'database.json');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(
      {
        orders: [],
        products: [],
        payments: {
          upiId: '7578887888@ybl',
          payeeName: 'Lap of Luxury Mahbubnagar',
          upiNumber: '75 7888 7888',
          enableUPI: true,
          enableCOD: true,
          enableCard: false,
        },
      },
      null,
      2
    )
  );
}

const getDb = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const saveDb = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    store: 'Lap of Luxury Mahbubnagar Backend',
    version: '1.0.0',
    endpoints: ['/api/orders', '/api/payments/config', '/api/health'],
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Orders API
app.get('/api/orders', (req, res) => {
  const db = getDb();
  res.json(db.orders || []);
});

app.post('/api/orders', (req, res) => {
  const db = getDb();
  const newOrder = {
    id: 'order-' + Date.now(),
    trackingNumber: 'LOL-' + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    isRead: false,
  };
  db.orders.unshift(newOrder);
  saveDb(db);
  res.status(201).json(newOrder);
});

// Payment Configuration API
app.get('/api/payments/config', (req, res) => {
  const db = getDb();
  res.json(db.payments);
});

app.post('/api/payments/config', (req, res) => {
  const db = getDb();
  db.payments = { ...db.payments, ...req.body };
  saveDb(db);
  res.json({ success: true, payments: db.payments });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Lap of Luxury Backend running on port ${PORT}`);
});
