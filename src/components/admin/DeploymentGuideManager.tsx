import React, { useState } from 'react';
import {
  Server,
  Globe,
  Download,
  Copy,
  ExternalLink,
  Code2,
  FolderArchive,
  CheckCircle,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import JSZip from 'jszip';

export const DeploymentGuideManager: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState<'backend' | 'frontend' | null>(null);

  const copyToClipboard = (text: string, filename: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const downloadFile = (filename: string, content: string, mime = 'text/plain') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const vercelConfig = JSON.stringify(
    {
      framework: 'vite',
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      rewrites: [{ source: '/(.*)', destination: '/index.html' }],
    },
    null,
    2
  );

  const frontendPackageJson = JSON.stringify(
    {
      name: "lap-of-luxury-frontend",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        "@tailwindcss/vite": "^4.3.3",
        "@vitejs/plugin-react": "^6.1.1",
        "lucide-react": "^0.546.0",
        "react": "^19.0.1",
        "react-dom": "^19.0.1",
        "vite": "^8.3.0"
      },
      devDependencies: {
        "@types/react": "^19.3.0",
        "@types/react-dom": "^19.3.0",
        "tailwindcss": "^4.3.3",
        "typescript": "^7.0.2"
      }
    },
    null,
    2
  );

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

  const railwayPackageJson = JSON.stringify(
    {
      name: 'lap-of-luxury-backend',
      version: '1.0.0',
      description: 'Production Railway Backend for Lap of Luxury',
      main: 'server.js',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
      },
      dependencies: {
        cors: '^2.8.5',
        dotenv: '^16.4.5',
        express: '^4.19.2',
        multer: '^1.4.5-lts.1',
      },
      devDependencies: {
        nodemon: '^3.1.0',
      },
      engines: {
        node: '>=18.0.0',
      },
    },
    null,
    2
  );

  const railwayServerJs = `const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistent File Database
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
    store: 'Lap of Luxury Mahbubnagar API',
    endpoints: ['/api/health', '/api/orders', '/api/payments/config'],
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', store: 'Lap of Luxury Mahbubnagar', timestamp: new Date() });
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

// Payment Config API
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
  console.log('🚀 Lap of Luxury Backend running on port ' + PORT);
});
`;

  const railwayProcfile = `web: node server.js\n`;
  const railwayEnvExample = `PORT=8080\nNODE_ENV=production\nSTORE_UPI_ID=7578887888@ybl\nSTORE_NAME=Lap of Luxury Mahbubnagar\nSTORE_PHONE=7578887888\n`;
  const backendReadme = `# Lap of Luxury - Node.js Backend API

Production Express.js backend with JSON persistent database.

## Quick Start (Local):
\`\`\`bash
npm install
npm start
\`\`\`
Server runs at http://localhost:8080

## Deploy to Railway (100% Free):
1. Sign in to https://railway.app
2. Create New Project -> Deploy from GitHub
3. Select this backend folder
4. Railway will automatically build and assign a free HTTPS URL!
`;

  const frontendReadme = `# Lap of Luxury - Vite & React Frontend

## Quick Start (Local):
\`\`\`bash
npm install
npm run dev
\`\`\`

## Deploy to Vercel (100% Free):
1. Sign in to https://vercel.com
2. Click Add New -> Project -> Import Git Repo
3. Vercel automatically detects Vite and uses vercel.json
4. Click Deploy!
`;

  // Download complete backend ZIP folder
  const downloadBackendZip = async () => {
    try {
      setDownloadingZip('backend');
      const zip = new JSZip();
      const folder = zip.folder('backend');
      folder?.file('server.js', railwayServerJs);
      folder?.file('package.json', railwayPackageJson);
      folder?.file('Procfile', railwayProcfile);
      folder?.file('.env.example', railwayEnvExample);
      folder?.file(
        'database.json',
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
      folder?.file('README.md', backendReadme);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backend.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingZip(null);
    }
  };

  // Download complete frontend configuration ZIP folder
  const downloadFrontendZip = async () => {
    try {
      setDownloadingZip('frontend');
      const zip = new JSZip();
      const folder = zip.folder('frontend');
      folder?.file('vercel.json', vercelConfig);
      folder?.file('package.json', frontendPackageJson);
      folder?.file('vite.config.ts', viteConfig);
      folder?.file('.env.example', 'VITE_API_URL=https://your-railway-app.up.railway.app\n');
      folder?.file('README.md', frontendReadme);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'frontend-vercel.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingZip(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Direct 1-Click ZIP Downloads */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#B8860B]">
              <FolderArchive className="w-5 h-5" />
            </span>
            <h2 className="font-bodoni text-xl font-bold tracking-wider text-[#111111] uppercase">
              SEPARATE FOLDERS FOR DEPLOYMENT: FRONTEND & BACKEND
            </h2>
          </div>
          <p className="text-xs text-[#7A6C58]">
            Download real production files: Vercel for Frontend and Railway for Backend (no dummy code).
          </p>
        </div>

        {/* 1-Click ZIP Download Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadBackendZip}
            disabled={downloadingZip !== null}
            className="px-4 py-2.5 bg-[#7928CA] hover:bg-[#6820B0] text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingZip === 'backend' ? 'Zipping...' : 'DOWNLOAD BACKEND.ZIP (RAILWAY)'}</span>
          </button>

          <button
            onClick={downloadFrontendZip}
            disabled={downloadingZip !== null}
            className="px-4 py-2.5 bg-[#111111] hover:bg-[#28282D] text-[#E5C07B] rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{downloadingZip === 'frontend' ? 'Zipping...' : 'DOWNLOAD FRONTEND.ZIP (VERCEL)'}</span>
          </button>
        </div>
      </div>

      {/* Two Columns: Frontend (Vercel) & Backend (Railway) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: FRONTEND (VERCEL) */}
        <div className="bg-white rounded-2xl p-6 border-2 border-black/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-black flex items-center justify-center">
                ▲
              </span>
              <div>
                <h3 className="font-bodoni text-base font-bold tracking-wider text-[#111111] uppercase">
                  FOLDER: frontend/ (VERCEL)
                </h3>
                <span className="text-[10px] text-emerald-700 font-bold">100% Free Forever</span>
              </div>
            </div>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#111111] font-bold flex items-center gap-1 hover:underline"
            >
              <span>vercel.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2 text-xs text-[#4A4033]">
            <p className="font-bold text-[#111111]">How to Host on Vercel:</p>
            <ol className="space-y-1.5 list-decimal list-inside pl-1 text-[#5E5244]">
              <li>Push your frontend repository to GitHub.</li>
              <li>Open <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-[#B8860B] underline font-bold">vercel.com/new</a>.</li>
              <li>Select your repository — Vite framework is auto-detected.</li>
              <li>Click <strong>Deploy</strong>. Vercel provides a free URL with SSL.</li>
            </ol>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-[#111111]">
              <span>vercel.json Configuration:</span>
              <button
                onClick={() => copyToClipboard(vercelConfig, 'vercel.json')}
                className="text-[10px] text-[#B8860B] font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedFile === 'vercel.json' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#111113] text-[#E5C07B] rounded-xl text-[10px] font-mono overflow-x-auto">
              {vercelConfig}
            </pre>
          </div>
        </div>

        {/* Box 2: BACKEND (RAILWAY) */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#7928CA]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#7928CA] text-white text-xs font-black flex items-center justify-center">
                🚂
              </span>
              <div>
                <h3 className="font-bodoni text-base font-bold tracking-wider text-[#111111] uppercase">
                  FOLDER: backend/ (RAILWAY)
                </h3>
                <span className="text-[10px] text-[#7928CA] font-bold">Free Cloud Node.js Server</span>
              </div>
            </div>
            <a
              href="https://railway.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#7928CA] font-bold flex items-center gap-1 hover:underline"
            >
              <span>railway.app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2 text-xs text-[#4A4033]">
            <p className="font-bold text-[#111111]">How to Host on Railway:</p>
            <ol className="space-y-1.5 list-decimal list-inside pl-1 text-[#5E5244]">
              <li>Unzip <code>backend.zip</code> onto your machine.</li>
              <li>Go to <a href="https://railway.app/new" target="_blank" rel="noreferrer" className="text-[#7928CA] underline font-bold">railway.app/new</a>.</li>
              <li>Click <strong>Deploy from GitHub repo</strong> (or drag folder).</li>
              <li>Railway detects Express and automatically runs <code>npm start</code>.</li>
              <li>You get an HTTPS backend API link instantly!</li>
            </ol>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-[#111111]">
              <span>backend/package.json:</span>
              <button
                onClick={() => copyToClipboard(railwayPackageJson, 'package.json')}
                className="text-[10px] text-[#B8860B] font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedFile === 'package.json' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#111113] text-[#A5D6A7] rounded-xl text-[10px] font-mono overflow-x-auto">
              {railwayPackageJson}
            </pre>
          </div>
        </div>
      </div>

      {/* Full Working Backend Server Code */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#B89758]" />
            <h4 className="font-bodoni text-sm font-bold tracking-wider text-[#111111] uppercase">
              backend/server.js (Working Express API & File Database)
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(railwayServerJs, 'server.js')}
              className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5C7B0] hover:border-[#111111] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedFile === 'server.js' ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => downloadFile('server.js', railwayServerJs, 'application/javascript')}
              className="px-3 py-1.5 bg-[#111111] hover:bg-[#28282D] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Download server.js</span>
            </button>
          </div>
        </div>

        <pre className="p-4 bg-[#111113] text-gray-200 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed border border-[#333339]">
          {railwayServerJs}
        </pre>
      </div>
    </div>
  );
};
