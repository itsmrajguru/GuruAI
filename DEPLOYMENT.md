# 🚀 GuruAI Production Deployment Guide

This guide ensures your application is deployed correctly with **Netlify** (Frontend) and **Render** (Backend).

## 🛠️ 1. Backend Deployment (Render)

Render will host your Express server and connect to MongoDB.

### Steps:
1. **GitHub Connection**: Connect your repository to Render.
2. **Create Web Service**:
   - **Name**: `guruai-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Environment Variables**: Add these in the Render dashboard:
   - `PORT`: `10000` (Render's default)
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A random string for encryption.
   - `JWT_REFRESH_SECRET`: Another random string.
   - `RESEND_API_KEY`: Key from Resend.com.
   - `FROM_EMAIL`: Authorized email in Resend.
   - `CLIENT_URL`: Your Netlify URL (e.g., `https://guru-ai-official.netlify.app`).
   - `GEMINI_API_KEY`: Your primary Google Gemini key.
   - `GEMINI_API_KEY_2/3/4`: (Optional) Rotation keys.

> [!TIP]
> Use the provided `render.yaml` file in the root to automate this! Render will detect it if you use the "Blueprint" feature.

---

## 🎨 2. Frontend Deployment (Netlify)

Netlify will host your Vite/React frontend as a fast static site.

### Steps:
1. **GitHub Connection**: Set site to link to your repo.
2. **Build Settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Environment Variables**:
   - `VITE_API_BASE_URL`: **IMPORTANT!** This must be your Render backend URL (e.g., `https://guruai-backend.onrender.com`).
4. **Headers & Redirects**:
   - Already handled by the created `client/netlify.toml`. This ensures your React Router pages don't 404 on refresh.

---

## 📑 3. Configuration Summary

| Feature | File | Purpose |
| :--- | :--- | :--- |
| **Netlify Config** | `client/netlify.toml` | Handles SPA routing and security. |
| **Render Config** | `render.yaml` | Automates backend setup. |
| **Production Env** | `client/.env.production` | Template for build-time secrets. |
| **Production Server** | `server/server.js` | Updated for Port/CORS flexibility. |

---

## 🆘 Troubleshooting

- **CORS Errors**: Ensure the `CLIENT_URL` in gathered Render exactly matches your Netlify URL without a trailing slash.
- **Gemini 429**: The server automatically rotates keys. If all fail, check if your keys are valid in the Google AI Studio.
- **Blank Page on Refresh**: Ensure `netlify.toml` is in the `client` folder (which was correctly handled).
