# GuruAI - Your Spiritual & Intelligent AI Companion

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Render Deployment](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/itsmrajguru/GuruAI)

**GuruAI** is a state-of-the-art AI platform designed to provide intelligent insights, automated tasks, and powerful AI integrations. Built with a robust MERN-inspired stack, it bridges the gap between advanced AI models and user-friendly interfaces.

---

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based auth with cookie support and secure route protection.
- 🤖 **AI Integration**: Powered by Google Gemini with automatic API key rotation to handle high traffic and rate limits.
- 📧 **Automated Communication**: Seamless email services integrated via Resend.
- 🎨 **Modern UI**: A premium, responsive dashboard built with React, Vite, and Tailwind CSS.
- ⚡ **Optimized Performance**: DNS caching and optimized server-side logic for lightning-fast responses.
- 🛡️ **Production Ready**: Pre-configured for deployment on Vercel, Netlify, and Render.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router 7

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Services**: Google Gemini API, Resend (Email)
- **Security**: JWT, Cookie Parser, CORS, DNS Cache

---

## 📂 Project Structure

```text
GuruAI/
├── client/             # Vite + React Frontend
│   ├── src/            # Components, Hooks, API logic
│   └── vercel.json     # Vercel SPA configuration
├── server/             # Express Backend
│   ├── routes/         # API Endpoints (Auth, AI, etc.)
│   ├── controllers/    # Business Logic
│   └── server.js       # Main server entry point
├── DEPLOYMENT.md       # Comprehensive deployment guide
└── render.yaml         # Render Blueprint configuration
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/itsmrajguru/GuruAI.git
cd GuruAI
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file based on .env.example
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
# Create a .env file for VITE_API_BASE_URL
npm run dev
```

---


## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👋 Acknowledgments

- Built with ❤️ by **Mangesh Rajguru**.
- Special thanks to the **Google Gemini** team for providing the AI power.

> [!NOTE]
> Ensure you have your MongoDB URI and API keys ready before starting the application in production.
