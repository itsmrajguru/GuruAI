# 🎨 GuruAI Frontend

The frontend of GuruAI is a high-performance, responsive React application built with **Vite** and **Tailwind CSS**.

## 🚀 Key Features

- **Responsive Design**: Fully mobile-responsive layout using Tailwind CSS.
- **State Management**: Clean handling of auth state and AI interactions.
- **Fast Builds**: Powered by Vite for near-instant HMR and optimized production bundles.
- **Secure**: Pre-configured with security headers and protected routes.

## 🛠️ Development

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:2501
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```
The output will be in the `dist/` directory, ready to be deployed.

## 📦 Deployment

This frontend is configured for:
- **Netlify**: Using `netlify.toml` for redirects/headers.
- **Vercel**: Using `vercel.json` for SPA routing.

For more details, see the root [DEPLOYMENT.md](../DEPLOYMENT.md).
