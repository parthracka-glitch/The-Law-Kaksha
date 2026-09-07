# ⚖️ The Law Kaksha - Full-Stack Architecture

This repository contains the complete codebase for **The Law Kaksha** separated cleanly into **Frontend** (Next.js) and **Backend** (Express.js API) for effortless deployment on **Vercel** and **Render**.

```
The Law Kaksha/
├── frontend/               # Next.js 16 + Tailwind CSS Application (Hosted on Vercel)
│   ├── src/
│   │   ├── app/            # Landing page, /student portal, /admin portal
│   │   ├── components/     # Modals, Cart Drawer, PDF Reader, Video Masterclass
│   │   ├── context/        # CartContext, DeviceSessionContext
│   │   └── types/          # TypeScript models
│   ├── public/             # Optimized image assets & icons
│   ├── vercel.json         # Vercel configuration
│   ├── .env.example        # Frontend environment variables
│   └── package.json
│
├── backend/                # Express.js API Server (Hosted on Render)
│   ├── src/
│   │   └── server.js       # Health check, Auth, Catalog, Orders, Students APIs
│   ├── render.yaml         # Render 1-click Blueprint configuration
│   ├── .env.example        # Backend environment variables
│   └── package.json
│
├── package.json            # Root monorepo scripts
└── README.md               # Hosting & Deployment Guide
```

---

## 🚀 Quick Local Development

### 1. Run Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Run Backend (Express API)
```bash
cd backend
npm install
npm run start
```
API running on **`http://localhost:5000`** (Health check: `http://localhost:5000/api/health`).

---

## 🌐 Deployment Instructions

### A. Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Select your GitHub repository: `The-Law-Kaksha`.
3. In the configuration screen:
   - **Root Directory**: Click **Edit** and select **`frontend`**.
   - **Framework Preset**: **Next.js** (Auto-detected).
   - **Build Command**: `next build` (Default).
   - **Output Directory**: `.next` (Default).
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-api.onrender.com` (Your deployed Render URL).
5. Click **Deploy**! 🚀

---

### B. Deploy Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New +" -> "Web Service"**.
2. Connect your GitHub repository: `The-Law-Kaksha`.
3. Configure the Web Service settings:
   - **Name**: `the-law-kaksha-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app` (Your Vercel deployment URL).
5. Click **Create Web Service**! 🎉

---

## 📋 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Render zero-downtime health check |
| `/api/catalog` | `GET` | Retrieve all books, notes & video lecture plans |
| `/api/catalog/:id` | `GET` | Get specific study item details |
| `/api/orders` | `GET` | List orders for Admin dashboard |
| `/api/orders` | `POST` | Create a new student order & unlock content |
| `/api/students` | `GET` | List active students and subscriptions |
| `/api/payments/verify` | `POST` | Verify Razorpay payments |
