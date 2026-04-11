# ⚙️ GuruAI Backend

The backend of GuruAI is a robust Express service that manages authentication, AI processing, and third-party integrations.

## 🚀 Key Features

- **Auth System**: Complete signup/login flow with JWT and cookies.
- **AI Engine**: Integrated with Google Gemini API with smart key rotation.
- **Email Service**: Uses Resend for reliable automated notifications.
- **Database**: MongoDB integration for persistent storage.

## 🛠️ Development

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   Copy `.env.example` to `.env` and fill in your credentials.
3. Start server:
   ```bash
   npm start
   ```

### API Endpoints
- `/auth`: User registration, login, and profile management.
- `/ai`: AI chat and generation endpoints.
- `/`: Health check endpoint.

## 📦 Deployment

This backend is configured for:
- **Render**: Using `render.yaml` (root) for blueprint deployment.
- **Vercel**: Using `vercel.json` for Serverless Function deployment.

For more details, see the root [DEPLOYMENT.md](../DEPLOYMENT.md).
