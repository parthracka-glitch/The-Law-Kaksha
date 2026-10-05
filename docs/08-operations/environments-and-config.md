# Environment Variables & Configuration Reference

**Purpose:** Comprehensive inventory of all environment variables, purposes, default values, and safe placeholders.  
**Status:** Verified against code & .env.example  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Backend Configuration (`backend/.env`)

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` / `production` | Node environment runtime mode. |
| `PORT` | No | `5000` (Render sets `10000`) | Port on which Express server binds. |
| `FRONTEND_URL` | Yes | `http://localhost:3000` / `https://thelawkaksha.com` | Allowed CORS origin. |
| `JWT_SECRET` | Yes | `your-secure-random-jwt-secret-key-min-32-chars` | Secret key used to sign student and admin JWTs. |
| `MONGODB_URI` | No | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/lawkaksha` | Connection string for MongoDB Atlas; falls back to local JSON if omitted. |
| `RAZORPAY_KEY_ID` | Yes | `rzp_test_YourKeyHere123` | Razorpay Merchant Key ID. |
| `RAZORPAY_KEY_SECRET` | Yes | `yourRazorpaySecretKeyHere456` | Razorpay Merchant Secret for signature verification. |
| `CLOUDINARY_CLOUD_NAME` | No | `your_cloudinary_cloud_name` | Cloudinary account cloud identifier. |
| `CLOUDINARY_API_KEY` | No | `123456789012345` | Cloudinary API access key. |
| `CLOUDINARY_API_SECRET` | No | `abcdefghijklmnopqrstuvwxyz123` | Cloudinary API access secret. |
| `GOOGLE_CLIENT_ID` | No | `your-google-oauth-client-id.apps.googleusercontent.com` | Google Cloud OAuth 2.0 Web Client ID. |

---

## 2. Frontend Configuration (`frontend/.env.local`)

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000` / `https://the-law-kaksha-api.onrender.com` | Base URL of the backend API for client-side queries. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`| Yes | `rzp_test_YourKeyHere123` | Public Razorpay key injected into the browser checkout script. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`| No | `your-google-oauth-client-id.apps.googleusercontent.com` | Google OAuth Web Client ID for frontend button initialization. |
